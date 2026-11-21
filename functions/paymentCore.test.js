import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { PRODUCTS } from '../src/data/products.js';
import { CATALOG } from './catalog.js';
import { priceOrder, verifyRazorpaySignature, verifyWebhookSignature } from './paymentCore.js';

test('server payment catalog matches every storefront product ID and price', () => {
  assert.deepEqual(
    Object.fromEntries(PRODUCTS.map(product => [product.id, product.price])),
    Object.fromEntries(Object.entries(CATALOG).map(([id, product]) => [id, product.price]))
  );
});

test('server recalculates subtotal, promo discount, shipping and paise amount', () => {
  assert.deepEqual(priceOrder([
    { id: 'veda-finder-skin-care', quantity: 1 },
    { id: 'vitonex-tablets', quantity: 2 }
  ], 'VAGVAT10'), {
    items: [
      { id: 'veda-finder-skin-care', name: 'Veda Finder Skin Care', quantity: 1, price: 3499, volume: 'Skin Care' },
      { id: 'vitonex-tablets', name: 'Vitonex Tablets (Multivitamin & Multimineral)', quantity: 2, price: 347, volume: '30 Tablets • Complete Daily Spectrum' }
    ],
    subtotal: 4193,
    discountAmount: 419,
    shippingCost: 0,
    total: 3774,
    currency: 'INR',
    amount: 377400
  });
});

test('server rejects forged product IDs, quantities and coupon codes', () => {
  assert.throws(() => priceOrder([{ id: 'forged-product', quantity: 1 }]));
  assert.throws(() => priceOrder([{ id: 'veda-finder-skin-care', quantity: 0 }]));
  assert.throws(() => priceOrder([{ id: 'veda-finder-skin-care', quantity: 1 }], 'FAKE10'));
});

test('payment and webhook signatures require a valid HMAC over the trusted payload', () => {
  const secret = 'unit-test-secret';
  const orderId = 'order_test_123';
  const paymentId = 'pay_test_456';
  const paymentSignature = createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
  assert.equal(verifyRazorpaySignature(orderId, paymentId, paymentSignature, secret), true);
  assert.equal(verifyRazorpaySignature('order_wrong', paymentId, paymentSignature, secret), false);

  const body = Buffer.from('{"event":"payment.captured"}');
  const webhookSignature = createHmac('sha256', secret).update(body).digest('hex');
  assert.equal(verifyWebhookSignature(body, webhookSignature, secret), true);
  assert.equal(verifyWebhookSignature(Buffer.from('{}'), webhookSignature, secret), false);
});
