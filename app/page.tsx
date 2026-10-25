import { AppSidebar } from "@/components/app-sidebar";
import KbdSearchField from "@/components/kbd-search";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getCatalog } from "@/lib/api/catalog";
import { Area } from "@/lib/types/typesList";
import Link from "next/link";





function AreaCard({ area, toneIndex}: { area: Area; toneIndex: number, }) {
  return (
    <Card className="gap-0 rounded-2xl border border-border p-4 shadow-none ring-0">
      <div
        className={`relative isolate flex flex-col items-center justify-center space-y-3 min-h-[280px] place-items-center overflow-hidden rounded-2xl p-5 text-center text-[#14171B] @container ${toneIndex % 2 === 0 ? "bg-[#F0A4CC]" : "bg-[#F1D369]"}`}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[15%] rotate-[3deg] rounded-[68%_52%_58%_52%] border border-current"
        />
        <h2 className="relative z-10 max-w-full text-[clamp(22px,3cqi,30px)] leading-none font-semibold tracking-[-0.055em] wrap-break-word">
          {area.name}
        </h2>
        <Button variant="default" nativeButton={false} render={<Link href={`/facultad/${area.slug}`}/>}>Conoce las ofertas</Button>
      </div>
    </Card>
  );
}

function CarouselCards({ title, areas }: { title: string, areas: Area[] }) {
  return (
    <div className="flex gap-4 flex-col">
      <div className="p-4 pt-8 px-14">
        <h1 className="max-w-full text-[clamp(22px,3cqi,30px)] leading-none font-semibold tracking-[-0.055em] wrap-break-word">
            {title.toUpperCase()}
        </h1>
      </div>
      <div className="min-w-0 px-14">

        <Carousel>
          <CarouselContent>
            {areas.map((area, index) => (
              <CarouselItem key={area.uuid} className="min-w-0 basis-full sm:basis-1/2 lg:basis-1/5 md:basis-1/3 ">
                <AreaCard area={area} toneIndex={index} />
              </CarouselItem>
            ))}

          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}

export default async function Home() {

  const catalog = await getCatalog();


  return (
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
          {[...catalog.sections].sort((a, b) => a.order - b.order).map((section) => (
            <CarouselCards key={section.id} title={section.name} areas={catalog.areas.filter(
              (area) => area.sectionId === section.id
            )}/>
          ))
          }

        </SidebarInset>
      </SidebarProvider>


    </div>
  );
}
