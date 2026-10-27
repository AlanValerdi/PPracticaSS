import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const widths = ["w-16", "w-48", "w-28", "w-24", "w-36", "w-32", "w-28", "w-40"];

export default function Loading() {
  return (
    <div className="flex min-w-0 w-full flex-1 flex-col bg-zinc-50 font-sans dark:bg-black" aria-busy="true">
      <span className="sr-only" role="status">Cargando ofertas de la carrera…</span>
      <div aria-hidden="true">
        <div className="flex justify-center px-14 pt-8 pb-4">
          <Skeleton className="h-8 w-80 max-w-full" />
        </div>
        <div className="min-w-0 p-6">
          <div className="overflow-hidden rounded-md border">
            <Table className="min-w-[960px]">
              <TableHeader>
                <TableRow>
                  {widths.map((width, column) => (
                    <TableHead key={column}>
                      <Skeleton className={`h-4 ${width}`} />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 8 }, (_, row) => (
                  <TableRow key={row}>
                    {widths.map((width, column) => (
                      <TableCell key={column} className="p-4">
                        <Skeleton className={`h-5 ${width}`} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
