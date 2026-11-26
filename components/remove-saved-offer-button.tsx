"use client";

import { useActionState } from "react";
import { BookmarkX, LoaderCircle } from "lucide-react";

import { removeSavedOfferAction, type RemoveSavedOfferState } from "@/app/actions/saved-offers";
import { Button } from "@/components/ui/button";
import { getGoogleLoginHref } from "@/lib/auth-routes";

type RemoveSavedOfferButtonProps = {
  offerUuid: string;
  title: string;
};

export function RemoveSavedOfferButton({ offerUuid, title }: RemoveSavedOfferButtonProps) {
  const [state, action, isPending] = useActionState<RemoveSavedOfferState>(
    async () => removeSavedOfferAction(offerUuid),
    { status: "idle" },
  );

  return (
    <form action={action} className="flex max-w-48 shrink-0 flex-col items-end gap-2" aria-busy={isPending}>
      <Button
        type="submit"
        variant="outline"
        size="icon-lg"
        disabled={isPending || state.status === "removed"}
        aria-label={isPending ? `Quitando de guardados: ${title}` : `Quitar de guardados: ${title}`}
        className="rounded-xl border-[#A94E2E]/20 bg-white text-[#A94E2E] hover:bg-white/90 hover:text-[#963F23] disabled:opacity-60 [&_svg]:size-5"
      >
        {isPending ? (
          <LoaderCircle className="animate-spin" aria-hidden="true" />
        ) : (
          <BookmarkX aria-hidden="true" />
        )}
      </Button>
      {state.status === "error" && (
        <p className="text-right text-sm text-[#14171B]" role="alert">{state.message}</p>
      )}
      {state.status === "auth-required" && (
        <p className="text-right text-sm text-[#14171B]" role="alert">
          Tu sesión expiró. <a className="underline" href={getGoogleLoginHref("/guardados")}>Inicia sesión</a> para quitar la oferta.
        </p>
      )}
    </form>
  );
}
