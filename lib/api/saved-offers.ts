import "server-only";

import { cookies } from "next/headers";

import type { components } from "@/lib/api-types";

export type SavedOffer = components["schemas"]["SavedOfferListItem"];

export async function getSavedOffers(): Promise<SavedOffer[] | null> {
  const sessionToken = (await cookies()).get("pp_session")?.value;
  if (!sessionToken) return null;

  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) throw new Error("Falta configurar API_BASE_URL");

  const response = await fetch(`${baseUrl.replace(/\/+$/, "")}/api/v1/saved-offers`, {
    cache: "no-store",
    headers: { Cookie: `pp_session=${encodeURIComponent(sessionToken)}` },
  });

  if (response.status === 401) return null;
  if (!response.ok) throw new Error("No se pudieron cargar tus ofertas guardadas");

  return response.json();
}
