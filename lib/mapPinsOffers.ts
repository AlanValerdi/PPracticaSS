export type MapOffer = {
    id: string;
    title: string;
    folio: string;
    description: string;
    latitude: number;
    longitude: number;
    areaId: string;
}

export const mockMapOffers: MapOffer[] = [
  {
    id: "oferta-1",
    title: "Desarrollo de aplicaciones web",
    folio: "PR-2026-001",
    description:
      "Colabora en el desarrollo de aplicaciones web para proyectos universitarios.",
    latitude: 18.99859,
    longitude: -98.199381,
    areaId: "computacion",
  },
  {
    id: "oferta-2",
    title: "Soporte técnico",
    folio: "PR-2026-002",
    description:
      "Participa en el mantenimiento de equipos y la atención a usuarios.",
    latitude: 19.001,
    longitude: -98.202,
    areaId: "computacion",
  },
];