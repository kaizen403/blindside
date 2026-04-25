"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Html, Environment } from "@react-three/drei";
import * as THREE from "three";

function MacBookModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.15;
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.05;
  });

  const aluminumMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#c4c4c4"),
        metalness: 0.9,
        roughness: 0.2,
      }),
    []
  );

  const darkMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1a1a1a"),
        metalness: 0.5,
        roughness: 0.4,
      }),
    []
  );

  const screenGlowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#0a0a0c"),
      }),
    []
  );

  return (
    <group ref={groupRef} position={[0, -0.3, 0]} rotation={[0.1, 0, 0]}>
      <RoundedBox args={[3.2, 0.12, 2.2]} radius={0.04} smoothness={4} position={[0, 0, 0]}>
        <primitive object={aluminumMaterial} attach="material" />
      </RoundedBox>

      <mesh position={[0, -0.06, 0]}>
        <boxGeometry args={[3.2, 0.01, 2.2]} />
        <primitive object={darkMaterial} attach="material" />
      </mesh>

      <RoundedBox args={[1.2, 0.01, 0.8]} radius={0.02} smoothness={4} position={[0, 0.065, 0.5]}>
        <meshStandardMaterial color="#b8b8b8" metalness={0.8} roughness={0.3} />
      </RoundedBox>

      <mesh position={[0, 0.062, -0.35]}>
        <boxGeometry args={[2.6, 0.005, 1.0]} />
        <primitive object={darkMaterial} attach="material" />
      </mesh>

      {[-0.25, -0.15, -0.05, 0.05, 0.15].map((z, rowIdx) => (
        <group key={rowIdx}>
          {Array.from({ length: 12 - rowIdx }).map((_, i) => {
            const x = -1.1 + i * 0.21 + (rowIdx * 0.05);
            const width = rowIdx === 0 ? 0.18 : 0.16;
            return (
              <mesh key={i} position={[x, 0.068, z]}>
                <boxGeometry args={[width, 0.008, 0.08]} />
                <meshStandardMaterial color="#2a2a2a" metalness={0.3} roughness={0.7} />
              </mesh>
            );
          })}
        </group>
      ))}

      <group position={[0, 0.06, -1.1]} rotation={[-0.35, 0, 0]}>
        <RoundedBox args={[3.2, 2.1, 0.08]} radius={0.04} smoothness={4} position={[0, 1.05, 0]}>
          <primitive object={aluminumMaterial} attach="material" />
        </RoundedBox>

        <RoundedBox args={[3.05, 1.95, 0.02]} radius={0.02} smoothness={4} position={[0, 1.05, 0.03]}>
          <meshStandardMaterial color="#0a0a0a" metalness={0.3} roughness={0.5} />
        </RoundedBox>

        <mesh position={[0, 1.05, 0.041]}>
          <planeGeometry args={[2.9, 1.8]} />
          <primitive object={screenGlowMaterial} attach="material" />
        </mesh>

        <Html
          transform
          occlude
          position={[0, 1.05, 0.045]}
          style={{
            width: "580px",
            height: "360px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
              width: "100%",
              height: "100%",
              borderRadius: "4px",
              overflow: "hidden",
              position: "relative",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            <div
              style={{
                height: "22px",
                background: "rgba(0,0,0,0.35)",
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                gap: "16px",
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px" }}>Finder</span>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px" }}>File</span>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px" }}>Edit</span>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", marginLeft: "auto" }}>12:42 PM</span>
            </div>

            <div
              style={{
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "calc(100% - 22px)",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(180deg, #2a2a2e 0%, #1c1c1e 100%)",
                  borderRadius: "10px",
                  padding: "24px",
                  width: "280px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: "#dc2626",
                    borderRadius: "10px 10px 0 0",
                  }}
                />

                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    border: "2px solid #dc2626",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px",
                    color: "#dc2626",
                    fontSize: "16px",
                    fontWeight: 700,
                  }}
                >
                  !
                </div>

                <h3
                  style={{
                    color: "#fafafa",
                    fontSize: "11px",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                >
                  CRITICAL SECURITY ALERT
                </h3>

                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "8px", marginBottom: "4px" }}>
                  Your personal files have been encrypted.
                </p>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "8px", marginBottom: "16px" }}>
                  Pay 0.5 BTC within 48 hours to recover.
                </p>

                <button
                  style={{
                    background: "#dc2626",
                    color: "#fafafa",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 16px",
                    fontSize: "9px",
                    fontWeight: 600,
                    cursor: "default",
                  }}
                >
                  Decrypt Files
                </button>

                <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "7px", marginTop: "10px" }}>
                  47:59:12 remaining
                </p>
              </div>
            </div>
          </div>
        </Html>

        <mesh position={[0, 1.92, 0.035]}>
          <boxGeometry args={[0.15, 0.03, 0.01]} />
          <meshStandardMaterial color="#0a0a0a" />
        </mesh>
      </group>

      <mesh position={[0, 0.06, -1.1]} rotation={[0.2, 0, 0]}>
        <cylinderGeometry args={[1.6, 1.6, 0.05, 32]} />
        <meshStandardMaterial color="#a0a0a0" metalness={0.9} roughness={0.2} />
      </mesh>

      <mesh position={[0, -0.15, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 3]} />
        <meshBasicMaterial color="#000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export default function MacBook3D() {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#09090b"]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-5, 3, -5]} intensity={0.5} color="#dc2626" />
        <spotLight position={[0, 8, 0]} intensity={0.8} angle={0.5} penumbra={1} />

        <MacBookModel />

        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
