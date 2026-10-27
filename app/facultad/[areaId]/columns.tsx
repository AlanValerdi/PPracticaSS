"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { type DataTableFeatures } from "./data-table-features"
import { Offer } from "@/lib/types/typesList"
import { DataTableColumnHeader } from "./data-table-column-header"

const columnHelper = createColumnHelper<DataTableFeatures, Offer>()

export const columns = columnHelper.columns([
    columnHelper.accessor("listing.folio", { header: "Folio" }),
    columnHelper.accessor("listing.programa", { header: "Programa" }),
    columnHelper.accessor("listing.tipo", { header: ({column }) => (
        <DataTableColumnHeader column={column} title="Tipo" hidde={true}/>
    ) }),
    columnHelper.accessor("listing.area", { header: "Area", cell: (info) => {
        const area = info.getValue() ?? ""
        return(
            <div className="max-w-[160px] truncate sm:max-w-[240px]" title="area">
                {area}
            </div>
        )
    } }),
    columnHelper.accessor("listing.perfilEducativo", { header: "Perfil Educativo" }),
    columnHelper.accessor("listing.coordinador", { header: "Coordinador" }),
    columnHelper.accessor("listing.cursoInduccion", { header: "Curso Induccion" }),
    columnHelper.accessor("listing.empresa", { header: "Empresa" }),
])
