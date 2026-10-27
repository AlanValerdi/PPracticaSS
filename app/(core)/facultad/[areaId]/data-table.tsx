"use client"

import { useTable, type ColumnDef, type RowData } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { features, type DataTableFeatures } from "./data-table-features"
import Link from "next/link"
import { useParams } from "next/navigation"

interface DataTableProps<TData extends RowData & {uuid:string}> {
  columns: ColumnDef<DataTableFeatures, TData>[]
  data: TData[]
}

export function DataTable<TData extends RowData & {uuid: string}>({ columns, data }: DataTableProps<TData>) {
  const { areaId } = useParams<{ areaId: string }>()
  const table = useTable({ features, data, columns })

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const href = `/facultad/${encodeURIComponent(areaId)}/${encodeURIComponent(row.original.uuid)}`

              return (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="p-0" key={cell.id}>
                      <Link
                        href={href}
                        className="block p-4 focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        <table.FlexRender cell={cell} />
                      </Link>
                    </TableCell>
                  ))}
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
