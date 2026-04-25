"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Object3D,
  Group,
  BufferGeometry,
  Float32BufferAttribute,
  InstancedMesh as InstancedMeshType,
} from "three";

const NODE_COUNT = 11;
const ROTATION_SPEED = (Math.PI * 2) / 18;
const tempObject = new Object3D();

function makeNodes() {
  const pts: [number, number, number][] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const angle = (i / NODE_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
    const r = Math.random() * 1.5;
    pts.push([
      Math.cos(angle) * r,
      (Math.random() - 0.5) * 0.4,
      Math.sin(angle) * r,
    ]);
  }
  return pts;
}

function makeEdgeGeometry(nodes: [number, number, number][]) {
  const verts: number[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i][0] - nodes[j][0];
      const dz = nodes[i][2] - nodes[j][2];
      if (Math.sqrt(dx * dx + dz * dz) < 1.2) {
        verts.push(...nodes[i], ...nodes[j]);
      }
    }
  }
  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(verts, 3));
  return geo;
}

export default function DataModelGraph() {
  const groupRef = useRef<Group>(null);
  const instanceRef = useRef<InstancedMeshType>(null);

  const nodes = useMemo(() => makeNodes(), []);
  const edgeGeo = useMemo(() => makeEdgeGeometry(nodes), [nodes]);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * ROTATION_SPEED;
  });

  useFrame(() => {
    if (!instanceRef.current) return;
    for (let i = 0; i < NODE_COUNT; i++) {
      tempObject.position.set(nodes[i][0], nodes[i][1], nodes[i][2]);
      tempObject.updateMatrix();
      instanceRef.current.setMatrixAt(i, tempObject.matrix);
    }
    instanceRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={instanceRef}
        args={[undefined, undefined, NODE_COUNT]}
      >
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial
          color="#fafafa"
          emissive="#fafafa"
          emissiveIntensity={0.2}
          transparent
          opacity={0.6}
        />
      </instancedMesh>
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial color="#93c5fd" transparent opacity={0.2} />
      </lineSegments>
    </group>
  );
}
