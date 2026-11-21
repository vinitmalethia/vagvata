import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const ADMIN_UID = '3KIdtkNrZSTLd5iqRGxLLG7UihA2';
const TEST_ORDER_ID = 'VAGVAT-RULE-TEST-1';
const testEnv = await initializeTestEnvironment({
  projectId: process.env.GCLOUD_PROJECT || 'demo-vagvatayurveda',
  firestore: { rules: await readFile(new URL('../firestore.rules', import.meta.url), 'utf8') }
});

const order = (overrides = {}) => ({
  orderId: TEST_ORDER_ID,
  customerName: 'Sample Customer',
  customerEmail: 'customer@example.com',
  total: 2499,
  isTestOrder: true,
  paymentStatus: 'Test',
  paymentMethod: 'Test Order (No Payment)',
  status: 'Ordered',
  items: [{ name: 'Sample Product', quantity: 1, price: 2499 }],
  ...overrides
});

after(async () => testEnv.cleanup());

test('the configured admin alone can read, update and delete orders', async () => {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), 'orders', TEST_ORDER_ID), order());
  });

  const adminDb = testEnv.authenticatedContext(ADMIN_UID).firestore();
  const otherDb = testEnv.authenticatedContext('another-user').firestore();
  await assertSucceeds(getDoc(doc(adminDb, 'orders', TEST_ORDER_ID)));
  await assertSucceeds(updateDoc(doc(adminDb, 'orders', TEST_ORDER_ID), { status: 'Delivered' }));
  await assertFails(getDoc(doc(otherDb, 'orders', TEST_ORDER_ID)));
  await assertFails(updateDoc(doc(otherDb, 'orders', TEST_ORDER_ID), { status: 'Delivered' }));
  await assertFails(deleteDoc(doc(otherDb, 'orders', TEST_ORDER_ID)));
  await assertSucceeds(deleteDoc(doc(adminDb, 'orders', TEST_ORDER_ID)));
});

test('customers can create only unpaid test orders', async () => {
  const guestDb = testEnv.unauthenticatedContext().firestore();
  await assertSucceeds(setDoc(doc(guestDb, 'orders', TEST_ORDER_ID), order()));
  await assertFails(setDoc(doc(guestDb, 'orders', 'VAGVAT-FAKE-PAID'), order({
    orderId: 'VAGVAT-FAKE-PAID',
    isTestOrder: false,
    paymentStatus: 'Paid',
    paymentMethod: 'Razorpay'
  })));
});

test('users cannot create or promote admin profile documents', async () => {
  const customerDb = testEnv.authenticatedContext('customer-uid').firestore();
  await assertSucceeds(setDoc(doc(customerDb, 'users', 'customer-uid'), {
    uid: 'customer-uid', role: 'customer', email: 'customer@example.com'
  }));
  await assertFails(setDoc(doc(customerDb, 'users', 'customer-uid'), {
    uid: 'customer-uid', role: 'admin', email: 'customer@example.com'
  }));
  await assertFails(setDoc(doc(customerDb, 'users', 'someone-else'), {
    uid: 'someone-else', role: 'admin'
  }));
  await assertFails(updateDoc(doc(customerDb, 'users', 'customer-uid'), { role: 'admin' }));
});
