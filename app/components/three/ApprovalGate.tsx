"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Object3D, InstancedMesh as InstancedMeshType } from "three";

const DIAMOND_COUNT = 4;
const tempObject = new Object3D();

export default function ApprovalGate() {
  const diamondRef = useRef<InstancedMeshType>(null);

  const offsets = useMemo(
    () =>
      Array.from(
        { length: DIAMOND_COUNT },
        (_, i) => i * ((Math.PI * 2) / DIAMOND_COUNT),
      ),
    [],
  );

  useFrame((state) => {
    if (!diamondRef.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < DIAMOND_COUNT; i++) {
      const x = Math.sin(t * 0.5 + offsets[i]) * 0.4;
      const y = Math.sin(t * 0.3 + offsets[i]) * 0.5;
      tempObject.position.set(x, y, 0);
      tempObject.rotation.set(t * 0.5, t * 0.3, 0);
      tempObject.updateMatrix();
      diamondRef.current.setMatrixAt(i, tempObject.matrix);
    }
    diamondRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <mesh position={[-0.5, 0, 0]}>
        <boxGeometry args={[0.05, 1.5, 0.05]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh position={[0.5, 0, 0]}>
        <boxGeometry args={[0.05, 1.5, 0.05]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.3}
        />
      </mesh>

      <instancedMesh
        ref={diamondRef}
        args={[undefined, undefined, DIAMOND_COUNT]}
      >
        <octahedronGeometry args={[0.08, 0]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.4}
          transparent
          opacity={0.8}
        />
      </instancedMesh>
    </group>
  );
}
