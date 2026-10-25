import { AppSidebar } from "@/components/app-sidebar"
import KbdSearchField from "@/components/kbd-search"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"



export default async function AreasPage({ params }: { params: Promise<{ areaId: string }> }) {
    const { areaId } = await params


    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                        <div className="flex items-center gap-2 px-3">
                            <SidebarTrigger />
                            <Separator orientation="vertical" className="mr-2 " />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        Inicio
                                    </BreadcrumbItem>

                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div className="ml-auto w-36 max-w-xs sm:w-64 px-2">
                            <KbdSearchField />
                        </div>
                    </header>
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="px-14 pt-8 p-4 max-w-full text-[clamp(22px,3cqi,30px)] leading-none font-semibold tracking-[-0.055em] wrap-break-word">
                            {areaId.toUpperCase()}
                        </h1>
                    </div>
                    <div className="flex">
                        
                    </div>

                </SidebarInset>
            </SidebarProvider>


        </div>
    )
}