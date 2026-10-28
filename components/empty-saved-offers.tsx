import Link from "next/link";
import { ArrowLeft, Bookmark } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function EmptySavedOffers() {
  return (
    <Card className="border border-dashed shadow-none ring-0">
      <CardContent className="items-center gap-4 py-12 text-center sm:py-16">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <Bookmark className="size-7 text-muted-foreground" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">
          Aún no tienes ofertas guardadas
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          Explora las ofertas disponibles y guarda las que te interesen para encontrarlas aquí.
        </p>
        <Button nativeButton={false} render={<Link href="/" />}>
          <ArrowLeft aria-hidden="true" />
          Volver al inicio
        </Button>
      </CardContent>
    </Card>
  );
}
