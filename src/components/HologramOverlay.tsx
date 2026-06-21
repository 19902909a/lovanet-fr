import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

/**
 * Real 3D humanoid "holograms" walking across the homepage.
 * Models: KhronosGroup / three.js examples (Soldier, Xbot) — free, animated rigs.
 * Rendered in a fullscreen transparent Canvas overlay (no pointer events).
 */

const MODELS = [
  "https://threejs.org/examples/models/gltf/Soldier.glb",
  "https://threejs.org/examples/models/gltf/Xbot.glb",
];
// Preload only on capable devices (skip on mobile / low-memory to avoid jank).
if (typeof window !== "undefined") {
  const dm = (navigator as any).deviceMemory ?? 8;
  const coarse = window.matchMedia?.("(pointer: coarse)").matches;
  const small = window.innerWidth < 1024;
  if (!coarse && !small && dm >= 4) {
    MODELS.forEach((u) => useGLTF.preload(u));
  }
}

const TINTS = [
  "#22d3ee",
  "#f472b6",
  "#a78bfa",
  "#34d399",
  "#fbbf24",
  "#60a5fa",
  "#fb7185",
  "#ffffff",
];

type Spawn = {
  id: number;
  url: string;
  dir: 1 | -1;
  z: number;
  tint: string;
  action: "Walk" | "Run" | "Idle";
  speed: number;
  startAt: number;
};

let uid = 1;
const spawnOne = (): Spawn => {
  const action = Math.random() < 0.7 ? "Walk" : Math.random() < 0.6 ? "Run" : "Idle";
  return {
    id: uid++,
    url: MODELS[Math.floor(Math.random() * MODELS.length)],
    dir: Math.random() < 0.5 ? 1 : -1,
    z: -2 + Math.random() * 4,
    tint: TINTS[Math.floor(Math.random() * TINTS.length)],
    action,
    speed: action === "Run" ? 2.4 : action === "Walk" ? 1.2 : 0,
    startAt: performance.now(),
  };
};

const HoloFigure = ({ spawn, onDone }: { spawn: Spawn; onDone: (id: number) => void }) => {
  const { scene, animations } = useGLTF(spawn.url) as any;
  // Cloned scene so we can have multiple independent instances.
  const cloned = useMemo(() => SkeletonUtils.clone(scene) as THREE.Object3D, [scene]);
  const group = useRef<THREE.Group>(null!);
  const { actions, mixer } = useAnimations(animations, group);

  // Apply hologram material (transparent, additive, neon tint).
  useEffect(() => {
    const tint = new THREE.Color(spawn.tint);
    cloned.traverse((o: any) => {
      if (o.isMesh) {
        o.castShadow = false;
        o.receiveShadow = false;
        o.material = new THREE.MeshBasicMaterial({
          color: tint,
          transparent: true,
          opacity: 0.55,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          wireframe: false,
        });
      }
    });
  }, [cloned, spawn.tint]);

  // Play the chosen animation (clip name fallback: try exact, then case-insensitive).
  useEffect(() => {
    if (!actions || !animations?.length) return;
    const want = spawn.action;
    const key =
      Object.keys(actions).find((k) => k === want) ||
      Object.keys(actions).find((k) => k.toLowerCase() === want.toLowerCase()) ||
      Object.keys(actions)[0];
    const a = key ? actions[key] : null;
    a?.reset().fadeIn(0.3).play();
    return () => {
      a?.fadeOut(0.3);
    };
  }, [actions, animations, spawn.action]);

  // Travel across the scene; remove when off-screen.
  const startX = useRef(spawn.dir === 1 ? -8 : 8);
  useFrame((_, dt) => {
    mixer?.update(dt);
    const g = group.current;
    if (!g) return;
    g.position.x += spawn.dir * spawn.speed * dt;
    g.position.z = spawn.z;
    g.rotation.y = spawn.dir === 1 ? Math.PI / 2 : -Math.PI / 2;
    // flicker opacity slightly for hologram feel
    const t = performance.now() / 1000;
    const flick = 0.45 + 0.2 * Math.sin(t * 8 + spawn.id);
    g.traverse((o: any) => {
      if (o.isMesh && o.material) o.material.opacity = flick;
    });
    if (Math.abs(g.position.x) > 9 || (spawn.speed === 0 && performance.now() - spawn.startAt > 6000)) {
      onDone(spawn.id);
    }
  });

  return (
    <group ref={group} position={[startX.current, -1.4, spawn.z]} scale={1}>
      <primitive object={cloned} />
    </group>
  );
};

const Stage = ({ figures, removeFigure }: { figures: Spawn[]; removeFigure: (id: number) => void }) => {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0.4, 6);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#ff66ff" />
      <pointLight position={[-5, 3, 5]} intensity={0.8} color="#66ffff" />
      <Suspense fallback={null}>
        {figures.map((f) => (
          <HoloFigure key={f.id} spawn={f} onDone={removeFigure} />
        ))}
      </Suspense>
    </>
  );
};

export const HologramOverlay = () => {
  const [figures, setFigures] = useState<Spawn[]>([]);

  // Respect prefers-reduced-motion
  const reduce = useMemo(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      setFigures((arr) => [...arr.slice(-2), spawnOne()]);
      const next = 9000 + Math.random() * 14000;
      window.setTimeout(tick, next);
    };
    const first = window.setTimeout(tick, 3000);
    return () => {
      cancelled = true;
      window.clearTimeout(first);
    };
  }, [reduce]);

  const removeFigure = (id: number) =>
    setFigures((arr) => arr.filter((f) => f.id !== id));

  if (reduce) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5]"
      style={{ mixBlendMode: "screen" }}
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.4, 6], fov: 45 }}
        style={{ background: "transparent" }}
      >
        <Stage figures={figures} removeFigure={removeFigure} />
      </Canvas>
    </div>
  );
};

export default HologramOverlay;