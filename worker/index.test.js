import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac, generateKeyPairSync } from 'node:crypto';
import worker from './index.js';

const origin = 'https://www.vagvatayurveda.com';

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

test('creates no Firestore order until Razorpay confirms a captured payment', async () => {
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const account = {
    project_id: 'vagvat-98c70',
    client_email: 'payment-worker@example.iam.gserviceaccount.com',
    private_key: privateKey.export({ type: 'pkcs8', format: 'pem' })
  };
  const sessions = new Map();
  const events = new Set();
  const firestoreDocuments = new Map();
  const firestoreWrites = [];
  let turnstileValidated = false;
  let paymentState = { id: 'pay_test_123', order_id: 'order_test_123', status: 'captured', currency: 'INR', amount: 349900 };
  const CHECKOUT_DB = {
    prepare(sql) {
      return {
        bind(...args) {
          return {
            async run() {
              if (sql.startsWith('INSERT INTO checkout_sessions')) {
                sessions.set(args[0], { payload_json: args[1], amount_paise: args[2], status: args[3], payment_id: args[4] });
              } else if (sql.startsWith('UPDATE checkout_sessions SET razorpay_order_id')) {
                const row = sessions.get(args[4]);
                row.payload_json = args[1];
                row.status = args[2];
              } else if (sql.startsWith('UPDATE checkout_sessions SET status')) {
                const row = sessions.get(args[3]);
                row.status = args[0];
                row.payment_id = args[1];
              } else if (sql.startsWith('INSERT OR IGNORE INTO webhook_events')) {
                events.add(args[0]);
              }
              return { success: true };
            },
            async first() {
              if (sql.includes('WHERE internal_order_id = ?')) return sessions.get(args[0]) || null;
              if (sql.includes('WHERE razorpay_order_id = ?')) {
                return [...sessions.values()].find((row) => JSON.parse(row.payload_json).razorpayOrderId === args[0]) || null;
              }
              if (sql.includes('FROM webhook_events WHERE event_id = ?')) return events.has(args[0]) ? { event_id: args[0] } : null;
              return null;
            }
          };
        }
      };
    }
  };
  const env = {
    CHECKOUT_DB,
    RAZORPAY_KEY_ID: 'rzp_test_public',
    RAZORPAY_KEY_SECRET: 'razorpay-test-secret',
    RAZORPAY_WEBHOOK_SECRET: 'razorpay-hook-secret',
    TURNSTILE_SECRET_KEY: 'turnstile-test-secret',
    GOOGLE_SERVICE_ACCOUNT_JSON: JSON.stringify(account)
  };
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init = {}) => {
    const url = String(input);
    if (url.includes('challenges.cloudflare.com')) {
      turnstileValidated = true;
      return jsonResponse({ success: true, action: 'checkout', hostname: 'www.vagvatayurveda.com' });
    }
    if (url.includes('oauth2.googleapis.com/token')) return jsonResponse({ access_token: 'test-access-token', expires_in: 3600 });
    if (url.includes('api.razorpay.com/v1/orders')) {
      return jsonResponse({ id: 'order_test_123', amount: JSON.parse(init.body).amount, currency: 'INR' });
    }
    if (url.includes('api.razorpay.com/v1/payments/')) return jsonResponse(paymentState);
    if (url.includes('firestore.googleapis.com')) {
      const parsedUrl = new URL(url);
      if (init.method === 'POST') {
        const documentId = parsedUrl.searchParams.get('documentId');
        const document = JSON.parse(init.body);
        if (firestoreDocuments.has(documentId)) return jsonResponse({ error: { status: 'ALREADY_EXISTS' } }, 409);
        firestoreDocuments.set(documentId, document);
        firestoreWrites.push(document);
        return jsonResponse({ name: `orders/${documentId}` });
      }
      const documentId = decodeURIComponent(parsedUrl.pathname.split('/').at(-1));
      return firestoreDocuments.has(documentId)
        ? jsonResponse(firestoreDocuments.get(documentId))
        : jsonResponse({ error: { status: 'NOT_FOUND' } }, 404);
    }
    throw new Error(`Unexpected mocked request: ${url}`);
  };
  try {
    const checkout = await worker.fetch(new Request(`${origin}/checkout/create`, {
      method: 'POST',
      headers: { Origin: origin, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: { fullName: 'Test Customer', email: 'test@example.com', phone: '9876543210', street: '1 Test Road', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
        items: [{ id: 'veda-finder-skin-care', quantity: 1 }],
        turnstileToken: 'valid-turnstile-token'
      })
    }), env);
    const created = await checkout.json();
    assert.equal(checkout.status, 200);
    assert.equal(checkout.headers.get('Access-Control-Allow-Origin'), origin);
    assert.equal(turnstileValidated, true);
    assert.equal(firestoreWrites.length, 0);
    assert.equal(sessions.size, 1);

    const webhookBody = JSON.stringify({ event: 'payment.captured', payload: { payment: { entity: paymentState } } });
    const webhookSignature = createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET).update(webhookBody).digest('hex');
    const webhook = await worker.fetch(new Request('https://worker.example/webhooks/razorpay', {
      method: 'POST',
      headers: { 'X-Razorpay-Signature': webhookSignature, 'X-Razorpay-Event-Id': 'event_capture_123' },
      body: webhookBody
    }), env);
    assert.equal(webhook.status, 200);
    assert.equal(firestoreWrites.length, 1);
    assert.equal(events.has('event_capture_123'), true);

    const signature = createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update('order_test_123|pay_test_123').digest('hex');
    const verified = await worker.fetch(new Request(`${origin}/checkout/verify`, {
      method: 'POST',
      headers: { Origin: origin, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        internalOrderId: created.internalOrderId,
        razorpayOrderId: 'order_test_123',
        paymentId: 'pay_test_123',
        signature
      })
    }), env);
    const result = await verified.json();
    assert.equal(verified.status, 200);
    assert.equal(result.verified, true);
    assert.equal(result.order.paymentStatus, 'Paid');
    assert.equal(firestoreWrites.length, 1);
    assert.equal(firestoreWrites[0].fields.paymentStatus.stringValue, 'Paid');
    assert.equal(firestoreWrites[0].fields.status.stringValue, 'Ordered');

    paymentState = { ...paymentState, amount: 10_000 };
    const second = await worker.fetch(new Request(`${origin}/checkout/verify`, {
      method: 'POST',
      headers: { Origin: origin, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        internalOrderId: created.internalOrderId,
        razorpayOrderId: 'order_test_123',
        paymentId: 'pay_test_123',
        signature
      })
    }), env);
    assert.equal(second.status, 409);
    assert.equal(firestoreWrites.length, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('blocks untrusted origins and rejects invalid raw webhook signatures', async () => {
  const env = { RAZORPAY_WEBHOOK_SECRET: 'webhook-test-secret' };
  const blocked = await worker.fetch(new Request('https://worker.example/checkout/create', {
    method: 'POST', headers: { Origin: 'https://attacker.example' }, body: '{}'
  }), env);
  assert.equal(blocked.status, 403);

  const webhook = await worker.fetch(new Request('https://worker.example/webhooks/razorpay', {
    method: 'POST', headers: { 'X-Razorpay-Signature': '0'.repeat(64), 'X-Razorpay-Event-Id': 'event_1' }, body: '{"event":"payment.captured"}'
  }), env);
  assert.equal(webhook.status, 400);
});
