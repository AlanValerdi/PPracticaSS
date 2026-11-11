"use client"

import * as React from "react"
import Link from "next/link"
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
import { GalleryVerticalEndIcon } from "lucide-react"
import { APP_NAV_ITEMS } from "@/lib/navigation"
import { NavUser } from "./nav-user"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const {
    user,
    isLoading,
    error,
    logout,
    isLoggingOut,
    logoutError,
  } = useAuth();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEndIcon className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">PProgramaSS</span>
                <span className="">v1.0.0</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>

            {APP_NAV_ITEMS.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton render={<Link href={item.url} className="font-medium" />}>
                  {item.icon && <item.icon />}
                  {item.title}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}



          </SidebarMenu>
        </SidebarGroup>
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
