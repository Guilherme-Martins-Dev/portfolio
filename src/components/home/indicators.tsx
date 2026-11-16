import { useTranslations } from "next-intl";

import { HomeSection } from "@/components/layout/home-section";
import { getHomeIndicators } from "@/lib/home-data";

/**
 * Indicadores (D05): calculados dos dados. Zero itens = o indicador não aparece;
 * sem nenhum indicador, a seção inteira não aparece (nada de números decorativos).
 */
export async function Indicators() {
  const indicators = await getHomeIndicators();
  if (indicators.length === 0) return null;

  return <IndicatorsView indicators={indicators} />;
}

function IndicatorsView({ indicators }: { indicators: { key: string; value: number }[] }) {
  const t = useTranslations("Sections");
  const tStats = useTranslations("Stats");

  return (
    <HomeSection
      id="indicadores"
      aria-labelledby="indicadores-titulo"
      className="mx-auto flex min-h-[60svh] w-full max-w-6xl flex-col justify-center gap-8 px-4 py-16 sm:px-6"
    >
      <h2 id="indicadores-titulo" className="font-display text-4xl sm:text-5xl">
        {t("stats")}
      </h2>
      <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {indicators.map((indicator) => (
          <li key={indicator.key} className="flex flex-col gap-1">
            <span className="font-display text-5xl">{indicator.value}</span>
            <span className="text-sm text-muted-foreground">{tStats(indicator.key)}</span>
          </li>
        ))}
      </ul>
    </HomeSection>
  );
}
