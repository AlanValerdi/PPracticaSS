import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getPinHref, parseCoordinates } from '../lib/map-pins.ts';

test('builds an offer link only when the pin has an area', () => {
  assert.equal(getPinHref({ offerUuid: 'abc', areaSlug: 'computacion' }), '/facultad/computacion/abc');
  assert.equal(getPinHref({ offerUuid: 'a/b', areaSlug: 'c d' }), '/facultad/c%20d/a%2Fb');
  assert.equal(getPinHref({ offerUuid: 'abc', areaSlug: null }), null);
});

test('parses valid coordinates', () => {
  assert.deepEqual(parseCoordinates(19.04, -98.2), { lat: 19.04, lng: -98.2 });
  assert.deepEqual(parseCoordinates('19.04', '-98.2'), { lat: 19.04, lng: -98.2 });
});

test('rejects invalid or out of range coordinates', () => {
  assert.equal(parseCoordinates('', '-98'), null);
  assert.equal(parseCoordinates('abc', '1'), null);
  assert.equal(parseCoordinates(91, 0), null);
  assert.equal(parseCoordinates(0, 181), null);
  assert.equal(parseCoordinates(NaN, 0), null);
  assert.equal(parseCoordinates(null, 0), null);
});
