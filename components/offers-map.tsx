"use client";

import { map, marker, tileLayer } from "leaflet";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { getAreaCardVisual } from "./area-card";
import type { MapOffer } from "./map";
import { createPinIcon } from "./map-icons";
import { getPinHref } from "@/lib/map-pins";

const exactIcon = createPinIcon("#1d4ed8");
const approximateIcon = createPinIcon("#f59e0b", 0.6);

// Strips Leaflet's white popup frame so the area-coloured card is the whole popup.
// "!" is required: Tailwind utilities live in a cascade layer and unlayered leaflet.css would win.
const POPUP_CLASS =
  "offer-popup [&_.leaflet-popup-content-wrapper]:overflow-hidden! [&_.leaflet-popup-content-wrapper]:rounded-3xl! [&_.leaflet-popup-content-wrapper]:bg-transparent! [&_.leaflet-popup-content-wrapper]:p-0! [&_.leaflet-popup-content]:m-0! [&_.leaflet-popup-tip-container]:hidden";

// Same palette and illustration as the area cards on the home page. React escapes all text.
function OfferPopupCard({ offer, href }: { offer: MapOffer; href: string | null }) {
  const area = offer.area;
  const { Illustration, tone } = getAreaCardVisual(
    area ? `${area.areaName} ${offer.areaSlug ?? ""}` : "",
    area?.toneIndex ?? 0,
  );

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl font-sans text-[#17151B]" style={{ backgroundColor: tone.background }}>
      <div className="flex flex-col gap-3 px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <Illustration aria-hidden="true" className="size-10 shrink-0" style={{ color: tone.ink }} strokeWidth={1.5} fill="currentColor" fillOpacity={0.16} />
          <div className="min-w-0">
            <p className="m-0! text-sm leading-tight font-semibold" style={{ color: tone.ink }}>{area?.areaName ?? "Área no disponible"}</p>
            {area?.facultyName && <p className="m-0! text-xs leading-tight text-zinc-700">{area.facultyName}</p>}
          </div>
        </div>
        <h3 className="m-0 text-base leading-snug font-bold">{offer.title}</h3>
        <p className="m-0! text-xs text-zinc-700">Folio {offer.folio}</p>
        <p className="m-0! text-sm leading-relaxed">{offer.address}</p>
        {offer.precision === "approximate" && (
          <p className="m-0! text-xs font-medium" style={{ color: tone.ink }}>Ubicación aproximada (código postal)</p>
        )}
      </div>
      {href && (
        <a
          href={href}
          className="flex min-h-12 items-center justify-center px-4 py-3 text-center text-sm font-semibold text-white! no-underline transition-[filter] hover:brightness-90 focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-white"
          style={{ backgroundColor: tone.ink }}
        >
          Ver oferta
        </a>
      )}
    </article>
  );
}

export default function OffersMap({ offers }: { offers: MapOffer[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Activity retains the host DOM but reconnects effects on navigation.
    // Each connection owns a fresh Leaflet container and map instance.
    const mapElement = document.createElement("div");
    mapElement.className = "h-full min-h-[500px] w-full";
    container.appendChild(mapElement);
    const instance = map(mapElement).setView([19.0414, -98.2063], 11);

    tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(instance);

    for (const offer of offers) {
      const href = getPinHref(offer);
      const popup = document.createElement("div");
      popup.innerHTML = renderToStaticMarkup(<OfferPopupCard offer={offer} href={href} />);
      popup.querySelector("a")?.addEventListener("click", (event) => {
        if (!href) return;
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        router.push(href);
      });

      marker([offer.lat, offer.lng], {
        icon: offer.precision === "approximate" ? approximateIcon : exactIcon,
        title: offer.title,
        alt: offer.title,
      })
        .addTo(instance)
        .bindPopup(popup, { minWidth: 240, maxWidth: 300, className: POPUP_CLASS });
    }

    return () => {
      instance.remove();
      mapElement.remove();
    };
  }, [offers, router]);

  return (
    <section className="isolate flex h-full min-h-[500px] w-full flex-col" aria-label="Mapa de ofertas">
      <div ref={containerRef} className="h-full min-h-[500px] w-full flex-1" />
      <ul className="flex flex-wrap gap-x-6 gap-y-1 border-t bg-background px-4 py-2 text-sm">
        <li className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-blue-700" aria-hidden="true" />
          Ubicación exacta
        </li>
        <li className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-amber-500 opacity-60" aria-hidden="true" />
          Ubicación aproximada (código postal)
        </li>
      </ul>
    </section>
  );
}
