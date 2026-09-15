export type ExperienceMode = 'pending' | '3d' | 'poster';

type NetworkInformationLike = { saveData?: boolean; effectiveType?: string };

let webglSupport: boolean | undefined;

function hasWebGL() {
  if (webglSupport !== undefined) return webglSupport;
  try {
    const canvas = document.createElement('canvas');
    webglSupport = Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

/**
 * El 3D solo corre en escritorio/tablet con puntero fino, sin reducción de
 * movimiento, sin ahorro de datos y con WebGL. Todo lo demás recibe el póster
 * estático con la misma composición.
 */
export function canRun3D(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  if (connection?.saveData) return false;
  if (connection?.effectiveType && /(^|-)(2g|3g)$/.test(connection.effectiveType)) return false;

  const width = window.innerWidth;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (width < 768) return false;
  if (width < 1024 && !finePointer) return false;
  if ((navigator.hardwareConcurrency ?? 4) < 4) return false;

  return hasWebGL();
}
