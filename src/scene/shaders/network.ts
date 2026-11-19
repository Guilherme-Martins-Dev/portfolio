/**
 * GLSL da rede de nós. Nós (gl.POINTS) e conexões (gl.LINES) usam o mesmo deslocamento, então
 * as linhas acompanham os pontos sem recalcular nada na CPU: a cena inteira são 2 draw calls.
 * Ficam em .ts (string) e não em .glsl para não exigir loader no bundler.
 */
const shared = /* glsl */ `
  uniform float uOpen;
  uniform float uStretch;
  uniform float uPhase;
  attribute float aSeed;
  varying float vSeed;

  vec3 displace(vec3 p, float seed) {
    vec3 q = p;
    q.x *= uStretch;
    vec3 dir = normalize(p + 0.0001);
    q += dir * uOpen * (0.6 + seed * 1.8);
    float w = sin(uPhase * 2.0 + seed * 6.2831) * 0.07 * (0.4 + uOpen);
    q += vec3(w, cos(uPhase * 1.7 + seed * 9.0) * 0.07, w * 0.5);
    return q;
  }
`;

const colorMix = /* glsl */ `
  uniform vec3 uCyan;
  uniform vec3 uPurple;
  uniform float uHue;
  uniform float uGlow;
  varying float vSeed;

  vec3 brand() {
    return mix(uCyan, uPurple, clamp(mix(vSeed * 0.55, uHue, 0.65), 0.0, 1.0));
  }
`;

export const nodeVertex = /* glsl */ `
  ${shared}
  uniform float uSize;
  uniform float uPixelRatio;
  void main() {
    vSeed = aSeed;
    vec4 mv = modelViewMatrix * vec4(displace(position, aSeed), 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.55 + aSeed * 0.9) * (9.0 / -mv.z);
  }
`;

export const nodeFragment = /* glsl */ `
  ${colorMix}
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float disc = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(brand(), pow(disc, 1.6) * uGlow);
  }
`;

export const linkVertex = /* glsl */ `
  ${shared}
  void main() {
    vSeed = aSeed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displace(position, aSeed), 1.0);
  }
`;

export const linkFragment = /* glsl */ `
  ${colorMix}
  void main() {
    gl_FragColor = vec4(brand(), 0.32 * uGlow);
  }
`;
