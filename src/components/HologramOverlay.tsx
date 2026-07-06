import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

/**
 * Animated 3D holograms rendered in a fullscreen transparent Canvas.
 * Uses the original GLB characters from the captures: humanoid + expressive robot.
 */

const MODELS = [
  {
    url: "https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb",
    kind: "robot",
    scale: 0.62,
    y: -1.45,
    actions: ["Walking", "Running", "Dance", "Wave", "Jump", "Idle", "Yes", "No", "Punch", "ThumbsUp"],
  },
  {
    url: "https://threejs.org/examples/models/gltf/Soldier.glb",
    kind: "soldier",
    scale: 1.05,
    y: -1.52,
    actions: ["Walk", "Run", "Idle"],
  },
  {
    url: "https://threejs.org/examples/models/gltf/Xbot.glb",
    kind: "human",
    scale: 1.0,
    y: -1.52,
    actions: ["walking", "running", "dance", "wave", "idle"],
  },
] as const;

if (typeof window !== "undefined") {
  MODELS.forEach((model) => useGLTF.preload(model.url));
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
  kind: string;
  dir: 1 | -1;
  z: number;
  y: number;
  baseScale: number;
  tint: string;
  action: string;
  speed: number;
  startAt: number;
  scale: number;
  spin: number;
};

let uid = 1;
const spawnOne = (): Spawn => {
  const model = MODELS[Math.floor(Math.random() * MODELS.length)];
  const action = model.actions[Math.floor(Math.random() * model.actions.length)];
  const low = action.toLowerCase();
  const moving = low.includes("walk") || low.includes("run");
  return {
    id: uid++,
    url: model.url,
    kind: model.kind,
    dir: Math.random() < 0.5 ? 1 : -1,
    z: -1.2 + Math.random() * 2.4,
    y: model.y + Math.random() * 0.18,
    baseScale: model.scale,
    tint: model.kind === "robot" ? "#7dd3fc" : TINTS[Math.floor(Math.random() * TINTS.length)],
    action,
    speed: low.includes("run") ? 2.25 : low.includes("walk") ? 1.18 : 0,
    scale: model.scale * (0.86 + Math.random() * 0.2),
    spin: moving ? 0 : (Math.random() - 0.5) * 0.55,
    startAt: performance.now(),
  };
};

const HoloFigure = ({ spawn, onDone }: { spawn: Spawn; onDone: (id: number) => void }) => {
  const { scene, animations } = useGLTF(spawn.url) as any;
  const cloned = useMemo(() => SkeletonUtils.clone(scene) as THREE.Object3D, [scene]);
  const group = useRef<THREE.Group>(null!);
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    const tint = new THREE.Color(spawn.tint);
    cloned.traverse((object: any) => {
      if (!object.isMesh) return;
      object.frustumCulled = false;
      object.castShadow = false;
      object.receiveShadow = false;
      object.renderOrder = 10000;
      object.material = new THREE.MeshBasicMaterial({
        color: tint,
        transparent: true,
        opacity: spawn.kind === "robot" ? 0.66 : 0.72,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false,
      });
    });
  }, [cloned, spawn.kind, spawn.tint]);

  useEffect(() => {
    const keys = Object.keys(actions || {});
    if (!keys.length) return;
    const wanted = spawn.action.toLowerCase();
    const key =
      keys.find((name) => name.toLowerCase() === wanted) ||
      keys.find((name) => name.toLowerCase().includes(wanted)) ||
      keys.find((name) => wanted.includes(name.toLowerCase())) ||
      keys[0];
    const action = actions[key];
    action?.reset().fadeIn(0.25).play();
    return () => {
      action?.fadeOut(0.2);
    };
  }, [actions, spawn.action]);

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
    g.position.y = spawn.y + Math.sin(performance.now() / 320 + spawn.id) * 0.04;

    const t = performance.now() / 1000;

    if (stationary) {
      g.rotation.y += spawn.spin * dt;
    } else {
      g.rotation.y = spawn.dir === 1 ? Math.PI / 2 : -Math.PI / 2;
    }
    if (spawn.action.toLowerCase().includes("jump")) {
      g.position.y += Math.abs(Math.sin(t * 4.6)) * 0.34;
    }
    const flick = 0.58 + 0.16 * Math.sin(t * 9 + spawn.id);
    g.traverse((object: any) => {
      if (object.isMesh && object.material) object.material.opacity = flick;
    });

    if (Math.abs(g.position.x) > 9 || (stationary && performance.now() - spawn.startAt > 12000)) {
      onDone(spawn.id);
    }
  });

  return (
    <group ref={group} position={[startX.current, spawn.y, spawn.z]} scale={spawn.scale}>
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
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      setFigures((arr) => [...arr.slice(-(maxFigures - 1)), spawnOne()]);
      const next = 4500 + Math.random() * 9000;
      window.setTimeout(tick, next);
    };
    setFigures([spawnOne(), spawnOne()]);
    const first = window.setTimeout(tick, 1500);
    return () => {
      cancelled = true;
      window.clearTimeout(first);
    };
  }, [maxFigures]);

  const removeFigure = (id: number) =>
    setFigures((arr) => arr.filter((f) => f.id !== id));

  return (
    <div
      aria-hidden
      data-hologram-overlay
      className="pointer-events-none fixed inset-0 h-screen w-screen overflow-visible z-[9998]"
      style={{ pointerEvents: "none", isolation: "isolate", zIndex: 2147483000 }}
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
        style={{ width: "100vw", height: "100vh", background: "transparent", pointerEvents: "none" }}
      >
        <Stage figures={figures} removeFigure={removeFigure} />
      </Canvas>
    </div>
  );
};

export default HologramOverlay;