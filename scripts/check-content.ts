// Valida todo o conteúdo de src/content antes do build (roda em `pnpm build`).
// Os schemas e as referências são conferidos na importação; se algo estiver errado, o processo
// termina com a mensagem do item inválido.
async function main() {
  const { events, experience, projects, technologies } = await import("../src/content");
  const { computeStats } = await import("../src/lib/stats");
  const stats = computeStats({ projects, events, experience });
  console.log(
    `✓ Conteúdo válido: ${projects.length} projetos, ${events.length} eventos, ${experience.length} experiências, ${technologies.length} tecnologias (${stats.distinctTechnologies} em uso).`,
  );
}

main().catch((error: unknown) => {
  console.error(`✖ ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
