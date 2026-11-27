import { Suspense } from "react"

import Map from "@/components/map"
import { getCatalog } from "@/lib/api/catalog"
import { getMapPins } from "@/lib/api/map"
import { buildAreaLookup, describeOfferAreas } from "@/lib/map-pins"

async function MapWithOffers() {
  const [pins, catalog] = await Promise.all([getMapPins(), getCatalog()])
  const areas = buildAreaLookup(catalog)
  const offers = pins.map((pin) => ({ ...pin, areas: describeOfferAreas(pin.areaSlugs, areas) }))
  return <Map offers={offers} />
}

export default function MapPage() {
  return (
    <div className="flex min-w-0 w-full flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <Suspense
        fallback={
          <div className="flex min-h-[500px] w-full items-center justify-center" role="status">
            Cargando mapa…
          </div>
        }
      >
        <MapWithOffers />
      </Suspense>
    </div>
  )
}
