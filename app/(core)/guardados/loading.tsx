import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-w-0 w-full flex-1 flex-col gap-6 bg-zinc-50 p-6 font-sans sm:p-8 dark:bg-black" aria-busy="true">
      <span className="sr-only" role="status">Cargando tus ofertas guardadas…</span>
      <div aria-hidden="true" className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-9 w-40 max-w-full" />
          <Skeleton className="h-5 w-80 max-w-full" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Card key={index} className="gap-0 rounded-2xl border p-4 shadow-none ring-0">
              <div className="flex min-h-80 flex-col gap-4 rounded-2xl bg-muted/40 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-32 max-w-full" />
                    <Skeleton className="h-4 w-40 max-w-full" />
                  </div>
                  <Skeleton className="size-8 rounded-md" />
                </div>
                <div className="flex flex-1 flex-col justify-center gap-3 py-6">
                  <Skeleton className="h-7 w-full" />
                  <Skeleton className="mx-auto h-7 w-3/4" />
                </div>
                <div className="flex flex-wrap justify-between gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-40 max-w-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
