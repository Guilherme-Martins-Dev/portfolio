/**
 * Seções da Home com âncora (briefing, fase 0). Os ids são os mesmos nos dois idiomas (#hero, #about...):
 * assim um link compartilhado continua válido ao trocar de idioma e o seletor PT/EN
 * não precisa traduzir o hash. Ver docs/storyboard.md §0.4.
 *
 * `label` é a chave em `Sections` dos arquivos de mensagens. `inMenu` diz se a seção
 * aparece no menu principal (o Hero fica na marca). Os indicadores são uma faixa dentro de #about.
 */
export const HOME_SECTIONS = [
  { id: "hero", label: "home", inMenu: false },
  { id: "about", label: "about", inMenu: true },
  { id: "experience", label: "experience", inMenu: true },
  { id: "projects", label: "projects", inMenu: true },
  { id: "events", label: "events", inMenu: true },
  { id: "contact", label: "contact", inMenu: true },
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
