import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";


type Areas = {
  id: number;
  Nombre: string;
  facultades: Facultad[];
}

type Facultad = {
  id: number;
  Nombre: string;
};


function FacultadCard({ facultad, toneIndex }: { facultad: Facultad; toneIndex: number }) {
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
          {facultad.Nombre}
        </h2>
        <Button variant="default">Conoce las ofertas</Button>
      </div>
    </Card>
  );
}

function CarouselCards({ areas, facultades }: { areas: Areas, facultades: Facultad[] }) {
  return (
    <div className="flex gap-4 flex-col">
      <div className="p-4 pt-8 px-14">
        <h1 className="relative z-10 max-w-full text-[clamp(22px,3cqi,30px)] leading-none font-semibold tracking-[-0.055em] wrap-break-word">
            {areas.Nombre}
        </h1>
      </div>
      <div className="min-w-0 px-14">

        <Carousel>
          <CarouselContent>
            {facultades.map((facultad, index) => (
              <CarouselItem key={facultad.id} className="min-w-0 basis-full sm:basis-1/3 lg:basis-1/4">
                <FacultadCard facultad={facultad} toneIndex={index} />
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

export default function Home() {

  const dataAreas: Areas[] = [
    {
      "id": 1,
      "Nombre": "INGENIERIA",
      "facultades": [
        { id: 1, Nombre: "FACULTAD MEDICINA" },
        { id: 2, Nombre: "FACULTAD COMPUTACION" },
        { id: 3, Nombre: "FACULTAD COMPUTACION" },
      ]
    },
    {
      "id": 2,
      "Nombre": "SALUD",
      "facultades": [
        { id: 4, Nombre: "ENFERMERIA" },
        { id: 5, Nombre: "MEDICO GENERAL" },
      
      ]
    },
  ]


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
          </header>
          {dataAreas.map((areas)=> (
            <CarouselCards key={areas.id} areas={areas} facultades={areas.facultades} />
          ))}

        </SidebarInset>
      </SidebarProvider>


    </div>
  );
}
