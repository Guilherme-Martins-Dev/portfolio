import { useTranslations } from "next-intl";

import { HomeSection } from "@/components/layout/home-section";
import { getContactLinks } from "@/lib/home-data";
import { cn } from "@/lib/utils";

/**
 * Chamada de contato (storyboard §7): só links reais do perfil. O formulário depende da P03/#26.
 * O primeiro canal (e-mail, se houver) é o CTA principal; link sem valor cadastrado não aparece.
 */
export function Contact() {
  const t = useTranslations("Sections");
  const tContact = useTranslations("Contact");
  // TODO(guilherme): preencher e-mail, LinkedIn e GitHub em src/content/profile.ts para aparecerem aqui.
  const links = getContactLinks();

  return (
    <HomeSection
      id="contact"
      aria-labelledby="contact-titulo"
      className="mx-auto flex min-h-[80svh] w-full max-w-6xl flex-col justify-center gap-6 px-4 py-16 sm:px-6"
    >
      <h2 id="contact-titulo" className="font-display text-4xl sm:text-5xl">
        {t("contact")}
      </h2>
      <p className="max-w-xl text-lg text-muted-foreground">{tContact("lead")}</p>
      {links.length > 0 && (
        <ul aria-label={tContact("channels")} className="flex flex-wrap gap-3">
          {links.map((link, index) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  "inline-flex rounded-md px-5 py-2.5 outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring",
                  index === 0 ? "bg-primary text-primary-foreground" : "border border-border hover:border-ring",
                )}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </HomeSection>
  );
}
