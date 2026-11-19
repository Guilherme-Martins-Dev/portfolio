import { useTranslations } from "next-intl";

import { getHomeIndicators } from "@/lib/home-data";

/**
 * Indicadores (D05): calculados dos dados, em faixa dentro de #about. Zero itens = o indicador não aparece;
 * sem nenhum indicador, a faixa inteira não aparece (nada de números decorativos).
 */
export async function Indicators() {
  const indicators = await getHomeIndicators();
  if (indicators.length === 0) return null;

  return <IndicatorsView indicators={indicators} />;
}

function IndicatorsView({ indicators }: { indicators: { key: string; value: number }[] }) {
  const t = useTranslations("About");
  const tStats = useTranslations("Stats");

  return (
    <div className="flex flex-col gap-4">
      <h3 id="about-indicadores" className="font-mono text-sm uppercase tracking-wide text-muted-foreground">
        {t("stats")}
      </h3>
      <ul aria-labelledby="about-indicadores" className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {indicators.map((indicator) => (
          <li key={indicator.key} className="flex flex-col gap-1">
            <span className="font-display text-5xl">{indicator.value}</span>
            <span className="text-sm text-muted-foreground">{tStats(indicator.key)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
