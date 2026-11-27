import { useTranslations } from "next-intl";

import { PageContainer, PageHeader } from "@/components/layout/page-header";
import { profile } from "@/content";
import { getContactConfig } from "@/features/contact/config";
import { ContactForm } from "@/features/contact/contact-form";
import { CopyEmail } from "@/features/contact/copy-email";
import { getContactLinks } from "@/lib/home-data";
import { pageMetadata } from "@/lib/page-metadata";

export const generateMetadata = () => pageMetadata("ContactPage", "/contato");

/**
 * /contato (/en/contact): e-mail como texto selecionável + botão copiar, LinkedIn e GitHub.
 * Só aparece o que estiver em src/content/profile.ts (D08). O formulário (#26, P03) só aparece
 * quando RESEND_API_KEY, CONTACT_TO_EMAIL e as chaves do Turnstile estão definidas.
 */
export default function ContactPage() {
  const t = useTranslations("ContactPage");
  // TODO(guilherme): preencher e-mail, LinkedIn e GitHub em src/content/profile.ts para aparecerem aqui.
  const profiles = getContactLinks().filter((link) => link.kind !== "email");
  const contactForm = getContactConfig();
  const hasChannels = !!profile.email || profiles.length > 0 || !!contactForm;

  return (
    <PageContainer>
      <PageHeader title={t("title")} lead={t("lead")} />

      {profile.email && (
        <section aria-labelledby="contato-email" className="flex flex-col gap-4">
          <h2 id="contato-email" className="font-display text-3xl">
            {t("email")}
          </h2>
          <CopyEmail
            email={profile.email}
            labels={{ copy: t("copy"), copied: t("copied"), copyFailed: t("copyFailed") }}
          />
        </section>
      )}

      {profiles.length > 0 && (
        <section aria-labelledby="contato-perfis" className="flex flex-col gap-4">
          <h2 id="contato-perfis" className="font-display text-3xl">
            {t("profiles")}
          </h2>
          <ul className="flex flex-wrap gap-3">
            {profiles.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-contact-profile={link.kind}
                  className="inline-flex rounded-md border border-border px-5 py-2.5 outline-none transition-colors hover:border-ring focus-visible:ring-[3px] focus-visible:ring-ring"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {contactForm && (
        <section aria-labelledby="contato-formulario" className="flex flex-col gap-4">
          <h2 id="contato-formulario" className="font-display text-3xl">
            {t("form")}
          </h2>
          <p className="text-muted-foreground">{t("formLead")}</p>
          <ContactForm siteKey={contactForm.turnstileSiteKey} />
        </section>
      )}

      {!hasChannels && <p className="text-muted-foreground">{t("empty")}</p>}
    </PageContainer>
  );
}
