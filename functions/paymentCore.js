import { createHmac, timingSafeEqual } from 'node:crypto';
import { CATALOG } from './catalog.js';

const COUPONS = Object.freeze({
  VAGVAT10: 10,
  AYURVEDA10: 10,
  VAIDYA15: 15
});

export function priceOrder(cart, couponCode = '') {
  if (!Array.isArray(cart) || cart.length < 1 || cart.length > 30) {
    throw new Error('Your cart is empty or contains too many items.');
  }

  const quantities = new Map();
  for (const row of cart) {
    const id = typeof row?.id === 'string' ? row.id : '';
    const quantity = Number(row?.quantity);
    if (!CATALOG[id] || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw new Error('Your cart contains an invalid product or quantity.');
    }
    quantities.set(id, (quantities.get(id) || 0) + quantity);
    if (quantities.get(id) > 99) throw new Error('The requested quantity exceeds the limit.');
  }

  const items = [...quantities].map(([id, quantity]) => ({
    id,
    name: CATALOG[id].name,
    quantity,
    price: CATALOG[id].price,
    volume: CATALOG[id].volume
  }));
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  if (!Number.isSafeInteger(subtotal) || subtotal > 1_000_000) {
    throw new Error('The cart total is outside the supported checkout range.');
  }

  const normalizedCoupon = String(couponCode || '').trim().toUpperCase();
  const discountPercent = normalizedCoupon ? COUPONS[normalizedCoupon] : 0;
  if (normalizedCoupon && !discountPercent) throw new Error('The promo code is invalid.');
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shippingCost = subtotal >= 499 ? 0 : 70;
  const total = subtotal - discountAmount + shippingCost;

  return { items, subtotal, discountAmount, shippingCost, total, currency: 'INR', amount: total * 100 };
}

export function verifyRazorpaySignature(orderId, paymentId, signature, secret) {
  if (![orderId, paymentId, signature, secret].every(value => typeof value === 'string' && value.length > 0)) {
    return false;
  }
  if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest();
  const received = Buffer.from(signature, 'hex');
  return received.length === expected.length && timingSafeEqual(expected, received);
}

export function verifyWebhookSignature(rawBody, signature, secret) {
  if (!Buffer.isBuffer(rawBody) || typeof signature !== 'string' || typeof secret !== 'string') return false;
  if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = createHmac('sha256', secret).update(rawBody).digest();
  const received = Buffer.from(signature, 'hex');
  return received.length === expected.length && timingSafeEqual(expected, received);
}
