import { LocationsManager } from "@/components/locations-manager";
import { getGeocodingRows } from "@/lib/api/admin-geocoding";
import { requireAdmin } from "@/lib/api/auth";

export default async function UbicacionesPage() {
  await requireAdmin();
  const [notFound, approximate, manual] = await Promise.all([
    getGeocodingRows("not_found"),
    getGeocodingRows("approximate"),
    getGeocodingRows("manual"),
  ]);

  return (
    <div className="flex min-w-0 w-full flex-1 flex-col gap-6 bg-zinc-50 p-6 font-sans sm:p-8 dark:bg-black">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Ubicaciones</h1>
        <p className="text-sm text-muted-foreground">
          Corrige las direcciones que no se pudieron ubicar o que solo tienen ubicación aproximada.
        </p>
      </header>
      <LocationsManager groups={{ not_found: notFound, approximate, manual }} />
    </div>
  );
}
