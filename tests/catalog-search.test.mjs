import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCatalogSearchIndex, searchCatalog, normalizeSearch, matchesSearch } from '../lib/catalog-search.ts';

const areas = [
  { uuid: 'b', slug: 'ingenieria-computacion', name: 'Computación', level: 'Ing', offerIds: ['shared', 'exact', 'prefix'] },
  { uuid: 'a', slug: 'actuaria', name: 'Actuaría', level: 'Lic', offerIds: ['shared', 'shared'] },
];
const offer = (uuid, programa, folio, empresa = 'Empresa Demo') => ({ uuid, listing: { programa, folio, empresa }, summary: { company: empresa } });
const catalog = { areas, offers: [offer('shared', 'Apoyo en datos', '12345', 'Compañía Águila'), offer('shared', 'Duplicada', '12345'), offer('exact', 'Datos', '222'), offer('prefix', 'Datos abiertos', '333'), offer('orphan', 'Sin carrera', '444')] };
const index = buildCatalogSearchIndex(catalog);
const results = (query, group = 'Ofertas') => searchCatalog(index, query).find((item) => item.label === group)?.items ?? [];

test('normaliza acentos, mayúsculas y espacios; permite varios términos', () => {
  assert.equal(normalizeSearch('  COMPUTACIÓN  Ágil  '), 'computacion agil');
  assert.ok(matchesSearch('Ing. Ingeniería Tecnologías de la Información', ' tecnologias   informacion '));
});
test('separa áreas y ofertas y oculta grupos vacíos', () => {
  assert.deepEqual(searchCatalog(index, 'computacion').map((group) => group.label), ['Áreas', 'Ofertas']);
  assert.deepEqual(searchCatalog(index, '12345').map((group) => group.label), ['Ofertas']);
  assert.deepEqual(searchCatalog(index, 'inexistente'), []);
  assert.deepEqual(searchCatalog(index, '  '), []);
});
test('busca folio y empresa sin duplicar ofertas compartidas', () => {
  assert.equal(results('12345').length, 1);
  assert.equal(results('compania aguila')[0].id, 'offer:shared');
  assert.equal(results('444').length, 0);
});
test('prioriza coincidencias exactas, de inicio y luego parciales', () => {
  assert.deepEqual(results('datos').map((item) => item.label), ['Datos', 'Datos abiertos', 'Apoyo en datos']);
});
test('usa carrera coincidente o primera por nombre y crea enlaces correctos', () => {
  const matching = results('computacion').find((item) => item.id === 'offer:shared');
  assert.equal(matching.href, '/facultad/ingenieria-computacion/shared');
  assert.match(matching.description, /Ing\. Computación/);
  assert.equal(results('12345')[0].href, '/facultad/actuaria/shared');
  assert.equal(results('actuaria', 'Áreas')[0].href, '/facultad/actuaria');
});
test('ordena empates alfabéticamente', () => {
  const tied = buildCatalogSearchIndex({ areas: [{ ...areas[0], offerIds: ['z', 'a'] }], offers: [offer('z', 'Zeta', '1'), offer('a', 'Alfa', '2')] });
  assert.deepEqual(searchCatalog(tied, 'demo')[0].items.map((item) => item.label), ['Alfa', 'Zeta']);
});
