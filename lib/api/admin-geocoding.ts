import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { components } from "@/lib/api-types";

export type GeocodedAddress = components["schemas"]["GeocodedAddressRead"];

export async function getGeocodingRows(status: GeocodedAddress["status"]): Promise<GeocodedAddress[]> {
  const sessionToken = (await cookies()).get("pp_session")?.value;
  if (!sessionToken) redirect("/login");

  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) throw new Error("Falta configurar API_BASE_URL");

  const response = await fetch(
    `${baseUrl.replace(/\/+$/, "")}/api/v1/admin/geocoding?status=${encodeURIComponent(status)}`,
    { cache: "no-store", headers: { Cookie: `pp_session=${encodeURIComponent(sessionToken)}` } },
  );

  if (response.status === 401) redirect("/login");
  if (response.status === 403) redirect("/");
  if (!response.ok) throw new Error("No se pudieron cargar las direcciones");

  return response.json();
}
