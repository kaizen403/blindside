"use client";

import { RoundedBox } from "@react-three/drei";

interface GlassPlaneProps {
  position: [number, number, number];
}

export default function GlassPlane({ position }: GlassPlaneProps) {
  return (
    <group position={position}>
      {/* Edge glow — slightly larger, behind */}
      <RoundedBox
        args={[6.05, 3.55, 0.01]}
        radius={0.15}
        smoothness={4}
        position={[0, 0, -0.03]}
      >
        <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
      </RoundedBox>

      {/* Main glass panel */}
      <RoundedBox args={[6, 3.5, 0.05]} radius={0.15} smoothness={4}>
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.6}
          roughness={0.3}
          metalness={0}
          transparent
          opacity={0.06}
          envMapIntensity={0}
        />
      </RoundedBox>
    </group>
  );
}
