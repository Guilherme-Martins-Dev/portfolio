import { formatPartialDate } from "@/lib/home-sections";

type Props = {
  start?: string;
  end?: string;
  locale: "pt" | "en";
  /** Texto para o fim em aberto ("atual", "em andamento"); só aparece quando há início e não há fim. */
  ongoingLabel: string;
};

/** Período com `<time>`: "mar. 2024 – atual", "2021 – dez. 2024" ou uma data só. Sem datas, não renderiza. */
export function DateRange({ start, end, locale, ongoingLabel }: Props) {
  if (!start && !end) return null;
  const time = (value: string) => <time dateTime={value}>{formatPartialDate(value, locale)}</time>;

  // Data única (evento, certificado sem início): `start` ausente ou igual a `end`.
  if (!start || start === end) return <span>{time((end ?? start)!)}</span>;
  return (
    <span>
      {time(start)}
      {" – "}
      {end ? time(end) : ongoingLabel}
    </span>
  );
}
