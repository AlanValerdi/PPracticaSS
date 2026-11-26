"use client";

import { map, marker, tileLayer, type LatLngExpression, type Marker } from "leaflet";
import { useEffect, useRef } from "react";

export type Coordinates = { lat: number; lng: number };

const DEFAULT_CENTER: LatLngExpression = [19.0414, -98.2063];

// Click anywhere on the map to choose a location; the marker follows the selection.
export default function LocationPicker({
  value,
  onChange,
}: {
  value: Coordinates | null;
  onChange: (coordinates: Coordinates) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  const markerRef = useRef<Marker | null>(null);
  const valueRef = useRef(value);

  useEffect(() => {
    onChangeRef.current = onChange;
    valueRef.current = value;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mapElement = document.createElement("div");
    mapElement.className = "h-full min-h-[400px] w-full";
    container.appendChild(mapElement);

    const initial = valueRef.current;
    const instance = map(mapElement).setView(initial ? [initial.lat, initial.lng] : DEFAULT_CENTER, initial ? 15 : 11);
    tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(instance);

    if (initial) markerRef.current = marker([initial.lat, initial.lng]).addTo(instance);

    instance.on("click", (event) => {
      const { lat, lng } = event.latlng;
      if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
      else markerRef.current = marker([lat, lng]).addTo(instance);
      onChangeRef.current({ lat, lng });
    });

    return () => {
      markerRef.current = null;
      instance.remove();
      mapElement.remove();
    };
  }, []);

  return <div ref={containerRef} className="isolate h-full min-h-[400px] w-full" role="application" aria-label="Mapa para elegir ubicación" />;
}
