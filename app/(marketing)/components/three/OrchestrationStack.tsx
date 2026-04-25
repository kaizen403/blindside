"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import GlassPlane from "./GlassPlane";
import ConnectorTiles from "./ConnectorTiles";
import DataModelGraph from "./DataModelGraph";
import AgentOrbs from "./AgentOrbs";
import ApprovalGate from "./ApprovalGate";
import MemoryMesh from "./MemoryMesh";

const LAYER_Y = [-5, -2.5, 0, 2.5, 5] as const;
const ROTATION_SPEED = (Math.PI * 2) / 60;
const FLOAT_SPEED = Math.PI / 3;
const FLOAT_AMPLITUDE = 0.3;

export default function OrchestrationStack() {
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * ROTATION_SPEED;
    groupRef.current.position.y =
      Math.sin(state.clock.elapsedTime * FLOAT_SPEED) * FLOAT_AMPLITUDE;
  });

  return (
    <group ref={groupRef} rotation={[-0.4, 0, 0.1]}>
      <group position={[0, LAYER_Y[0], 0]}>
        <GlassPlane position={[0, 0, 0]} />
        <ConnectorTiles />
      </group>
      <group position={[0, LAYER_Y[1], 0]}>
        <GlassPlane position={[0, 0, 0]} />
        <DataModelGraph />
      </group>
      <group position={[0, LAYER_Y[2], 0]}>
        <GlassPlane position={[0, 0, 0]} />
        <AgentOrbs />
      </group>
      <group position={[0, LAYER_Y[3], 0]}>
        <GlassPlane position={[0, 0, 0]} />
        <ApprovalGate />
      </group>
      <group position={[0, LAYER_Y[4], 0]}>
        <GlassPlane position={[0, 0, 0]} />
        <MemoryMesh />
      </group>
    </group>
  );
}
