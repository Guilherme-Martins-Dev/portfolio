/**
 * Seções da Home com âncora. Os ids são os mesmos nos dois idiomas (#inicio, #sobre...):
 * assim um link compartilhado continua válido ao trocar de idioma e o seletor PT/EN
 * não precisa traduzir o hash. Ver docs/storyboard.md §0.4.
 *
 * `label` é a chave em `Sections` dos arquivos de mensagens. `inMenu` diz se a seção
 * aparece no menu principal (Início fica na marca; Indicadores não tem entrada própria).
 */
export const HOME_SECTIONS = [
  { id: "inicio", label: "home", inMenu: false },
  { id: "sobre", label: "about", inMenu: true },
  { id: "indicadores", label: "stats", inMenu: false },
  { id: "projetos", label: "projects", inMenu: true },
  { id: "trajetoria", label: "journey", inMenu: true },
  { id: "contato", label: "contact", inMenu: true },
] as const;

export type HomeSectionId = (typeof HOME_SECTIONS)[number]["id"];

export const MENU_SECTIONS = HOME_SECTIONS.filter((section) => section.inMenu);

/** Páginas internas (rotas de src/i18n/routing.ts) listadas no menu do celular e no rodapé. */
export const SITE_PAGES = [
  { pathname: "/sobre", label: "about" },
  { pathname: "/experiencia", label: "experience" },
  { pathname: "/projetos", label: "projects" },
  { pathname: "/eventos", label: "events" },
  { pathname: "/estudos", label: "studies" },
  { pathname: "/contato", label: "contact" },
] as const;

/** id do <main>, alvo do link "Pular para o conteúdo". */
export const MAIN_CONTENT_ID = "conteudo";
