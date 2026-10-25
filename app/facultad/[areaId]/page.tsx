export default async function AreasPage({params} : { params: Promise<{ areaId: string}>}) {
    const { areaId } = await params

    return(
        <h1>
            Your page {areaId}
        </h1>
    )
}