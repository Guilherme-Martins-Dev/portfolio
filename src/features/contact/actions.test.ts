import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

let requestHeaders = new Headers();
vi.mock("next/headers", () => ({ headers: async () => requestHeaders }));

import { sendContactMessage } from "./actions";
import { initialContactState } from "./contact-schema";

const turnstile = vi.fn<typeof fetch>();
let ipCounter = 0;

function form(overrides: Record<string, string> = {}) {
  const data = new FormData();
  const fields = {
    name: "Pessoa Teste",
    email: "pessoa@exemplo.com",
    message: "Olá! Gostaria de conversar sobre um projeto.",
    "cf-turnstile-response": "token-valido",
    locale: "pt",
    ...overrides,
  };
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

const submit = (data: FormData) => sendContactMessage(initialContactState, data);

describe("sendContactMessage (Server Action)", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "re_teste");
    vi.stubEnv("CONTACT_TO_EMAIL", "destino@exemplo.com");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site-key");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret-key");
    vi.stubEnv("CONTACT_FROM_EMAIL", "");
    vi.stubGlobal("fetch", turnstile);
    turnstile.mockImplementation(async () => Response.json({ success: true }));
    send.mockResolvedValue({ data: { id: "email-1" }, error: null });
    // Um IP diferente por teste, para o rate limit de um teste não vazar para o outro.
    requestHeaders = new Headers({ "x-forwarded-for": `203.0.113.${++ipCounter}, 10.0.0.1` });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    send.mockReset();
    turnstile.mockReset();
  });

  it("envia pelo Resend com replyTo da pessoa depois de validar o Turnstile no servidor", async () => {
    expect(await submit(form())).toEqual({ status: "success" });

    expect(turnstile).toHaveBeenCalledOnce();
    const [url, init] = turnstile.mock.calls[0];
    expect(url).toBe("https://challenges.cloudflare.com/turnstile/v0/siteverify");
    const body = init?.body as URLSearchParams;
    expect(body.get("secret")).toBe("secret-key");
    expect(body.get("response")).toBe("token-valido");
    expect(body.get("remoteip")).toBe(`203.0.113.${ipCounter}`);

    expect(send).toHaveBeenCalledOnce();
    const email = send.mock.calls[0][0];
    expect(email).toMatchObject({
      from: "Portfólio <onboarding@resend.dev>",
      to: "destino@exemplo.com",
      replyTo: "pessoa@exemplo.com",
      subject: "Portfólio: mensagem de Pessoa Teste",
    });
    expect(email.react).toBeTruthy();
  });

  it("usa CONTACT_FROM_EMAIL quando definido", async () => {
    vi.stubEnv("CONTACT_FROM_EMAIL", "Portfólio <contato@exemplo.com>");
    await submit(form());
    expect(send.mock.calls[0][0].from).toBe("Portfólio <contato@exemplo.com>");
  });

  it("recusa sem as variáveis de ambiente, sem chamar Turnstile nem Resend", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    expect(await submit(form())).toEqual({ status: "unavailable" });
    expect(turnstile).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it("devolve os erros de cada campo e mantém o que foi digitado", async () => {
    const result = await submit(form({ name: "  ", email: "invalido", message: "curta" }));
    expect(result.status).toBe("invalid");
    expect(result.fieldErrors).toEqual({ name: "nameRequired", email: "emailInvalid", message: "messageTooShort" });
    expect(result.values).toEqual({ name: "  ", email: "invalido", message: "curta" });
    expect(send).not.toHaveBeenCalled();
  });

  it("finge sucesso e não envia nada quando o honeypot vem preenchido", async () => {
    expect(await submit(form({ website: "https://spam.example" }))).toEqual({ status: "success" });
    expect(turnstile).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it("não envia quando o Turnstile reprova, falha ou o token falta", async () => {
    turnstile.mockResolvedValueOnce(Response.json({ success: false, "error-codes": ["invalid-input-response"] }));
    expect((await submit(form())).status).toBe("captcha");

    turnstile.mockRejectedValueOnce(new Error("rede"));
    expect((await submit(form())).status).toBe("captcha");

    turnstile.mockClear();
    expect((await submit(form({ "cf-turnstile-response": "" }))).status).toBe("captcha");
    expect(turnstile).not.toHaveBeenCalled();

    expect(send).not.toHaveBeenCalled();
  });

  it("limita a 5 envios por IP em 10 minutos", async () => {
    for (let i = 0; i < 5; i++) expect((await submit(form())).status).toBe("success");
    expect((await submit(form())).status).toBe("rateLimited");
    expect(send).toHaveBeenCalledTimes(5);

    requestHeaders = new Headers({ "x-forwarded-for": "198.51.100.7" });
    expect((await submit(form())).status).toBe("success");
  });

  it("devolve erro (com os valores) quando o Resend recusa ou lança exceção", async () => {
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
    send.mockResolvedValueOnce({ data: null, error: { name: "validation_error", message: "x", statusCode: 422 } });
    const refused = await submit(form());
    expect(refused.status).toBe("error");
    expect(refused.values?.email).toBe("pessoa@exemplo.com");

    send.mockRejectedValueOnce(new Error("timeout"));
    expect((await submit(form())).status).toBe("error");
    expect(errorLog.mock.calls.flat().join(" ")).not.toContain("Gostaria de conversar");
    errorLog.mockRestore();
  });
});
