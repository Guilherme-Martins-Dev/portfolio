"use client";

import { Canvas } from "@react-three/fiber";

import { NetworkScene } from "./NetworkScene";

/**
 * O canvas persistente e ÚNICO do projeto (briefing): montado uma vez no layout, nunca por
 * seção. `frameloop="demand"` e DPR com teto baixo: parado, não consome GPU; no celular o
 * teto é menor. Transparente: o fundo vem do site, a cena é só uma camada por cima dele.
 */
export default function SceneCanvas({ onLost, route }: { onLost: () => void; route: string }) {
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, coarse ? 1.25 : 1.5]}
      camera={{ fov: 42, near: 0.1, far: 60, position: [0, 0.4, 9] }}
      gl={{ antialias: false, alpha: true, powerPreference: "default" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <NetworkScene onLost={onLost} route={route} />
    </Canvas>
  );
}
