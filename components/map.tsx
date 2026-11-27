"use client";

import dynamic from "next/dynamic";
import type { MapPin } from "@/lib/api/map";
import type { AreaInfo } from "@/lib/map-pins";

export type MapOffer = MapPin & { area: AreaInfo | null };

const OffersMap = dynamic(() => import("./offers-map"), {
  ssr: false,
  loading: () => (
    <div
      className="flex min-h-[500px] w-full items-center justify-center"
      role="status"
    >
      Cargando mapa…
    </div>
  ),
});

export default function Map({ offers }: { offers: MapOffer[] }) {
  return <OffersMap offers={offers} />;
}
