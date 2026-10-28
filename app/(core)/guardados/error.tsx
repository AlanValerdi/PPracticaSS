"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SavedOffersError({ retry }: { retry: () => void }) {
  return (
    <div className="flex min-w-0 w-full flex-1 flex-col gap-6 bg-zinc-50 p-6 font-sans sm:p-8 dark:bg-black">
      <h1 className="text-3xl font-semibold tracking-tight">Guardados</h1>
      <Card>
        <CardContent className="items-start gap-4 pt-6">
          <p role="alert">No se pudieron cargar tus ofertas guardadas. Intenta nuevamente.</p>
          <Button type="button" variant="outline" onClick={retry}>
            Reintentar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
