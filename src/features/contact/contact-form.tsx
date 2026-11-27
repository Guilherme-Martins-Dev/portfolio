"use client";

import { Send } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useActionState, useCallback, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { htmlLang } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import { sendContactMessage } from "./actions";
import {
  CONTACT_FIELDS,
  CONTACT_LIMITS,
  HONEYPOT_FIELD,
  initialContactState,
  parseContact,
  readContactValues,
  TURNSTILE_FIELD,
  type ContactField,
  type ContactFieldErrors,
} from "./contact-schema";
import { TurnstileWidget } from "./turnstile-widget";

const fieldClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/60 aria-invalid:border-destructive";

/**
 * Formulário de contato (#26): `useActionState` + Server Action, validação Zod no cliente (antes de enviar)
 * e no servidor, Turnstile e honeypot. Só é renderizado quando getContactConfig() existe.
 */
export function ContactForm({ siteKey }: { siteKey: string }) {
  const t = useTranslations("ContactForm");
  const locale = useLocale();
  const [state, formAction, pending] = useActionState(sendContactMessage, initialContactState);
  const [clientErrors, setClientErrors] = useState<ContactFieldErrors | null>(null);
  const [captchaMissing, setCaptchaMissing] = useState(false);
  const [widgetFailed, setWidgetFailed] = useState(false);
  const onWidgetError = useCallback(() => setWidgetFailed(true), []);

  const errors = clientErrors ?? state.fieldErrors ?? {};
  const values = state.status === "success" ? undefined : state.values;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const parsed = parseContact(readContactValues(formData));
    const hasToken = !!formData.get(TURNSTILE_FIELD);

    if (!parsed.success || !hasToken) {
      event.preventDefault();
      setClientErrors(parsed.success ? null : parsed.fieldErrors);
      setCaptchaMissing(!hasToken);
      if (!parsed.success) {
        const first = CONTACT_FIELDS.find((field) => parsed.fieldErrors[field]);
        if (first) event.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      }
      return;
    }
    setClientErrors(null);
    setCaptchaMissing(false);
  }

  // Prioridade: o que acabou de acontecer no clique > resposta do servidor > aviso de widget que não carregou.
  const serverStatus = state.status === "idle" || state.status === "invalid" ? null : state.status;
  const statusMessage = captchaMissing
    ? t("status.captchaMissing")
    : serverStatus
      ? t(`status.${serverStatus}`)
      : widgetFailed
        ? t("status.widgetFailed")
        : "";
  const statusTone = !captchaMissing && serverStatus === "success" ? "success" : "error";

  const field = (name: ContactField, input: (props: Record<string, unknown>) => React.ReactNode) => {
    const error = errors[name];
    const errorId = `contato-${name}-erro`;
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={`contato-${name}`} className="text-sm font-medium">
          {t(`fields.${name}`)}
        </label>
        {input({
          id: `contato-${name}`,
          name,
          required: true,
          defaultValue: values?.[name],
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? errorId : undefined,
          className: fieldClass,
        })}
        {error && (
          <p id={errorId} className="text-sm text-destructive">
            {t(`errors.${error}`, { min: CONTACT_LIMITS.messageMin })}
          </p>
        )}
      </div>
    );
  };

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate className="flex max-w-xl flex-col gap-5" data-contact-form>
      <input type="hidden" name="locale" value={locale} />

      {field("name", (props) => <input type="text" autoComplete="name" maxLength={CONTACT_LIMITS.name} {...props} />)}
      {field("email", (props) => (
        <input type="email" autoComplete="email" inputMode="email" maxLength={CONTACT_LIMITS.email} {...props} />
      ))}
      {field("message", (props) => <textarea rows={6} maxLength={CONTACT_LIMITS.message} {...props} />)}

      {/* Honeypot: fora da tela e fora da ordem de foco; uma pessoa nunca preenche. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`contato-${HONEYPOT_FIELD}`}>{t("honeypot")}</label>
        <input id={`contato-${HONEYPOT_FIELD}`} type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </div>

      <TurnstileWidget
        siteKey={siteKey}
        language={htmlLang[locale as keyof typeof htmlLang] ?? locale}
        resetKey={state}
        onError={onWidgetError}
      />

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={pending}>
          <Send aria-hidden />
          {pending ? t("sending") : t("submit")}
        </Button>
      </div>

      <p
        role="status"
        aria-live="polite"
        data-contact-status={state.status}
        className={cn("min-h-5 text-sm", statusTone === "success" ? "text-foreground" : "text-destructive")}
      >
        {statusMessage}
      </p>
    </form>
  );
}
