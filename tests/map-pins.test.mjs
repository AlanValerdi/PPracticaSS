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

test('area lookup mirrors the home tone order and resolves the faculty', async () => {
  const { buildAreaLookup } = await import('../lib/map-pins.ts');
  const catalog = {
    sections: [{ id: 'ing', order: 1 }, { id: 'lic', order: 2 }],
    faculties: [{ id: 'f1', name: 'Facultad de Ingeniería' }, { id: 'f2', name: 'Facultad de Economía' }],
    areas: [
      { slug: 'civil', name: 'Civil', sectionId: 'ing', facultyId: 'f1' },
      { slug: 'actuaria', name: 'Actuaría', sectionId: 'lic', facultyId: 'f2' },
      { slug: 'computacion', name: 'Computación', sectionId: 'ing', facultyId: 'f1' },
      { slug: 'huerfana', name: 'Sin facultad', sectionId: 'lic', facultyId: 'missing' },
    ],
  };
  const lookup = buildAreaLookup(catalog);
  assert.deepEqual(lookup.get('computacion'), { areaName: 'Computación', facultyName: 'Facultad de Ingeniería', toneIndex: 1 });
  assert.deepEqual(lookup.get('actuaria'), { areaName: 'Actuaría', facultyName: 'Facultad de Economía', toneIndex: 0 });
  assert.equal(lookup.get('huerfana').facultyName, null);
  assert.equal(lookup.get('nope'), undefined);
});

test('describes a single-area offer with that area colour and faculty', async () => {
  const { describeOfferAreas } = await import('../lib/map-pins.ts');
  const lookup = new Map([['civil', { areaName: 'Civil', facultyName: 'Ingeniería', toneIndex: 2 }]]);
  assert.deepEqual(describeOfferAreas(['civil'], lookup), {
    kind: 'single', slug: 'civil', areaName: 'Civil', facultyName: 'Ingeniería', toneIndex: 2,
  });
});

test('describes a multi-area offer with a count, first names and shared faculty only', async () => {
  const { describeOfferAreas } = await import('../lib/map-pins.ts');
  const lookup = new Map([
    ['civil', { areaName: 'Civil', facultyName: 'Ingeniería', toneIndex: 0 }],
    ['computacion', { areaName: 'Computación', facultyName: 'Ingeniería', toneIndex: 1 }],
    ['mecanica', { areaName: 'Mecánica', facultyName: 'Ingeniería', toneIndex: 2 }],
    ['actuaria', { areaName: 'Actuaría', facultyName: 'Físico Matemáticas', toneIndex: 0 }],
  ]);
  assert.deepEqual(describeOfferAreas(['civil', 'computacion', 'mecanica'], lookup), {
    kind: 'multiple', count: 3, shownNames: ['Civil', 'Computación'], remaining: 1, facultyName: 'Ingeniería',
  });
  assert.equal(describeOfferAreas(['actuaria', 'civil'], lookup).facultyName, null);
});

test('describes offers without known areas as unknown', async () => {
  const { describeOfferAreas } = await import('../lib/map-pins.ts');
  assert.deepEqual(describeOfferAreas([], new Map()), { kind: 'unknown' });
  assert.deepEqual(describeOfferAreas(['ghost'], new Map()), { kind: 'unknown' });
});
