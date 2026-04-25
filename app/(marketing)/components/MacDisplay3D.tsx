"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

interface SceneProps {
  variant: "startup" | "saas" | "business" | "founder" | "agency" | "team";
}

function Particles({ count = 20, color = "#dc2626" }: { count?: number; color?: string }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 3,
      y: (Math.random() - 0.5) * 2,
      z: (Math.random() - 0.5) * 1,
      speed: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  const tempObject = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      tempObject.position.set(
        p.x + Math.sin(t * p.speed + p.phase) * 0.3,
        p.y + Math.cos(t * p.speed * 0.7 + p.phase) * 0.2,
        p.z
      );
      tempObject.scale.setScalar(0.02 + Math.sin(t * 2 + i) * 0.01);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </instancedMesh>
  );
}

function FloatingShapes({ variant }: { variant: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.1;
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.05;
  });

  const shapes = useMemo(() => {
    switch (variant) {
      case "startup":
        return (
          <group>
            <mesh position={[0, 0.3, 0]}>
              <coneGeometry args={[0.15, 0.4, 8]} />
              <meshBasicMaterial color="#dc2626" />
            </mesh>
            <mesh position={[0, -0.1, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.3, 8]} />
              <meshBasicMaterial color="#fafafa" transparent opacity={0.5} />
            </mesh>
            {[-0.3, -0.5, -0.7].map((y, i) => (
              <mesh key={i} position={[Math.sin(i) * 0.1, y, 0]}>
                <sphereGeometry args={[0.03 + i * 0.01, 8, 8]} />
                <meshBasicMaterial color="#dc2626" transparent opacity={0.4 - i * 0.1} />
              </mesh>
            ))}
          </group>
        );
      case "saas":
        return (
          <group>
            <mesh>
              <octahedronGeometry args={[0.2, 0]} />
              <meshBasicMaterial color="#dc2626" />
            </mesh>
            {[0, 1, 2, 3].map((i) => {
              const angle = (i / 4) * Math.PI * 2;
              const x = Math.cos(angle) * 0.6;
              const y = Math.sin(angle) * 0.4;
              return (
                <group key={i}>
                  <mesh position={[x, y, 0]}>
                    <sphereGeometry args={[0.06, 8, 8]} />
                    <meshBasicMaterial color="#fafafa" transparent opacity={0.6} />
                  </mesh>
                  <line>
                    <bufferGeometry>
                      <bufferAttribute
                        attach="attributes-position"
                        args={[new Float32Array([0, 0, 0, x, y, 0]), 3]}
                      />
                    </bufferGeometry>
                    <lineBasicMaterial color="#dc2626" transparent opacity={0.3} />
                  </line>
                </group>
              );
            })}
          </group>
        );
      case "business":
        return (
          <group>
            <mesh position={[-0.3, -0.2, 0]}>
              <boxGeometry args={[0.3, 0.4, 0.1]} />
              <meshBasicMaterial color="#fafafa" transparent opacity={0.3} />
            </mesh>
            <mesh position={[0.1, -0.1, 0]}>
              <boxGeometry args={[0.35, 0.5, 0.1]} />
              <meshBasicMaterial color="#dc2626" transparent opacity={0.5} />
            </mesh>
            <mesh position={[0.4, -0.15, 0]}>
              <boxGeometry args={[0.25, 0.45, 0.1]} />
              <meshBasicMaterial color="#fafafa" transparent opacity={0.3} />
            </mesh>
          </group>
        );
      case "founder":
        return (
          <group>
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
              return (
                <mesh key={i} position={[Math.cos(angle) * 0.25, Math.sin(angle) * 0.25, 0]}>
                  <sphereGeometry args={[0.05, 8, 8]} />
                  <meshBasicMaterial color={i % 2 === 0 ? "#dc2626" : "#fafafa"} />
                </mesh>
              );
            })}
            <mesh>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial color="#dc2626" />
            </mesh>
          </group>
        );
      case "agency":
        return (
          <group>
            <mesh>
              <ringGeometry args={[0.3, 0.32, 32]} />
              <meshBasicMaterial color="#dc2626" transparent opacity={0.6} />
            </mesh>
            <mesh>
              <ringGeometry args={[0.15, 0.16, 32]} />
              <meshBasicMaterial color="#fafafa" transparent opacity={0.4} />
            </mesh>
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([0, -0.45, 0, 0, 0.45, 0]), 3]}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#dc2626" transparent opacity={0.3} />
            </line>
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([-0.45, 0, 0, 0.45, 0, 0]), 3]}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#dc2626" transparent opacity={0.3} />
            </line>
          </group>
        );
      case "team":
        return (
          <group>
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([-0.5, -0.3, 0, -0.2, -0.1, 0, 0.1, 0.1, 0, 0.5, 0.3, 0]), 3]}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#dc2626" transparent opacity={0.6} />
            </line>
            {[-0.5, -0.2, 0.1, 0.5].map((x, i) => {
              const y = [-0.3, -0.1, 0.1, 0.3][i];
              return (
                <mesh key={i} position={[x, y, 0]}>
                  <sphereGeometry args={[0.04, 8, 8]} />
                  <meshBasicMaterial color="#dc2626" />
                </mesh>
              );
            })}
          </group>
        );
      default:
        return null;
    }
  }, [variant]);

  return <group ref={groupRef}>{shapes}</group>;
}

function MacScene({ variant }: SceneProps) {
  return (
    <>
      <color attach="background" args={["#111113"]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[2, 2, 3]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-2, -1, 2]} intensity={0.3} color="#dc2626" />

      <RoundedBox args={[3.2, 2.2, 0.05]} radius={0.08} smoothness={4} position={[0, 0, -0.1]}>
        <meshBasicMaterial color="#1a1a1c" />
      </RoundedBox>

      <RoundedBox args={[3.25, 2.25, 0.02]} radius={0.1} smoothness={4} position={[0, 0, -0.12]}>
        <meshBasicMaterial color="#dc2626" transparent opacity={0.15} />
      </RoundedBox>

      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[3, 2]} />
        <meshBasicMaterial color="#0a0a0c" />
      </mesh>

      <FloatingShapes variant={variant} />
      <Particles count={15} color={variant === "founder" || variant === "agency" ? "#fafafa" : "#dc2626"} />
    </>
  );
}

export default function MacDisplay3D({ variant }: SceneProps) {
  return (
    <div className="w-full h-full" style={{ minHeight: "160px" }}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3.5], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: "#111113" }}
      >
        <MacScene variant={variant} />
      </Canvas>
    </div>
  );
}
