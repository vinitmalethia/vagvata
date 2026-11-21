import { fromFirestoreDocument, priceOrder, toFirestoreFields, verifyHmacSha256 } from './payment-core.js';

const encoder = new TextEncoder();
const PROJECT_ID = 'vagvat-98c70';
const ALLOWED_ORIGINS = new Set(['https://vagvatayurveda.com', 'https://www.vagvatayurveda.com']);
let serviceAccountToken = null;
let serviceAccountTokenExpiry = 0;
let serviceAccountKeyPromise = null;

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

function json(data, status = 200, origin = '') {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
    headers['Vary'] = 'Origin';
  }
  return new Response(JSON.stringify(data), { status, headers });
}

function b64url(bytesOrText) {
  const bytes = typeof bytesOrText === 'string' ? encoder.encode(bytesOrText) : new Uint8Array(bytesOrText);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(normalized + '='.repeat((4 - normalized.length % 4) % 4));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function requireString(value, name, max) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) throw new HttpError(400, `Please check the ${name} field.`);
  return value.trim();
}

function validateCustomer(input = {}) {
  const fullName = requireString(input.fullName, 'name', 100);
  const email = requireString(input.email, 'email', 254).toLowerCase();
  const phone = requireString(input.phone, 'phone', 20).replace(/[\s()-]/g, '');
  const street = requireString(input.street, 'street address', 300);
  const city = requireString(input.city, 'city', 80);
  const state = typeof input.state === 'string' ? input.state.trim().slice(0, 80) : '';
  const pincode = requireString(input.pincode, 'PIN code', 6);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, 'Enter a valid email address.');
  if (!/^\+?\d{10,13}$/.test(phone)) throw new HttpError(400, 'Enter a valid phone number.');
  if (!/^\d{6}$/.test(pincode)) throw new HttpError(400, 'Enter a valid 6-digit PIN code.');
  return { fullName, email, phone, street, city, state, pincode };
}

async function readJson(request, maxBytes = 24_000) {
  const text = await request.text();
  if (encoder.encode(text).byteLength > maxBytes) throw new HttpError(413, 'Request is too large.');
  try { return JSON.parse(text); } catch { throw new HttpError(400, 'Invalid JSON request.'); }
}

async function verifyTurnstile(token, request, env) {
  if (!env.TURNSTILE_SECRET_KEY) return;
  if (!token) throw new HttpError(400, 'Complete the security check before checkout.');
  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token });
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) body.set('remoteip', ip);
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.success || result.action !== 'checkout' ||
      result.hostname && !['vagvatayurveda.com', 'www.vagvatayurveda.com'].includes(result.hostname)) {
    throw new HttpError(403, 'Security check expired. Please try again.');
  }
}

function readServiceAccount(env) {
  let credentials;
  try { credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON || ''); } catch { throw new HttpError(503, 'Order storage is not configured.'); }
  if (credentials.project_id !== PROJECT_ID || !credentials.client_email || !credentials.private_key) throw new HttpError(503, 'Order storage is not configured.');
  return credentials;
}

async function getServiceAccountAccessToken(env) {
  if (serviceAccountToken && Date.now() < serviceAccountTokenExpiry - 60_000) return serviceAccountToken;
  const account = readServiceAccount(env);
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({
    iss: account.client_email,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600
  }));
  if (!serviceAccountKeyPromise) {
    const pkcs8 = account.private_key.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, '');
    serviceAccountKeyPromise = crypto.subtle.importKey('pkcs8', decodeBase64Url(pkcs8), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  }
  let key;
  try { key = await serviceAccountKeyPromise; } catch {
    serviceAccountKeyPromise = null;
    throw new HttpError(503, 'Order storage credentials are invalid.');
  }
  const unsigned = `${header}.${claim}`;
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, encoder.encode(unsigned));
  const assertion = `${unsigned}.${b64url(signature)}`;
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion })
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.access_token) throw new HttpError(503, 'Could not connect to Firebase order storage.');
  serviceAccountToken = data.access_token;
  serviceAccountTokenExpiry = Date.now() + Number(data.expires_in || 3600) * 1000;
  return serviceAccountToken;
}

async function firestoreRequest(env, path, init = {}) {
  const token = await getServiceAccountAccessToken(env);
  const response = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...(init.headers || {}) }
  });
  const data = await response.json().catch(() => null);
  return { response, data };
}

function dateFields(now = new Date()) {
  const date = now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' });
  const time = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true });
  return { date, time, dateTime: `${date} • ${time}` };
}

function safePaymentError(status, code) {
  console.error('Razorpay request failed', { status, code: code || 'unknown' });
  throw new HttpError(503, 'Payment service is temporarily unavailable. Please try again.');
}

