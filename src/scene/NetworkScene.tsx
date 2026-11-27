"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { useReducedMotion } from "@/motion/use-reduced-motion";
import { chapters, type CameraPose, type WorldState } from "./chapters/chapters";
import { buildNetwork } from "./network-data";
import { clamp01, damp, lerp, lerpVec3, lerpWorld, poseFor, segmentState } from "./progress";
import { createQualityGovernor } from "./quality";
import { sceneScroll } from "./scroll-store";
import { linkFragment, linkVertex, nodeFragment, nodeVertex } from "./shaders/network";
import { useScrollProgress } from "./useScrollProgress";

declare global {
  interface Window {
    /** Quadros desenhados pela cena; os testes e2e usam para provar que, parada, ela não desenha. */
    __sceneFrames?: number;
    /** DPR atual escolhido pelo governador de qualidade. */
    __sceneDpr?: number;
  }
}

type Palette = { dark: boolean; cyan: THREE.Color; purple: THREE.Color };

/** Cores dos tokens da marca (globals.css); o ciano de texto no claro é o mais escuro (#007A8C). */
function readPalette(): Palette {
  const root = document.documentElement;
  const css = getComputedStyle(root);
  const dark = root.getAttribute("data-theme") === "dark";
  const token = (name: string, fallback: string) => new THREE.Color(css.getPropertyValue(name).trim() || fallback);
  return {
    dark,
    cyan: token(dark ? "--color-cyan-400" : "--color-cyan-700", dark ? "#00e5ff" : "#007a8c"),
    purple: token("--color-purple-600", "#7b2cbf"),
  };
}

type Uniforms = ReturnType<typeof createUniforms>;

function createUniforms() {
  return {
    uOpen: { value: 0 },
    uStretch: { value: 1 },
    uPhase: { value: 0 },
    uHue: { value: 0 },
    uGlow: { value: 1 },
    uSize: { value: 15 },
    uPixelRatio: { value: 1 },
    uCyan: { value: new THREE.Color("#00e5ff") },
    uPurple: { value: new THREE.Color("#7b2cbf") },
  };
}

// As escritas nos uniforms e nos materiais ficam fora do componente: são mutações imperativas
// do mundo Three.js, feitas em efeitos e no useFrame, nunca durante o render.
function applyPalette(uniforms: Uniforms, materials: (THREE.ShaderMaterial | null)[], palette: Palette) {
  uniforms.uCyan.value.copy(palette.cyan);
  uniforms.uPurple.value.copy(palette.purple);
  for (const material of materials) {
    if (!material) continue;
    material.blending = palette.dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    material.needsUpdate = true;
  }
}

function setPixelRatio(uniforms: Uniforms, ratio: number) {
  uniforms.uPixelRatio.value = ratio;
}

function applyWorld(uniforms: Uniforms, world: WorldState, value: number, glowScale: number) {
  uniforms.uOpen.value = world.open;
  uniforms.uStretch.value = world.stretch;
  uniforms.uHue.value = world.hue;
  uniforms.uGlow.value = clamp01(world.glow * glowScale);
  uniforms.uPhase.value = value * 1.4;
}

function applyCamera(camera: THREE.PerspectiveCamera, from: CameraPose, to: CameraPose, t: number) {
  const [px, py, pz] = lerpVec3(from.position, to.position, t);
  const [tx, ty, tz] = lerpVec3(from.target, to.target, t);
  camera.position.set(px, py, pz);
  camera.fov = lerp(from.fov, to.fov, t);
  camera.updateProjectionMatrix();
  camera.lookAt(tx, ty, tz);
}

/**
 * A cena inteira: uma rede de nós (POINTS) e conexões (LINES) em 2 draw calls, com o
 * deslocamento no vertex shader. Câmera e estado do mundo vêm do ledger de capítulos,
 * interpolados pelo valor de scroll. Só desenha quando algo muda (`frameloop="demand"`).
 */
export function NetworkScene({ onLost, route }: { onLost: () => void; route: string }) {
  const { camera, gl, invalidate, size, viewport, setDpr } = useThree();
  const group = useRef<THREE.Group>(null);
  const nodeMaterial = useRef<THREE.ShaderMaterial>(null);
  const linkMaterial = useRef<THREE.ShaderMaterial>(null);
  const smooth = useRef(sceneScroll.get());
  const palette = useRef<Palette | null>(null);

  // Qualidade adaptativa: baixa o DPR se os quadros desenhados durante o scroll ficarem lentos.
  const governor = useMemo(() => createQualityGovernor(viewport.initialDpr), [viewport.initialDpr]);

  // Sistema OU botão "Reduzir efeitos": a cena salta para o capítulo, sem deslizar.
  const reducedMotion = useReducedMotion();
  useScrollProgress(reducedMotion, route);

  const data = useMemo(() => buildNetwork(), []);
  const uniforms = useMemo(() => createUniforms(), []);

  // Tema: cores dos tokens e mistura (aditiva no escuro, normal no claro). Reage à troca de tema.
  useEffect(() => {
    const applyTheme = () => {
      const next = readPalette();
      palette.current = next;
      applyPalette(uniforms, [nodeMaterial.current, linkMaterial.current], next);
      invalidate();
    };
    applyTheme();
    const observer = new MutationObserver(applyTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });
    return () => observer.disconnect();
  }, [invalidate, uniforms]);

  // O scroll pede um frame; sem scroll, nenhum frame.
  useEffect(() => sceneScroll.subscribe(invalidate), [invalidate]);

  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onLost();
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onLost]);

  useEffect(() => {
    setPixelRatio(uniforms, viewport.dpr);
    invalidate();
  }, [viewport.dpr, size.width, size.height, uniforms, invalidate]);

  useFrame((_, delta) => {
    window.__sceneFrames = (window.__sceneFrames ?? 0) + 1;

    const nextDpr = governor.observe(delta * 1000);
    if (nextDpr !== null) {
      setDpr(nextDpr);
      window.__sceneDpr = nextDpr;
    }

    const target = sceneScroll.get();
    smooth.current = reducedMotion ? target : damp(smooth.current, target, 5.2, Math.min(delta, 1 / 30));
    const settled = Math.abs(target - smooth.current) < 0.0005;
    if (settled) smooth.current = target;
    const value = smooth.current;

    const { a, b, t } = segmentState(value, chapters.length);
    const from = poseFor(chapters[a], size.width);
    const to = poseFor(chapters[b], size.width);
    applyCamera(camera as THREE.PerspectiveCamera, from, to, t);
    applyWorld(uniforms, lerpWorld(chapters[a].world, chapters[b].world, t), value, palette.current?.dark === false ? 0.75 : 1);
    if (group.current) group.current.rotation.y = value * 0.55;

    if (!settled) invalidate();
  });

  return (
    <group ref={group}>
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.linkPositions, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[data.linkSeeds, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={linkMaterial}
          vertexShader={linkVertex}
          fragmentShader={linkFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </lineSegments>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[data.seeds, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={nodeMaterial}
          vertexShader={nodeVertex}
          fragmentShader={nodeFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </points>
    </group>
  );
}
