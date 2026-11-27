export function getPinHref(pin: { offerUuid: string; areaSlug: string | null }): string | null {
  if (!pin.areaSlug) return null;
  return `/facultad/${encodeURIComponent(pin.areaSlug)}/${encodeURIComponent(pin.offerUuid)}`;
}

// Validates a lat/lng pair coming from user input; returns null when invalid.
export function parseCoordinates(lat: unknown, lng: unknown): { lat: number; lng: number } | null {
  const toNumber = (value: unknown): number => {
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() !== "") return Number(value);
    return NaN;
  };
  const latitude = toNumber(lat);
  const longitude = toNumber(lng);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null;
  return { lat: latitude, lng: longitude };
}

export type AreaInfo = { areaName: string; facultyName: string | null; toneIndex: number };

type CatalogShape = {
  sections: { id: string; order: number }[];
  faculties: { id: string; name: string }[];
  areas: { slug: string; name: string; sectionId: string; facultyId: string }[];
};

// toneIndex is the area's position inside its section, the same order the home carousel uses,
// so map cards get the same colour as the area cards on the home page.
export function buildAreaLookup(catalog: CatalogShape): Map<string, AreaInfo> {
  const facultyNames = new Map(catalog.faculties.map((faculty) => [faculty.id, faculty.name]));
  const positionInSection = new Map<string, number>();
  const lookup = new Map<string, AreaInfo>();

  for (const area of catalog.areas) {
    const toneIndex = positionInSection.get(area.sectionId) ?? 0;
    positionInSection.set(area.sectionId, toneIndex + 1);
    lookup.set(area.slug, {
      areaName: area.name,
      facultyName: facultyNames.get(area.facultyId) ?? null,
      toneIndex,
    });
  }
  return lookup;
}

export type OfferAreas =
  | ({ kind: "single"; slug: string } & AreaInfo)
  | { kind: "multiple"; count: number; shownNames: string[]; remaining: number; facultyName: string | null }
  | { kind: "unknown" };

const SHOWN_AREA_NAMES = 2;

// Offers can be open to many careers; only single-area offers take that area's colour.
export function describeOfferAreas(slugs: string[], lookup: Map<string, AreaInfo>): OfferAreas {
  const known = slugs.flatMap((slug) => {
    const info = lookup.get(slug);
    return info ? [{ slug, ...info }] : [];
  });
  if (known.length === 0) return { kind: "unknown" };
  if (known.length === 1) return { kind: "single", ...known[0] };

  const faculties = new Set(known.map((area) => area.facultyName));
  const [onlyFaculty] = faculties;
  return {
    kind: "multiple",
    count: known.length,
    shownNames: known.slice(0, SHOWN_AREA_NAMES).map((area) => area.areaName),
    remaining: Math.max(known.length - SHOWN_AREA_NAMES, 0),
    facultyName: faculties.size === 1 ? onlyFaculty : null,
  };
}
