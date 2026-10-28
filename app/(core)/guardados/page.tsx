import Link from "next/link";
import { Bookmark, MapPin, Send } from "lucide-react";

import { EmptySavedOffers } from "@/components/empty-saved-offers";
import { RemoveSavedOfferButton } from "@/components/remove-saved-offer-button";
import { ProgramCard } from "@/components/program-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSavedOffers } from "@/lib/api/saved-offers";

export default async function GuardadosPage() {
  const savedOffers = await getSavedOffers();

  return (
    <div className="flex min-w-0 w-full flex-1 flex-col gap-6 bg-zinc-50 p-6 font-sans sm:p-8 dark:bg-black">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Guardados</h1>
        <p className="text-sm text-muted-foreground">
          Vuelve a consultar los programas que te interesan.
        </p>
      </header>

      {savedOffers === null ? (
        <Card>
          <CardContent className="items-center gap-4 py-8 text-center">
            <Bookmark className="size-8 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-xl font-semibold">Tus ofertas, en un solo lugar</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Inicia sesión para consultar tus ofertas guardadas.
            </p>
            <Button nativeButton={false} render={<a href="/api/backend/auth/google/login" />}>
              Iniciar sesión con Google
            </Button>
          </CardContent>
        </Card>
      ) : savedOffers.length === 0 ? (
        <EmptySavedOffers />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
          {savedOffers.map((offer, index) => {
            const email = offer.supervisorEmail.trim();
            const address = offer.workAddress.trim();
            const hasLocation = address !== "" && !/\bvirtual\b/i.test(address);
            const detailHref = offer.isActive && offer.areaSlug
              ? `/facultad/${encodeURIComponent(offer.areaSlug)}/${encodeURIComponent(offer.offerUuid)}`
              : null;

            return (
              <ProgramCard key={offer.offerUuid} toneIndex={index}>
                <div className="relative z-10 flex flex-1 flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-semibold wrap-break-word">Folio {offer.folio}</p>
                      <p className="text-sm wrap-break-word">
                        {offer.remuneration.trim() || "Remuneración no especificada"}
                      </p>
                    </div>
                    <RemoveSavedOfferButton offerUuid={offer.offerUuid} title={offer.title} />
                  </div>

                  <div className="flex min-h-28 flex-1 flex-col items-center justify-center gap-3 py-6 text-center">
                    <h2 className="max-w-full text-[clamp(22px,3cqi,30px)] leading-tight font-semibold tracking-[-0.055em] wrap-break-word">
                      {offer.title}
                    </h2>
                    {!offer.isActive && (
                      <p className="rounded-md bg-white/60 px-3 py-1 text-sm font-medium">
                        Ya no está disponible en el catálogo
                      </p>
                    )}
                  </div>

                  <div className="mt-auto grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center">
                    {detailHref ? (
                      <Button size="sm" nativeButton={false} render={<Link href={detailHref} />}>
                        Ver oferta
                      </Button>
                    ) : (
                      <Button type="button" size="sm" disabled>Ver oferta</Button>
                    )}
                    <div className="grid grid-cols-1 gap-2 min-[390px]:grid-cols-2 sm:ml-auto sm:flex sm:flex-wrap sm:justify-end">
                      {offer.isActive && email ? (
                        <Button
                          variant="outline"
                          size="sm"
                          nativeButton={false}
                          render={<a href={`mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Solicitud para el programa: ${offer.title}`)}`} />}
                        >
                          <Send aria-hidden="true" />
                          Aplicar
                        </Button>
                      ) : (
                        <Button type="button" variant="outline" size="sm" disabled>
                          <Send aria-hidden="true" />
                          Aplicar
                        </Button>
                      )}
                      {offer.isActive && hasLocation ? (
                        <Button
                          variant="outline"
                          size="sm"
                          nativeButton={false}
                          render={<a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer" />}
                        >
                          <MapPin aria-hidden="true" />
                          Ver en mapa
                        </Button>
                      ) : (
                        <Button type="button" variant="outline" size="sm" disabled>
                          <MapPin aria-hidden="true" />
                          Ver en mapa
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </ProgramCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
