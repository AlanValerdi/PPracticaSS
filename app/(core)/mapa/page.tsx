import Map from "@/components/map"
import { getMapPins } from "@/lib/api/map"

export default async function MapPage() {
  const pins = await getMapPins()

  return (
    <div className="flex min-w-0 w-full flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <Map offers={pins} />
    </div>
  )
}
