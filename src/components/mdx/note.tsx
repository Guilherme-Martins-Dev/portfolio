import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type NoteProps = {
  children: ReactNode;
  variant?: "info" | "warning";
  title?: string;
};

/** Observação lateral dentro do estudo de caso. */
export function Note({ children, variant = "info", title }: NoteProps) {
  return (
    <aside
      role="note"
      className={cn(
        "my-6 rounded-lg border-l-4 bg-card px-4 py-3 text-card-foreground",
        variant === "warning" ? "border-l-destructive" : "border-l-primary",
      )}
    >
      {title ? <p className="mb-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">{title}</p> : null}
      <div className="[&>p]:m-0">{children}</div>
    </aside>
  );
}
