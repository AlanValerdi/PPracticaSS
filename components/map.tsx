"use client";

import dynamic from "next/dynamic";
import type { MapPin } from "@/lib/api/map";

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

export default function Map({ offers }: { offers: MapPin[] }) {
  return <OffersMap offers={offers} />;
}
