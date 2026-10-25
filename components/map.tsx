"use client";

import { useEffect, useRef } from "react";
import type { MapOffer } from "@/lib/mapPinsOffers";

type MapProps = {
    offers: MapOffer[];
}

export default function Map({ offers }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let map: import("leaflet").Map | undefined;

    async function initializeMap() {
      const L = await import("leaflet");

      if (cancelled || !containerRef.current) return;

      map = L.map(containerRef.current).setView(
        [18.99859, -98.199381],
        15,
      );

      L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        },
      ).addTo(map);

      const markers = L.layerGroup().addTo(map);

      for (const offer of offers) {
        // Each marker gets its own element.
        const pin = document.createElement("div");
        pin.className = "offer-pin";
        pin.textContent = "✦";

        const icon = L.divIcon({
          html: pin,
          className: "offer-marker",
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -36],
        });

        const card = document.createElement("article");
        card.className = "offer-popup";

        const title = document.createElement("h3");
        title.textContent = offer.title;

        const folio = document.createElement("p");
        folio.className = "offer-popup-folio";
        folio.textContent = `Folio: ${offer.folio}`;

        const description = document.createElement("p");
        description.textContent = offer.description;

        const link = document.createElement("a");
        link.className = "offer-popup-link";
        link.textContent = "Ver más";
        link.href =
          `/facultad/${encodeURIComponent(offer.areaId)}` +
          `/${encodeURIComponent(offer.id)}`;

        card.append(title, folio, description, link);

        L.marker([offer.latitude, offer.longitude], {
          icon,
          title: offer.title,
          alt: offer.title,
        })
          .bindPopup(card, {
            minWidth: 220,
            maxWidth: 280,
          })
          .addTo(markers);
      }
    }

    void initializeMap();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [offers]);

  return (
    <div
      ref={containerRef}
      className="isolate"
      style={{ height: "100%", minHeight: "500px", width: "100%" }}
      aria-label="Mapa de ofertas"
    />
  );
}