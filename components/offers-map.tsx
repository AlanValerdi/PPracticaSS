"use client";

import { divIcon, map, marker, tileLayer } from "leaflet";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import type { MapPin as OfferPin } from "@/lib/api/map";
import { getPinHref } from "@/lib/map-pins";
import { renderToStaticMarkup } from "react-dom/server";
import { MapPin } from "lucide-react";

// Only fixed application markup goes into the icon; React escapes popup content.
function createIcon(fill: string, opacity: number) {
  return divIcon({
    html: renderToStaticMarkup(
      <MapPin size={36} fill={fill} color="white" strokeWidth={2} opacity={opacity} />
    ),
    className:
      "offer-marker focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

const exactIcon = createIcon("#1d4ed8", 1);
const approximateIcon = createIcon("#f59e0b", 0.6);

export default function OffersMap({ offers }: { offers: OfferPin[] }) {
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
      popup.innerHTML = renderToStaticMarkup(
        <article className="font-sans text-zinc-900">
          <h3 className="mb-2 text-base leading-snug font-bold">{offer.title}</h3>
          <p className="my-2! text-xs text-zinc-600">Folio: {offer.folio}</p>
          <p className="my-2! text-sm leading-relaxed">{offer.address}</p>
          {offer.precision === "approximate" && (
            <p className="my-2! text-xs text-amber-700">Ubicación aproximada (código postal)</p>
          )}
          {href && (
            <a
              href={href}
              className="mt-2 inline-block rounded-md bg-blue-700 px-3 py-2 font-semibold text-white! no-underline hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Ver más
            </a>
          )}
        </article>
      );
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
        .bindPopup(popup, { minWidth: 220, maxWidth: 280 });
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
