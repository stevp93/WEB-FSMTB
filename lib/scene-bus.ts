/**
 * Canal mínimo entre el DOM y la escena 3D (sin importar three):
 * el Canvas corre con frameloop "never" y solo avanza cuando algo lo pide.
 */
export const sceneBus = {
  /** Renderiza cada frame (órbita del hero, vistas de perfiles). */
  continuous: false,
  /** Pide al menos un frame más (scroll, resize, cámara o perfil en movimiento). */
  dirty: true,
};

export function requestSceneFrame() {
  sceneBus.dirty = true;
}
