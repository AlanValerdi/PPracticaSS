import Map from "@/components/map"
import { mockMapOffers } from "@/lib/mapPinsOffers"

export default function MapPage() {
  return (
    <div className="flex min-w-0 w-full flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <Map offers={mockMapOffers} />
    </div>
  )
}
