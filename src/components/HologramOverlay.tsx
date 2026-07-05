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
  // Per-model base scale & y-offset so every figure stays fully inside the
  // viewport (no giant robots clipping out of the page).
  { url: "https://threejs.org/examples/models/gltf/Soldier.glb",     baseScale: 1.0, baseY: -1.4 },
  { url: "https://threejs.org/examples/models/gltf/Xbot.glb",        baseScale: 1.0, baseY: -1.4 },
  { url: "https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb", baseScale: 0.45, baseY: -1.2 },
] as const;
// Preload on any non-reduced-motion device — we want max GPU usage when allowed.
if (typeof window !== "undefined") {
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    MODELS.forEach((m) => useGLTF.preload(m.url));
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

// Rich palette of actions — sport, humor, dance, daily life. We try them on
// every model and fall back gracefully when the clip is missing.
const ACTIONS = [
  "Dance", "Wave", "Jump", "ThumbsUp", "Yes", "No", "Punch",
  "Walk", "Run", "Idle", "Sitting", "Standing", "Death",
] as const;
type ActionName = typeof ACTIONS[number];

type Spawn = {
  id: number;
  url: string;
  baseScale: number;
  baseY: number;
  dir: 1 | -1;
  z: number;
  tint: string;
  action: ActionName;
  speed: number;
  startAt: number;
  scale: number;
  spin: number;
};

let uid = 1;
const spawnOne = (): Spawn => {
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  const stationary = action !== "Walk" && action !== "Run";
  const m = MODELS[Math.floor(Math.random() * MODELS.length)];
  return {
    id: uid++,
    url: m.url,
    baseScale: m.baseScale,
    baseY: m.baseY,
    dir: Math.random() < 0.5 ? 1 : -1,
    z: -1.5 + Math.random() * 2.5,
    tint: TINTS[Math.floor(Math.random() * TINTS.length)],
    action,
    speed: action === "Run" ? 2.6 : action === "Walk" ? 1.3 : 0,
    // Smaller, well-contained figures so they fit inside the page.
    scale: m.baseScale * (0.7 + Math.random() * 0.35),
    spin: stationary ? (Math.random() - 0.5) * 0.6 : 0,
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
  const stationary = spawn.speed === 0;
  const startX = useRef(
    stationary ? (Math.random() - 0.5) * 8 : spawn.dir === 1 ? -8 : 8
  );
  useFrame((_, dt) => {
    mixer?.update(dt);
    const g = group.current;
    if (!g) return;
    g.position.x += spawn.dir * spawn.speed * dt;
    g.position.z = spawn.z;
    if (stationary) {
      g.rotation.y += spawn.spin * dt;
    } else {
      g.rotation.y = spawn.dir === 1 ? Math.PI / 2 : -Math.PI / 2;
    }
    // flicker opacity slightly for hologram feel
    const t = performance.now() / 1000;
    const flick = 0.5 + 0.22 * Math.sin(t * 8 + spawn.id);
    g.traverse((o: any) => {
      if (o.isMesh && o.material) o.material.opacity = flick;
    });
    if (Math.abs(g.position.x) > 9 || (stationary && performance.now() - spawn.startAt > 12000)) {
      onDone(spawn.id);
    }
  });

  return (
    <group ref={group} position={[startX.current, spawn.baseY, spawn.z]} scale={spawn.scale}>
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
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#ff66ff" />
      <pointLight position={[-5, 3, 5]} intensity={1.2} color="#66ffff" />
      <pointLight position={[0, 6, -3]} intensity={0.9} color="#a78bfa" />
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
  const [visible, setVisible] = useState<boolean>(typeof document === "undefined" ? true : !document.hidden);

  // Only opt out for explicit reduced-motion preference — otherwise we go all in.
  const skip = useMemo(() => {
    if (typeof window === "undefined") return true;
    return !!window.matchMedia?.("(prefers-reduced-motion: reduce), (pointer: coarse), (max-width: 767px)").matches;
  }, []);

  // Limit concurrent figures on small viewports to keep things smooth.
  const maxFigures = useMemo(() => {
    if (typeof window === "undefined") return 3;
    return window.innerWidth < 768 ? 2 : window.innerWidth < 1280 ? 3 : 4;
  }, []);

  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (skip) return;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      setFigures((arr) => [...arr.slice(-(maxFigures - 1)), spawnOne()]);
      const next = 4500 + Math.random() * 9000;
      window.setTimeout(tick, next);
    };
    const first = window.setTimeout(tick, 1500);
    return () => {
      cancelled = true;
      window.clearTimeout(first);
    };
  }, [skip, maxFigures]);

  const removeFigure = (id: number) =>
    setFigures((arr) => arr.filter((f) => f.id !== id));

  if (skip) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5]"
      style={{ mixBlendMode: "screen", pointerEvents: "none" }}
    >
      <Canvas
        dpr={[1, 2]}
        frameloop={visible ? "always" : "never"}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        }}
        camera={{ position: [0, 0.4, 6], fov: 45 }}
        style={{ background: "transparent", pointerEvents: "none" }}
      >
        <Stage figures={figures} removeFigure={removeFigure} />
      </Canvas>
    </div>
  );
};

export default HologramOverlay;