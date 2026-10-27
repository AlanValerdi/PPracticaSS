"use client"

import * as React from "react"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { GalleryVerticalEndIcon, HomeIcon, LucideIcon, MapIcon } from "lucide-react"

type DataNav = {
  "id": number,
  "title": string,
  "url": string,
  icon?: LucideIcon,
  items?: [],
}

const data: DataNav[] = [
  {
    id: 1,
    title: "Inicio",
    url: "/",
    icon: HomeIcon,
    items: []
  },
  {
    id: 2,
    title: "Mapa",
    url: "/mapa",
    icon: MapIcon,
    items: []
  },
]


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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

            {data.map((item)=> (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton render={<Link href={item.url} className="font-medium" />}>
                  {item.icon && <item.icon/>}
                  {item.title}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}


      
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
