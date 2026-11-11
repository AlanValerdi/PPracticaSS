"use client";

import { Combobox } from "@base-ui/react/combobox";
import { Check, ChevronsUpDown, SearchIcon } from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";
import { areaLabel, matchesSearch, type SearchArea } from "@/lib/catalog-search";

type Props = { areas: SearchArea[]; value: string; onValueChange: (slug: string) => void; label?: string };

export function CareerCombobox({ areas, value, onValueChange, label = "Tu carrera" }: Props) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const sorted = useMemo(() => [...areas].sort((a, b) => a.name.localeCompare(b.name, "es") || a.level.localeCompare(b.level) || a.slug.localeCompare(b.slug)), [areas]);
  const selected = sorted.find((area) => area.slug === value) ?? null;

  return (
    <div className="max-w-xl space-y-1">
      <Combobox.Root items={sorted} value={selected} inputValue={query} onInputValueChange={(text, details) => {
        if (details.reason === "input-change" || details.reason === "input-clear") setQuery(text);
      }} onOpenChange={() => setQuery("")} onValueChange={(area) => {
        if (area && area.slug !== value) onValueChange(area.slug);
      }} itemToStringLabel={areaLabel} isItemEqualToValue={(a, b) => a.slug === b.slug} filter={(area, text) => matchesSearch(`${areaLabel(area)} ${area.slug}`, text)} autoHighlight>
        <Combobox.Label className="block text-sm font-medium">{label}</Combobox.Label>
        <Combobox.Trigger aria-describedby={`${id}-value`} className="flex min-h-9 w-full items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-left text-sm outline-none hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring">
          <span id={`${id}-value`} className={`min-w-0 truncate ${selected ? "" : "text-muted-foreground"}`}>{selected ? areaLabel(selected) : "Selecciona tu carrera"}</span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </Combobox.Trigger>
        <Combobox.Portal>
          <Combobox.Positioner align="start" sideOffset={6} className="z-60 outline-none">
            <Combobox.Popup initialFocus={inputRef} className="w-(--anchor-width) max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-lg outline-none">
              <div className="m-2 flex items-center gap-2 rounded-md border bg-muted/50 px-3">
                <SearchIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <Combobox.Input ref={inputRef} aria-label="Buscar carrera" placeholder="Buscar carrera…" className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none" />
              </div>
              <Combobox.Empty className="px-4 py-6 text-center text-sm text-muted-foreground">Sin carreras que coincidan.</Combobox.Empty>
              <Combobox.List className="max-h-[min(18rem,calc(var(--available-height)-3.5rem))] overflow-y-auto overscroll-contain p-1 outline-none" aria-label="Carreras disponibles">
                {(area: SearchArea) => <Combobox.Item key={area.uuid} value={area} className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm outline-none select-none data-highlighted:bg-muted">
                  <span className="min-w-0 wrap-break-word">{areaLabel(area)}</span>
                  <Combobox.ItemIndicator><Check className="size-4 shrink-0" aria-hidden="true" /></Combobox.ItemIndicator>
                </Combobox.Item>}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </div>
  );
}
