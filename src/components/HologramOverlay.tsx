import { Suspense, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

/**
 * Fullscreen holographic overlay: animated humanoids + procedural objects
 * (house, pool, garden, city, motorcycle, fountain, mountain, boat, yacht,
 * speaker...). Click a hologram to trigger a particle burst + animation swap.
 */

type GlbDef = {
  url: string;
  kind: "robot" | "soldier" | "human";
  scale: number;
  y: number;
  facing: number;
  loco: { walk?: string; run?: string; idle: string; dance?: string; wave?: string; jump?: string };
  extra: string[];
};

const GLBS: GlbDef[] = [
  {
    url: "https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb",
    kind: "robot",
    scale: 0.35,
    y: -1.25,
    facing: -Math.PI / 2,
    loco: { walk: "Walking", run: "Running", idle: "Idle", dance: "Dance", wave: "Wave", jump: "Jump" },
    extra: ["Yes", "No", "Punch", "ThumbsUp"],
  },
  {
    url: "https://threejs.org/examples/models/gltf/Soldier.glb",
    kind: "soldier",
    scale: 0.6,
    y: -1.35,
    facing: Math.PI / 2,
    loco: { walk: "Walk", run: "Run", idle: "Idle" },
    extra: [],
  },
  {
    url: "https://threejs.org/examples/models/gltf/Xbot.glb",
    kind: "human",
    scale: 1.0,
    y: -1.52,
    facing: Math.PI / 2,
    loco: { idle: "idle" },
    extra: [],
  },
];

if (typeof window !== "undefined") {
  GLBS.forEach((m) => useGLTF.preload(m.url));
}

const TINTS = [
  "#22d3ee", "#f472b6", "#a78bfa", "#34d399", "#fbbf24",
  "#60a5fa", "#fb7185", "#ffffff", "#e879f9", "#fde047",
  "#4ade80", "#f87171", "#38bdf8", "#c084fc",
];

const holoMat = (tint: string, opacity = 0.7, wireframe = true) =>
  new THREE.MeshBasicMaterial({
    color: new THREE.Color(tint),
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    depthWrite: false,
    wireframe,
  });

const addMesh = (
  parent: THREE.Object3D,
  geo: THREE.BufferGeometry,
  tint: string,
  pos: [number, number, number],
  rot: [number, number, number] = [0, 0, 0]
) => {
  const m = new THREE.Mesh(geo, holoMat(tint));
  m.position.set(...pos);
  m.rotation.set(...rot);
  m.renderOrder = 10000;
  parent.add(m);
  return m;
};

const OBJECT_BUILDERS = {
  house: (tint: string) => {
    const g = new THREE.Group();
    addMesh(g, new THREE.BoxGeometry(2, 1.3, 1.6), tint, [0, 0, 0]);
    addMesh(g, new THREE.ConeGeometry(1.5, 1, 4), tint, [0, 1.15, 0], [0, Math.PI / 4, 0]);
    addMesh(g, new THREE.BoxGeometry(0.35, 0.6, 0.05), tint, [0, -0.35, 0.83]);
    return g;
  },
  pool: (tint: string) => {
    const g = new THREE.Group();
    addMesh(g, new THREE.BoxGeometry(3, 0.1, 1.6), tint, [0, 0, 0]);
    addMesh(g, new THREE.PlaneGeometry(2.8, 1.4), tint, [0, 0.06, 0], [-Math.PI / 2, 0, 0]);
    return g;
  },
  garden: (tint: string) => {
    const g = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const x = (i - 2) * 0.5;
      addMesh(g, new THREE.ConeGeometry(0.25, 0.9, 8), tint, [x, 0.1, 0]);
      addMesh(g, new THREE.CylinderGeometry(0.05, 0.05, 0.3, 6), tint, [x, -0.35, 0]);
    }
    return g;
  },
  city: (tint: string) => {
    const g = new THREE.Group();
    for (let i = 0; i < 8; i++) {
      const h = 0.6 + Math.random() * 2.4;
      addMesh(g, new THREE.BoxGeometry(0.5, h, 0.5), tint, [(i - 3.5) * 0.55, h / 2 - 1, 0]);
    }
    return g;
  },
  motorcycle: (tint: string) => {
    const g = new THREE.Group();
    addMesh(g, new THREE.TorusGeometry(0.35, 0.08, 8, 16), tint, [-0.7, -0.35, 0], [0, Math.PI / 2, 0]);
    addMesh(g, new THREE.TorusGeometry(0.35, 0.08, 8, 16), tint, [0.7, -0.35, 0], [0, Math.PI / 2, 0]);
    addMesh(g, new THREE.BoxGeometry(1.3, 0.25, 0.2), tint, [0, 0, 0]);
    addMesh(g, new THREE.BoxGeometry(0.25, 0.4, 0.15), tint, [0.55, 0.25, 0]);
    return g;
  },
  fountain: (tint: string) => {
    const g = new THREE.Group();
    addMesh(g, new THREE.CylinderGeometry(1, 1.1, 0.3, 24), tint, [0, -0.5, 0]);
    addMesh(g, new THREE.CylinderGeometry(0.5, 0.6, 0.25, 20), tint, [0, -0.1, 0]);
    addMesh(g, new THREE.CylinderGeometry(0.06, 0.06, 1.4, 8), tint, [0, 0.5, 0]);
    return g;
  },
  mountain: (tint: string) => {
    const g = new THREE.Group();
    addMesh(g, new THREE.ConeGeometry(1.6, 2.4, 5), tint, [0, 0.2, 0]);
    addMesh(g, new THREE.ConeGeometry(1.1, 1.7, 5), tint, [-1.3, -0.15, 0.2]);
    return g;
  },
  boat: (tint: string) => {
    const g = new THREE.Group();
    const hull = new THREE.Mesh(
      new THREE.SphereGeometry(1, 12, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
      holoMat(tint)
    );
    hull.scale.set(1.6, 0.5, 0.7);
    hull.renderOrder = 10000;
    g.add(hull);
    addMesh(g, new THREE.BoxGeometry(0.8, 0.4, 0.5), tint, [0, 0.2, 0]);
    addMesh(g, new THREE.CylinderGeometry(0.05, 0.05, 1.5, 6), tint, [0, 0.9, 0]);
    return g;
  },
  yacht: (tint: string) => {
    const g = new THREE.Group();
    const hull = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 1), holoMat(tint));
    hull.position.y = -0.3;
    hull.renderOrder = 10000;
    g.add(hull);
    addMesh(g, new THREE.BoxGeometry(1.6, 0.5, 0.8), tint, [0.1, 0.05, 0]);
    addMesh(g, new THREE.BoxGeometry(0.9, 0.4, 0.7), tint, [0.2, 0.45, 0]);
    addMesh(g, new THREE.CylinderGeometry(0.05, 0.05, 1.2, 6), tint, [-0.3, 1.1, 0]);
    return g;
  },
  speaker: (tint: string) => {
    const g = new THREE.Group();
    addMesh(g, new THREE.BoxGeometry(0.9, 1.6, 0.7), tint, [0, 0, 0]);
    addMesh(g, new THREE.CircleGeometry(0.28, 20), tint, [0, 0.35, 0.36]);
    addMesh(g, new THREE.CircleGeometry(0.18, 20), tint, [0, -0.3, 0.36]);
    return g;
  },
};

