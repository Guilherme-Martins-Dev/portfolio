import { useTranslations } from "next-intl";

import type { ProjectStatus } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const dotClass: Record<ProjectStatus, string> = {
  concluido: "bg-primary",
  "em-desenvolvimento": "bg-accent-text",
  planejamento: "bg-muted-foreground",
};

/** Selo de status: o texto carrega a informação; o ponto colorido é só reforço visual (WCAG 1.4.1). */
export function StatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  const t = useTranslations("ProjectStatus");

  return (
    <span
      data-status-badge
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-xs",
        className,
      )}
    >
      <span aria-hidden className={cn("size-2 rounded-full", dotClass[status])} />
      {t(status)}
    </span>
  );
}
