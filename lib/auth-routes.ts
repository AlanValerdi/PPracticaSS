export const LOGIN_PATH = "/login";
export const SESSION_COOKIE = "pp_session";
export const PROTECTED_PATHS = ["/guardados", "/analisis-cv", "/admin"] as const;

export type AuthStatus = "unknown" | "anonymous" | "authenticated";

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function getNavHref(item: { url: string; requiresAuth?: boolean }, status: AuthStatus): string {
  return item.requiresAuth && status === "anonymous" ? LOGIN_PATH : item.url;
}
