/** Lista de tecnologias em "chips". Lista vazia não renderiza nada (D08). */
export function TechList({ names, label }: { names: string[]; label: string }) {
  if (names.length === 0) return null;
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {names.map((name) => (
        <li key={name} className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs">
          {name}
        </li>
      ))}
    </ul>
  );
}
