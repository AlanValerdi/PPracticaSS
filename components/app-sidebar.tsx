"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { getNavHref, type AuthStatus } from "@/lib/auth-routes"
import { APP_NAV_ITEMS } from "@/lib/navigation"
import { getVisibleNavItems, type UserRole } from "@/lib/nav-visibility"
import { NavUser } from "./nav-user"

function SidebarNavigation({ pathname, authStatus = "unknown", role }: { pathname?: string; authStatus?: AuthStatus; role?: UserRole }) {
  return (
    <SidebarGroup className="px-3 py-5">
      <SidebarMenu className="gap-2">
        {getVisibleNavItems(APP_NAV_ITEMS, role).map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              isActive={pathname !== undefined && (item.url === "/" ? pathname === "/" : pathname === item.url || pathname.startsWith(`${item.url}/`))}
              className="h-12 gap-3 rounded-xl px-3 text-lg font-medium data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground data-active:shadow-sm [&_svg]:size-5"
              render={<Link href={getNavHref(item, authStatus)} className="font-medium" />}
            >
              {item.icon && <item.icon strokeWidth={1.9} />}
              {item.title}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function ActiveSidebarNavigation({ authStatus, role }: { authStatus: AuthStatus; role?: UserRole }) {
  const pathname = usePathname()
  return <SidebarNavigation pathname={pathname} authStatus={authStatus} role={role} />
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    user,
    isLoading,
    error,
    logout,
    isLoggingOut,
    logoutError,
  } = useAuth();
  const authStatus: AuthStatus = isLoading || error ? "unknown" : user ? "authenticated" : "anonymous";

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="h-16 gap-3 rounded-xl px-2 hover:bg-transparent" render={<Link href="/" />}>
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
                <Image src="/programass-logo.svg" alt="" width={36} height={36} className="size-9" />
              </div>
              <div className="flex min-w-0 flex-col gap-1 leading-tight">
                <span className="truncate text-lg font-semibold tracking-tight">PProgramaSS</span>
                <span className="text-sm text-muted-foreground">v1.0.0</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <React.Suspense fallback={<SidebarNavigation authStatus={authStatus} role={user?.role} />}>
          <ActiveSidebarNavigation authStatus={authStatus} role={user?.role} />
        </React.Suspense>
      </SidebarContent>
      <SidebarFooter>
        {isLoading ? (
          <p className="px-2 py-3 text-sm text-muted-foreground" role="status">
            Cargando sesión…
          </p>
        ) : error ? (
          <div className="space-y-2 px-2 py-3">
            <p className="text-sm" role="alert">
              No se pudo consultar tu sesión.
            </p>
            <button
              type="button"
              className="text-sm underline"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>
          </div>
        ) : user ? (
          <NavUser
            user={{
              name: user.name,
              email: user.email,
              avatar: user.avatarUrl ?? "",
            }}
            onLogout={logout}
            isLoggingOut={isLoggingOut}
          />
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<a href="/api/backend/auth/google/login" />}
              >
                Iniciar sesión con Google
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}

        {logoutError && (
          <p className="px-2 text-sm text-destructive" role="alert">
            {logoutError}
          </p>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
