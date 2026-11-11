import type { components } from "./api-types";

type Catalog = components["schemas"]["Catalog"];
export type SearchArea = Pick<components["schemas"]["Area"], "uuid" | "slug" | "name" | "level">;
export type SearchItem = {
  id: string;
  label: string;
  description?: string;
  href: string;
  kind: "page" | "area" | "offer";
};
export type SearchGroup = { label: string; items: SearchItem[] };
type IndexedArea = { area: SearchArea; fields: string[] };
type IndexedOffer = {
  uuid: string;
  title: string;
  folio: string;
  areas: IndexedArea[];
  fields: string[];
};
export type CatalogSearchIndex = { areas: IndexedArea[]; offers: IndexedOffer[] };

export function normalizeSearch(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").trim().replace(/\s+/g, " ");
}

export function matchesSearch(text: string, query: string): boolean {
  const normalized = normalizeSearch(text);
  return normalizeSearch(query).split(" ").every((term) => normalized.includes(term));
}

export function areaLabel(area: SearchArea): string {
  return `${area.level}. ${area.name}`;
}

function score(fields: string[], query: string): number {
  const values = fields.map(normalizeSearch);
  if (values.includes(query)) return 0;
  if (values.some((value) => value.startsWith(query))) return 1;
  return query.split(" ").every((term) => values.some((value) => value.includes(term))) ? 2 : Infinity;
}

function compareAreas(a: IndexedArea, b: IndexedArea): number {
  return a.area.name.localeCompare(b.area.name, "es") || a.area.level.localeCompare(b.area.level) || a.area.slug.localeCompare(b.area.slug);
}

export function buildCatalogSearchIndex(catalog: Catalog): CatalogSearchIndex {
  const byOffer = new Map<string, IndexedArea[]>();
  const areas = catalog.areas.map((area) => {
    const indexed = { area, fields: [area.name, area.level, areaLabel(area), area.slug] };
    for (const id of new Set(area.offerIds)) byOffer.set(id, [...(byOffer.get(id) ?? []), indexed]);
    return indexed;
  }).sort(compareAreas);
  const offers = new Map<string, IndexedOffer>();
  for (const offer of catalog.offers) {
    const related = [...(byOffer.get(offer.uuid) ?? [])].sort(compareAreas);
    if (!related.length || offers.has(offer.uuid)) continue;
    offers.set(offer.uuid, {
      uuid: offer.uuid, title: offer.listing.programa, folio: offer.listing.folio, areas: related,
      fields: [offer.listing.programa, offer.listing.folio, offer.listing.empresa, offer.summary.company, ...related.flatMap((item) => item.fields)],
    });
  }
  return { areas, offers: [...offers.values()] };
}

export function searchCatalog(index: CatalogSearchIndex, text: string): SearchGroup[] {
  const query = normalizeSearch(text);
  if (!query) return [];
  const areas = index.areas.map((item) => ({ item, rank: score(item.fields, query) }))
    .filter(({ rank }) => Number.isFinite(rank))
    .sort((a, b) => a.rank - b.rank || compareAreas(a.item, b.item))
    .map(({ item }): SearchItem => ({
      id: `area:${item.area.uuid}`, label: areaLabel(item.area), kind: "area",
      href: `/facultad/${encodeURIComponent(item.area.slug)}`,
    }));
  const offers = index.offers.map((offer) => ({ offer, rank: score(offer.fields, query) }))
    .filter(({ rank }) => Number.isFinite(rank))
    .sort((a, b) => a.rank - b.rank || a.offer.title.localeCompare(b.offer.title, "es") || a.offer.uuid.localeCompare(b.offer.uuid))
    .map(({ offer }): SearchItem => {
      const related = offer.areas.map((item) => ({ item, rank: score(item.fields, query) }))
        .sort((a, b) => a.rank - b.rank || compareAreas(a.item, b.item));
      const area = related[0].item.area;
      return {
        id: `offer:${offer.uuid}`, label: offer.title, kind: "offer",
        description: `Folio ${offer.folio} · ${areaLabel(area)}`,
        href: `/facultad/${encodeURIComponent(area.slug)}/${encodeURIComponent(offer.uuid)}`,
      };
    });
  return [{ label: "Áreas", items: areas }, { label: "Ofertas", items: offers }].filter((group) => group.items.length);
}
