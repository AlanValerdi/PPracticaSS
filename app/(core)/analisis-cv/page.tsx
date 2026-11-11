import { Suspense } from "react";
import CvRecommendationsPage from "@/components/cv-recommendations";
import { getCatalog } from "@/lib/api/catalog";
import { getSavedOffers } from "@/lib/api/saved-offers";

export default function AnalisisCvPage() {
  return (
    <Suspense fallback={<div className="p-8" role="status">Cargando carreras y guardados…</div>}>
      <AnalysisContent />
    </Suspense>
  );
}

async function AnalysisContent() {
  const [catalog, saved] = await Promise.all([
    getCatalog(),
    getSavedOffers().then((offers) => ({ offers, failed: false })).catch(() => ({ offers: null, failed: true })),
  ]);
  const areas = catalog.areas.map(({ uuid, slug, name, level }) => ({ uuid, slug, name, level }));
  return <CvRecommendationsPage areas={areas} initiallySavedIds={saved.offers?.map((offer) => offer.offerUuid) ?? []} savedLookupFailed={saved.failed} />;
}
