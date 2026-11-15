import { cacheLife } from "next/cache";
import { z } from "zod";

/**
 * Repositórios públicos do GitHub (issue #13), com revalidação de 1 hora.
 * `GITHUB_TOKEN` é opcional: sem ele a API permite 60 requisições/hora por IP; com um token
 * fine-grained sem nenhuma permissão (só leitura pública) o limite sobe para 5.000/hora.
 */

export const GITHUB_USER = "Guilherme-Martins-Dev";

/** Repositórios que nunca aparecem no site (nome exato). */
// TODO(guilherme): listar os repositórios que não devem aparecer.
export const HIDDEN: readonly string[] = [];

/** Repositórios fixados no topo, nesta ordem (nome exato). */
// TODO(guilherme): escolher de 4 a 6 repositórios para fixar (02-conteudo §2.1).
export const PINNED: readonly string[] = [];

const apiRepoSchema = z.object({
  name: z.string(),
  html_url: z.url(),
  description: z.string().nullable(),
  homepage: z.string().nullable().optional(),
  language: z.string().nullable(),
  topics: z.array(z.string()).optional().default([]),
  stargazers_count: z.number().int().nonnegative(),
  forks_count: z.number().int().nonnegative(),
  fork: z.boolean(),
  archived: z.boolean(),
  private: z.boolean(),
  pushed_at: z.string().nullable(),
});

export type Repo = {
  name: string;
  url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
  pushedAt: string | null;
  pinned: boolean;
};

type FetchOptions = {
  token?: string;
  fetchImpl?: typeof fetch;
  hidden?: readonly string[];
  pinned?: readonly string[];
};

/**
 * Busca e normaliza os repositórios. Lança erro em qualquer falha (rede, status ≠ 200,
 * resposta fora do formato), para que o erro nunca fique em cache.
 */
export async function fetchPublicRepos({
  token,
  fetchImpl = fetch,
  hidden = HIDDEN,
  pinned = PINNED,
}: FetchOptions = {}): Promise<Repo[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const url = `https://api.github.com/users/${GITHUB_USER}/repos?type=owner&sort=pushed&per_page=100`;
  const response = await fetchImpl(url, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API respondeu ${response.status} ${response.statusText}`.trim());
  }

  const data = z.array(apiRepoSchema).parse(await response.json());
  const pinnedOrder = new Map(pinned.map((name, index) => [name, index]));

  return data
    .filter((r) => !r.private && !r.fork && !r.archived && !hidden.includes(r.name))
    .map<Repo>((r) => ({
      name: r.name,
      url: r.html_url,
      description: r.description,
      homepage: r.homepage || null,
      language: r.language,
      topics: r.topics,
      stars: r.stargazers_count,
      forks: r.forks_count,
      pushedAt: r.pushed_at,
      pinned: pinnedOrder.has(r.name),
    }))
    .sort((a, b) => {
      const pa = pinnedOrder.get(a.name) ?? Infinity;
      const pb = pinnedOrder.get(b.name) ?? Infinity;
      if (pa !== pb) return pa - pb;
      return (b.pushedAt ?? "").localeCompare(a.pushedAt ?? "");
    });
}

/**
 * Repositórios para a interface, com cache de 1 hora (perfil "hours" do Next 16).
 * Em caso de falha devolve `null` e a seção some; a página nunca quebra por causa da API.
 * O erro não é lançado dentro do "use cache" (isso derrubaria o prerender): a falha fica
 * em cache só por alguns minutos (perfil "minutes"), para tentar de novo logo.
 */
export async function getPublicRepos(): Promise<Repo[] | null> {
  "use cache";
  try {
    const repos = await fetchPublicRepos({ token: process.env.GITHUB_TOKEN || undefined });
    cacheLife("hours");
    return repos;
  } catch (error) {
    console.warn(`[github] repositórios indisponíveis: ${error instanceof Error ? error.message : String(error)}`);
    cacheLife("minutes");
    return null;
  }
}