type ObjectKey = keyof typeof OBJECT_BUILDERS;

type Variant = {
  id: string;
  category: "human" | "object";
  label: string;
  buildKey?: ObjectKey;
  glbIndex?: number;
  tint: string;
  scaleMul: number;
  preferredAction?: "dance" | "walk" | "run" | "idle" | "wave" | "jump";
};

const buildVariants = (): Variant[] => {
  const out: Variant[] = [];
  const labels = ["dancer", "young", "man", "woman", "robot"];
  labels.forEach((label, i) => {
    for (let k = 0; k < 14; k++) {
      out.push({
        id: `${label}-${k}`,
        category: "human",
        label,
        glbIndex: i % GLBS.length,
        tint: TINTS[(i * 3 + k) % TINTS.length],
        scaleMul: 0.85 + Math.random() * 0.35,
        preferredAction:
          label === "dancer" ? "dance"
          : label === "young" ? "run"
          : label === "robot" ? (Math.random() < 0.5 ? "wave" : "jump")
          : Math.random() < 0.6 ? "walk" : "idle",
      });
    }
  });
  (Object.keys(OBJECT_BUILDERS) as ObjectKey[]).forEach((key) => {
    for (let k = 0; k < 4; k++) {
      out.push({
        id: `${key}-${k}`,
        category: "object",
        label: key,
        buildKey: key,
        tint: TINTS[(key.length + k) % TINTS.length],
        scaleMul: 0.9 + Math.random() * 0.3,
      });
    }
  });
  return out;
};

