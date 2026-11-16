import { getPublicRepos } from "@/lib/github";

type Props = {
  /** Título da seção (traduzido por quem usa o componente). */
  title: string;
  /** Rótulo de acessibilidade para o número de estrelas, ex.: "estrelas". */
  starsLabel: string;
  limit?: number;
};

/**
 * Lista de repositórios públicos. Se a API falhar ou não houver repositórios,
 * a seção inteira não é renderizada (regra: campo vazio não aparece).
 */
export async function GitHubRepos({ title, starsLabel, limit = 6 }: Props) {
  const repos = await getPublicRepos();
  if (!repos || repos.length === 0) return null;

  return (
    <section aria-labelledby="github-repos" className="flex flex-col gap-4">
      <h2 id="github-repos" className="font-display text-3xl">
        {title}
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {repos.slice(0, limit).map((repo) => (
          <li key={repo.name} className="flex flex-col gap-2 rounded-lg border bg-card p-4 text-card-foreground">
            <a href={repo.url} className="font-mono text-sm font-medium text-link hover:underline">
              {repo.name}
            </a>
            {repo.description ? <p className="text-sm text-muted-foreground">{repo.description}</p> : null}
            <p className="mt-auto flex gap-4 font-mono text-xs text-muted-foreground">
              {repo.language ? <span>{repo.language}</span> : null}
              {repo.stars > 0 ? (
                <span>
                  <span aria-hidden="true">★ </span>
                  {repo.stars}
                  <span className="sr-only"> {starsLabel}</span>
                </span>
              ) : null}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
