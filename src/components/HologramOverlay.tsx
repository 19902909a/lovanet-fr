import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Animated 3D humanoid holograms rendered in a fullscreen transparent Canvas.
 * Built from local procedural geometry so they always appear, without external GLB loading.
 */

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

const ACTIONS = [
  "walk", "run", "wave", "dance", "jump", "idle", "spin",
] as const;
type ActionName = typeof ACTIONS[number];

type Spawn = {
  id: number;
  dir: 1 | -1;
  z: number;
  y: number;
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
  const stationary = action !== "walk" && action !== "run";
  return {
    id: uid++,
    dir: Math.random() < 0.5 ? 1 : -1,
    z: -1.2 + Math.random() * 2.4,
    y: -1.85 + Math.random() * 0.35,
    tint: TINTS[Math.floor(Math.random() * TINTS.length)],
    action,
    speed: action === "run" ? 2.45 : action === "walk" ? 1.25 : 0,
    scale: 0.82 + Math.random() * 0.42,
    spin: stationary ? (Math.random() - 0.5) * 0.6 : 0,
    startAt: performance.now(),
  };
};

const HoloFigure = ({ spawn, onDone }: { spawn: Spawn; onDone: (id: number) => void }) => {
  const group = useRef<THREE.Group>(null!);
  const head = useRef<THREE.Mesh>(null!);
  const body = useRef<THREE.Mesh>(null!);
  const leftArm = useRef<THREE.Group>(null!);
  const rightArm = useRef<THREE.Group>(null!);
  const leftLeg = useRef<THREE.Group>(null!);
  const rightLeg = useRef<THREE.Group>(null!);

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(spawn.tint),
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false,
      }),
    [spawn.tint]
  );

  const wireMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#ffffff"),
        transparent: true,
        opacity: 0.42,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false,
        wireframe: true,
      }),
    []
  );

  // Travel across the scene; remove when off-screen.
  const stationary = spawn.speed === 0;
  const startX = useRef(
    stationary ? (Math.random() - 0.5) * 8 : spawn.dir === 1 ? -8 : 8
  );
  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    g.position.x += spawn.dir * spawn.speed * dt;
    g.position.z = spawn.z;
    g.position.y = spawn.y + Math.sin(performance.now() / 320 + spawn.id) * 0.04;

    const t = performance.now() / 1000;
    const phase = t * (spawn.action === "run" ? 9 : 5.6) + spawn.id;
    const stride = Math.sin(phase);

    if (stationary) {
      g.rotation.y += (spawn.action === "spin" ? 1.15 : spawn.spin) * dt;
    } else {
      g.rotation.y = spawn.dir === 1 ? Math.PI / 2 : -Math.PI / 2;
    }

    leftLeg.current.rotation.x = stride * 0.8;
    rightLeg.current.rotation.x = -stride * 0.8;
    leftArm.current.rotation.x = -stride * 0.7;
    rightArm.current.rotation.x = stride * 0.7;

    if (spawn.action === "wave") {
      rightArm.current.rotation.z = -1.9 + Math.sin(t * 8) * 0.34;
      rightArm.current.rotation.x = -0.25;
    } else if (spawn.action === "dance") {
      leftArm.current.rotation.z = 1.25 + Math.sin(t * 7) * 0.45;
      rightArm.current.rotation.z = -1.25 + Math.cos(t * 7) * 0.45;
      body.current.rotation.z = Math.sin(t * 5) * 0.14;
    } else if (spawn.action === "jump") {
      g.position.y += Math.abs(Math.sin(t * 4.6)) * 0.34;
      leftArm.current.rotation.z = 1.55;
      rightArm.current.rotation.z = -1.55;
    }

    head.current.rotation.y = Math.sin(t * 2.8 + spawn.id) * 0.22;

    const flick = 0.74 + 0.2 * Math.sin(t * 9 + spawn.id);
    material.opacity = flick;
    wireMaterial.opacity = 0.34 + 0.12 * Math.sin(t * 13 + spawn.id);

    if (Math.abs(g.position.x) > 9 || (stationary && performance.now() - spawn.startAt > 12000)) {
      onDone(spawn.id);
    }
  });

  return (
    <group ref={group} position={[startX.current, spawn.y, spawn.z]} scale={spawn.scale}>
      <group>
        <mesh ref={head} position={[0, 1.82, 0]} material={material} renderOrder={9999}>
          <sphereGeometry args={[0.23, 24, 20]} />
        </mesh>
        <mesh position={[0, 1.82, 0]} material={wireMaterial} renderOrder={10000}>
          <sphereGeometry args={[0.245, 12, 10]} />
        </mesh>

        <mesh ref={body} position={[0, 1.18, 0]} material={material} renderOrder={9999}>
          <capsuleGeometry args={[0.28, 0.72, 8, 20]} />
        </mesh>
        <mesh position={[0, 1.18, 0]} material={wireMaterial} renderOrder={10000}>
          <capsuleGeometry args={[0.295, 0.74, 6, 10]} />
        </mesh>

        <group ref={leftArm} position={[-0.34, 1.43, 0]}>
          <mesh position={[0, -0.34, 0]} rotation={[0, 0, 0.12]} material={material} renderOrder={9999}>
            <capsuleGeometry args={[0.07, 0.62, 6, 12]} />
          </mesh>
        </group>
        <group ref={rightArm} position={[0.34, 1.43, 0]}>
          <mesh position={[0, -0.34, 0]} rotation={[0, 0, -0.12]} material={material} renderOrder={9999}>
            <capsuleGeometry args={[0.07, 0.62, 6, 12]} />
          </mesh>
        </group>

        <group ref={leftLeg} position={[-0.14, 0.72, 0]}>
          <mesh position={[0, -0.44, 0]} material={material} renderOrder={9999}>
            <capsuleGeometry args={[0.085, 0.78, 6, 12]} />
          </mesh>
        </group>
        <group ref={rightLeg} position={[0.14, 0.72, 0]}>
          <mesh position={[0, -0.44, 0]} material={material} renderOrder={9999}>
            <capsuleGeometry args={[0.085, 0.78, 6, 12]} />
          </mesh>
        </group>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.18, 0]} material={material} renderOrder={9998}>
          <ringGeometry args={[0.48, 0.55, 48]} />
        </mesh>
      </group>
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
      {figures.map((f) => (
        <HoloFigure key={f.id} spawn={f} onDone={removeFigure} />
      ))}
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