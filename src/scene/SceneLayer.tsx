"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Three.js só entra neste chunk, carregado no cliente depois do primeiro desenho: nunca no
// bundle inicial e nunca no servidor. O LCP é o título do Hero, não a cena.
const SceneCanvas = dynamic(() => import("./Canvas"), { ssr: false });

function hasWebGL(): boolean {
  try {
    const probe = document.createElement("canvas");
    return Boolean(probe.getContext("webgl2") ?? probe.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Camada fixa atrás do conteúdo, montada uma vez no layout. Sempre mostra o fundo 2D (gradiente
 * com os tokens da marca): é o fallback sem WebGL e também o placeholder enquanto a cena carrega,
 * então a página nunca fica vazia nem muda de tamanho. O canvas é decorativo (`aria-hidden`).
 */
export function SceneLayer() {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // A detecção roda no callback (não direto no efeito) e só então decide: cena ou fallback 2D.
    const start = () => (hasWebGL() ? setReady(true) : setFailed(true));
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(start, 300);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div
      aria-hidden="true"
      data-scene-layer
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background:
          "radial-gradient(55% 45% at 78% 38%, color-mix(in oklab, var(--color-cyan-400) 13%, transparent), transparent 70%)," +
          "radial-gradient(40% 40% at 90% 70%, color-mix(in oklab, var(--color-purple-600) 14%, transparent), transparent 70%)",
      }}
    >
      {ready && !failed && <SceneCanvas onLost={() => setFailed(true)} route={pathname} />}
    </div>
  );
}
