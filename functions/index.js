import { randomUUID, createHash } from 'node:crypto';
import { initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { defineSecret } from 'firebase-functions/params';
import { HttpsError, onCall, onRequest } from 'firebase-functions/v2/https';
import { logger, setGlobalOptions } from 'firebase-functions/v2';
import { priceOrder, verifyRazorpaySignature, verifyWebhookSignature } from './paymentCore.js';

initializeApp();
setGlobalOptions({ region: 'asia-south1', maxInstances: 10 });

const razorpayKeyId = defineSecret('RAZORPAY_KEY_ID');
const razorpayKeySecret = defineSecret('RAZORPAY_KEY_SECRET');
const razorpayWebhookSecret = defineSecret('RAZORPAY_WEBHOOK_SECRET');
const db = getFirestore();

const ALLOWED_ORIGINS = [
  'https://vagvatayurveda.com',
  'https://www.vagvatayurveda.com',
  'http://localhost:5173'
];

function requireString(value, name, maxLength) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maxLength) {
    throw new HttpsError('invalid-argument', `Please check the ${name} field.`);
  }
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

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpsError('invalid-argument', 'Enter a valid email address.');
  }
  if (!/^\+?\d{10,13}$/.test(phone)) {
    throw new HttpsError('invalid-argument', 'Enter a valid phone number.');
  }
  if (!/^\d{6}$/.test(pincode)) {
    throw new HttpsError('invalid-argument', 'Enter a valid 6-digit PIN code.');
  }

  return { fullName, email, phone, street, city, state, pincode };
}

function createDateFields(now = new Date()) {
  const date = now.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric'
  });
  const time = now.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true
  });
  return { date, time, dateTime: `${date} • ${time}` };
}

