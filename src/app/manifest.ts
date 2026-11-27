import type { MetadataRoute } from "next";

/**
 * /manifest.webmanifest (#24). Cores da paleta-base (D10): #0B132B no fundo.
 * TODO(guilherme): os ícones entram quando a logomarca final (#2) estiver em public/brand/.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Guilherme Martins Bezerra",
    short_name: "Guilherme Martins",
    description: "Portfólio de Guilherme Martins Bezerra: projetos, experiência, eventos e estudos.",
    start_url: "/",
    display: "browser",
    lang: "pt-BR",
    background_color: "#0B132B",
    theme_color: "#0B132B",
  };
}
