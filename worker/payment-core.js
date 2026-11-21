import { CATALOG } from './catalog.js';

const COUPONS = Object.freeze({ VAGVAT10: 10, AYURVEDA10: 10, VAIDYA15: 15 });
const encoder = new TextEncoder();

export function priceOrder(cart, couponCode = '') {
  if (!Array.isArray(cart) || cart.length < 1 || cart.length > 30) throw new Error('Your cart is empty or contains too many items.');
  const quantities = new Map();
  for (const row of cart) {
    const id = typeof row?.id === 'string' ? row.id : '';
    const quantity = Number(row?.quantity);
    if (!CATALOG[id] || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) throw new Error('Your cart contains an invalid product or quantity.');
    quantities.set(id, (quantities.get(id) || 0) + quantity);
    if (quantities.get(id) > 99) throw new Error('The requested quantity exceeds the limit.');
  }
  const items = [...quantities].map(([id, quantity]) => ({ id, name: CATALOG[id].name, quantity, price: CATALOG[id].price, volume: CATALOG[id].volume }));
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (!Number.isSafeInteger(subtotal) || subtotal > 1_000_000) throw new Error('The cart total is outside the supported checkout range.');
  const coupon = String(couponCode || '').trim().toUpperCase();
  const discountPercent = coupon ? COUPONS[coupon] : 0;
  if (coupon && !discountPercent) throw new Error('The promo code is invalid.');
  const discountAmount = Math.round(subtotal * discountPercent / 100);
  const shippingCost = subtotal >= 499 ? 0 : 70;
  const total = subtotal - discountAmount + shippingCost;
  return { items, subtotal, discountAmount, shippingCost, total, amount: total * 100, currency: 'INR' };
}

function bytesToHex(bytes) {
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex) {
  if (typeof hex !== 'string' || !/^[a-f\d]{64}$/i.test(hex)) return null;
  return Uint8Array.from(hex.match(/.{2}/g), (pair) => Number.parseInt(pair, 16));
}

function constantTimeEqual(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) result |= a[i] ^ b[i];
  return result === 0;
}

export async function hmacSha256Hex(secret, message) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return bytesToHex(await crypto.subtle.sign('HMAC', key, typeof message === 'string' ? encoder.encode(message) : message));
}

export async function verifyHmacSha256(secret, message, signature) {
  if (typeof secret !== 'string' || !secret) return false;
  return constantTimeEqual(hexToBytes(await hmacSha256Hex(secret, message)), hexToBytes(signature));
}

function toFirestoreValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(toFirestoreValue) } };
  if (typeof value === 'object') return { mapValue: { fields: toFirestoreFields(value) } };
  throw new Error('Unsupported Firestore value.');
}

export function toFirestoreFields(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Firestore documents must be objects.');
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, toFirestoreValue(item)]));
}

export function fromFirestoreValue(value) {
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('nullValue' in value) return null;
  if ('timestampValue' in value) return value.timestampValue;
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(fromFirestoreValue);
  if ('mapValue' in value) return Object.fromEntries(Object.entries(value.mapValue.fields || {}).map(([key, item]) => [key, fromFirestoreValue(item)]));
  return null;
}

export function fromFirestoreDocument(document) {
  return Object.fromEntries(Object.entries(document.fields || {}).map(([key, value]) => [key, fromFirestoreValue(value)]));
}
