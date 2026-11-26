import Link from "next/link";
import { redirect } from "next/navigation";
import { MapPin, Send } from "lucide-react";

import { EmptySavedOffers } from "@/components/empty-saved-offers";
import { RemoveSavedOfferButton } from "@/components/remove-saved-offer-button";
import { ProgramCard } from "@/components/program-card";
import { Button } from "@/components/ui/button";
import { requireSession } from "@/lib/api/auth";
import { getSavedOffers } from "@/lib/api/saved-offers";

export default async function GuardadosPage() {
  await requireSession();
  const savedOffers = await getSavedOffers();
  if (savedOffers === null) redirect("/login");

  return (
    <div className="flex min-w-0 w-full flex-1 flex-col gap-6 bg-zinc-50 p-6 font-sans sm:p-8 dark:bg-black">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Guardados</h1>
        <p className="text-sm text-muted-foreground">
          Vuelve a consultar los programas que te interesan.
        </p>
      </header>

      {savedOffers.length === 0 ? (
        <EmptySavedOffers />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 group-has-[[data-slot=sidebar][data-state=expanded]]/sidebar-wrapper:md:grid-cols-1 group-has-[[data-slot=sidebar][data-state=expanded]]/sidebar-wrapper:xl:grid-cols-2 group-has-[[data-slot=sidebar][data-state=expanded]]/sidebar-wrapper:2xl:grid-cols-3">
          {savedOffers.map((offer, index) => {
            const email = offer.supervisorEmail.trim();
            const address = offer.workAddress.trim();
            const hasLocation = address !== "" && !/\bvirtual\b/i.test(address);
            const detailHref = offer.isActive && offer.areaSlug
              ? `/facultad/${encodeURIComponent(offer.areaSlug)}/${encodeURIComponent(offer.offerUuid)}`
              : null;

            return (
              <ProgramCard
                key={offer.offerUuid}
                toneIndex={index}
                appearance="saved"
              >
                <div className="relative z-10 flex flex-1 flex-col gap-4">
                  <div className="flex items-center justify-between gap-4">
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

                  <div className="mt-auto grid grid-cols-2 gap-2 border-t border-[#A94E2E]/15 pt-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center">
                    {detailHref ? (
                      <Button className="col-span-2 min-h-11 w-full bg-[#A94E2E] px-6 text-base text-white hover:bg-[#963F23] sm:col-span-1 sm:min-w-40" size="default" nativeButton={false} render={<Link href={detailHref} />}>
                        Ver oferta
                      </Button>
                    ) : (
                      <Button className="col-span-2 min-h-11 w-full bg-[#A94E2E] px-6 text-base text-white sm:col-span-1 sm:min-w-40" type="button" size="default" disabled>
                        {offer.isActive ? "Ver oferta" : "No disponible"}
                      </Button>
                    )}
                      {offer.isActive && email ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="min-h-10 bg-white text-foreground hover:bg-white/90 hover:text-foreground"
                          nativeButton={false}
                          render={<a href={`mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Solicitud para el programa: ${offer.title}`)}`} />}
                        >
                          <Send aria-hidden="true" />
                          Aplicar
                        </Button>
                      ) : (
                        <Button type="button" variant="outline" size="sm" className="min-h-10 bg-white text-foreground hover:bg-white" disabled>
                          <Send aria-hidden="true" />
                          Aplicar
                        </Button>
                      )}
                      {offer.isActive && hasLocation ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="min-h-10 bg-white text-foreground hover:bg-white/90 hover:text-foreground"
                          nativeButton={false}
                          render={<a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noopener noreferrer" />}
                        >
                          <MapPin aria-hidden="true" />
                          Ver en mapa
                        </Button>
                      ) : (
                        <Button type="button" variant="outline" size="sm" className="min-h-10 bg-white text-foreground hover:bg-white" disabled>
                          <MapPin aria-hidden="true" />
                          Ver en mapa
                        </Button>
                      )}
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
