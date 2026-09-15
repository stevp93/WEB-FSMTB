/** Rutas de /public con el basePath del despliegue (GitHub Pages sirve el sitio bajo /<repo>). */
export function withBase(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`;
}

/** URL pública canónica del sitio desplegado. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sfmtb.info';
