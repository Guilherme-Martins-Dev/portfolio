import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";
import type { HomeSectionId } from "./sections";

/**
 * Seção da Home que é alvo de âncora. O `scroll-margin-top` com a altura do cabeçalho
 * fixo impede que o título fique escondido atrás dele (correção 2 de 08-prototipacao §8.3).
 */
export function HomeSection({
  id,
  className,
  ...props
}: Omit<ComponentProps<"section">, "id"> & { id: HomeSectionId }) {
  return <section id={id} className={cn("scroll-mt-(--header-height)", className)} {...props} />;
}
