import * as runtime from "react/jsx-runtime";
import type { ComponentType, ReactNode } from "react";

import { CodeBlock, InlineCode } from "./code-block";
import { Figure } from "./figure";
import { Note } from "./note";

type MDXComponents = Record<string, ComponentType<never>>;

/** Componentes disponíveis em todo estudo de caso, sem precisar de import no .mdx. */
export const mdxComponents = {
  Figure,
  Note,
  CodeBlock,
  pre: CodeBlock,
  code: InlineCode,
} as unknown as MDXComponents;

/**
 * O Velite compila o MDX em build para o corpo de uma função (string). Aqui ela é
 * instanciada com o runtime JSX do React. Só roda no servidor e só com conteúdo do repositório.
 */
type CompiledMDX = (props: { components?: MDXComponents }) => ReactNode;

// Cada estudo de caso é compilado uma vez por processo, não a cada render.
const cache = new Map<string, CompiledMDX>();

function getCompiledMDX(code: string): CompiledMDX {
  let compiled = cache.get(code);
  if (!compiled) {
    compiled = new Function(code)({ ...runtime }).default as CompiledMDX;
    cache.set(code, compiled);
  }
  return compiled;
}

export function MDXContent({ code, components }: { code: string; components?: MDXComponents }) {
  // O MDX compilado é uma função pura (sem hooks); chamá-la direto evita criar um
  // componente novo durante o render.
  return getCompiledMDX(code)({ components: { ...mdxComponents, ...components } });
}
