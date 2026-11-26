"use client";

import dynamic from "next/dynamic";

export const LocationPickerMap = dynamic(() => import("./location-picker"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[400px] w-full items-center justify-center" role="status">
      Cargando mapa…
    </div>
  ),
});
