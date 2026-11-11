import type { components } from "@/lib/api-types";

export type RecommendationAnalysis = components["schemas"]["RecommendationAnalysis"];
export type RecommendationArea = Pick<components["schemas"]["Area"], "uuid" | "slug" | "name" | "level">;

export async function analyzeCv(file: File, areaSlug: string, signal: AbortSignal): Promise<RecommendationAnalysis> {
  const body = new FormData();
  body.append("cv", file);
  body.append("areaSlug", areaSlug);
  const response = await fetch("/api/backend/recommendations/analyze", {
    method: "POST", body, signal, credentials: "same-origin", cache: "no-store",
    headers: { "X-Requested-With": "XMLHttpRequest" },
  });
  if (!response.ok) {
    if (response.status === 401) throw new Error("Tu sesión venció. Vuelve a iniciar sesión para analizar el CV.");
    const error = await response.json().catch(() => null);
    throw new Error(typeof error?.detail === "string" ? error.detail : "No se pudo analizar el CV. Comprueba el archivo e intenta nuevamente.");
  }
  return response.json();
}
