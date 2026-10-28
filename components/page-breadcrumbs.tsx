"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type BreadcrumbEntry = {
  label: string;
  href?: string;
};

function getBreadcrumbs(pathname: string): BreadcrumbEntry[] {
  const segments = pathname.split("/").filter(Boolean);
  const entries: BreadcrumbEntry[] = [{ label: "Inicio" }];

  if (segments.length === 1 && segments[0] === "mapa") {
    entries.push({ label: "Mapa" });
  } else if (segments.length === 1 && segments[0] === "guardados") {
    entries.push({ label: "Guardados" });
  } else if (segments.length === 1 && segments[0] === "dashboard") {
    entries.push({ label: "Dashboard" });
  } else if (
    segments[0] === "facultad" &&
    (segments.length === 2 || segments.length === 3)
  ) {
    entries.push({
      label: "Carrera",
      href: segments.length === 3 ? `/facultad/${segments[1]}` : undefined,
    });

    if (segments.length === 3) {
      entries.push({ label: "Oferta" });
    }
  }

  if (entries.length > 1) {
    entries[0].href = "/";
  }

  return entries;
}

export function PageBreadcrumbs() {
  const pathname = usePathname();
  const entries = getBreadcrumbs(pathname);

  return (
    <Breadcrumb aria-label="Ruta de navegación" className="min-w-0 overflow-hidden">
      <BreadcrumbList className="flex-nowrap">
        {entries.map((entry, index) => (
          <Fragment key={entry.label}>
            {index > 0 && <BreadcrumbSeparator className="shrink-0" />}
            <BreadcrumbItem className="min-w-0">
              {entry.href ? (
                <BreadcrumbLink render={<Link href={entry.href} />}>
                  {entry.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="truncate" title={entry.label}>
                  {entry.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
