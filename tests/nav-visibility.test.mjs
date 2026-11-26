import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getVisibleNavItems } from '../lib/nav-visibility.ts';

const items = [
  { id: 1, title: 'Inicio', url: '/' },
  { id: 2, title: 'Ubicaciones', url: '/admin/ubicaciones', requiresRole: 'admin' },
];

test('hides admin items from anonymous users and regular users', () => {
  assert.deepEqual(getVisibleNavItems(items, undefined).map((i) => i.id), [1]);
  assert.deepEqual(getVisibleNavItems(items, null).map((i) => i.id), [1]);
  assert.deepEqual(getVisibleNavItems(items, 'user').map((i) => i.id), [1]);
});

test('shows admin items to admins', () => {
  assert.deepEqual(getVisibleNavItems(items, 'admin').map((i) => i.id), [1, 2]);
});
