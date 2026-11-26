import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getNavHref, isProtectedPath } from '../lib/auth-routes.ts';

test('protected items point to the login page when the user is logged out', () => {
  assert.equal(getNavHref({ url: '/guardados', requiresAuth: true }, 'anonymous'), '/login?next=%2Fguardados');
  assert.equal(getNavHref({ url: '/analisis-cv', requiresAuth: true }, 'anonymous'), '/login?next=%2Fanalisis-cv');
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

test('admin routes are protected', () => {
  assert.equal(isProtectedPath('/admin'), true);
  assert.equal(isProtectedPath('/admin/ubicaciones'), true);
  assert.equal(isProtectedPath('/administrador'), false);
});

test('google login href carries the current page as next', async () => {
  const { getGoogleLoginHref } = await import('../lib/auth-routes.ts');
  assert.equal(getGoogleLoginHref('/facultad/civil/123'), '/api/backend/auth/google/login?next=%2Ffacultad%2Fcivil%2F123');
  assert.equal(getGoogleLoginHref(undefined), '/api/backend/auth/google/login');
  assert.equal(getGoogleLoginHref('//evil.com'), '/api/backend/auth/google/login');
  assert.equal(getGoogleLoginHref('https://evil.com'), '/api/backend/auth/google/login');
});

test('login page path keeps where the user was going', async () => {
  const { getLoginPagePath } = await import('../lib/auth-routes.ts');
  assert.equal(getLoginPagePath('/guardados'), '/login?next=%2Fguardados');
  assert.equal(getLoginPagePath(undefined), '/login');
});