type Spawn = {
  id: number;
  variant: Variant;
  dir: 1 | -1;
  x: number;
  y: number;
  z: number;
  scale: number;
  action: string;
  speed: number;
  spin: number;
  bornAt: number;
};

const VARIANTS = buildVariants();
let uid = 1;

const pickAction = (v: Variant): { action: string; speed: number; spin: number } => {
  if (v.category === "object") {
    return { action: "idle", speed: 0, spin: (Math.random() - 0.5) * 0.4 };
  }
  const p = v.preferredAction ?? (Math.random() < 0.5 ? "walk" : "idle");
  if (p === "run") return { action: "run", speed: 2.1, spin: 0 };
  if (p === "walk") return { action: "walk", speed: 1.1, spin: 0 };
  if (p === "dance") return { action: "dance", speed: 0, spin: 0 };
  if (p === "wave") return { action: "wave", speed: 0, spin: 0 };
  if (p === "jump") return { action: "jump", speed: 0, spin: 0 };
  return { action: "idle", speed: 0, spin: (Math.random() - 0.5) * 0.3 };
};

const spawnOne = (): Spawn => {
  const v = VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
  const { action, speed, spin } = pickAction(v);
  const glb = v.glbIndex != null ? GLBS[v.glbIndex] : null;
  const baseY = glb ? glb.y : -0.6;
  const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
  const stationary = speed === 0;
  return {
    id: uid++,
    variant: v,
    dir,
    x: stationary ? (Math.random() - 0.5) * 8 : dir === 1 ? -8.5 : 8.5,
    y: baseY + Math.random() * 0.25,
    z: -1.4 + Math.random() * 2.6,
    scale: (glb ? glb.scale : 0.7) * v.scaleMul,
    action,
    speed,
    spin,
    bornAt: performance.now(),
  };
};

type Burst = { id: number; pos: THREE.Vector3; color: string; bornAt: number };

const BurstFX = ({ burst, onDone }: { burst: Burst; onDone: (id: number) => void }) => {
  const ref = useRef<THREE.Points>(null!);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 80;
    const pos = new Float32Array(n * 3);
    const vel = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = 0; pos[i * 3 + 1] = 0; pos[i * 3 + 2] = 0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const s = 2 + Math.random() * 3;
      vel[i * 3] = Math.sin(phi) * Math.cos(theta) * s;
      vel[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * s;
      vel[i * 3 + 2] = Math.cos(phi) * s;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("velocity", new THREE.BufferAttribute(vel, 3));
    return g;
  }, []);
  const mat = useMemo(
    () => new THREE.PointsMaterial({
      color: new THREE.Color(burst.color),
      size: 0.12,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
    }),
    [burst.color]
  );

  useFrame((_, dt) => {
    const age = (performance.now() - burst.bornAt) / 1000;
    if (age > 1.1) { onDone(burst.id); return; }
    const pos = geo.getAttribute("position") as THREE.BufferAttribute;
    const vel = geo.getAttribute("velocity") as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      (pos.array as Float32Array)[i * 3] += (vel.array as Float32Array)[i * 3] * dt;
      (pos.array as Float32Array)[i * 3 + 1] += (vel.array as Float32Array)[i * 3 + 1] * dt - 1.2 * dt;
      (pos.array as Float32Array)[i * 3 + 2] += (vel.array as Float32Array)[i * 3 + 2] * dt;
    }
    pos.needsUpdate = true;
    mat.opacity = Math.max(0, 1 - age / 1.1);
  });

  return <points ref={ref} geometry={geo} material={mat} position={burst.pos} renderOrder={20000} />;
};

