import type { CSSProperties, ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { getAreaCardVisual } from "@/components/area-card";
import { cn } from "@/lib/utils";

type ProgramCardProps = {
  children: ReactNode;
  toneIndex: number;
  type?: string;
  appearance?: "default" | "saved";
  className?: string;
  cardClassName?: string;
};

export function ProgramCard({ children, toneIndex, type, appearance = "default", className, cardClassName }: ProgramCardProps) {
  const { Illustration, tone } = getAreaCardVisual(type ?? "", toneIndex, true);
  const saved = appearance === "saved";

  return (
    <Card className={cn(
      "h-full min-w-0 gap-0 rounded-2xl border p-4 shadow-none ring-0",
      saved && "border-0 bg-transparent p-0",
      !saved && "border-border",
      cardClassName,
    )}>
      <div
        className={cn(
          "relative isolate flex min-h-[280px] flex-1 flex-col overflow-hidden rounded-2xl p-5 text-[#17151B] @container",
          saved && "p-5",
          className,
        )}
        style={{
          backgroundColor: saved ? "#F2D9CA" : tone.background,
          "--program-accent": saved ? "#A94E2E" : tone.ink,
        } as CSSProperties}
      >
        {!saved && (
          <Illustration
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 size-28 max-w-full -translate-x-1/2 -translate-y-1/2 opacity-20"
            style={{ color: tone.ink }}
            strokeWidth={1.5}
            fill="currentColor"
            fillOpacity={0.16}
          />
        )}
        {children}
      </div>
    </Card>
  );
}
