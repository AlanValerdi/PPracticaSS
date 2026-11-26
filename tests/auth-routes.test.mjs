import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LOGIN_PATH, getNavHref, isProtectedPath } from '../lib/auth-routes.ts';

test('protected items point to the login page when the user is logged out', () => {
  assert.equal(getNavHref({ url: '/guardados', requiresAuth: true }, 'anonymous'), LOGIN_PATH);
  assert.equal(getNavHref({ url: '/analisis-cv', requiresAuth: true }, 'anonymous'), LOGIN_PATH);
});

test('protected items keep their url while the session is unknown or authenticated', () => {
  assert.equal(getNavHref({ url: '/guardados', requiresAuth: true }, 'unknown'), '/guardados');
  assert.equal(getNavHref({ url: '/guardados', requiresAuth: true }, 'authenticated'), '/guardados');
});

test('public items always keep their url', () => {
  assert.equal(getNavHref({ url: '/mapa' }, 'anonymous'), '/mapa');
});

test('detects protected paths including nested routes', () => {
  assert.equal(isProtectedPath('/guardados'), true);
  assert.equal(isProtectedPath('/guardados/123'), true);
  assert.equal(isProtectedPath('/analisis-cv'), true);
  assert.equal(isProtectedPath('/guardadosx'), false);
  assert.equal(isProtectedPath('/'), false);
});
