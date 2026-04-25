"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Object3D, InstancedMesh as InstancedMeshType } from "three";

const COUNT = 7;
const RADII = [0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0];
const SPEEDS = [0.8, 0.6, 1.0, 0.5, 0.7, 0.9, 0.4];
const tempObject = new Object3D();

export default function AgentOrbs() {
  const meshRef = useRef<InstancedMeshType>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < COUNT; i++) {
      const x = RADII[i] * Math.cos(t * SPEEDS[i]);
      const z = RADII[i] * Math.sin(t * SPEEDS[i]);
      tempObject.position.set(x, 0, z);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[0.15, 12, 12]} />
      <meshStandardMaterial
        color="#8b5cf6"
        emissive="#8b5cf6"
        emissiveIntensity={0.5}
        transparent
        opacity={0.7}
      />
    </instancedMesh>
  );
}
