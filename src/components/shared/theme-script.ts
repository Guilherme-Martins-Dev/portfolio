/** Chave do localStorage com a escolha manual ("light" | "dark"). Sem valor, segue o sistema. */
export const THEME_STORAGE_KEY = "theme";

/**
 * Script inline que roda no <head> antes do primeiro paint (sem flash de tema).
 * Usa a escolha salva ou, na falta dela, `prefers-color-scheme`, e continua seguindo
 * o sistema enquanto não houver escolha manual.
 * Ver node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
 */
export const themeScript = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)},d=document.documentElement,m=window.matchMedia("(prefers-color-scheme: dark)");function a(){var t=localStorage.getItem(k);d.setAttribute("data-theme",t==="light"||t==="dark"?t:(m.matches?"dark":"light"))}a();m.addEventListener("change",function(){if(!localStorage.getItem(k))a()})}catch(e){}})()`;
