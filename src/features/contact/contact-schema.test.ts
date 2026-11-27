import { describe, expect, it } from "vitest";

import { parseContact } from "./contact-schema";
import { createRateLimiter } from "./rate-limit";

const valid = { name: "Pessoa", email: "pessoa@exemplo.com", message: "Uma mensagem de teste." };

describe("parseContact", () => {
  it("aceita e limpa espaços", () => {
    expect(parseContact({ name: "  Pessoa ", email: " pessoa@exemplo.com ", message: valid.message })).toEqual({
      success: true,
      data: valid,
    });
  });

  it("devolve uma chave de erro por campo", () => {
    expect(parseContact({ name: "", email: "", message: "" })).toEqual({
      success: false,
      fieldErrors: { name: "nameRequired", email: "emailRequired", message: "messageRequired" },
    });
    expect(parseContact({ ...valid, name: "a".repeat(101), message: "b".repeat(5001) })).toEqual({
      success: false,
      fieldErrors: { name: "nameTooLong", message: "messageTooLong" },
    });
    expect(parseContact({ ...valid, email: "sem-arroba" })).toMatchObject({ fieldErrors: { email: "emailInvalid" } });
  });
});

describe("createRateLimiter", () => {
  it("bloqueia acima do limite e libera quando a janela passa", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(limiter.check("ip", 0)).toBe(true);
    expect(limiter.check("ip", 10)).toBe(true);
    expect(limiter.check("ip", 20)).toBe(false);
    expect(limiter.check("outro", 20)).toBe(true);
    expect(limiter.check("ip", 1001)).toBe(true);
  });
});