const HumanoidFigure = ({
  spawn,
  onDone,
  onClickBurst,
}: {
  spawn: Spawn;
  onDone: (id: number) => void;
  onClickBurst: (id: number, pos: THREE.Vector3, color: string) => void;
}) => {
  const glb = GLBS[spawn.variant.glbIndex!];
  const { scene, animations } = useGLTF(glb.url) as any;
  const cloned = useMemo(() => SkeletonUtils.clone(scene) as THREE.Object3D, [scene]);
  const group = useRef<THREE.Group>(null!);
  const { actions, mixer } = useAnimations(animations, group);
  const [action, setAction] = useState<string>(spawn.action);
  const speedRef = useRef(spawn.speed);
  const spinRef = useRef(spawn.spin);

  useEffect(() => {
    const tint = new THREE.Color(spawn.variant.tint);
    cloned.traverse((o: any) => {
      if (!o.isMesh) return;
      o.frustumCulled = false;
      o.renderOrder = 10000;
      o.material = new THREE.MeshBasicMaterial({
        color: tint,
        transparent: true,
        opacity: 0.72,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        depthWrite: false,
      });
    });
  }, [cloned, spawn.variant.tint]);

  useEffect(() => {
    const keys = Object.keys(actions || {});
    if (!keys.length) return;
    const loco = glb.loco as Record<string, string | undefined>;
    const target = loco[action] || glb.extra[Math.floor(Math.random() * (glb.extra.length || 1))] || keys[0];
    const wanted = (target || "").toLowerCase();
    const key =
      keys.find((n) => n.toLowerCase() === wanted) ||
      keys.find((n) => n.toLowerCase().includes(wanted)) ||
      keys[0];
    const clip = actions[key];
    clip?.reset().fadeIn(0.25).play();
    return () => { clip?.fadeOut(0.2); };
  }, [actions, action, glb]);

  const posRef = useRef(new THREE.Vector3(spawn.x, spawn.y, spawn.z));

  useFrame((_, dt) => {
    mixer?.update(dt);
    const g = group.current;
    if (!g) return;
    const isLoco = action === "walk" || action === "run";
    if (isLoco) {
      posRef.current.x += spawn.dir * speedRef.current * dt;
      g.rotation.y = spawn.dir === 1 ? glb.facing : glb.facing + Math.PI;
    } else {
      g.rotation.y += spinRef.current * dt;
    }
    const t = performance.now() / 1000;
    g.position.set(
      posRef.current.x,
      posRef.current.y + Math.sin(t * 1.3 + spawn.id) * 0.03 + (action === "jump" ? Math.abs(Math.sin(t * 4.6)) * 0.34 : 0),
      posRef.current.z
    );
    const flick = 0.6 + 0.14 * Math.sin(t * 9 + spawn.id);
    cloned.traverse((o: any) => {
      if (o.isMesh && o.material) o.material.opacity = flick;
    });
    if (Math.abs(posRef.current.x) > 9.5 || (!isLoco && performance.now() - spawn.bornAt > 15000)) {
      onDone(spawn.id);
    }
  });

  const handleClick = useCallback((e: any) => {
    e.stopPropagation();
    onClickBurst(spawn.id, group.current.position.clone(), spawn.variant.tint);
    const options = ["dance", "wave", "jump", "walk", "run", "idle"];
    setAction(options[Math.floor(Math.random() * options.length)]);
    speedRef.current = 0;
    spinRef.current = 1.2;
  }, [onClickBurst, spawn.id, spawn.variant.tint]);

  return (
    <group
      ref={group}
      position={[spawn.x, spawn.y, spawn.z]}
      scale={spawn.scale}
      onClick={handleClick}
    >
      <primitive object={cloned} />
    </group>
  );
};

