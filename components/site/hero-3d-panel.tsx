"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

function detectWebGLSupport() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") || canvas.getContext("webgl");
    return !!context;
  } catch {
    return false;
  }
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 960px)");
    setMobile(mediaQuery.matches);

    const onChange = (event: MediaQueryListEvent) => setMobile(event.matches);
    mediaQuery.addEventListener("change", onChange);

    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  return mobile;
}

function HeroOrbScene({
  pointer,
  isMobile,
  reduceMotion,
}: {
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  isMobile: boolean;
  reduceMotion: boolean;
}) {
  const orbRef = useRef<THREE.Group | null>(null);

  const particles = useMemo(() => {
    const count = isMobile ? 80 : 180;
    const values = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const radius = THREE.MathUtils.randFloat(1.7, 2.6);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      values[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      values[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      values[i * 3 + 2] = radius * Math.cos(phi);
    }

    return values;
  }, [isMobile]);

  useFrame((state) => {
    const group = orbRef.current;
    if (!group) return;

    const targetX = reduceMotion ? 0 : pointer.current.y * 0.2;
    const targetY = reduceMotion ? 0.2 : pointer.current.x * 0.4;

    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetX, 0.04);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetY, 0.04);

    if (!reduceMotion) {
      group.rotation.z += 0.0015;
      group.position.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.08;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2.5, 2.8, 1.8]} intensity={1.05} color="#88ccff" />
      <pointLight position={[-2.5, -1.8, 1.8]} intensity={0.7} color="#ffd59a" />

      <group ref={orbRef}>
        <Float speed={reduceMotion ? 0 : 1.2} rotationIntensity={reduceMotion ? 0 : 0.5} floatIntensity={0.6}>
          <mesh>
            <icosahedronGeometry args={[0.95, isMobile ? 3 : 4]} />
            <meshPhysicalMaterial
              color="#99edff"
              emissive="#0f3f5a"
              emissiveIntensity={0.28}
              roughness={0.16}
              metalness={0.32}
              transmission={0.22}
              clearcoat={1}
              clearcoatRoughness={0.2}
            />
          </mesh>
        </Float>

        <mesh rotation={[0.6, 0.3, 0.2]}>
          <torusGeometry args={[1.25, 0.05, 16, 140]} />
          <meshStandardMaterial color="#59b7f5" roughness={0.3} metalness={0.65} emissive="#0e2944" emissiveIntensity={0.12} />
        </mesh>

        <mesh rotation={[-0.4, -0.7, -0.3]}>
          <torusGeometry args={[1.62, 0.035, 14, 120]} />
          <meshStandardMaterial color="#ffc274" roughness={0.25} metalness={0.72} emissive="#3f220d" emissiveIntensity={0.16} />
        </mesh>
      </group>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particles.length / 3} itemSize={3} array={particles} />
        </bufferGeometry>
        <pointsMaterial color="#8ecbf8" size={isMobile ? 0.018 : 0.014} transparent opacity={0.45} sizeAttenuation />
      </points>

      <Environment preset="city" />

      {!isMobile && !reduceMotion ? (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.6} mipmapBlur luminanceThreshold={0.2} />
          <Noise premultiply opacity={0.04} />
          <Vignette eskil={false} offset={0.25} darkness={0.75} />
        </EffectComposer>
      ) : null}
    </>
  );
}

function Hero3DFallback({ imageSrc }: { imageSrc: string }) {
  return (
    <div className="relative h-full min-h-[360px] w-full overflow-hidden rounded-[2rem] border border-white/25 bg-[#06111e]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(52,151,214,0.24),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(255,174,96,0.2),transparent_40%),linear-gradient(180deg,#030712_0%,#0a1625_100%)]" />
      <Image src={imageSrc} alt="Hero fallback artwork" fill className="object-cover opacity-75" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/5" />
    </div>
  );
}

export function Hero3DPanel({ imageSrc = "/images/emmanuel.png" }: { imageSrc?: string }) {
  const reduceMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const [webglReady, setWebglReady] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  const pointer = useRef({ x: 0, y: 0 });
  const lastPointerUpdate = useRef(0);

  useEffect(() => {
    const supported = detectWebGLSupport();
    setWebglSupported(supported);
    setWebglReady(true);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const handlePointer = (x: number, y: number) => {
      const now = performance.now();
      if (now - lastPointerUpdate.current < 24) return;

      lastPointerUpdate.current = now;
      pointer.current.x = (x / window.innerWidth - 0.5) * 2;
      pointer.current.y = (y / window.innerHeight - 0.5) * 2;
    };

    const onMouseMove = (event: MouseEvent) => handlePointer(event.clientX, event.clientY);
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      handlePointer(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [reduceMotion]);

  if (!webglReady || !webglSupported) {
    return <Hero3DFallback imageSrc={imageSrc} />;
  }

  return (
    <div className="relative h-full min-h-[360px] w-full overflow-hidden rounded-[2rem] border border-white/20 bg-[radial-gradient(circle_at_30%_10%,rgba(71,168,230,0.24),transparent_45%),radial-gradient(circle_at_70%_20%,rgba(255,178,115,0.24),transparent_40%),linear-gradient(180deg,#020815_0%,#081324_58%,#060f1a_100%)]">
      <Suspense fallback={<Hero3DFallback imageSrc={imageSrc} />}>
        <Canvas
          dpr={isMobile ? [1, 1.2] : [1, 1.7]}
          camera={{ position: [0, 0, 4.5], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: isMobile ? "low-power" : "high-performance" }}
        >
          <HeroOrbScene pointer={pointer} isMobile={isMobile} reduceMotion={reduceMotion} />
        </Canvas>
      </Suspense>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.13),transparent_45%)]" />
    </div>
  );
}
