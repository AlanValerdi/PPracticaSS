
import { notFound } from "next/navigation"
import type { components } from "../api-types"

type AreaPageData = components["schemas"]["AreaPage"]

export async function getDataTable(areaSlug: string): Promise<AreaPageData> {
  const baseUrl = process.env.API_BASE_URL
  if (!baseUrl) throw new Error("API_BASE_URL is missing")

  const response = await fetch(
    `${baseUrl}/api/v1/areas/${encodeURIComponent(areaSlug)}`,
    { cache: "no-store" }
  )

  if (response.status === 404) notFound()
  if (!response.ok) {
    throw new Error(`No se pudo cargar el área: ${response.status}`)
  }
  return response.json()
}