const ObjectFigure = ({
  spawn,
  onDone,
  onClickBurst,
}: {
  spawn: Spawn;
  onDone: (id: number) => void;
  onClickBurst: (id: number, pos: THREE.Vector3, color: string) => void;
}) => {
  const group = useRef<THREE.Group>(null!);
  const built = useMemo(
    () => OBJECT_BUILDERS[spawn.variant.buildKey!](spawn.variant.tint),
    [spawn.variant.buildKey, spawn.variant.tint]
  );
  const spinRef = useRef(spawn.spin || 0.3);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += spinRef.current * dt;
    const t = performance.now() / 1000;
    g.position.y = spawn.y + Math.sin(t * 1.1 + spawn.id) * 0.08;
    const flick = 0.55 + 0.2 * Math.sin(t * 7 + spawn.id);
    built.traverse((o: any) => {
      if (o.isMesh && o.material) o.material.opacity = flick;
    });
    if (performance.now() - spawn.bornAt > 14000) onDone(spawn.id);
  });

  const handleClick = useCallback((e: any) => {
    e.stopPropagation();
    onClickBurst(spawn.id, group.current.position.clone(), spawn.variant.tint);
    spinRef.current = 2.5;
  }, [onClickBurst, spawn.id, spawn.variant.tint]);

  return (
    <group ref={group} position={[spawn.x, spawn.y, spawn.z]} scale={spawn.scale} onClick={handleClick}>
      <primitive object={built} />
    </group>
  );
};

const Stage = ({
  figures,
  bursts,
  removeFigure,
  removeBurst,
  addBurst,
}: {
  figures: Spawn[];
  bursts: Burst[];
  removeFigure: (id: number) => void;
  removeBurst: (id: number) => void;
  addBurst: (id: number, pos: THREE.Vector3, color: string) => void;
}) => {
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
        {figures.map((f) =>
          f.variant.category === "human" ? (
            <HumanoidFigure key={f.id} spawn={f} onDone={removeFigure} onClickBurst={addBurst} />
          ) : (
            <ObjectFigure key={f.id} spawn={f} onDone={removeFigure} onClickBurst={addBurst} />
          )
        )}
      </Suspense>
      {bursts.map((b) => (
        <BurstFX key={b.id} burst={b} onDone={removeBurst} />
      ))}
    </>
  );
};

// Concurrency caps: strict, per-category. New spawn only when a slot is free.
const MAX_HUMANS = 2;
const MAX_OBJECTS = 1;

const spawnHuman = (): Spawn => {
  // Force a human variant.
  let v: Variant;
  do { v = VARIANTS[Math.floor(Math.random() * VARIANTS.length)]; } while (v.category !== "human");
  return spawnFromVariant(v);
};
const spawnObject = (): Spawn => {
  let v: Variant;
  do { v = VARIANTS[Math.floor(Math.random() * VARIANTS.length)]; } while (v.category !== "object");
  return spawnFromVariant(v);
};
const spawnFromVariant = (v: Variant): Spawn => {
  const { action, speed, spin } = pickAction(v);
  const glb = v.glbIndex != null ? GLBS[v.glbIndex] : null;
  const baseY = glb ? glb.y : -0.6;
  const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
  const stationary = speed === 0;
  return {
    id: uid++,
    variant: v,
    dir,
    x: stationary ? (Math.random() - 0.5) * 8 : dir === 1 ? -8.5 : 8.5,
    y: baseY + Math.random() * 0.25,
    z: -1.4 + Math.random() * 2.6,
    scale: (glb ? glb.scale : 0.7) * v.scaleMul,
    action,
    speed,
    spin,
    bornAt: performance.now(),
  };
};

