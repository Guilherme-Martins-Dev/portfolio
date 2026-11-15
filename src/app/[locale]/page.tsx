import { LocaleSwitcher } from "@/components/navigation/locale-switcher";

// Página provisória. A Home real (Hero, Sobre, Indicadores...) entra nas issues #15 e #16,
// e o seletor de idioma vai para o cabeçalho na #14.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-2xl font-semibold">Guilherme Martins Bezerra</h1>
      <LocaleSwitcher />
    </main>
  );
}
