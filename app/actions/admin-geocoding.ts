"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";

import { parseCoordinates } from "@/lib/map-pins";

export type GeocodingActionState = {
  status: "success" | "auth-required" | "error";
  message?: string;
};

async function adminRequest(path: string, init: { method: string; body?: unknown }) {
  const sessionToken = (await cookies()).get("pp_session")?.value;
  if (!sessionToken) return { error: { status: "auth-required" } as GeocodingActionState };

  const origin = (await headers()).get("origin");
  const baseUrl = process.env.API_BASE_URL;
  if (!origin || !baseUrl) {
    return { error: { status: "error", message: "No se pudo validar la solicitud. Recarga la página." } as GeocodingActionState };
  }

  try {
    const response = await fetch(`${baseUrl.replace(/\/+$/, "")}${path}`, {
      method: init.method,
      cache: "no-store",
      headers: {
        Cookie: `pp_session=${encodeURIComponent(sessionToken)}`,
        Origin: origin,
        "X-Requested-With": "XMLHttpRequest",
        ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    });
    return { response };
  } catch {
    return { error: { status: "error", message: "No se pudo conectar con el servidor. Intenta nuevamente." } as GeocodingActionState };
  }
}

function mapFailure(status: number): GeocodingActionState {
  if (status === 401) return { status: "auth-required" };
  if (status === 403) return { status: "error", message: "No tienes permisos o la solicitud no es válida." };
  if (status === 404) return { status: "error", message: "La dirección ya no existe." };
  if (status === 422) return { status: "error", message: "Las coordenadas no son válidas." };
  return { status: "error", message: "No se pudo completar la operación. Intenta nuevamente." };
}

function revalidateMap() {
  revalidatePath("/mapa");
  revalidatePath("/admin/ubicaciones");
}

export async function saveManualLocationAction(
  addressKey: string,
  lat: number,
  lng: number,
): Promise<GeocodingActionState> {
  if (typeof addressKey !== "string" || !addressKey.trim() || addressKey.length > 1000) {
    return { status: "error", message: "La dirección no es válida." };
  }
  const coordinates = parseCoordinates(lat, lng);
  if (!coordinates) return { status: "error", message: "Las coordenadas no son válidas." };

  const result = await adminRequest(`/api/v1/admin/geocoding/${encodeURIComponent(addressKey)}`, {
    method: "PUT",
    body: coordinates,
  });
  if (result.error) return result.error;
  if (!result.response.ok) return mapFailure(result.response.status);

  revalidateMap();
  return { status: "success", message: "Ubicación guardada." };
}

export async function retryGeocodingAction(): Promise<GeocodingActionState> {
  const result = await adminRequest("/api/v1/geocoding/runs?retryNotFound=true", { method: "POST" });
  if (result.error) return result.error;
  if (!result.response.ok) return mapFailure(result.response.status);

  const run = (await result.response.json()) as {
    geocoded: number;
    approximate: number;
    notFound: number;
    failed: number;
  };
  revalidateMap();
  return {
    status: "success",
    message: `Listo: ${run.geocoded} exactas, ${run.approximate} aproximadas, ${run.notFound} sin resultado, ${run.failed} con error.`,
  };
}
