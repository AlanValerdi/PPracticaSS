import { AreaCard } from "@/components/area-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getCatalog } from "@/lib/api/catalog";
import type { Area } from "@/lib/types/typesList";

function CarouselCards({ title, areas }: { title: string; areas: Area[] }) {
  return (
    <div className="flex min-w-0 w-full flex-col gap-4">
      <div className="p-4 pt-8 px-14">
        <h1 className="max-w-full text-[clamp(22px,3cqi,30px)] leading-none font-semibold tracking-[-0.055em] wrap-break-word">
          {title.toUpperCase()}
        </h1>
      </div>
      <div className="min-w-0 px-14">
        <Carousel>
          <CarouselContent>
            {areas.map((area, index) => (
              <CarouselItem
                key={area.uuid}
                className="min-w-0 basis-full md:basis-1/3 lg:basis-1/5 md:group-has-[[data-slot=sidebar][data-state=expanded]]/sidebar-wrapper:basis-1/2"
              >
                <AreaCard area={area} toneIndex={index} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}

export default async function Home() {
  const catalog = await getCatalog();

  return (
    <div className="flex min-w-0 w-full flex-1 flex-col bg-zinc-50 pb-12 font-sans dark:bg-black">
      {[...catalog.sections]
        .sort((a, b) => a.order - b.order)
        .map((section) => (
          <CarouselCards
            key={section.id}
            title={section.name}
            areas={catalog.areas.filter((area) => area.sectionId === section.id)}
          />
        ))}
    </div>
  );
}
