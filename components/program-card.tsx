import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ProgramCardProps = {
  children: ReactNode;
  toneIndex: number;
  className?: string;
  cardClassName?: string;
};

export function ProgramCard({ children, toneIndex, className, cardClassName }: ProgramCardProps) {
  return (
    <Card className={cn("h-full min-w-0 gap-0 rounded-2xl border border-border p-4 shadow-none ring-0", cardClassName)}>
      <div
        className={cn(
          "relative isolate flex min-h-[280px] flex-1 flex-col overflow-hidden rounded-2xl p-5 text-[#14171B] @container",
          toneIndex % 2 === 0 ? "bg-[#F0A4CC]" : "bg-[#F1D369]",
          className,
        )}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[15%] rotate-[3deg] rounded-[68%_52%_58%_52%] border border-current"
        />
        {children}
      </div>
    </Card>
  );
}
