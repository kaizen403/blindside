"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Object3D, InstancedMesh as InstancedMeshType } from "three";

const COUNT = 8;
const RADIUS = 2;
const tempObject = new Object3D();

export default function ConnectorTiles() {
  const meshRef = useRef<InstancedMeshType>(null);

  const phases = useMemo(
    () => Array.from({ length: COUNT }, (_, i) => (i / COUNT) * Math.PI * 2),
    [],
  );

  const positions = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => {
        const angle = (i / COUNT) * Math.PI * 2;
        return [Math.cos(angle) * RADIUS, 0, Math.sin(angle) * RADIUS] as const;
      }),
    [],
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < COUNT; i++) {
      const [x, , z] = positions[i];
      const y = Math.sin(t * 2 + phases[i]) * 0.1;
      tempObject.position.set(x, y, z);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <boxGeometry args={[0.4, 0.4, 0.08]} />
      <meshStandardMaterial
        color="#93c5fd"
        emissive="#93c5fd"
        emissiveIntensity={0.3}
        transparent
        opacity={0.6}
      />
    </instancedMesh>
  );
}
