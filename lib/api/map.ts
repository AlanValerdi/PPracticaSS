import "server-only";

import type { components } from "@/lib/api-types";

export type MapPin = components["schemas"]["MapPin"];

export async function getMapPins(): Promise<MapPin[]> {
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) throw new Error("Falta configurar API_BASE_URL");

  const response = await fetch(`${baseUrl.replace(/\/+$/, "")}/api/v1/map/pins`, { cache: "no-store" });
  if (!response.ok) throw new Error("No se pudieron cargar las ubicaciones del mapa");

  return response.json();
}
