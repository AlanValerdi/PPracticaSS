export type UserRole = "user" | "admin";

// Hides items restricted to a role unless the current user has it.
export function getVisibleNavItems<T extends object>(
  items: readonly T[],
  role: UserRole | null | undefined,
): T[] {
  return items.filter((item) => {
    const required = (item as { requiresRole?: UserRole }).requiresRole;
    return !required || required === role;
  });
}
