"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";

export type SaveOfferState = {
  status: "idle" | "saved" | "auth-required" | "error";
  message?: string;
};

export async function saveOfferAction(offerUuid: string): Promise<SaveOfferState> {
  if (typeof offerUuid !== "string" || !offerUuid.trim() || offerUuid.length > 200) {
    return { status: "error", message: "La oferta no es válida." };
  }

  const sessionToken = (await cookies()).get("pp_session")?.value;
  if (!sessionToken) return { status: "auth-required" };

  const origin = (await headers()).get("origin");
  const baseUrl = process.env.API_BASE_URL;
  if (!origin || !baseUrl) {
    return { status: "error", message: "No se pudo validar la solicitud. Recarga la página." };
  }

  let response: Response;
  try {
    response = await fetch(
      `${baseUrl.replace(/\/+$/, "")}/api/v1/saved-offers/${encodeURIComponent(offerUuid)}`,
      {
        method: "POST",
        cache: "no-store",
        headers: {
          Cookie: `pp_session=${encodeURIComponent(sessionToken)}`,
          Origin: origin,
          "X-Requested-With": "XMLHttpRequest",
        },
      },
    );
  } catch {
    return { status: "error", message: "No se pudo guardar la oferta. Intenta nuevamente." };
  }

  if (response.status === 401) return { status: "auth-required" };
  if (response.status === 403) {
    return { status: "error", message: "No se pudo validar la solicitud. Recarga la página." };
  }
  if (response.status === 404) {
    return { status: "error", message: "La oferta ya no está disponible." };
  }
  if (response.status !== 200 && response.status !== 201) {
    return { status: "error", message: "No se pudo guardar la oferta. Intenta nuevamente." };
  }

  revalidatePath("/guardados");
  revalidatePath("/facultad/[areaId]/[ofertaId]", "page");
  return { status: "saved", message: "Oferta guardada." };
}

export type RemoveSavedOfferState = {
  status: "idle" | "removed" | "auth-required" | "error";
  message?: string;
};

export async function removeSavedOfferAction(offerUuid: string): Promise<RemoveSavedOfferState> {
  if (typeof offerUuid !== "string" || !offerUuid.trim() || offerUuid.length > 200) {
    return { status: "error", message: "La oferta no es válida." };
  }

  const sessionToken = (await cookies()).get("pp_session")?.value;
  if (!sessionToken) return { status: "auth-required" };

  const origin = (await headers()).get("origin");
  const baseUrl = process.env.API_BASE_URL;
  if (!origin || !baseUrl) {
    return { status: "error", message: "No se pudo validar la solicitud. Recarga la página." };
  }

  let response: Response;
  try {
    response = await fetch(
      `${baseUrl.replace(/\/+$/, "")}/api/v1/saved-offers/${encodeURIComponent(offerUuid)}`,
      {
        method: "DELETE",
        cache: "no-store",
        headers: {
          Cookie: `pp_session=${encodeURIComponent(sessionToken)}`,
          Origin: origin,
          "X-Requested-With": "XMLHttpRequest",
        },
      },
    );
  } catch {
    return { status: "error", message: "No se pudo quitar la oferta. Intenta nuevamente." };
  }

  if (response.status === 401) return { status: "auth-required" };
  if (response.status === 403) {
    return { status: "error", message: "No se pudo validar la solicitud. Recarga la página." };
  }
  if (response.status !== 204) {
    return { status: "error", message: "No se pudo quitar la oferta. Intenta nuevamente." };
  }

  revalidatePath("/guardados");
  revalidatePath("/facultad/[areaId]/[ofertaId]", "page");
  return { status: "removed" };
}
