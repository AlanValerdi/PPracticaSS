"use client";
import { Button } from "@/components/ui/button";

export default function AnalysisError({ retry }: { retry: () => void }) {
  return <div className="space-y-4 p-8"><h1 className="text-2xl font-semibold">Ofertas sugeridas</h1><p role="alert">No se pudieron cargar las carreras. Intenta nuevamente.</p><Button onClick={retry}>Reintentar</Button></div>;
}
