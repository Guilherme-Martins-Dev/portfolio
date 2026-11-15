import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const getPublicRepos = vi.fn();
vi.mock("@/lib/github", () => ({ getPublicRepos: () => getPublicRepos() }));

import { GitHubRepos } from "./github-repos";

const render = async () => {
  const element = await GitHubRepos({ title: "Repositórios", starsLabel: "estrelas" });
  return element ? renderToStaticMarkup(element) : null;
};

describe("GitHubRepos", () => {
  afterEach(() => getPublicRepos.mockReset());

  it("some quando a API falha", async () => {
    getPublicRepos.mockResolvedValue(null);
    expect(await render()).toBeNull();
  });

  it("some quando não há repositórios", async () => {
    getPublicRepos.mockResolvedValue([]);
    expect(await render()).toBeNull();
  });

  it("lista os repositórios com link, linguagem e estrelas", async () => {
    getPublicRepos.mockResolvedValue([
      { name: "portfolio", url: "https://github.com/x/portfolio", description: null, homepage: null, language: "TypeScript", topics: [], stars: 2, forks: 0, pushedAt: null, pinned: false },
    ]);
    const html = await render();
    expect(html).toContain('href="https://github.com/x/portfolio"');
    expect(html).toContain("TypeScript");
    expect(html).toContain("estrelas");
  });
});
