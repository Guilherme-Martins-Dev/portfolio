import { useTranslations } from "next-intl";

import { profile } from "@/content";
import { PageLinks } from "./nav-links";

const linkClass =
  "rounded-sm text-link underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring";

/**
 * Rodapé com as páginas internas e os contatos do perfil.
 * Só aparece o que estiver preenchido em src/content/profile.ts (D08: campo vazio não aparece).
 */
export function SiteFooter() {
  const t = useTranslations("Layout");
  // TODO(guilherme): preencher e-mail, GitHub e LinkedIn em src/content/profile.ts para aparecerem aqui.
  const contacts = [
    profile.links.github && { label: "GitHub", href: profile.links.github, external: true },
    profile.links.linkedin && { label: "LinkedIn", href: profile.links.linkedin, external: true },
    profile.email && { label: profile.email, href: `mailto:${profile.email}`, external: false },
  ].filter((item) => !!item);

  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:justify-between">
        <p className="font-display text-2xl">{profile.name}</p>

        <nav aria-label={t("pages")}>
          <PageLinks className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm" />
        </nav>

        {contacts.length > 0 && (
          <ul aria-label={t("contacts")} className="flex flex-col gap-2 text-sm">
            {contacts.map((contact) => (
              <li key={contact.href}>
                <a
                  href={contact.href}
                  className={linkClass}
                  {...(contact.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {contact.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  );
}
