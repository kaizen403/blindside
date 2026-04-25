"use client";

import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import OrchestrationStack from "./OrchestrationStack";
import DataParticles from "./DataParticles";

export default function OrchestrationCanvas() {
  const [canRender, setCanRender] = useState(false);
  const [dpr, setDpr] = useState(1.5);

  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    setCanRender(isDesktop && !!gl);
  }, []);

  if (!canRender) return null;

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 2, 18], fov: 45 }}
      gl={{ powerPreference: "high-performance", antialias: true }}
      style={{ position: "absolute", inset: 0, zIndex: 0 }}
      aria-hidden="true"
    >
      <color attach="background" args={["#09090b"]} />
      <ambientLight intensity={0.15} />
      <pointLight position={[8, 10, 6]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-6, -4, 4]} intensity={0.3} color="#8b5cf6" />

      <Suspense fallback={null}>
        <OrchestrationStack />
        <DataParticles />
      </Suspense>

      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>

      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(1.5)}
      />
    </Canvas>
  );
}
