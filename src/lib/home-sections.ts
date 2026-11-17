import type { EventRole, Experience, LocalizedText, PortfolioEvent, Profile, Project, Technology } from "./schemas";
import { parsePartialDate } from "./stats";

/**
 * Dados das seções Projetos, Trajetória/Eventos e Contato da Home (#16).
 * Funções puras: recebem as coleções de src/content e devolvem o que a interface mostra.
 */

/** No máximo 4 projetos em destaque na Home (02-conteudo §2.3, storyboard §4). */
export const MAX_FEATURED = 4;

export type HomeProjects = {
  /** Projetos em destaque já concluídos. */
  completed: Project[];
  /** Subseção "Em desenvolvimento" (D06): em desenvolvimento ou em planejamento. */
  inProgress: Project[];
};

/** Separa os projetos com `featured: true` entre concluídos e "Em desenvolvimento", na ordem do cadastro. */
export function splitFeaturedProjects(projects: Project[]): HomeProjects {
  const featured = projects.filter((p) => p.featured).slice(0, MAX_FEATURED);
  return {
    completed: featured.filter((p) => p.status === "concluido"),
    inProgress: featured.filter((p) => p.status !== "concluido"),
  };
}

/** Nomes das tecnologias de um projeto, na ordem em que foram cadastradas no projeto. */
export function technologyNames(ids: string[], technologies: Technology[]): string[] {
  const byId = new Map(technologies.map((t) => [t.id, t.name]));
  return ids.flatMap((id) => {
    const name = byId.get(id);
    return name ? [name] : [];
  });
}

export type TimelineItem =
  | {
      kind: "experience";
      id: string;
      /** Data de ordenação e do `<time>`: início da experiência. */
      date: string;
      end?: string;
      title: LocalizedText;
      organization: string;
      description?: LocalizedText;
    }
  | {
      kind: "event";
      id: string;
      date: string;
      title: string;
      role: EventRole;
      location?: string;
      description?: LocalizedText;
    };

/**
 * Linha do tempo com experiências e eventos, do mais recente para o mais antigo.
 * A experiência entra pela data de início; evento sem data não entra (storyboard §6).
 * Empate de data: experiência em andamento primeiro, depois a ordem do cadastro (sort estável).
 */
export function buildTimeline(input: { experience: Experience[]; events: PortfolioEvent[] }): TimelineItem[] {
  const items: TimelineItem[] = [
    ...input.experience.map(
      (e): TimelineItem => ({
        kind: "experience",
        id: `experience-${e.id}`,
        date: e.start,
        end: e.end,
        title: e.role,
        organization: e.organization,
        description: e.description,
      }),
    ),
    ...input.events.flatMap((e): TimelineItem[] =>
      e.date
        ? [
            {
              kind: "event",
              id: `event-${e.id}`,
              date: e.date,
              title: e.name,
              role: e.role,
              location: e.location,
              description: e.description,
            },
          ]
        : [],
    ),
  ];

  const ongoing = (item: TimelineItem) => (item.kind === "experience" && !item.end ? 1 : 0);
  return items.sort(
    (a, b) => parsePartialDate(b.date).getTime() - parsePartialDate(a.date).getTime() || ongoing(b) - ongoing(a),
  );
}

const intlLocale = { pt: "pt-BR", en: "en" } as const;

/** Formata "AAAA", "AAAA-MM" ou "AAAA-MM-DD" só com a precisão que o dado tem. */
export function formatPartialDate(value: string, locale: "pt" | "en"): string {
  const parts = value.split("-").length;
  if (parts === 1) return value;
  const options: Intl.DateTimeFormatOptions =
    parts === 2 ? { month: "short", year: "numeric" } : { day: "numeric", month: "short", year: "numeric" };
  return new Intl.DateTimeFormat(intlLocale[locale], { ...options, timeZone: "UTC" }).format(parsePartialDate(value));
}

export type ContactLink = { kind: "email" | "linkedin" | "github"; label: string; href: string; external: boolean };

/** Contatos do perfil, na ordem e-mail → LinkedIn → GitHub. Só entra o que estiver preenchido (D08). */
export function contactLinks(profile: Pick<Profile, "email" | "links">): ContactLink[] {
  const links: Array<ContactLink | undefined> = [
    profile.email ? { kind: "email", label: profile.email, href: `mailto:${profile.email}`, external: false } : undefined,
    profile.links.linkedin ? { kind: "linkedin", label: "LinkedIn", href: profile.links.linkedin, external: true } : undefined,
    profile.links.github ? { kind: "github", label: "GitHub", href: profile.links.github, external: true } : undefined,
  ];
  return links.filter((link): link is ContactLink => !!link);
}
