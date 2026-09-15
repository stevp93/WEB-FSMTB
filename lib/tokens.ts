/**
 * Capa primitiva de color: única fuente de verdad.
 * Tailwind la convierte en variables CSS (ver tailwind.config.ts) y la escena 3D
 * la lee directamente. Ningún componente debe declarar hex propios.
 */
export const primitive = {
  'bruma-noche': '#0A1614',
  bosque: '#1E3A32',
  'agua-viva': '#1FC7B6',
  'ocre-tierra': '#D98A3D',
  niebla: '#E9EFEB',
  piedra: '#9DB0A6',
} as const;

export type PrimitiveName = keyof typeof primitive;

/** Capa semántica: qué papel cumple cada primitivo. */
export const semantic = {
  canvas: 'bruma-noche',
  surface: 'bosque',
  ink: 'niebla',
  'ink-muted': 'piedra',
  'ink-on-cta': 'bruma-noche',
  accent: 'agua-viva',
  cta: 'ocre-tierra',
  line: 'piedra',
  focus: 'agua-viva',
  alert: 'ocre-tierra',
} as const satisfies Record<string, PrimitiveName>;

/** Capa de componente: el color de cada modalidad es constante en todo el sitio (3D, SVG, texto). */
export const component = {
  'route-carrera': 'ocre-tierra',
  'route-travesia': 'agua-viva',
} as const satisfies Record<string, PrimitiveName>;

export function hexToRgbChannels(hex: string): string {
  const n = parseInt(hex.replace('#', ''), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}
