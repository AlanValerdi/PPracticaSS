import { notFound } from "next/navigation"
import { Bookmark, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getDataTable } from "@/lib/api/dataTable"
import { getOffer } from "@/lib/api/offer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Offer } from "@/lib/types/typesList"
import { Separator } from "@/components/ui/separator"

function AppointmentCard({ offer }: { offer: Offer }) {
    const fields = [
        { label: "Destinatario", value: offer.appointment.addressee },
        { label: "Cargo", value: offer.appointment.position },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Datos para la carta de presentación</CardTitle>
            </CardHeader>
            <CardContent className="-mb-(--card-spacing)">
                <dl className="-mx-(--card-spacing) grid grid-cols-2 gap-4 border-t bg-muted/50 px-(--card-spacing) py-4 text-sm leading-relaxed">
                    {fields.map(({ label, value }) => (
                        <div key={label} className="min-w-0">
                            <dt className="font-medium">{label}</dt>
                            <dd className="mt-1 whitespace-pre-line wrap-break-word">
                                {value.trim() || "No especificado"}
                            </dd>
                        </div>
                    ))}
                </dl>
            </CardContent>
        </Card>
    )
}

function SupervisorCard({ offer }: { offer: Offer }) {
    const { supervisor } = offer
    const fields = [
        { label: "Nombre", value: supervisor.name },
        { label: "Cargo", value: supervisor.position },
        { label: "Correo electrónico", value: supervisor.email },
        { label: "Teléfono", value: supervisor.phone },
        { label: "Dirección para entrevista", value: supervisor.interviewAddress },
        { label: "Dirección de trabajo", value: supervisor.workAddress },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Responsable de los alumnos en la empresa/dependencia</CardTitle>
            </CardHeader>
            <CardContent className="-mb-(--card-spacing)">
                <dl className="-mx-(--card-spacing) grid grid-cols-2 gap-4 border-t bg-muted/50 px-(--card-spacing) py-4 text-sm leading-relaxed">
                    {fields.map(({ label, value }) => (
                        <div key={label} className="min-w-0">
                            <dt className="font-medium">{label}</dt>
                            <dd className="mt-1 whitespace-pre-line wrap-break-word">
                                {value.trim() || "No especificado"}
                            </dd>
                        </div>
                    ))}
                </dl>
            </CardContent>
        </Card>
    )
}

function GeneralDataCard({ offer }: { offer: Offer }) {
    const { general } = offer
    const fields = [
        { label: "Nombre del programa", value: general.name },
        { label: "Tipo de programa", value: general.programType },
        { label: "Departamento", value: general.department },
        { label: "Fecha de inicio", value: general.startDate || general.startDateRaw },
        { label: "Fecha de término", value: general.endDate || general.endDateRaw },
        { label: "Duración", value: `${general.durationMonths} meses` },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Datos generales</CardTitle>
            </CardHeader>
            <CardContent className="-mb-(--card-spacing)">
                <dl className="-mx-(--card-spacing) grid grid-cols-2 gap-4 border-t bg-muted/50 px-(--card-spacing) py-4 text-sm leading-relaxed">
                    {fields.map(({ label, value }) => (
                        <div key={label} className="min-w-0">
                            <dt className="font-medium">{label}</dt>
                            <dd className="mt-1 whitespace-pre-line wrap-break-word">
                                {value.trim() || "No especificado"}
                            </dd>
                        </div>
                    ))}
                </dl>
            </CardContent>
        </Card>
    )
}

function SummaryCard({ actividades, competencias }: { actividades?: string, competencias?: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Lo que haras</CardTitle>
            </CardHeader>
            <CardContent className="-mb-(--card-spacing) ">
                <div className="-mx-(--card-spacing) max-h-90 space-y-4 overflow-y-scroll border-t bg-muted/50 px-(--card-spacing) py-4 text-sm leading-relaxed">
                    <div>
                        <h3 className="font-medium">Actividades</h3>
                        <p className="mt-2 whitespace-pre-line">
                            {actividades || "Actividades no especificadas"}
                        </p>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="font-medium">Competencias</h3>
                        <p className="mt-2 whitespace-pre-line">
                            {competencias || "Competencias no especificadas"}
                        </p>
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}

function InfoCard({ offer }: { offer: Offer }) {

    return (
        <Card>
            <CardHeader>
                <CardTitle>Informacion del programa</CardTitle>
            </CardHeader>

            <CardContent className="-mb-(--card-spacing) ">
                <div className="-mx-(--card-spacing) max-h-90 space-y-4 overflow-y-scroll border-t bg-muted/50 px-(--card-spacing) py-4 text-sm leading-relaxed">
                    <p>
                        Apoyo economico mensual: {offer.programInfo.monthlyStipend}
                    </p>
                    <Separator />
                    <p>
                        Otros apoyos: {offer.programInfo.otherSupport}
                    </p>
                    <Separator />
                    <p>
                        Ejeres rectores de pertinencia social que atiende el programa: {offer.programInfo.socialAxes}
                    </p>
                    <Separator />
                    <p>
                        El programa promueve la capacidad de emprendimiento: {offer.programInfo.promotesEntrepreneurship}
                    </p>

                </div>

            </CardContent>
        </Card>
    )
}

export default async function OfertaPage({
    params,
}: {
    params: Promise<{ areaId: string; ofertaId: string }>
}) {
    const { areaId, ofertaId } = await params
    const [{ area, offers }, offer] = await Promise.all([
        getDataTable(areaId),
        getOffer(ofertaId),
    ])

    if (!offers.some((areaOffer) => areaOffer.uuid === offer.uuid)) notFound()

    const areaDetail = offer.areaDetails.find(
        (detail) => detail.areaUuid === area.uuid
    )

    



    const actividades = areaDetail?.activities.trim()

    const competencias = areaDetail?.competencies.trim()

    return (
        <div className="min-w-0 w-full p-6 space-y-4">
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight wrap-break-word">
                    {offer.listing.programa}
                </h1>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span>Registrado en: {offer.summary.registeredAt || "No especificado"}</span>
                    <span>Revalidado: {offer.summary.revalidated ? "Sí" : "No"}</span>
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline">
                    <Bookmark aria-hidden="true" />
                    Guardar
                </Button>
                <Button
                    nativeButton={false}
                    render={
                        <a
                            href={`mailto:${offer.supervisor.email.trim()}?subject=${encodeURIComponent(
                                `Solicitud para el programa: ${offer.listing.programa}`
                            )}`}
                        />
                    }
                >
                    <Send aria-hidden="true" />
                    Aplicar
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {[
                    { label: "Empresa que oferta", value: offer.summary.company },
                    { label: "Folio", value: offer.summary.programNumber },
                    { label: "Sector", value: offer.summary.sector },
                    { label: "Periodo del programa", value: offer.summary.period },
                    { label: "Estatus", value: offer.summary.status },
                    { label: "TIpo de programa", value: offer.summary.tipo },

                ].map(({ label, value }) => (
                    <Card key={label} className="min-w-0">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {label}
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm font-semibold wrap-break-word">
                                {value.toUpperCase() || "No especificado"}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <GeneralDataCard offer={offer} />
            <SummaryCard actividades={actividades} competencias={competencias} />
            <InfoCard offer={offer} />
            <SupervisorCard offer={offer} />
            <AppointmentCard offer={offer} />

        </div>
    )
}
