"use server";

import { headers } from "next/headers";
import { Resend } from "resend";

import { routing } from "@/i18n/routing";

import { getContactConfig } from "./config";
import { ContactEmail } from "./contact-email";
import {
  HONEYPOT_FIELD,
  parseContact,
  readContactValues,
  TURNSTILE_FIELD,
  type ContactState,
} from "./contact-schema";
import { contactRateLimit } from "./rate-limit";
import { verifyTurnstile } from "./turnstile";

async function clientIp(): Promise<string | undefined> {
  const list = await headers();
  return list.get("x-forwarded-for")?.split(",")[0]?.trim() || list.get("x-real-ip")?.trim() || undefined;
}

/**
 * Server Action do formulário de contato (#26), usada com `useActionState`.
 * Ordem: configuração → honeypot → validação Zod → rate limit por IP → Turnstile → Resend.
 */
export async function sendContactMessage(_previous: ContactState, formData: FormData): Promise<ContactState> {
  const config = getContactConfig();
  if (!config) return { status: "unavailable" };

  // Robô preencheu o campo-isca: finge sucesso para não dar pista, e não envia nada.
  const honeypot = formData.get(HONEYPOT_FIELD);
  if (typeof honeypot === "string" && honeypot.trim() !== "") return { status: "success" };

  const values = readContactValues(formData);
  const parsed = parseContact(values);
  if (!parsed.success) return { status: "invalid", fieldErrors: parsed.fieldErrors, values };

  const ip = await clientIp();
  if (!contactRateLimit.check(ip ?? "unknown")) return { status: "rateLimited", values };

  const token = formData.get(TURNSTILE_FIELD);
  const human = await verifyTurnstile(typeof token === "string" ? token : "", config.turnstileSecretKey, ip);
  if (!human) return { status: "captcha", values };

  const rawLocale = formData.get("locale");
  const locale = routing.locales.find((item) => item === rawLocale) ?? routing.defaultLocale;
  const { name, email, message } = parsed.data;

  try {
    const resend = new Resend(config.resendApiKey);
    const { error } = await resend.emails.send({
      from: config.from,
      to: config.to,
      replyTo: email,
      subject: `Portfólio: mensagem de ${name}`,
      react: ContactEmail({ name, email, message, locale }),
    });
    if (error) {
      // Só o tipo do erro vai para o log; o conteúdo da mensagem não.
      console.error("[contato] Resend recusou o envio:", error.name);
      return { status: "error", values };
    }
  } catch (cause) {
    console.error("[contato] falha ao chamar o Resend:", cause instanceof Error ? cause.name : "desconhecida");
    return { status: "error", values };
  }

  return { status: "success" };
}
