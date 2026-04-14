"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Mesh as MeshType,
  MeshStandardMaterial,
} from "three";

const NODE_COUNT = 18;

function generateNodes() {
  const pts: [number, number, number][] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const angle = (i / NODE_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const r = 0.4 + Math.random() * 1.8;
    pts.push([
      Math.cos(angle) * r,
      (Math.random() - 0.5) * 0.6,
      Math.sin(angle) * r,
    ]);
  }
  return pts;
}

function generateEdgeGeometry(nodes: [number, number, number][]) {
  const verts: number[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i][0] - nodes[j][0];
      const dy = nodes[i][1] - nodes[j][1];
      const dz = nodes[i][2] - nodes[j][2];
      if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 1.3) {
        verts.push(...nodes[i], ...nodes[j]);
      }
    }
  }
  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(verts, 3));
  return geo;
}

export default function MemoryMesh() {
  const nodesRef = useRef<(MeshType | null)[]>([]);
  const nodes = useMemo(() => generateNodes(), []);
  const edgeGeo = useMemo(() => generateEdgeGeometry(nodes), [nodes]);
  const phases = useMemo(
    () => Array.from({ length: NODE_COUNT }, () => Math.random() * Math.PI * 2),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    for (let i = 0; i < NODE_COUNT; i++) {
      const mesh = nodesRef.current[i];
      if (!mesh) continue;
      const mat = mesh.material as MeshStandardMaterial;
      mat.emissiveIntensity =
        0.1 + (Math.sin(t * 1.5 + phases[i]) * 0.5 + 0.5) * 0.4;
    }
  });

  return (
    <group>
      {nodes.map((pos, i) => (
        <mesh
          key={`mm-${pos[0].toFixed(3)}-${pos[2].toFixed(3)}`}
          ref={(el) => {
            nodesRef.current[i] = el;
          }}
          position={pos}
        >
          <sphereGeometry args={[0.08, 6, 6]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#c4b5fd"
            emissiveIntensity={0.3}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial color="#8b5cf6" transparent opacity={0.15} />
      </lineSegments>
    </group>
  );
}
