"use client";

import { useState, useTransition } from "react";
import { LoaderCircle } from "lucide-react";

import {
  retryGeocodingAction,
  saveManualLocationAction,
  type GeocodingActionState,
} from "@/app/actions/admin-geocoding";
import { type Coordinates } from "@/components/location-picker";
import { LocationPickerMap } from "@/components/location-picker-loader";
import { Button } from "@/components/ui/button";
import type { GeocodedAddress } from "@/lib/api/admin-geocoding";

type Tab = "not_found" | "approximate" | "manual";
const TABS: { id: Tab; label: string }[] = [
  { id: "not_found", label: "Sin ubicar" },
  { id: "approximate", label: "Aproximadas" },
  { id: "manual", label: "Manuales" },
];

export function LocationsManager({ groups }: { groups: Record<Tab, GeocodedAddress[]> }) {
  const [tab, setTab] = useState<Tab>("not_found");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [picked, setPicked] = useState<Coordinates | null>(null);
  const [feedback, setFeedback] = useState<GeocodingActionState | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [isRetrying, startRetrying] = useTransition();

  const rows = groups[tab];
  const selected = rows.find((row) => row.addressKey === selectedKey) ?? null;

  function select(row: GeocodedAddress) {
    setSelectedKey(row.addressKey);
    setPicked(row.lat !== null && row.lng !== null ? { lat: row.lat, lng: row.lng } : null);
    setFeedback(null);
  }

  function save() {
    if (!selected || !picked) return;
    startSaving(async () => {
      setFeedback(await saveManualLocationAction(selected.addressKey, picked.lat, picked.lng));
    });
  }

  function retry() {
    startRetrying(async () => {
      setFeedback(await retryGeocodingAction());
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Estado de la ubicación" className="flex gap-2">
          {TABS.map(({ id, label }) => (
            <Button
              key={id}
              role="tab"
              aria-selected={tab === id}
              variant={tab === id ? "default" : "outline"}
              onClick={() => {
                setTab(id);
                setSelectedKey(null);
                setPicked(null);
              }}
            >
              {label} ({groups[id].length})
            </Button>
          ))}
        </div>
        <Button onClick={retry} disabled={isRetrying} aria-busy={isRetrying}>
          {isRetrying && <LoaderCircle className="animate-spin" aria-hidden="true" />}
          {isRetrying ? "Reintentando (puede tardar ~1 min)…" : "Reintentar geocodificación"}
        </Button>
      </div>

      {feedback?.message && (
        <p className="text-sm" role={feedback.status === "error" ? "alert" : "status"}>
          {feedback.message}
        </p>
      )}
      {feedback?.status === "auth-required" && (
        <p className="text-sm" role="alert">Tu sesión expiró. Inicia sesión nuevamente.</p>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <ul className="max-h-[600px] space-y-2 overflow-auto" aria-label="Direcciones">
          {rows.length === 0 && <li className="text-sm text-muted-foreground">No hay direcciones en esta lista.</li>}
          {rows.map((row) => (
            <li key={row.addressKey}>
              <button
                type="button"
                onClick={() => select(row)}
                aria-pressed={row.addressKey === selectedKey}
                className="w-full rounded-lg border bg-background p-3 text-left text-sm hover:bg-muted aria-pressed:border-primary aria-pressed:bg-muted"
              >
                {row.rawAddress}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3">
          {selected ? (
            <>
              <p className="text-sm font-medium">{selected.rawAddress}</p>
              <div className="h-[400px] overflow-hidden rounded-lg border">
                <LocationPickerMap key={selected.addressKey} value={picked} onChange={setPicked} />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  {picked
                    ? `Lat ${picked.lat.toFixed(6)}, Lng ${picked.lng.toFixed(6)}`
                    : "Haz clic en el mapa para elegir la ubicación."}
                </p>
                <Button onClick={save} disabled={!picked || isSaving} aria-busy={isSaving}>
                  {isSaving && <LoaderCircle className="animate-spin" aria-hidden="true" />}
                  Guardar
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Selecciona una dirección para ubicarla en el mapa.</p>
          )}
        </div>
      </div>
    </div>
  );
}
