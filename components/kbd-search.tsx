"use client";

import { Autocomplete } from "@base-ui/react/autocomplete";
import { Dialog } from "@base-ui/react/dialog";
import { ArrowRight, BriefcaseBusiness, CornerDownLeft, GraduationCap, LoaderCircle, SearchIcon, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { Kbd } from "@/components/ui/kbd";
import { APP_NAV_ITEMS } from "@/lib/navigation";
import { buildCatalogSearchIndex, normalizeSearch, searchCatalog, type SearchGroup, type SearchItem } from "@/lib/catalog-search";
import type { components } from "@/lib/api-types";

type Catalog = components["schemas"]["Catalog"];
const pageGroups: SearchGroup[] = [{
  label: "Páginas",
  items: APP_NAV_ITEMS.map((item) => ({ id: `page:${item.id}`, label: item.title, href: item.url, kind: "page" })),
}];

async function fetchCatalog(url: string): Promise<Catalog> {
  const response = await fetch(url);
  if (!response.ok) throw new Error("No se pudo cargar el catálogo.");
  return response.json();
}

export default function KbdSearchField() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { data, error, isLoading, mutate } = useSWR(open ? "/api/backend/catalog" : null, fetchCatalog, {
    revalidateIfStale: false, revalidateOnFocus: false, revalidateOnReconnect: false, shouldRetryOnError: false,
  });
  const index = useMemo(() => data ? buildCatalogSearchIndex(data) : null, [data]);
  const searching = normalizeSearch(query) !== "";
  const groups = useMemo(() => !searching ? pageGroups : index ? searchCatalog(index, query) : [], [searching, index, query]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === "k" && !event.repeat && !event.isComposing) {
        event.preventDefault();
        setQuery("");
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={(next) => { setOpen(next); if (!next) setQuery(""); }}>
      <Dialog.Trigger ref={triggerRef} aria-label="Buscar áreas y ofertas" aria-keyshortcuts="Control+k Meta+k" className="flex h-9 w-full items-center gap-2 rounded-md border bg-muted/30 px-3 text-sm text-muted-foreground shadow-xs outline-none hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring">
        <SearchIcon className="size-4 shrink-0" aria-hidden="true" />
        <span className="truncate">Buscar…</span>
        <span className="ml-auto hidden items-center gap-1 sm:flex"><Kbd>Ctrl</Kbd><Kbd>K</Kbd></span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px]" />
        <Dialog.Popup initialFocus={inputRef} finalFocus={triggerRef} className="fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100svh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border bg-popover text-popover-foreground shadow-xl outline-none">
          <Dialog.Title className="sr-only">Buscar en la aplicación</Dialog.Title>
          <Dialog.Description className="sr-only">Busca áreas y ofertas o navega entre páginas. Usa las flechas y Enter para abrir un resultado.</Dialog.Description>
          <Autocomplete.Root items={groups} filteredItems={groups} mode="none" inline open autoHighlight="always" value={query} onValueChange={setQuery} itemToStringValue={(item: SearchItem) => item.label}>
            <div className="m-2 flex shrink-0 items-center gap-2 rounded-lg border bg-muted/60 px-3">
              <SearchIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <Autocomplete.Input ref={inputRef} aria-label="Buscar áreas y ofertas" placeholder="Buscar áreas, ofertas o folios…" className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
              <Dialog.Close aria-label="Cerrar buscador" className="rounded p-1 text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"><X className="size-4" /></Dialog.Close>
            </div>
            {searching && isLoading && <p role="status" className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin" />Cargando catálogo…</p>}
            {searching && error && <div role="alert" className="space-y-3 px-4 py-6 text-center text-sm"><p>No se pudo cargar el catálogo.</p><button type="button" onClick={() => void mutate()} className="rounded border px-3 py-1.5 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">Reintentar</button></div>}
            {searching && !isLoading && !error && index && !groups.length && <p role="status" className="px-4 py-8 text-center text-sm text-muted-foreground">Sin resultados para “{query.trim()}”.</p>}
            <Autocomplete.List className="min-h-40 max-h-[min(55svh,26rem)] overflow-y-auto overscroll-contain px-2 pb-2 outline-none empty:min-h-0" aria-label="Resultados de búsqueda">
              {(group: SearchGroup) => (
                <Autocomplete.Group key={group.label} items={group.items} className="mb-2 last:mb-0">
                  <Autocomplete.GroupLabel className="px-3 pt-1 pb-1.5 text-xs text-muted-foreground">{group.label}</Autocomplete.GroupLabel>
                  <Autocomplete.Collection>
                    {(item: SearchItem) => {
                      const Icon = item.kind === "area" ? GraduationCap : item.kind === "offer" ? BriefcaseBusiness : ArrowRight;
                      return <Autocomplete.Item key={item.id} value={item} render={<Link href={item.href} />} onClick={(event) => {
                        if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { setOpen(false); setQuery(""); }
                      }} className="flex min-h-9 cursor-pointer items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm outline-none select-none hover:bg-muted/60 data-highlighted:border-border data-highlighted:bg-muted">
                        <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                        <span className="min-w-0"><span className="block line-clamp-2 wrap-break-word font-medium">{item.label}</span>{item.description && <span className="mt-0.5 block truncate text-xs text-muted-foreground">{item.description}</span>}</span>
                      </Autocomplete.Item>;
                    }}
                  </Autocomplete.Collection>
                </Autocomplete.Group>
              )}
            </Autocomplete.List>
          </Autocomplete.Root>
          <div className="flex shrink-0 items-center gap-2 border-t bg-muted/20 px-4 py-2.5 text-xs text-muted-foreground">
            <Kbd><CornerDownLeft className="size-3" /></Kbd><span>{searching ? "Abrir resultado" : "Ir a la página"}</span>
            <span className="ml-auto flex items-center gap-1"><Kbd>↑</Kbd><Kbd>↓</Kbd><span className="hidden sm:inline">Navegar</span><Kbd>Esc</Kbd><span className="hidden sm:inline">Cerrar</span></span>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
