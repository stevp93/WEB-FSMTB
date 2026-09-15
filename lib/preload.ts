/** bundle-preload: adelanta el chunk pesado de un destino cuando el usuario muestra intención (hover/foco). */
export function preloadRouteChunks(href: string) {
  if (href === '/recorridos') void import('@/components/three/ProfileView');
}
