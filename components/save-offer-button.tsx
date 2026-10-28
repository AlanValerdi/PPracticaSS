"use client";

import { useActionState } from "react";
import { Bookmark, BookmarkCheck, LoaderCircle } from "lucide-react";

import { saveOfferAction, type SaveOfferState } from "@/app/actions/saved-offers";
import { Button } from "@/components/ui/button";

type SaveOfferButtonProps = {
  offerUuid: string;
  isAuthenticated: boolean;
  initiallySaved: boolean;
  initialError?: string;
};

export function SaveOfferButton({
  offerUuid,
  isAuthenticated,
  initiallySaved,
  initialError,
}: SaveOfferButtonProps) {
  const [state, action, isPending] = useActionState<SaveOfferState>(
    async () => saveOfferAction(offerUuid),
    {
      status: initiallySaved ? "saved" : initialError ? "error" : "idle",
      message: initialError,
    },
  );

  if (!isAuthenticated || state.status === "auth-required") {
    return (
      <Button variant="outline" nativeButton={false} render={<a href="/api/backend/auth/google/login" />}>
        <Bookmark aria-hidden="true" />
        Iniciar sesión para guardar
      </Button>
    );
  }

  const isSaved = initiallySaved || state.status === "saved";

  return (
    <form action={action} className="flex flex-col items-start gap-2" aria-busy={isPending}>
      <Button type="submit" variant="outline" disabled={isPending || isSaved}>
        {isPending ? (
          <LoaderCircle className="animate-spin" aria-hidden="true" />
        ) : isSaved ? (
          <BookmarkCheck aria-hidden="true" />
        ) : (
          <Bookmark aria-hidden="true" />
        )}
        {isPending ? "Guardando…" : isSaved ? "Guardada" : "Guardar"}
      </Button>
      {state.status === "error" && (
        <p className="max-w-sm text-sm text-destructive" role="alert">{state.message}</p>
      )}
      {state.status === "saved" && state.message && (
        <span className="sr-only" role="status">{state.message}</span>
      )}
    </form>
  );
}
