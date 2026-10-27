"use client";

import { useState } from "react";
import useSWR from "swr";
import { useRouter  } from "next/navigation";

import type { components } from "@/lib/api-types";

export type AuthUser = components["schemas"]["UserRead"];

async function fetchCurrentUser(url: string): Promise<AuthUser | null> {
    const response = await fetch(url, {
        cache: "no-store",
        credentials: "same-origin",
    });

    if (response.status === 401) {
        return null;
    }

    if (!response.ok) {
        throw new Error("No se pudo consultar tu sesión.");
    }

    return response.json();
}

export function useAuth() {
    const router = useRouter();
    const { data, error, isLoading, mutate } = useSWR<
        AuthUser | null,
        Error
    >("/api/backend/auth/me", fetchCurrentUser, {
        errorRetryCount: 2,
    });

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState<string | null>(null);

    async function logout(): Promise<void> {
        if (isLoggingOut) return;

        setIsLoggingOut(true);
        setLogoutError(null);

        try {
            await mutate(
                async () => {
                    const response = await fetch("/api/backend/auth/logout", {
                        method: "POST",
                        credentials: "same-origin",
                        headers: {
                            "X-Requested-With": "XMLHttpRequest",
                        },
                    });

                    if (!response.ok) {
                        throw new Error("No se pudo cerrar la sesión. Intenta nuevamente.");
                    }

                    return null;
                },
                { revalidate: false },
            );


            router.replace("/");
            router.refresh();
        } catch (error) {
            setLogoutError(
                error instanceof Error
                    ? error.message
                    : "No se pudo cerrar la sesión.",
            );
        } finally {
            setIsLoggingOut(false);
        }
    }

    return {
        user: data ?? null,
        isLoading,
        error,
        logout,
        isLoggingOut,
        logoutError,
    };
}
