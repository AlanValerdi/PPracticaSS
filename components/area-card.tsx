import Link from "next/link";
import {
  BookOpen, Brain, BriefcaseBusiness, Building2, Calculator, Cog, Dna,
  Dumbbell, FlaskConical, Globe2, GraduationCap, HeartPulse, Landmark,
  Languages, Leaf, Monitor, Music, Palette, PawPrint, Pickaxe, Plane,
  RadioTower, Scale, Sprout, Utensils, Zap,
  type LucideIcon,
} from "lucide-react";

import type { Area } from "@/lib/types/typesList";

// Specific subjects precede broader fields such as engineering or administration.
const subjects: { pattern: RegExp; icon: LucideIcon }[] = [
  { pattern: /automot|autotron|automat/, icon: Cog },
  { pattern: /comput|software|informat|tecnologias de la informacion|sistemas/, icon: Monitor },
  { pattern: /agron|agric|agropec|agroindustrial|agroforest|agrohidra/, icon: Sprout },
  { pattern: /veterin|zootec|fauna/, icon: PawPrint },
  { pattern: /medic|enferm|salud|odont|estomat|fisioter|biomed|farmac|forense|readapt/, icon: HeartPulse },
  { pattern: /psicol|neuro/, icon: Brain },
  { pattern: /quim|alquim/, icon: FlaskConical },
  { pattern: /biolog|biotec|genom/, icon: Dna },
  { pattern: /ambient|ecolog|forest|sustent/, icon: Leaf },
  { pattern: /arquitect|urban|civil|ciudades/, icon: Building2 },
  { pattern: /derecho|crimin|juridic/, icon: Scale },
  { pattern: /contad|finanz|actuar|matematic|estadistic|econom/, icon: Calculator },
  { pattern: /politic|publica|sociolog/, icon: Landmark },
  { pattern: /internacional|geograf|comercio/, icon: Globe2 },
  { pattern: /turis|aeronaut/, icon: Plane },
  { pattern: /administr|negocio|mercad|gestion|emprend/, icon: BriefcaseBusiness },
  { pattern: /geolog|geofis|minas|topograf|geodes/, icon: Pickaxe },
  { pattern: /electron|electric|energia|fisica/, icon: Zap },
  { pattern: /comunic|telecom|periodis/, icon: RadioTower },
  { pattern: /gastronom|nutric|aliment/, icon: Utensils },
  { pattern: /mecanic|mecatron|industrial|manufact|material|textil/, icon: Cog },
  { pattern: /musica|danza|escenic|dramatic|etnocoreo/, icon: Music },
  { pattern: /diseno|arte|cinema|cine|animacion/, icon: Palette },
  { pattern: /lengua|idioma|ingles|frances/, icon: Languages },
  { pattern: /histori|filosof|literat|antropol|humanidad/, icon: BookOpen },
  { pattern: /deport|cultura fisica/, icon: Dumbbell },
  { pattern: /educa|pedagog|ensenanza/, icon: GraduationCap },
];

const tones = [
  { background: "#F2D5E4", ink: "#AE38CC" },
  { background: "#F3E6B4", ink: "#A66A18" },
  { background: "#D6E8D3", ink: "#3C784F" },
  { background: "#DEDDF3", ink: "#6651B5" },
  { background: "#D5E7EE", ink: "#28708B" },
  { background: "#F2D9CA", ink: "#BA5935" },
];

export function getAreaCardVisual(name: string, toneIndex: number, colorByType = false) {
  const subject = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/-/g, " ")
    .toLowerCase();
  const subjectIndex = subjects.findIndex(({ pattern }) => pattern.test(subject));
  const Illustration = subjectIndex < 0 ? GraduationCap : subjects[subjectIndex].icon;
  const tone = tones[(colorByType && subjectIndex >= 0 ? subjectIndex : toneIndex) % tones.length];
  return { Illustration, tone };
}

export function AreaCard({ area, toneIndex }: { area: Area; toneIndex: number }) {
  const { Illustration, tone } = getAreaCardVisual(`${area.name} ${area.slug}`, toneIndex);

  return (
    <article
      className="flex h-full min-w-0 flex-col overflow-hidden rounded-3xl text-[#17151B] @container"
      style={{ backgroundColor: tone.background }}
    >
      <div className="flex min-h-[300px] flex-1 flex-col items-center justify-center gap-2 px-5 pt-8 pb-6 text-center">
        <Illustration
          aria-hidden="true"
          className="size-40 max-w-full shrink-0"
          style={{ color: tone.ink }}
          strokeWidth={1.5}
          fill="currentColor"
          fillOpacity={0.16}
        />
        <h2 className="w-full text-[clamp(18px,8cqi,28px)] leading-tight font-medium tracking-tight wrap-break-word">
          {area.name}
        </h2>
      </div>
      <Link
        href={`/facultad/${area.slug}`}
        aria-label={`Conoce las ofertas de ${area.name}`}
        className="flex min-h-20 items-center justify-center px-4 py-6 text-center text-[clamp(14px,6cqi,20px)] leading-tight font-semibold text-white transition-[filter] hover:brightness-90 focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-white"
        style={{ backgroundColor: tone.ink }}
      >
        Conoce las ofertas
      </Link>
    </article>
  );
}
