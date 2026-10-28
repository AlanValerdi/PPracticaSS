import { SaveOfferButton } from "@/components/save-offer-button";
import { getSavedOffers } from "@/lib/api/saved-offers";

export async function OfferSaveControl({ offerUuid }: { offerUuid: string }) {
  let isAuthenticated = true;
  let initiallySaved = false;
  let initialError: string | undefined;

  try {
    const savedOffers = await getSavedOffers();
    isAuthenticated = savedOffers !== null;
    initiallySaved = savedOffers?.some((offer) => offer.offerUuid === offerUuid) ?? false;
  } catch {
    // A failed lookup must not block the public offer. The POST validates the
    // session again and is safe to repeat if the offer was already saved.
    initialError = "No se pudo comprobar el guardado. Puedes intentar guardar nuevamente.";
  }

  return (
    <SaveOfferButton
      key={`${offerUuid}:${isAuthenticated}:${initiallySaved}`}
      offerUuid={offerUuid}
      isAuthenticated={isAuthenticated}
      initiallySaved={initiallySaved}
      initialError={initialError}
    />
  );
}
