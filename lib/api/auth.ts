import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { components } from "@/lib/api-types";

async function fetchSessionUser(): Promise<components["schemas"]["UserRead"]> {
  const sessionToken = (await cookies()).get("pp_session")?.value;
  if (!sessionToken) redirect("/login");

  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) throw new Error("Falta configurar API_BASE_URL");

  const response = await fetch(`${baseUrl.replace(/\/+$/, "")}/api/v1/auth/me`, {
    cache: "no-store",
    headers: { Cookie: `pp_session=${encodeURIComponent(sessionToken)}` },
  });

  if (response.status === 401) redirect("/login");
  if (!response.ok) throw new Error("No se pudo consultar tu sesión.");

  return response.json();
}

export async function requireSession(): Promise<void> {
  await fetchSessionUser();
}

// Anonymous users go to /login, signed-in non-admins go home.
export async function requireAdmin(): Promise<void> {
  const user = await fetchSessionUser();
  if (user.role !== "admin") redirect("/");
}
