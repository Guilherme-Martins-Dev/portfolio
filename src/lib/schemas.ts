import { z } from "zod";

/**
 * Schemas do conteúdo do site (decisões D05, D08 e D21).
 * Regra: só fatos reais. Campo desconhecido fica ausente (opcional) e não aparece na interface;
 * o que falta é marcado com TODO(guilherme) no arquivo de dados.
 */

/** Texto com versão em português e em inglês. */
export const localizedText = z.object({
  pt: z.string().trim().min(1),
  en: z.string().trim().min(1),
});
export type LocalizedText = z.infer<typeof localizedText>;

/** Data parcial em ISO: "2026", "2026-11" ou "2026-11-15". */
export const isoDate = z
  .string()
  .regex(/^\d{4}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?)?$/, "use AAAA, AAAA-MM ou AAAA-MM-DD");

const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "use letras minúsculas, números e hífens");

const links = z
  .object({
    repository: z.url().optional(),
    demo: z.url().optional(),
    devpost: z.url().optional(),
    photos: z.url().optional(),
    certificate: z.url().optional(),
  })
  .strict();

export const technologyAreas = ["frontend", "backend", "ia", "3d", "hardware", "integracao", "ferramentas"] as const;
export const technologyArea = z.enum(technologyAreas);
export type TechnologyArea = z.infer<typeof technologyArea>;

export const technologySchema = z
  .object({
    id: slug,
    name: z.string().trim().min(1),
    area: technologyArea,
  })
  .strict();
export type Technology = z.infer<typeof technologySchema>;

export const projectStatus = z.enum(["concluido", "em-desenvolvimento", "planejamento"]);
export type ProjectStatus = z.infer<typeof projectStatus>;

export const projectSchema = z
  .object({
    slug,
    title: z.string().trim().min(1),
    summary: localizedText,
    status: projectStatus,
    /** Aparece em destaque na Home (de 3 a 4 projetos, ver 02-conteudo §2.3). */
    featured: z.boolean(),
    /** Repositório privado ou trabalho para cliente: mostrar arquitetura e imagens, sem código. */
    confidential: z.boolean().default(false),
    technologies: z.array(slug).default([]),
    teamSize: z.number().int().positive().optional(),
    start: isoDate.optional(),
    end: isoDate.optional(),
    links: links.default({}),
  })
  .strict();
export type Project = z.infer<typeof projectSchema>;

export const eventRole = z.enum(["participante", "organizador", "palestrante", "mentor", "apoio-tecnico"]);
export type EventRole = z.infer<typeof eventRole>;

export const eventSchema = z
  .object({
    id: slug,
    name: z.string().trim().min(1),
    role: eventRole,
    date: isoDate.optional(),
    /** Cidade/instituição ou "online". */
    location: z.string().trim().min(1).optional(),
    description: localizedText.optional(),
    links: links.default({}),
    relatedProject: slug.optional(),
  })
  .strict();
export type PortfolioEvent = z.infer<typeof eventSchema>;

export const experienceSchema = z
  .object({
    id: slug,
    organization: z.string().trim().min(1),
    role: localizedText,
    start: isoDate,
    end: isoDate.optional(),
    description: localizedText.optional(),
    technologies: z.array(slug).default([]),
  })
  .strict();
export type Experience = z.infer<typeof experienceSchema>;

export const profileSchema = z
  .object({
    name: z.string().trim().min(1),
    headline: localizedText.optional(),
    bio: localizedText.optional(),
    location: z.string().trim().min(1).optional(),
    email: z.email().optional(),
    links: z
      .object({
        github: z.url().optional(),
        linkedin: z.url().optional(),
      })
      .strict()
      .default({}),
  })
  .strict();
export type Profile = z.infer<typeof profileSchema>;

/**
 * Valida uma coleção e falha com uma mensagem legível (arquivo, item e campo).
 * Roda quando o módulo de conteúdo é importado, inclusive no `pnpm build` (scripts/check-content.ts).
 */
export function defineCollection<T extends z.ZodType>(name: string, schema: T, data: unknown): z.output<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Conteúdo inválido em src/content/${name}.ts:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
