import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { copyText, CopyEmail } from "./copy-email";

const labels = { copy: "Copiar e-mail", copied: "E-mail copiado", copyFailed: "Não foi possível copiar." };

describe("CopyEmail", () => {
  it("renderiza o e-mail como texto selecionável com mailto e o botão de copiar, sem depender de JavaScript", () => {
    const html = renderToStaticMarkup(<CopyEmail email="pessoa@exemplo.com" labels={labels} />);
    expect(html).toMatch(/<a[^>]*href="mailto:pessoa@exemplo.com"[^>]*class="[^"]*select-all[^"]*"[^>]*>pessoa@exemplo.com<\/a>/);
    expect(html).toMatch(/<button[^>]*type="button"[^>]*>[\s\S]*Copiar e-mail<\/button>/);
    expect(html).toMatch(/role="status"[^>]*aria-live="polite"/);
  });
});

describe("copyText", () => {
  it("copia o texto e devolve copied", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    expect(await copyText("pessoa@exemplo.com", { writeText })).toBe("copied");
    expect(writeText).toHaveBeenCalledWith("pessoa@exemplo.com");
  });

  it("devolve failed quando a permissão é negada ou a API não existe", async () => {
    const writeText = vi.fn().mockRejectedValue(new DOMException("negado", "NotAllowedError"));
    expect(await copyText("pessoa@exemplo.com", { writeText })).toBe("failed");
    expect(await copyText("pessoa@exemplo.com", undefined)).toBe("failed");
  });
});
