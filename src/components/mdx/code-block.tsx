import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Bloco de código: substitui o <pre> do MDX. Rola na horizontal sem quebrar o layout
 * e é focável pelo teclado (requisito de acessibilidade para áreas roláveis).
 */
export function CodeBlock({ className, ...props }: ComponentProps<"pre">) {
  return (
    <pre
      tabIndex={0}
      className={cn(
        "my-6 overflow-x-auto rounded-lg border bg-card p-4 font-mono text-sm leading-relaxed text-card-foreground",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60",
        className,
      )}
      {...props}
    />
  );
}

/** Código inline (`assim`). Dentro de um <pre> herda o estilo do bloco. */
export function InlineCode({ className, ...props }: ComponentProps<"code">) {
  return (
    <code
      className={cn("rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] [pre_&]:bg-transparent [pre_&]:p-0", className)}
      {...props}
    />
  );
}
