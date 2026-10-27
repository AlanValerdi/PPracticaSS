import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const visibility = ["", "hidden sm:block", "hidden md:block", "hidden lg:block", "hidden lg:block"];

export default function Loading() {
  return (
    <div className="flex min-w-0 w-full flex-1 flex-col bg-zinc-50 pb-8 font-sans dark:bg-black" aria-busy="true">
      <span className="sr-only" role="status">Cargando catálogo…</span>
      <div aria-hidden="true" className="space-y-4">
        {Array.from({ length: 4 }, (_, section) => (
          <div key={section} className="flex min-w-0 w-full flex-col gap-4">
            <div className="px-14 pt-8 pb-4">
              <Skeleton className="h-8 w-72 max-w-full" />
            </div>
            <div className="grid min-w-0 grid-cols-1 gap-4 px-14 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {visibility.map((className, index) => (
                <Card key={index} className={`min-w-0 gap-0 rounded-2xl border border-border p-4 shadow-none ring-0 ${className}`}>
                  <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-2xl bg-muted/40 p-5">
                    <Skeleton className="h-7 w-full" />
                    <Skeleton className="h-7 w-3/4" />
                    <Skeleton className="mt-1 h-9 w-40 max-w-full" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
