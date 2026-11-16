import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Fora do Next, "use cache"/cacheLife não existem; o cache em si é responsabilidade do framework.
vi.mock("next/cache", () => ({ cacheLife: vi.fn() }));

import { fetchPublicRepos, getPublicRepos, GITHUB_USER } from "./github";

const apiRepo = (name: string, extra: Record<string, unknown> = {}) => ({
  name,
  html_url: `https://github.com/${GITHUB_USER}/${name}`,
  description: `Descrição de ${name}`,
  homepage: "",
  language: "TypeScript",
  topics: [],
  stargazers_count: 1,
  forks_count: 0,
  fork: false,
  archived: false,
  private: false,
  pushed_at: "2026-11-01T00:00:00Z",
  ...extra,
});

function mockFetch(body: unknown, init: { status?: number } = {}) {
  return vi.fn<typeof fetch>(async () => new Response(JSON.stringify(body), { status: init.status ?? 200 }));
}

describe("fetchPublicRepos", () => {
  it("funciona sem token (sem cabeçalho Authorization)", async () => {
    const fetchImpl = mockFetch([apiRepo("a")]);
    await fetchPublicRepos({ fetchImpl });
    const [url, init] = fetchImpl.mock.calls[0];
    expect(String(url)).toBe(`https://api.github.com/users/${GITHUB_USER}/repos?type=owner&sort=pushed&per_page=100`);
    expect((init?.headers as Record<string, string>).Authorization).toBeUndefined();
  });

  it("usa o token quando existe", async () => {
    const fetchImpl = mockFetch([]);
    await fetchPublicRepos({ fetchImpl, token: "abc" });
    expect((fetchImpl.mock.calls[0][1]?.headers as Record<string, string>).Authorization).toBe("Bearer abc");
  });

  it("remove forks, arquivados, privados e os da lista HIDDEN", async () => {
    const fetchImpl = mockFetch([
      apiRepo("ok"),
      apiRepo("fork", { fork: true }),
      apiRepo("velho", { archived: true }),
      apiRepo("privado", { private: true }),
      apiRepo("escondido"),
    ]);
    const repos = await fetchPublicRepos({ fetchImpl, hidden: ["escondido"] });
    expect(repos.map((r) => r.name)).toEqual(["ok"]);
  });

  it("põe os PINNED primeiro, na ordem dada, e o resto pelo push mais recente", async () => {
    const fetchImpl = mockFetch([
      apiRepo("antigo", { pushed_at: "2025-01-01T00:00:00Z" }),
      apiRepo("recente", { pushed_at: "2026-11-10T00:00:00Z" }),
      apiRepo("fixo-2", { pushed_at: "2024-01-01T00:00:00Z" }),
      apiRepo("fixo-1", { pushed_at: "2023-01-01T00:00:00Z" }),
    ]);
    const repos = await fetchPublicRepos({ fetchImpl, pinned: ["fixo-1", "fixo-2"] });
    expect(repos.map((r) => [r.name, r.pinned])).toEqual([
      ["fixo-1", true],
      ["fixo-2", true],
      ["recente", false],
      ["antigo", false],
    ]);
  });

  it("lança erro quando a API responde com erro (ex.: limite estourado)", async () => {
    await expect(fetchPublicRepos({ fetchImpl: mockFetch({ message: "API rate limit exceeded" }, { status: 403 }) })).rejects.toThrow(
      /403/,
    );
  });

  it("lança erro quando a resposta vem fora do formato", async () => {
    await expect(fetchPublicRepos({ fetchImpl: mockFetch({ not: "an array" }) })).rejects.toThrow();
  });
});

describe("getPublicRepos", () => {
  const originalFetch = globalThis.fetch;
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("devolve null em vez de quebrar quando a rede falha", async () => {
    globalThis.fetch = vi.fn(async () => {
      throw new TypeError("fetch failed");
    });
    await expect(getPublicRepos()).resolves.toBeNull();
    expect(console.warn).toHaveBeenCalled();
  });

  it("lê o GITHUB_TOKEN do ambiente quando definido", async () => {
    vi.stubEnv("GITHUB_TOKEN", "do-ambiente");
    const fetchImpl = mockFetch([apiRepo("a")]);
    globalThis.fetch = fetchImpl;
    const repos = await getPublicRepos();
    expect(repos?.map((r) => r.name)).toEqual(["a"]);
    expect((fetchImpl.mock.calls[0][1]?.headers as Record<string, string>).Authorization).toBe("Bearer do-ambiente");
  });
});
