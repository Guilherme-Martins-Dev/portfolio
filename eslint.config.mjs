import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Regras de estrutura do briefing. Ver src/scene/architecture.test.ts para a regra do Canvas único.
const threeImports = [
  { group: ["three", "three/*"], message: "Three.js só entra em src/scene/ (briefing: o custo do 3D fica isolado)." },
  { group: ["@react-three/*"], message: "React Three Fiber e Drei só entram em src/scene/." },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/scene/**"],
    rules: { "no-restricted-imports": ["error", { patterns: threeImports }] },
  },
  {
    // src/content/ é só dado: nada de React nem de código de apresentação.
    files: ["src/content/**/*.ts"],
    ignores: ["src/content/**/*.test.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            ...threeImports,
            { group: ["react", "react/*", "next/*", "next-intl", "next-intl/*"], message: "src/content/ não tem código de apresentação." },
            { group: ["@/components/*", "@/features/*", "@/app/*", "@/scene/*"], message: "src/content/ não importa componentes nem features." },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Saída gerada pelo Velite (estudos de caso em MDX).
    ".velite/**",
  ]),
]);

export default eslintConfig;
