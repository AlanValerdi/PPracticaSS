export const LOGIN_PATH = "/login";
export const SESSION_COOKIE = "pp_session";
export const PROTECTED_PATHS = ["/guardados", "/analisis-cv", "/admin"] as const;

export type AuthStatus = "unknown" | "anonymous" | "authenticated";

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function getNavHref(item: { url: string; requiresAuth?: boolean }, status: AuthStatus): string {
  return item.requiresAuth && status === "anonymous" ? getLoginPagePath(item.url) : item.url;
}

const GOOGLE_LOGIN_PATH = "/api/backend/auth/google/login";

// Only same-site relative paths are allowed as return targets (the backend validates again).
export function safeReturnPath(path: string | null | undefined): string | null {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) return null;
  return path;
}

export function getGoogleLoginHref(returnPath: string | null | undefined): string {
  const next = safeReturnPath(returnPath);
  return next ? `${GOOGLE_LOGIN_PATH}?next=${encodeURIComponent(next)}` : GOOGLE_LOGIN_PATH;
}

export function getLoginPagePath(returnPath: string | null | undefined): string {
  const next = safeReturnPath(returnPath);
  return next ? `${LOGIN_PATH}?next=${encodeURIComponent(next)}` : LOGIN_PATH;
}
