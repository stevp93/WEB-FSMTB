'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { MathUtils, Vector3, type PerspectiveCamera } from 'three';
import { requestSceneFrame } from '@/lib/scene-bus';
import { framingDistance, type Shot } from '@/lib/shots';

const LAMBDA = 3.4;
const ORBIT_SPEED = 0.035;

/** Cámara que viaja entre encuadres con amortiguación exponencial (interrumpible en cualquier frame). */
export function CameraRig({ shot }: { shot: Shot }) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  const target = useRef<Vector3 | null>(null);
  const desired = useMemo(() => new Vector3(), []);
  const angle = useRef(0);
  const shift = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const aspect = size.width / Math.max(size.height, 1);
    const distance = framingDistance(aspect);

    if (shot.orbit) angle.current += dt * ORBIT_SPEED;
    const a = shot.orbit ? angle.current : 0;
    const [tx, ty, tz] = shot.target;
    const ox = (shot.position[0] - tx) * distance;
    const oy = (shot.position[1] - ty) * distance;
    const oz = (shot.position[2] - tz) * distance;
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    desired.set(tx + ox * cos + oz * sin, ty + oy, tz - ox * sin + oz * cos);

    if (!target.current) {
      target.current = new Vector3(tx, ty, tz);
      camera.position.copy(desired);
      shift.current = shot.shiftY * size.height;
    }

    const t = target.current;
    camera.position.x = MathUtils.damp(camera.position.x, desired.x, LAMBDA, dt);
    camera.position.y = MathUtils.damp(camera.position.y, desired.y, LAMBDA, dt);
    camera.position.z = MathUtils.damp(camera.position.z, desired.z, LAMBDA, dt);
    t.x = MathUtils.damp(t.x, tx, LAMBDA, dt);
    t.y = MathUtils.damp(t.y, ty, LAMBDA, dt);
    t.z = MathUtils.damp(t.z, tz, LAMBDA, dt);
    camera.lookAt(t);

    const wantShift = shot.shiftY * size.height;
    shift.current = MathUtils.damp(shift.current, wantShift, LAMBDA, dt);
    camera.fov = MathUtils.damp(camera.fov, shot.fov, LAMBDA, dt);
    camera.setViewOffset(size.width, size.height, 0, shift.current, size.width, size.height);
    camera.updateProjectionMatrix();

    const moving =
      camera.position.distanceToSquared(desired) > 0.0004 ||
      Math.abs(t.x - tx) + Math.abs(t.y - ty) + Math.abs(t.z - tz) > 0.01 ||
      Math.abs(shift.current - wantShift) > 0.5 ||
      Math.abs(camera.fov - shot.fov) > 0.01;
    if (moving) requestSceneFrame();
  });

  return null;
}
