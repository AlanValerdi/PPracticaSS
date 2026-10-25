import type { Catalog } from "../types/typesList";

export async function getCatalog(): Promise<Catalog> {
    const baseUrl = process.env.API_BASE_URL;

    if(!baseUrl){
        throw new Error("env variable is missing")
    }

    const response = await fetch(`${baseUrl}/api/v1/catalog`, {
        cache: "no-store"
    })

    if (!response.ok){
        throw new Error(`No se pudo cargar el catalogo: ${response.status}`)
    }

    return response.json();
}