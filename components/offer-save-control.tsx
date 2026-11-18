import { SaveOfferButton } from "@/components/save-offer-button";
import { getSavedOffers } from "@/lib/api/saved-offers";

export async function OfferSaveControl({ offerUuid, areaSlug }: { offerUuid: string; areaSlug: string }) {
  let isAuthenticated = true;
  let initiallySaved = false;
  let initiallySavedAreaSlug: string | null = null;
  let savedAreaWasSelected = false;
  let initialError: string | undefined;

  try {
    const savedOffers = await getSavedOffers();
    isAuthenticated = savedOffers !== null;
    const existingOffer = savedOffers?.find((offer) => offer.offerUuid === offerUuid);
    initiallySaved = existingOffer !== undefined;
    initiallySavedAreaSlug = existingOffer?.areaSlug ?? null;
    savedAreaWasSelected = existingOffer?.areaSelected ?? false;
  } catch {
    // A failed lookup must not block the public offer. The POST validates the
    // session again and is safe to repeat if the offer was already saved.
    initialError = "No se pudo comprobar el guardado. Puedes intentar guardar nuevamente.";
  }

  return (
    <SaveOfferButton
      key={`${offerUuid}:${isAuthenticated}:${initiallySaved}`}
      offerUuid={offerUuid}
      areaSlug={areaSlug}
      isAuthenticated={isAuthenticated}
      initiallySaved={initiallySaved}
      canUpdateArea={initiallySaved && (!savedAreaWasSelected || initiallySavedAreaSlug !== areaSlug)}
      initialError={initialError}
    />
  );
}