async function razorpayRequest(env, path, body) {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) throw new HttpError(503, 'Online payments are not configured.');
  const authorization = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
  const response = await fetch(`https://api.razorpay.com/v1/${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Basic ${authorization}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) safePaymentError(response.status, data?.error?.code);
  return data;
}

async function persistVerifiedOrder(env, session, payment) {
  if (payment.status !== 'captured' || payment.order_id !== session.razorpayOrderId ||
      payment.currency !== 'INR' || Number(payment.amount) !== Number(session.amountPaise)) {
    throw new HttpError(409, 'The captured payment does not match the order.');
  }
  const now = new Date();
  const stamps = dateFields(now);
  const customer = session.customer;
  const order = {
    orderId: session.internalOrderId,
    customerName: customer.fullName,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    shippingAddress: `${customer.street}, ${customer.city}${customer.state ? `, ${customer.state}` : ''} - ${customer.pincode}`,
    addressDetails: { street: customer.street, city: customer.city, state: customer.state, pincode: customer.pincode },
    ...stamps,
    total: session.pricing.total,
    subtotal: session.pricing.subtotal,
    discountAmount: session.pricing.discountAmount,
    shippingCost: session.pricing.shippingCost,
    paymentMethod: 'Razorpay',
    paymentStatus: 'Paid',
    isTestOrder: false,
    status: 'Ordered',
    userId: null,
    razorpayOrderId: session.razorpayOrderId,
    paymentId: payment.id,
    amountCapturedPaise: payment.amount,
    currency: 'INR',
    items: session.pricing.items,
    createdAt: now.toISOString()
  };
  const { response, data } = await firestoreRequest(env, `/orders?documentId=${encodeURIComponent(session.internalOrderId)}`, {
    method: 'POST', body: JSON.stringify({ fields: toFirestoreFields(order) })
  });
  if (response.ok) return order;
  if (response.status === 409) {
    const existing = await firestoreRequest(env, `/orders/${encodeURIComponent(session.internalOrderId)}`);
    if (existing.response.ok) {
      const existingOrder = fromFirestoreDocument(existing.data);
      if (existingOrder.paymentId === payment.id && existingOrder.paymentStatus === 'Paid') return existingOrder;
    }
  }
  console.error('Firestore confirmed-order write failed', { status: response.status, code: data?.error?.status || 'unknown' });
  throw new HttpError(503, 'Payment was captured, but order confirmation is still processing. Please contact support before paying again.');
}

async function createCheckout(request, env) {
  const input = await readJson(request);
  await verifyTurnstile(input.turnstileToken, request, env);
  const customer = validateCustomer(input.customer);
  let pricing;
  try { pricing = priceOrder(input.items, input.couponCode); } catch (error) { throw new HttpError(400, error.message); }

  const now = Date.now();
  const internalOrderId = `VAGVAT-${now}-${crypto.randomUUID().replaceAll('-', '').slice(0, 8)}`;
  const session = {
    internalOrderId,
    userId: null,
    customer,
    pricing,
    amountPaise: pricing.amount,
    razorpayOrderId: null,
    createdAt: now
  };
  await env.CHECKOUT_DB.prepare(
    'INSERT INTO checkout_sessions (internal_order_id, razorpay_order_id, payload_json, amount_paise, status, payment_id, created_at, updated_at) VALUES (?, NULL, ?, ?, ?, NULL, ?, ?)'
  ).bind(internalOrderId, JSON.stringify(session), pricing.amount, 'Creating', now, now).run();

  let gatewayOrder;
  try {
    gatewayOrder = await razorpayRequest(env, 'orders', { amount: pricing.amount, currency: 'INR', receipt: internalOrderId, notes: { internalOrderId } });
  } catch (error) {
    await env.CHECKOUT_DB.prepare('UPDATE checkout_sessions SET status = ?, updated_at = ? WHERE internal_order_id = ?').bind('Setup Failed', Date.now(), internalOrderId).run();
    throw error;
  }
  session.razorpayOrderId = gatewayOrder.id;
  await env.CHECKOUT_DB.prepare('UPDATE checkout_sessions SET razorpay_order_id = ?, payload_json = ?, status = ?, updated_at = ? WHERE internal_order_id = ?')
    .bind(gatewayOrder.id, JSON.stringify(session), 'Pending', Date.now(), internalOrderId).run();
  return {
    keyId: env.RAZORPAY_KEY_ID,
    razorpayOrderId: gatewayOrder.id,
    internalOrderId,
    amount: gatewayOrder.amount,
    currency: gatewayOrder.currency
  };
}

async function verifyCheckout(request, env) {
  const input = await readJson(request, 8_000);
  const internalOrderId = requireString(input.internalOrderId, 'order reference', 64);
  const razorpayOrderId = requireString(input.razorpayOrderId, 'Razorpay order reference', 64);
  const paymentId = requireString(input.paymentId, 'payment reference', 64);
  const signature = requireString(input.signature, 'payment verification', 128);
  const row = await env.CHECKOUT_DB.prepare('SELECT payload_json, status, payment_id FROM checkout_sessions WHERE internal_order_id = ?').bind(internalOrderId).first();
  if (!row) {
    const existing = await firestoreRequest(env, `/orders/${encodeURIComponent(internalOrderId)}`);
    if (existing.response.ok) {
      const order = fromFirestoreDocument(existing.data);
      if (order.paymentStatus === 'Paid' && order.paymentId === paymentId && order.razorpayOrderId === razorpayOrderId) return { verified: true, order };
    }
    throw new HttpError(404, 'The checkout could not be found.');
  }
  const session = JSON.parse(row.payload_json);
  if (session.razorpayOrderId !== razorpayOrderId) throw new HttpError(403, 'The payment does not match this order.');
  if (!await verifyHmacSha256(env.RAZORPAY_KEY_SECRET || '', `${razorpayOrderId}|${paymentId}`, signature)) throw new HttpError(403, 'Payment verification failed.');
  const payment = await razorpayRequest(env, `payments/${encodeURIComponent(paymentId)}`);
  const order = await persistVerifiedOrder(env, session, payment);
  await env.CHECKOUT_DB.prepare('UPDATE checkout_sessions SET status = ?, payment_id = ?, updated_at = ? WHERE internal_order_id = ?')
    .bind('Paid', paymentId, Date.now(), internalOrderId).run();
  return { verified: true, order };
}

async function razorpayWebhook(request, env) {
  const rawBody = new Uint8Array(await request.arrayBuffer());
  if (rawBody.byteLength > 128_000) throw new HttpError(413, 'Webhook payload is too large.');
  const signature = request.headers.get('X-Razorpay-Signature') || '';
  if (!await verifyHmacSha256(env.RAZORPAY_WEBHOOK_SECRET || '', rawBody, signature)) throw new HttpError(400, 'Invalid webhook signature.');
  const eventId = request.headers.get('X-Razorpay-Event-Id');
  if (!eventId || eventId.length > 200) throw new HttpError(400, 'Missing or invalid webhook event ID.');
  let payload;
  try { payload = JSON.parse(new TextDecoder().decode(rawBody)); } catch { throw new HttpError(400, 'Invalid webhook payload.'); }
  if (payload.event !== 'payment.captured') return json({ received: true });
  const duplicate = await env.CHECKOUT_DB.prepare('SELECT event_id FROM webhook_events WHERE event_id = ?').bind(eventId).first();
  if (duplicate) return json({ received: true, duplicate: true });
  const payment = payload.payload?.payment?.entity;
  if (!payment?.id || !payment.order_id || payment.status !== 'captured') throw new HttpError(400, 'Incomplete capture event.');
  const row = await env.CHECKOUT_DB.prepare('SELECT payload_json, status, payment_id FROM checkout_sessions WHERE razorpay_order_id = ?').bind(payment.order_id).first();
  if (!row) throw new HttpError(503, 'Checkout record is not ready for webhook processing.');
  const session = JSON.parse(row.payload_json);
  if (row.status === 'Paid' && row.payment_id && row.payment_id !== payment.id) throw new HttpError(409, 'A different payment already completed this order.');
  await persistVerifiedOrder(env, session, payment);
  await env.CHECKOUT_DB.prepare('UPDATE checkout_sessions SET status = ?, payment_id = ?, updated_at = ? WHERE internal_order_id = ?')
    .bind('Paid', payment.id, Date.now(), session.internalOrderId).run();
  await env.CHECKOUT_DB.prepare('INSERT OR IGNORE INTO webhook_events (event_id, order_id, processed_at) VALUES (?, ?, ?)').bind(eventId, session.internalOrderId, Date.now()).run();
  return json({ received: true });
}

export default {
  async scheduled(_event, env) {
    const now = Date.now();
    try {
      await Promise.all([
        env.CHECKOUT_DB.prepare('DELETE FROM checkout_sessions WHERE created_at < ?').bind(now - 7 * 24 * 60 * 60 * 1000).run(),
        env.CHECKOUT_DB.prepare('DELETE FROM webhook_events WHERE processed_at < ?').bind(now - 30 * 24 * 60 * 60 * 1000).run()
      ]);
    } catch (error) {
      console.error('Scheduled checkout-data cleanup failed', { message: error.message });
    }
  },
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return ALLOWED_ORIGINS.has(origin)
      ? new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Authorization, Content-Type', 'Access-Control-Max-Age': '86400', Vary: 'Origin' } })
      : new Response(null, { status: 403 });
    if (url.pathname === '/webhooks/razorpay') {
      if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
      try { return await razorpayWebhook(request, env); }
      catch (error) {
        console.error('Razorpay webhook processing failed', { status: error.status || 500 });
        return json({ error: error.message || 'Webhook processing failed.' }, error.status || 500);
      }
    }
    if (!ALLOWED_ORIGINS.has(origin)) return json({ error: 'Origin is not allowed.' }, 403);
    if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405, origin);
    try {
      if (url.pathname === '/checkout/create') return json(await createCheckout(request, env), 200, origin);
      if (url.pathname === '/checkout/verify') {
        return json(await verifyCheckout(request, env), 200, origin);
      }
      return json({ error: 'Not found.' }, 404, origin);
    } catch (error) {
      console.error('Checkout request failed', { path: url.pathname, status: error.status || 500 });
      return json({ error: error.message || 'Checkout is temporarily unavailable.' }, error.status || 500, origin);
    }
  }
};
