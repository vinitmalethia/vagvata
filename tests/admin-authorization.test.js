import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ADMIN_UID, isAdminUser } from '../src/auth/adminAuthorization.js';

test('only the configured Firebase UID is authorized as admin', () => {
  assert.equal(ADMIN_UID, '3KIdtkNrZSTLd5iqRGxLLG7UihA2');
  assert.equal(isAdminUser({ uid: ADMIN_UID, email: 'any@example.com' }), true);
  assert.equal(isAdminUser({ uid: 'fOZcyquhHTUJJA7o5xiz4d7vBoB3', email: 'sachin@gmail.com' }), false);
  assert.equal(isAdminUser({ uid: 'another-user', email: 'sachin@gmail.com' }), false);
  assert.equal(isAdminUser(null), false);
});

test('Firestore rules restrict admin operations and public order creation to test orders', () => {
  const rules = readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8');
  assert.match(rules, /request\.auth\.uid\s*==\s*'3KIdtkNrZSTLd5iqRGxLLG7UihA2'/);
  assert.doesNotMatch(rules, /fOZcyquhHTUJJA7o5xiz4d7vBoB3/);
  assert.match(rules, /request\.resource\.data\.isTestOrder\s*==\s*true/);
  assert.match(rules, /allow update, delete:\s*if isAdmin\(\)/);
  assert.match(rules, /request\.resource\.data\.role\s*==\s*'customer'/);
});