async function razorpayRequest(path, { method = 'GET', body } = {}) {
  const keyId = razorpayKeyId.value();
  const keySecret = razorpayKeySecret.value();
  const authorization = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const response = await fetch(`https://api.razorpay.com/v1/${path}`, {
    method,
    headers: {
      Authorization: `Basic ${authorization}`,
      ...(body ? { 'Content-Type': 'application/json' } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    logger.error('Razorpay API request failed', {
      status: response.status,
      code: data?.error?.code || 'unknown'
    });
    throw new HttpsError('unavailable', 'Payment service is temporarily unavailable. Please try again.');
  }
  return data;
}

function orderSummary(order) {
  return {
    orderId: order.orderId,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    shippingAddress: order.shippingAddress,
    addressDetails: order.addressDetails,
    date: order.date,
    time: order.time,
    dateTime: order.dateTime,
    total: order.total,
    subtotal: order.subtotal,
    discountAmount: order.discountAmount,
    shippingCost: order.shippingCost,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    isTestOrder: false,
    status: order.status,
    items: order.items,
    razorpayOrderId: order.razorpayOrderId || null,
    paymentId: order.paymentId || null
  };
}

export const createRazorpayOrder = onCall({
  region: 'asia-south1',
  enforceAppCheck: true,
  cors: ALLOWED_ORIGINS,
  secrets: [razorpayKeyId, razorpayKeySecret]
}, async (request) => {
  const customer = validateCustomer(request.data?.customer);
  let pricing;
  try {
    pricing = priceOrder(request.data?.items, request.data?.couponCode);
  } catch (error) {
    throw new HttpsError('invalid-argument', error.message);
  }

  const internalOrderId = `VAGVAT-${Date.now()}-${randomUUID().replaceAll('-', '').slice(0, 8)}`;
  const orderRef = db.collection('orders').doc(internalOrderId);
  const addressDetails = {
    street: customer.street,
    city: customer.city,
    state: customer.state,
    pincode: customer.pincode
  };
  const shippingAddress = `${customer.street}, ${customer.city}${customer.state ? `, ${customer.state}` : ''} - ${customer.pincode}`;
  const dateFields = createDateFields();
  const orderRecord = {
    orderId: internalOrderId,
    customerName: customer.fullName,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    shippingAddress,
    addressDetails,
    ...dateFields,
    total: pricing.total,
    subtotal: pricing.subtotal,
    discountAmount: pricing.discountAmount,
    shippingCost: pricing.shippingCost,
    paymentMethod: 'Razorpay',
    paymentStatus: 'Pending',
    isTestOrder: false,
    status: 'Payment Pending',
    userId: request.auth?.uid || null,
    razorpayOrderId: null,
    paymentId: null,
    currency: 'INR',
    amountPaise: pricing.amount,
    items: pricing.items,
    createdAt: FieldValue.serverTimestamp()
  };

  await orderRef.create(orderRecord);

  try {
    const razorpayOrder = await razorpayRequest('orders', {
      method: 'POST',
      body: {
        amount: pricing.amount,
        currency: 'INR',
        receipt: internalOrderId,
        notes: { internalOrderId }
      }
    });
    await orderRef.update({ razorpayOrderId: razorpayOrder.id, updatedAt: FieldValue.serverTimestamp() });
    return {
      keyId: razorpayKeyId.value(),
      razorpayOrderId: razorpayOrder.id,
      internalOrderId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      order: orderSummary({ ...orderRecord, razorpayOrderId: razorpayOrder.id })
    };
  } catch (error) {
    await orderRef.update({
      status: 'Payment Setup Failed',
      paymentStatus: 'Failed',
      updatedAt: FieldValue.serverTimestamp()
    }).catch(() => {});
    if (error instanceof HttpsError) throw error;
    logger.error('Could not create Razorpay order', { orderId: internalOrderId });
    throw new HttpsError('unavailable', 'Could not start payment. Please try again.');
  }
});

export const verifyRazorpayPayment = onCall({
  region: 'asia-south1',
  enforceAppCheck: true,
  cors: ALLOWED_ORIGINS,
  secrets: [razorpayKeyId, razorpayKeySecret]
}, async (request) => {
  const internalOrderId = requireString(request.data?.internalOrderId, 'order reference', 64);
  const razorpayOrderId = requireString(request.data?.razorpayOrderId, 'Razorpay order reference', 64);
  const paymentId = requireString(request.data?.paymentId, 'payment reference', 64);
  const signature = requireString(request.data?.signature, 'payment verification', 128);
  const orderRef = db.collection('orders').doc(internalOrderId);
  const orderSnap = await orderRef.get();
  if (!orderSnap.exists) throw new HttpsError('not-found', 'The order could not be found.');
  const order = orderSnap.data();
  if (order.razorpayOrderId !== razorpayOrderId) {
    throw new HttpsError('permission-denied', 'The payment does not match this order.');
  }
  if (order.paymentStatus === 'Paid' && order.paymentId === paymentId) {
    return { verified: true, order: orderSummary(order) };
  }
  if (!verifyRazorpaySignature(order.razorpayOrderId, paymentId, signature, razorpayKeySecret.value())) {
    throw new HttpsError('permission-denied', 'Payment verification failed. The order was not confirmed.');
  }

  const payment = await razorpayRequest(`payments/${encodeURIComponent(paymentId)}`);
  if (payment.order_id !== order.razorpayOrderId || payment.amount !== order.amountPaise || payment.currency !== 'INR') {
    throw new HttpsError('failed-precondition', 'The payment amount or order does not match.');
  }
  if (payment.status !== 'captured') {
    throw new HttpsError('failed-precondition', 'Payment has not been captured yet. The order remains pending.');
  }

  await db.runTransaction(async (transaction) => {
    const latest = await transaction.get(orderRef);
    if (!latest.exists) throw new HttpsError('not-found', 'The order could not be found.');
    const latestOrder = latest.data();
    if (latestOrder.paymentStatus === 'Paid') {
      if (latestOrder.paymentId !== paymentId) {
        throw new HttpsError('already-exists', 'This order has already been paid with another payment.');
      }
      return;
    }
    if (latestOrder.razorpayOrderId !== razorpayOrderId || latestOrder.paymentStatus !== 'Pending') {
      throw new HttpsError('failed-precondition', 'The order is no longer awaiting payment.');
    }
    transaction.update(orderRef, {
      paymentStatus: 'Paid',
      status: 'Ordered',
      paymentId,
      amountCapturedPaise: payment.amount,
      updatedAt: FieldValue.serverTimestamp()
    });
  });

  const verified = (await orderRef.get()).data();
  return { verified: true, order: orderSummary(verified) };
});

export const razorpayWebhook = onRequest({
  region: 'asia-south1',
  maxInstances: 5,
  secrets: [razorpayWebhookSecret]
}, async (request, response) => {
  if (request.method !== 'POST') {
    response.status(405).send('Method not allowed');
    return;
  }

  const signature = request.get('x-razorpay-signature') || '';
  const rawBody = request.rawBody;
  if (!verifyWebhookSignature(rawBody, signature, razorpayWebhookSecret.value())) {
    response.status(400).send('Invalid webhook signature');
    return;
  }

  const eventId = request.get('x-razorpay-event-id');
  if (!eventId) {
    response.status(400).send('Missing event ID');
    return;
  }

  let payload;
  try {
    payload = JSON.parse(rawBody.toString('utf8'));
  } catch {
    response.status(400).send('Invalid event body');
    return;
  }
  if (payload.event !== 'payment.captured') {
    response.status(200).json({ received: true });
    return;
  }

  const payment = payload.payload?.payment?.entity;
  if (!payment?.id || !payment.order_id || payment.status !== 'captured') {
    response.status(400).send('Incomplete capture event');
    return;
  }

  try {
    const orderQuery = await db.collection('orders')
      .where('razorpayOrderId', '==', payment.order_id)
      .limit(1)
      .get();
    if (orderQuery.empty) {
      response.status(500).send('Order not ready for webhook processing');
      return;
    }

    const orderRef = orderQuery.docs[0].ref;
    const eventRef = db.collection('razorpay_webhook_events')
      .doc(createHash('sha256').update(eventId).digest('hex'));
    await db.runTransaction(async (transaction) => {
      const [eventSnap, orderSnap] = await Promise.all([
        transaction.get(eventRef),
        transaction.get(orderRef)
      ]);
      if (eventSnap.exists) return;
      if (!orderSnap.exists) throw new Error('Order disappeared during webhook processing.');
      const order = orderSnap.data();
      if (payment.amount !== order.amountPaise || payment.currency !== 'INR') {
        throw new Error('Captured amount does not match the order.');
      }
      if (order.paymentStatus !== 'Paid') {
        transaction.update(orderRef, {
          paymentStatus: 'Paid',
          status: 'Ordered',
          paymentId: payment.id,
          amountCapturedPaise: payment.amount,
          updatedAt: FieldValue.serverTimestamp()
        });
      }
      transaction.create(eventRef, {
        eventId,
        eventType: payload.event,
        orderId: order.orderId,
        paymentId: payment.id,
        processedAt: FieldValue.serverTimestamp()
      });
    });
    response.status(200).json({ received: true });
  } catch (error) {
    logger.error('Could not process Razorpay webhook', { eventId });
    response.status(500).send('Webhook processing failed');
  }
});
