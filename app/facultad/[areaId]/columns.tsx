"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { type DataTableFeatures } from "./data-table-features"
import { Offer } from "@/lib/types/typesList"

const columnHelper = createColumnHelper<DataTableFeatures, Offer>()

export const columns = columnHelper.columns([
    columnHelper.accessor("listing.folio", { header: "Folio" }),
    columnHelper.accessor("listing.programa", { header: "Programa" }),
    columnHelper.accessor("listing.tipo", { header: "Tipo" }),
    columnHelper.accessor("listing.area", { header: "Area" }),
    columnHelper.accessor("listing.perfilEducativo", { header: "Perfil Educativo" }),
    columnHelper.accessor("listing.coordinador", { header: "Coordinador" }),
    columnHelper.accessor("listing.cursoInduccion", { header: "Curso Induccion" }),
    columnHelper.accessor("listing.empresa", { header: "Empresa" }),
])
