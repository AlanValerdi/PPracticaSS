import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardHeader } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Sidebar } from "lucide-react";
import Image from "next/image";


export default function Home() {
  type Facultad = {
    "id": number,
    "Nombre": string
  }

  const dataFacultades: Facultad[] = [
    {id: 1, Nombre: "FACULTAD MEDICINA"},
    {id: 2, Nombre: "FACULTAD COMPUTACION"},
  ]

  function FacultadCard({facultad}: {facultad: Facultad}){
    return (
      <Card>
        <CardHeader>{facultad.Nombre}</CardHeader>
      </Card> 
    )
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <SidebarProvider>
        <AppSidebar/>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
             <div className="flex items-center gap-2 px-3">
              <SidebarTrigger/>
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
          <div className="flex gap-4 flex-col">
              <h1>Ingenierías</h1>
              <Carousel>
                  <CarouselContent>
                    {dataFacultades.map(facultad => (
                      <CarouselItem key={facultad.id} className="basis-1/2">
                      <FacultadCard  facultad={facultad} />
                      </CarouselItem>
                    ))}
                    
                  </CarouselContent>
                  <CarouselPrevious/>
                  <CarouselNext/>
                </Carousel>
              
            
              
            

          </div>
        </SidebarInset>
      </SidebarProvider>
      
      
    </div>
  );
}
