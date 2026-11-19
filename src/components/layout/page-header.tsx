import type { ReactNode } from "react";

/** Cabeçalho das páginas internas: o único `h1` da página e um parágrafo de abertura. */
export function PageHeader({ title, lead, children }: { title: string; lead: string; children?: ReactNode }) {
  return (
    <header className="flex flex-col gap-4">
      <h1 className="font-display text-5xl sm:text-6xl">{title}</h1>
      <p className="max-w-2xl text-lg text-muted-foreground">{lead}</p>
      {children}
    </header>
  );
}

/** Contêiner padrão das páginas internas (mesma largura e respiro de /projetos). */
export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6">{children}</div>;
}