export const HologramOverlay = () => {
  const [figures, setFigures] = useState<Spawn[]>([]);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [visible, setVisible] = useState<boolean>(typeof document === "undefined" ? true : !document.hidden);
  const [clipPath, setClipPath] = useState<string | undefined>(undefined);

  // Cut the hologram overlay around video players, iframes and elements marked
  // with data-hologram-block so the 3D figures never cover them.
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const selectors = "video, iframe, [data-hologram-block]";
      const rects: DOMRect[] = [];
      document.querySelectorAll<HTMLElement>(selectors).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width < 24 || r.height < 24) return;
        if (r.bottom < 0 || r.top > h || r.right < 0 || r.left > w) return;
        rects.push(r);
      });
      if (!rects.length) { setClipPath(undefined); return; }
      // Outer rect (clockwise) + inner rects (counter-clockwise) with evenodd.
      let d = `M0 0 H${w} V${h} H0 Z`;
      for (const r of rects) {
        const x1 = Math.max(0, r.left);
        const y1 = Math.max(0, r.top);
        const x2 = Math.min(w, r.right);
        const y2 = Math.min(h, r.bottom);
        // reversed winding
        d += ` M${x1} ${y1} V${y2} H${x2} V${y1} Z`;
      }
      setClipPath(`path(evenodd, "${d}")`);
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const interval = window.setInterval(schedule, 500);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(interval);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Polling loop: every ~1.5s, if a category slot is free, spawn one there.
  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      setFigures((arr) => {
        const humans = arr.filter((f) => f.variant.category === "human").length;
        const objects = arr.filter((f) => f.variant.category === "object").length;
        let next = arr;
        if (humans < MAX_HUMANS && Math.random() < 0.7) next = [...next, spawnHuman()];
        if (objects < MAX_OBJECTS && Math.random() < 0.5) next = [...next, spawnObject()];
        return next;
      });
      window.setTimeout(tick, 1400 + Math.random() * 1800);
    };
    // Seed: one human, then wait.
    setFigures([spawnHuman()]);
    const first = window.setTimeout(tick, 1200);
    return () => { cancelled = true; window.clearTimeout(first); };
  }, []);

  const removeFigure = useCallback(
    (id: number) => setFigures((arr) => arr.filter((f) => f.id !== id)),
    []
  );
  const removeBurst = useCallback(
    (id: number) => setBursts((arr) => arr.filter((b) => b.id !== id)),
    []
  );
  const addBurst = useCallback((id: number, pos: THREE.Vector3, color: string) => {
    setBursts((arr) => [...arr.slice(-8), { id: uid++, pos, color, bornAt: performance.now() }]);
  }, []);

  return (
    <div
      aria-hidden
      data-hologram-overlay
      className="fixed inset-0 h-screen w-screen overflow-visible"
      style={{
        isolation: "isolate",
        zIndex: 2147483000,
        pointerEvents: "none",
        clipPath,
        WebkitClipPath: clipPath,
      }}
    >
      <Canvas
        dpr={[1, 2]}
        frameloop={visible ? "always" : "never"}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.4, 6], fov: 45 }}
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        eventPrefix="client"
        style={{ width: "100vw", height: "100vh", background: "transparent", pointerEvents: "none" }}
      >
        <Stage
          figures={figures}
          bursts={bursts}
          removeFigure={removeFigure}
          removeBurst={removeBurst}
          addBurst={addBurst}
        />
      </Canvas>
    </div>
  );
};

export default HologramOverlay;