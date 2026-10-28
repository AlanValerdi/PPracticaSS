"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Bookmark, Check, FileText, LoaderCircle, MapPin, Send, Sparkles, Trash2, Upload } from "lucide-react";

import { ProgramCard } from "@/components/program-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

type SummaryField = { label: string; value: string };
type Recommendation = {
  id: string;
  folio: string;
  title: string;
  remuneration: string;
  reason: string;
};
type AnalysisState = "ready" | "analyzing" | "analyzed";

export default function AnalisisCvPage() {
  const { user, isLoading, error } = useAuth();

  useEffect(() => {
    if (!isLoading && !error && !user) {
      window.location.replace("/api/backend/auth/google/login");
    }
  }, [user, isLoading, error]);

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent>
            <p role="alert">No se pudo consultar tu sesión. Intenta nuevamente para continuar.</p>
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center gap-2 p-6 text-sm text-muted-foreground" role="status">
        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        {isLoading ? "Comprobando tu sesión…" : "Redirigiendo al inicio de sesión…"}
      </div>
    );
  }

  return <CvRecommendations />;
}

function CvRecommendations() {
  const summary: SummaryField[] = [
    { label: "Formación", value: "Licenciatura en Ingeniería de Software · 7.º semestre" },
    { label: "Experiencia", value: "Desarrollo de aplicaciones web en proyectos académicos y colaborativos." },
    { label: "Habilidades", value: "Desarrollo frontend, trabajo en equipo y resolución de problemas." },
    { label: "Herramientas", value: "React, TypeScript, HTML, CSS y Git." },
    { label: "Idiomas", value: "Español nativo · Inglés intermedio." },
    { label: "Intereses", value: "Tecnología educativa, accesibilidad y proyectos de impacto social." },
  ];
  const recommendations: Recommendation[] = [
    {
      id: "demo-1", folio: "240701", title: "TECNOLOGÍA PARA APRENDER",
      remuneration: "Apoyo económico de $3,000 mensuales",
      reason: "Tu experiencia con React y tu interés en la educación coinciden con el desarrollo de herramientas de aprendizaje para estudiantes.",
    },
    {
      id: "demo-2", folio: "240702", title: "CONECTANDO COMUNIDADES",
      remuneration: "Remuneración no especificada",
      reason: "Tus habilidades de desarrollo web y trabajo en equipo pueden contribuir a crear plataformas accesibles para organizaciones comunitarias.",
    },
    {
      id: "demo-3", folio: "240703", title: "INNOVACIÓN CON IMPACTO SOCIAL",
      remuneration: "Apoyo económico de $2,500 mensuales",
      reason: "Tu manejo de TypeScript y Git se relaciona con proyectos colaborativos que buscan resolver necesidades sociales mediante tecnología.",
    },
  ];

  const [document, setDocument] = useState<{ file: File; url: string } | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisState>("ready");
  const [fileError, setFileError] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (document) URL.revokeObjectURL(document.url);
    };
  }, [document]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function resetResults() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    setAnalysis("ready");
    setSaved([]);
    setNotice("");
  }

  function selectFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!/\.pdf$/i.test(file.name) || (file.type !== "application/pdf" && file.type !== "")) {
      setFileError("Selecciona un archivo en formato PDF.");
      return;
    }
    if (file.size === 0 || file.size > 10 * 1024 * 1024) {
      setFileError(file.size === 0 ? "El PDF está vacío. Selecciona otro archivo." : "El PDF supera los 10 MB. Selecciona un archivo más pequeño.");
      return;
    }
    resetResults();
    setFileError("");
    setDocument({ file, url: URL.createObjectURL(file) });
  }

  function removeDocument() {
    resetResults();
    setDocument(null);
    setFileError("");
  }

  function analyze() {
    if (!document || analysis !== "ready") return;
    setAnalysis("analyzing");
    timerRef.current = setTimeout(() => {
      setAnalysis("analyzed");
      timerRef.current = null;
    }, 1000);
  }

  function toggleSaved(offer: Recommendation) {
    const isSaved = saved.includes(offer.id);
    setSaved((current) => isSaved ? current.filter((id) => id !== offer.id) : [...current, offer.id]);
    setNotice(`${offer.title}: ${isSaved ? "eliminada de" : "añadida a"} tus guardados de demostración.`);
  }

  function showDemo(action: string, offer: Recommendation) {
    setNotice(`${action}: ${offer.title}. Esta oferta es de demostración; la acción estará disponible al conectar las recomendaciones reales.`);
  }

  return (
    <div className={`flex min-w-0 w-full flex-1 flex-col gap-5 bg-zinc-50 px-4 py-5 font-sans sm:gap-6 sm:p-8 dark:bg-black ${document ? "lg:h-[calc(100svh-4rem)] lg:flex-none lg:overflow-hidden" : ""}`}>
      <header className="shrink-0 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Ofertas sugeridas</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">Explora oportunidades que conectan con tu perfil a partir de tu currículum.</p>
      </header>

      <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="sr-only" tabIndex={-1} aria-label="Seleccionar CV en PDF" aria-describedby={fileError ? "cv-file-error" : undefined} onChange={selectFile} />
      {fileError && <p id="cv-file-error" role="alert" className="text-sm text-destructive">{fileError}</p>}

      {!document ? (
        <Card className="flex min-h-[420px] flex-1 items-center justify-center border border-dashed shadow-none ring-0">
          <CardContent className="items-center gap-4 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-muted"><FileText className="size-8 text-muted-foreground" aria-hidden="true" /></div>
            <h2 className="text-xl font-semibold">Tu próxima oportunidad empieza con tu CV</h2>
            <p className="max-w-md text-sm text-muted-foreground">Selecciona tu currículum y explora cómo se verán las recomendaciones para tu perfil.</p>
            <Button onClick={() => inputRef.current?.click()}><Upload aria-hidden="true" />Sube y analiza tu CV</Button>
            <p className="text-xs text-muted-foreground">PDF de hasta 10 MB. El archivo permanece en tu navegador.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid min-h-0 min-w-0 gap-6 p-1 lg:flex-1 lg:grid-cols-2 lg:overflow-hidden">
            <div
              role="region"
              aria-label="CV y resumen"
              tabIndex={0}
              className="min-h-0 min-w-0 space-y-5 p-1 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:space-y-6 lg:overflow-y-auto lg:overscroll-contain lg:[scrollbar-gutter:stable] lg:pr-3"
            >
              <section className="min-w-0 space-y-4" aria-labelledby="analysis-heading">
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 id="analysis-heading" className="text-xl font-semibold">Análisis</h2>
                  <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
                    <Button size="sm" variant="outline" onClick={() => inputRef.current?.click()}><Upload aria-hidden="true" />Cambiar CV</Button>
                    <Button size="sm" variant="ghost" onClick={removeDocument}><Trash2 aria-hidden="true" />Quitar</Button>
                  </div>
                </div>
                <Card size="sm" className="border border-border shadow-none ring-0">
                  <CardContent>
                    <div className="flex min-w-0 items-center gap-3">
                      <FileText className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <p className="min-w-0 flex-1 truncate font-medium" title={document.file.name}>{document.file.name}</p>
                      <span className="shrink-0 text-xs text-muted-foreground">{(document.file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed bg-muted/40 px-4 py-6 text-center sm:hidden">
                      <FileText className="size-10 text-muted-foreground" aria-hidden="true" />
                      <p className="text-sm font-medium">Tu CV está listo</p>
                      <p className="text-xs leading-relaxed text-muted-foreground">Abre el PDF para verlo completo en el visor de tu dispositivo.</p>
                      <Button variant="outline" nativeButton={false} render={<a href={document.url} target="_blank" rel="noopener noreferrer" />}>
                        Abrir CV
                      </Button>
                    </div>
                    <div className="mx-auto hidden aspect-[210/297] h-[min(50svh,360px)] max-w-full sm:block lg:h-[min(36svh,320px)]">
                      <object
                        data={`${document.url}#view=Fit&toolbar=0&navpanes=0`}
                        type="application/pdf"
                        aria-label={`Vista previa de ${document.file.name}`}
                        className="h-full w-full rounded-md border bg-muted"
                      >
                        <p className="p-4 text-sm text-muted-foreground">Tu navegador no permite mostrar el PDF aquí. Utiliza el enlace de abajo para abrirlo.</p>
                      </object>
                    </div>
                    <a href={document.url} target="_blank" rel="noopener noreferrer" className="hidden w-fit text-sm underline underline-offset-4 sm:block">Abrir PDF en otra pestaña</a>
                    <Button disabled={analysis !== "ready"} onClick={analyze}>
                      {analysis === "analyzing" ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : analysis === "analyzed" ? <Check aria-hidden="true" /> : <Sparkles aria-hidden="true" />}
                      {analysis === "analyzing" ? "Analizando…" : analysis === "analyzed" ? "Análisis completado" : "Realizar análisis"}
                    </Button>
                    <p role="status" className="text-xs text-muted-foreground">{analysis === "analyzing" ? "Preparando el resumen y las recomendaciones de demostración…" : analysis === "analyzed" ? "El resumen y las tres recomendaciones de demostración están disponibles." : "El análisis es simulado y no envía tu documento."}</p>
                  </CardContent>
                </Card>
              </section>
              {analysis === "analyzed" && (
                <section aria-labelledby="summary-heading" className="space-y-4">
                  <h2 id="summary-heading" className="text-xl font-semibold">Resumen</h2>
                  <Card className="gap-4 border border-border pb-0 shadow-none ring-0">
                    <CardHeader><h3 className="font-medium">Perfil profesional de ejemplo</h3></CardHeader>
                    <CardContent className="px-0">
                      <dl className="grid grid-cols-1 gap-4 border-t bg-muted/50 px-4 py-4 text-sm leading-relaxed sm:grid-cols-2 sm:px-6">
                        {summary.map(({ label, value }) => <div key={label} className="min-w-0"><dt className="font-medium">{label}</dt><dd className="mt-1 wrap-break-word text-muted-foreground">{value}</dd></div>)}
                      </dl>
                    </CardContent>
                  </Card>
                </section>
              )}
            </div>
            <Card role="region" aria-labelledby="recommendations-heading" className="min-h-0 min-w-0 gap-4 border border-border pb-0 shadow-none ring-0 lg:h-full">
              <CardHeader className="min-w-0 shrink-0 px-4 sm:px-6">
                <h2 id="recommendations-heading" className="text-xl font-semibold">Recomendaciones</h2>
                <p role="status" aria-live="polite" className="text-sm wrap-break-word text-muted-foreground">{notice}</p>
              </CardHeader>
              <CardContent
                role="region"
                aria-label="Ofertas recomendadas"
                tabIndex={0}
                className="min-h-0 max-h-[70svh] overflow-y-auto overscroll-contain border-t px-3 py-4 [scrollbar-gutter:stable] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:px-5 lg:max-h-none lg:flex-1"
              >
              {analysis === "analyzed" ? (
                <div className="space-y-6 p-1">
                  {recommendations.map((offer, index) => (
                    <article key={offer.id} className="space-y-3">
                      <ProgramCard toneIndex={index} cardClassName="p-2 sm:p-4" className="min-h-[240px] p-3 sm:min-h-[280px] sm:p-5">
                        <div className="relative z-10 flex flex-1 flex-col gap-4">
                          <div className="flex items-start justify-between gap-2 sm:gap-4">
                            <div className="min-w-0 space-y-1"><p className="text-sm font-semibold wrap-break-word">Folio {offer.folio}</p><p className="text-sm wrap-break-word">{offer.remuneration}</p></div>
                            <Button size="icon-sm" variant="ghost" aria-label={`${saved.includes(offer.id) ? "Quitar de" : "Añadir a"} guardados: ${offer.title}`} aria-pressed={saved.includes(offer.id)} onClick={() => toggleSaved(offer)}><Bookmark className={saved.includes(offer.id) ? "fill-current" : ""} aria-hidden="true" /></Button>
                          </div>
                          <div className="flex min-h-24 flex-1 items-center justify-center py-4 text-center sm:min-h-28 sm:py-6"><h3 className="max-w-full text-lg leading-tight font-semibold tracking-tight wrap-break-word sm:text-[clamp(22px,3cqi,30px)] sm:tracking-[-0.055em]">{offer.title}</h3></div>
                          <div className="mt-auto grid grid-cols-1 gap-2 min-[360px]:grid-cols-2 sm:flex sm:flex-wrap sm:items-center">
                            <Button className="min-[360px]:col-span-2" size="sm" onClick={() => showDemo("Ver oferta", offer)}>Ver oferta</Button>
                              <Button className="sm:ml-auto" size="sm" variant="outline" onClick={() => showDemo("Aplicar", offer)}><Send aria-hidden="true" />Aplicar</Button>
                              <Button size="sm" variant="outline" onClick={() => showDemo("Ver en mapa", offer)}><MapPin aria-hidden="true" />Ver en mapa</Button>
                          </div>
                        </div>
                      </ProgramCard>
                      <div className="px-2 text-sm leading-relaxed"><p className="font-medium">¿Por qué te recomendamos esta oferta?</p><p className="mt-1 text-muted-foreground">{offer.reason}</p></div>
                    </article>
                  ))}
                </div>
              ) : (
                  <div className="flex flex-col items-center gap-4 py-8 text-center">
                    <Sparkles className="size-8 text-muted-foreground" aria-hidden="true" />
                    <h3 className="text-base font-medium">Encuentra ofertas para tu perfil</h3>
                    <p className="max-w-sm text-sm text-muted-foreground">Realiza un análisis para ver un ejemplo de resumen de tu CV y las ofertas recomendadas.</p>
                    <div className="mt-2 grid w-full gap-3" aria-hidden="true">{[0, 1, 2].map((item) => <div key={item} className="h-24 rounded-xl bg-muted/60" />)}</div>
                  </div>
              )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
