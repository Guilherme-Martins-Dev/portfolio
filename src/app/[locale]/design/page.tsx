import type { Metadata } from "next";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";

// Página interna do design system: mostra tokens e componentes base nos dois temas.
// Não entra no menu nem no sitemap.
export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const primitives = [
  ["navy-950", "bg-navy-950"],
  ["navy-900", "bg-navy-900"],
  ["navy-800", "bg-navy-800"],
  ["navy-700", "bg-navy-700"],
  ["cyan-400", "bg-cyan-400"],
  ["cyan-700", "bg-cyan-700"],
  ["purple-600", "bg-purple-600"],
  ["purple-400", "bg-purple-400"],
  ["slate-50", "bg-slate-50"],
  ["slate-300", "bg-slate-300"],
  ["slate-600", "bg-slate-600"],
] as const;

const semantic = [
  ["background", "bg-background", "text-foreground"],
  ["card", "bg-card", "text-card-foreground"],
  ["muted", "bg-muted", "text-muted-foreground"],
  ["primary", "bg-primary", "text-primary-foreground"],
  ["secondary", "bg-secondary", "text-secondary-foreground"],
  ["destructive", "bg-destructive", "text-destructive-foreground"],
] as const;

export default function DesignPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-12">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Página interna
          </p>
          <h1 className="font-display text-5xl">Design system</h1>
        </div>
        <ThemeToggle />
      </header>

      <section aria-labelledby="tipografia" className="flex flex-col gap-4">
        <h2 id="tipografia" className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
          Tipografia
        </h2>
        <p className="font-display text-4xl">
          Instrument Serif <em>itálico</em>
        </p>
        <p className="font-sans text-lg">Geist: texto de corpo, neutro e legível.</p>
        <p className="font-mono text-sm">Geist Mono: labels, código e metadados.</p>
      </section>

      <section aria-labelledby="primitivos" className="flex flex-col gap-4">
        <h2 id="primitivos" className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
          Primitivos
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {primitives.map(([name, bg]) => (
            <li key={name} className="flex flex-col gap-2">
              <span className={`h-14 rounded-md border ${bg}`} aria-hidden="true" />
              <span className="font-mono text-xs">{name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="semanticos" className="flex flex-col gap-4">
        <h2 id="semanticos" className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
          Semânticos (mudam com o tema)
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {semantic.map(([name, bg, fg]) => (
            <li key={name} className={`rounded-lg border p-4 ${bg} ${fg}`}>
              <span className="font-mono text-sm">{name}</span>
            </li>
          ))}
        </ul>
        <p>
          Texto com destaque: <span className="text-accent-text">accent-text</span> e{" "}
          <a href="#semanticos" className="text-link underline underline-offset-4">
            link
          </a>
          .
        </p>
      </section>

      <section aria-labelledby="componentes" className="flex flex-col gap-4">
        <h2 id="componentes" className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
          Componentes base
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primário</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="outline">Contorno</Button>
          <Button variant="ghost">Fantasma</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destrutivo</Button>
          <Button disabled>Desabilitado</Button>
        </div>
        <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-[0_0_40px_-12px_var(--glow)]">
          <h3 className="font-display text-2xl">Card</h3>
          <p className="text-muted-foreground">Superfície com borda e brilho (--glow).</p>
        </div>
      </section>
    </div>
  );
}
