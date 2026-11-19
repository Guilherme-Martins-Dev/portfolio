/**
 * Ledger dos capítulos da cena (briefing): um por seção da Home, na mesma ordem e com os
 * mesmos ids. É só dado: câmera e estado do mundo de cada capítulo. A cena interpola entre
 * capítulos vizinhos; nada aqui cria ou recria recurso 3D.
 */
export type Vec3 = readonly [number, number, number];

export type CameraPose = { position: Vec3; target: Vec3; fov: number };

export type WorldState = {
  /** 0 = núcleo compacto; 1 = rede aberta, nós afastados do centro. */
  open: number;
  /** Alongamento no eixo X (linha do tempo). */
  stretch: number;
  /** 0 = ciano, 1 = roxo (mistura de cor dos nós e conexões). */
  hue: number;
  /** Intensidade do brilho (opacidade geral da rede). */
  glow: number;
};

export type SceneChapter = {
  /** Mesmo id da seção da Home (HOME_SECTIONS). */
  id: string;
  camera: CameraPose;
  /** Pose para telas estreitas (< 768 px); sem ela vale `camera`. */
  mobile?: CameraPose;
  world: WorldState;
};

export const MOBILE_BREAKPOINT = 768;

export const chapters: readonly SceneChapter[] = [
  {
    id: "hero",
    camera: { position: [0, 0.4, 9], target: [-2.8, 0, 0], fov: 42 },
    mobile: { position: [0, 0.2, 11.5], target: [0, 2.2, 0], fov: 48 },
    world: { open: 0.05, stretch: 1, hue: 0.1, glow: 0.8 },
  },
  {
    id: "about",
    camera: { position: [-1.4, 1.6, 8], target: [-2.6, 0, 0], fov: 40 },
    mobile: { position: [-1.5, 1.4, 11], target: [0, 2.2, 0], fov: 48 },
    world: { open: 0.3, stretch: 1.1, hue: 0.3, glow: 0.65 },
  },
  {
    id: "experience",
    camera: { position: [1.6, 0.6, 10], target: [-3.8, 0, 0], fov: 44 },
    mobile: { position: [3, 0.6, 10], target: [0, 2.2, 0], fov: 50 },
    world: { open: 0.45, stretch: 1.9, hue: 0.5, glow: 0.28 },
  },
  {
    id: "projects",
    camera: { position: [0, -2.2, 8.5], target: [-2.6, 0.4, 0], fov: 46 },
    mobile: { position: [0, -1.6, 11.5], target: [0, 2.2, 0], fov: 52 },
    world: { open: 0.75, stretch: 1.2, hue: 0.7, glow: 0.55 },
  },
  {
    id: "events",
    camera: { position: [1.2, -0.8, 7.5], target: [-2.4, 0, 0], fov: 44 },
    mobile: { position: [-2.4, -0.6, 10.5], target: [0, 2.2, 0], fov: 50 },
    world: { open: 1, stretch: 1.4, hue: 0.85, glow: 0.5 },
  },
  {
    id: "contact",
    camera: { position: [0, 0.2, 10.5], target: [-2.8, 0, 0], fov: 40 },
    mobile: { position: [0, 0.2, 12.5], target: [0, 2.2, 0], fov: 48 },
    world: { open: 0.12, stretch: 1, hue: 0.2, glow: 0.8 },
  },
];
