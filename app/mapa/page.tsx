import { AppSidebar } from "@/components/app-sidebar";
import KbdSearchField from "@/components/kbd-search";
import Map from "@/components/map";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { mockMapOffers } from "@/lib/mapPinsOffers";

export default function MapPage(){
    return(
         <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 " />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    Inicio
                  </BreadcrumbItem>
               
                </BreadcrumbList>
              </Breadcrumb>
            </div>
              <div className="ml-auto w-36 max-w-xs sm:w-64 px-2">
                  <KbdSearchField/>
              </div>
          </header>
          <Map offers={mockMapOffers}/>

        </SidebarInset>
      </SidebarProvider>


    </div>
    )
}