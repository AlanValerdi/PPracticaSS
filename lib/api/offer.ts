import { notFound } from "next/navigation"
import type { Offer } from "../types/typesList"

export async function getOffer(ofertaId: string): Promise<Offer> {
  const baseUrl = process.env.API_BASE_URL
  if (!baseUrl) throw new Error("API_BASE_URL is missing")

  const response = await fetch(
    `${baseUrl}/api/v1/offers/${encodeURIComponent(ofertaId)}`,
    { cache: "no-store" }
  )

  if (response.status === 404) notFound()
  if (!response.ok) {
    throw new Error(`No se pudo cargar la oferta: ${response.status}`)
  }

  return response.json()
}
