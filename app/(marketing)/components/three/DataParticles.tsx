"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface Particle {
  x: number;
  y: number;
  z: number;
  phase: number;
  speed: number;
}

const PARTICLE_COUNT = 40;
const LAYER_POSITIONS = [-5, -2.5, 0, 2.5, 5];
const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();
const bottomColor = new THREE.Color("#93c5fd");
const topColor = new THREE.Color("#c4b5fd");

function initParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: (Math.random() - 0.5) * 4,
    y: -5 + Math.random() * 11,
    z: (Math.random() - 0.5) * 2,
    phase: Math.random() * Math.PI * 2,
    speed: 0.03 + Math.random() * 0.02,
  }));
}

export default function DataParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particles = useRef<Particle[]>(initParticles());

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles.current[i];

      let speed = p.speed * delta * 60;
      for (const ly of LAYER_POSITIONS) {
        if (Math.abs(p.y - ly) < 0.3) {
          speed *= 0.3;
          break;
        }
      }

      p.y += speed;
      p.x += Math.sin(state.clock.elapsedTime * 2 + p.phase) * 0.003;
      p.z += Math.cos(state.clock.elapsedTime * 1.5 + p.phase) * 0.002;

      if (p.y > 5.5) {
        p.y = -5.5;
        p.x = (Math.random() - 0.5) * 4;
        p.z = (Math.random() - 0.5) * 2;
      }

      tempObject.position.set(p.x, p.y, p.z);
      tempObject.updateMatrix();
      mesh.setMatrixAt(i, tempObject.matrix);

      const t = Math.max(0, Math.min(1, (p.y + 5) / 10));
      tempColor.lerpColors(bottomColor, topColor, t);
      mesh.setColorAt(i, tempColor);
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[0.04, 6, 6]} />
      <meshBasicMaterial color="#93c5fd" transparent opacity={0.8} />
    </instancedMesh>
  );
}
