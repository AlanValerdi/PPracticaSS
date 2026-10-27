import { columns } from "./columns"
import { getDataTable } from "@/lib/api/dataTable"
import { DataTable } from "./data-table"

export default async function AreasPage({ params }: { params: Promise<{ areaId: string }> }) {
    const { areaId } = await params
    const { area, offers } = await getDataTable(areaId)


    return (
        <div className="flex min-w-0 w-full flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
            <div className="flex flex-col items-center justify-center">
                <h1 className="px-14 pt-8 p-4 max-w-full text-[clamp(22px,3cqi,30px)] leading-none font-semibold tracking-[-0.055em] wrap-break-word">
                    {area.name}
                </h1>
            </div>
            <div className="min-w-0 p-6">
                <DataTable key={area.uuid} columns={columns} data={offers} />
            </div>
        </div>
    )
}
