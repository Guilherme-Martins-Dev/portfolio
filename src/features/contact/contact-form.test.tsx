import { NextIntlClientProvider } from "next-intl";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import en from "@/messages/en.json";
import pt from "@/messages/pt.json";

vi.mock("./actions", () => ({ sendContactMessage: vi.fn() }));

import { ContactEmail } from "./contact-email";
import { ContactForm } from "./contact-form";

const render = (locale: "pt" | "en") =>
  renderToStaticMarkup(
    <NextIntlClientProvider locale={locale} messages={locale === "pt" ? pt : en}>
      <ContactForm siteKey="site-key" />
    </NextIntlClientProvider>,
  );

describe("ContactForm", () => {
  it("renderiza campos rotulados, honeypot fora do foco e região de status, nos dois idiomas", () => {
    const html = render("pt");
    expect(html).toContain('<label for="contato-name"');
    expect(html).toMatch(/<input[^>]*type="email"[^>]*autoComplete="email"|<input[^>]*autoComplete="email"[^>]*type="email"/i);
    expect(html).toMatch(/<textarea[^>]*name="message"/);
    expect(html).toMatch(/<input[^>]*name="website"[^>]*tabindex="-1"|<input[^>]*tabindex="-1"[^>]*name="website"/i);
    expect(html).toMatch(/role="status"[^>]*aria-live="polite"/);
    expect(html).toContain("Enviar mensagem");
    expect(html).toContain('name="locale" value="pt"');

    expect(render("en")).toContain("Send message");
  });

  it("as mensagens de erro e status existem nos dois idiomas", () => {
    expect(Object.keys(en.ContactForm.errors)).toEqual(Object.keys(pt.ContactForm.errors));
    expect(Object.keys(en.ContactForm.status)).toEqual(Object.keys(pt.ContactForm.status));
  });
});

describe("ContactEmail", () => {
  it("monta o e-mail com nome, endereço e mensagem", () => {
    const html = renderToStaticMarkup(
      <ContactEmail name="Pessoa" email="pessoa@exemplo.com" message={"Linha 1\nLinha 2"} locale="en" />,
    );
    expect(html).toContain("Pessoa");
    expect(html).toContain('href="mailto:pessoa@exemplo.com"');
    expect(html).toContain("Linha 1\nLinha 2");
  });
});
