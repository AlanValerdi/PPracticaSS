"use client";

import { divIcon } from "leaflet";
import Link from "next/link";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { MapOffer } from "@/lib/mapPinsOffers";
import { renderToStaticMarkup } from "react-dom/server";
import { MapPin } from "lucide-react";

// Only fixed application markup goes into the icon; offer content uses JSX below.
const offerIcon = divIcon({
  html: renderToStaticMarkup(
    <MapPin
      size={36}
      fill="#1d4ed8"
      color="white"
      strokeWidth={2}
    />
  ),
  className:
    "offer-marker focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-500",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

export default function OffersMap({ offers }: { offers: MapOffer[] }) {
  return (
    <section className="isolate h-full min-h-[500px] w-full" aria-label="Mapa de ofertas">
      <MapContainer
        center={[18.99859, -98.199381]}
        zoom={15}
        className="h-full min-h-[500px] w-full"
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />
        {offers.map((offer) => (
          <Marker
            key={offer.id}
            position={[offer.latitude, offer.longitude]}
            icon={offerIcon}
            title={offer.title}
            alt={offer.title}
          >
            <Popup minWidth={220} maxWidth={280}>
              <article className="font-sans text-zinc-900">
                <h3 className="mb-2 text-base leading-snug font-bold">
                  {offer.title}
                </h3>
                <p className="my-2! text-xs text-zinc-600">
                  Folio: {offer.folio}
                </p>
                <p className="my-2! text-sm leading-relaxed">
                  {offer.description}
                </p>
                <Link
                  href={`/facultad/${encodeURIComponent(offer.areaId)}/${encodeURIComponent(offer.id)}`}
                  className="mt-2 inline-block rounded-md bg-blue-700 px-3 py-2 font-semibold text-white! no-underline hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  Ver más
                </Link>
              </article>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </section>
  );
}
