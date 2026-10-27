import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function InformationSkeleton({ fields }: { fields: number }) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-80 max-w-full" />
      </CardHeader>
      <CardContent className="-mb-(--card-spacing)">
        <div className="-mx-(--card-spacing) grid grid-cols-2 gap-4 border-t bg-muted/50 px-(--card-spacing) py-4">
          {Array.from({ length: fields }, (_, index) => (
            <div key={index} className="min-w-0 space-y-2">
              <Skeleton className="h-4 w-28 max-w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TextSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-56 max-w-full" />
      </CardHeader>
      <CardContent className="-mb-(--card-spacing)">
        <div className="-mx-(--card-spacing) space-y-4 border-t bg-muted/50 px-(--card-spacing) py-4">
          {Array.from({ length: 2 }, (_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-4 w-36 max-w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Loading() {
  return (
    <div className="min-w-0 w-full space-y-4 p-6" aria-busy="true">
      <span className="sr-only" role="status">Cargando información de la oferta…</span>
      <div aria-hidden="true" className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 py-4">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-36" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }, (_, index) => (
            <Card key={index} className="min-w-0">
              <CardHeader>
                <Skeleton className="h-5 w-36 max-w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-5 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
        <InformationSkeleton fields={6} />
        <TextSkeleton />
        <TextSkeleton />
        <InformationSkeleton fields={6} />
        <InformationSkeleton fields={2} />
      </div>
    </div>
  );
}
