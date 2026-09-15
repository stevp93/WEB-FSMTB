import type { Material } from 'three';

/**
 * Uniformes de la "ventana de escena" compartidos por referencia entre terreno,
 * trazados y marcador: todo lo 3D se funde en niebla en la franja donde vive el texto.
 */
export type WindowUniforms = {
  uWinBottom: { value: number };
  uWinHeight: { value: number };
  uFade: { value: number };
};

export function createWindowUniforms(fade: number): WindowUniforms {
  return { uWinBottom: { value: 0 }, uWinHeight: { value: 1 }, uFade: { value: fade } };
}

export const WINDOW_FADE_GLSL = /* glsl */ `
  float windowFade() {
    float wy = (gl_FragCoord.y - uWinBottom) / max(uWinHeight, 1.0);
    return smoothstep(uFade * 0.42, uFade, wy);
  }
`;

/** Inyecta el fundido en materiales de three (líneas, básicos) antes de su primera compilación. */
export function applyWindowFade(material: Material, uniforms: WindowUniforms) {
  material.transparent = true;
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.fragmentShader = `uniform float uWinBottom;\nuniform float uWinHeight;\nuniform float uFade;\n${WINDOW_FADE_GLSL}\n${shader.fragmentShader.replace(
      '#include <premultiplied_alpha_fragment>',
      'gl_FragColor.a *= windowFade();\n#include <premultiplied_alpha_fragment>',
    )}`;
  };
  material.needsUpdate = true;
}
