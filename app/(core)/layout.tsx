import { Suspense } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import KbdSearchField from "@/components/kbd-search";
import { PageBreadcrumbs } from "@/components/page-breadcrumbs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function PrincipalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="min-w-0">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2" />
            <Suspense
              fallback={
                <div className="min-w-0" role="status" aria-label="Cargando ruta de navegación">
                  <Skeleton className="h-4 w-36 max-w-full" aria-hidden="true" />
                </div>
              }
            >
              <PageBreadcrumbs />
            </Suspense>
          </div>
          <div className="ml-auto w-36 max-w-xs shrink-0 px-2 sm:w-64">
            <KbdSearchField />
          </div>
        </header>

        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
