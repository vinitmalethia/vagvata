import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { PRODUCTS } from '../src/data/products.js';
import { CATALOG } from './catalog.js';
import { fromFirestoreDocument, priceOrder, toFirestoreFields, verifyHmacSha256 } from './payment-core.js';

test('Worker catalog matches storefront product IDs and prices', () => {
  assert.deepEqual(
    Object.fromEntries(PRODUCTS.map(({ id, price }) => [id, price])),
    Object.fromEntries(Object.entries(CATALOG).map(([id, product]) => [id, product.price]))
  );
});

test('prices cart and coupons on server in integer paise', () => {
  assert.deepEqual(priceOrder([
    { id: 'veda-finder-skin-care', quantity: 1 },
    { id: 'vitonex-tablets', quantity: 2 }
  ], 'VAGVAT10'), {
    items: [
      { id: 'veda-finder-skin-care', name: 'Veda Finder Skin Care', quantity: 1, price: 3499, volume: 'Skin Care' },
      { id: 'vitonex-tablets', name: 'Vitonex Tablets (Multivitamin & Multimineral)', quantity: 2, price: 347, volume: '30 Tablets • Complete Daily Spectrum' }
    ],
    subtotal: 4193, discountAmount: 419, shippingCost: 0, total: 3774, amount: 377400, currency: 'INR'
  });
  assert.throws(() => priceOrder([{ id: 'fake', quantity: 1 }]));
  assert.throws(() => priceOrder([{ id: 'veda-finder-skin-care', quantity: 100 }]));
  assert.throws(() => priceOrder([{ id: 'veda-finder-skin-care', quantity: 1 }], 'FAKE10'));
});

test('validates Razorpay payment and raw webhook HMACs', async () => {
  const secret = 'worker-test-secret';
  const paymentText = 'order_123|pay_456';
  const paymentSignature = createHmac('sha256', secret).update(paymentText).digest('hex');
  assert.equal(await verifyHmacSha256(secret, paymentText, paymentSignature), true);
  assert.equal(await verifyHmacSha256(secret, 'order_wrong|pay_456', paymentSignature), false);
  const body = new TextEncoder().encode('{"event":"payment.captured"}');
  const webhookSignature = createHmac('sha256', secret).update(body).digest('hex');
  assert.equal(await verifyHmacSha256(secret, body, webhookSignature), true);
  assert.equal(await verifyHmacSha256(secret, new TextEncoder().encode('{}'), webhookSignature), false);
});

test('converts confirmed orders to and from Firestore REST documents', () => {
  const order = { orderId: 'VAGVAT-1', total: 3499, paymentStatus: 'Paid', items: [{ id: 'veda-finder-skin-care', quantity: 1 }] };
  const fields = toFirestoreFields(order);
  assert.deepEqual(fromFirestoreDocument({ fields }), order);
});
