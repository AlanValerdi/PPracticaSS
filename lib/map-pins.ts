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
