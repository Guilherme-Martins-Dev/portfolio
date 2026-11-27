import { z } from "zod";

/**
 * Validação do formulário de contato, compartilhada entre o cliente e a Server Action.
 * As mensagens de erro são chaves de `ContactForm.errors` em src/messages/*.json, não texto.
 */
export const CONTACT_FIELDS = ["name", "email", "message"] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];

export const CONTACT_LIMITS = { name: 100, email: 254, messageMin: 10, message: 5000 } as const;

/** Campo-isca: invisível para pessoas; robôs que preenchem tudo caem nele. */
export const HONEYPOT_FIELD = "website";
/** Nome padrão do campo que o widget do Turnstile cria dentro do formulário. */
export const TURNSTILE_FIELD = "cf-turnstile-response";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "nameRequired").max(CONTACT_LIMITS.name, "nameTooLong"),
  email: z
    .string()
    .trim()
    .min(1, "emailRequired")
    .max(CONTACT_LIMITS.email, "emailInvalid")
    .pipe(z.email("emailInvalid")),
  message: z
    .string()
    .trim()
    .min(1, "messageRequired")
    .min(CONTACT_LIMITS.messageMin, "messageTooShort")
    .max(CONTACT_LIMITS.message, "messageTooLong"),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactErrorKey =
  | "nameRequired"
  | "nameTooLong"
  | "emailRequired"
  | "emailInvalid"
  | "messageRequired"
  | "messageTooShort"
  | "messageTooLong";
export type ContactFieldErrors = Partial<Record<ContactField, ContactErrorKey>>;
export type ContactValues = Record<ContactField, string>;

export type ContactStatus = "idle" | "success" | "invalid" | "captcha" | "rateLimited" | "error" | "unavailable";

export type ContactState = {
  status: ContactStatus;
  fieldErrors?: ContactFieldErrors;
  /** Devolvido nos erros para o React não apagar o que a pessoa digitou (o form é resetado após a action). */
  values?: ContactValues;
};

export const initialContactState: ContactState = { status: "idle" };

const text = (value: FormDataEntryValue | null) => (typeof value === "string" ? value : "");

export function readContactValues(formData: FormData): ContactValues {
  return { name: text(formData.get("name")), email: text(formData.get("email")), message: text(formData.get("message")) };
}

/** Valida os campos; devolve os dados limpos ou o primeiro erro de cada campo. */
export function parseContact(
  values: ContactValues,
): { success: true; data: ContactInput } | { success: false; fieldErrors: ContactFieldErrors } {
  const result = contactSchema.safeParse(values);
  if (result.success) return { success: true, data: result.data };

  const fieldErrors: ContactFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as ContactField;
    fieldErrors[field] ??= issue.message as ContactErrorKey;
  }
  return { success: false, fieldErrors };
}
