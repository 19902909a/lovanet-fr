import { useEffect, useState } from "react";

/**
 * Holograms with REAL articulated walk cycle (legs/arms swing, body bob)
 * plus random actions: walk, wave, bow, laugh (shoulders shake), crouch,
 * approach (scale up), recede (scale down). No sliding — figures move only
 * because their legs are actually stepping.
 */

type Action = "walk" | "wave" | "bow" | "laugh" | "crouch" | "approach";
type Gender = "woman" | "man";

type Figure = {
  id: number;
  gender: Gender;
  action: Action;
  topVh: number;
  heightPx: number;
  color: string;
  direction: 1 | -1; // 1 = walks left→right
  // Travel: km/h-feel speed, total seconds on screen.
  durationSec: number;
  hueShift: number;
};

const COLORS = [
  "#22d3ee",
  "#f472b6",
  "#a78bfa",
  "#34d399",
  "#fbbf24",
  "#60a5fa",
  "#fb7185",
];

const pickAction = (): Action => {
  const r = Math.random();
  if (r < 0.55) return "walk";
  if (r < 0.7) return "wave";
  if (r < 0.8) return "bow";
  if (r < 0.88) return "laugh";
  if (r < 0.95) return "crouch";
  return "approach";
};

let nextId = 1;
const spawn = (): Figure => {
  const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
  const action = pickAction();
  const isMoving = action === "walk" || action === "approach";
  return {
    id: nextId++,
    gender: Math.random() < 0.5 ? "woman" : "man",
    action,
    topVh: 8 + Math.random() * 55,
    heightPx: 220 + Math.random() * 220,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    direction: dir,
    durationSec: isMoving ? 16 + Math.random() * 10 : 10 + Math.random() * 6,
    hueShift: Math.random() * 360,
  };
};

/* ============================================================
 *  Articulated human silhouette — every limb is its own <g> so
 *  we can swing it with CSS keyframes for a real walk cycle.
 * ============================================================ */
const Human = ({ gender, action }: { gender: Gender; action: Action }) => {
  const stroke = "currentColor";
  const sw = 2.2;
  const line = {
    stroke,
    strokeWidth: sw,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };
  const fill = { fill: stroke, stroke: "none" };

  // Head + hair vary by gender; body remains the same skeleton.
  const Head = () => (
    <g className="holo-head">
      {gender === "woman" ? (
        <>
          {/* long hair */}
          <path {...line} d="M40 24 C32 42 32 70 38 86 M60 24 C68 42 68 70 62 86" />
          <ellipse {...line} cx="50" cy="30" rx="11" ry="13" />
          {/* mouth (smile) — toggles via .holo-smile */}
          <path className="holo-mouth" {...line} d="M45 36 Q50 39 55 36" />
          <circle cx="46" cy="29" r="1.4" {...fill} />
          <circle cx="54" cy="29" r="1.4" {...fill} />
        </>
      ) : (
        <>
          {/* short hair / cap */}
          <path {...line} d="M38 22 L62 22 L64 18 L36 18 Z" />
          <ellipse {...line} cx="50" cy="30" rx="11" ry="13" />
          <path className="holo-mouth" {...line} d="M45 36 Q50 39 55 36" />
          <circle cx="46" cy="29" r="1.4" {...fill} />
          <circle cx="54" cy="29" r="1.4" {...fill} />
        </>
      )}
    </g>
  );

  return (
    <svg
      viewBox="0 0 100 200"
      preserveAspectRatio="xMidYMax meet"
      className={`holo-rig holo-action-${action}`}
    >
      <g className="holo-body">
        <Head />

        {/* Torso */}
        <g className="holo-torso">
          <path {...line} d="M50 44 L50 78" />
          {/* shoulders */}
          <path {...line} d="M40 52 L60 52" />
          {/* hips */}
          <path {...line} d="M42 78 L58 78" />
          {gender === "woman" ? (
            <path {...line} d="M40 52 L36 78 L64 78 L60 52 Z" opacity={0.55} />
          ) : (
            <path {...line} d="M40 52 L38 78 L62 78 L60 52 Z" opacity={0.55} />
          )}
        </g>

        {/* Left arm (upper + forearm pivots) */}
        <g className="holo-arm holo-arm-l" style={{ transformOrigin: "40px 52px" }}>
          <path {...line} d="M40 52 L36 78" />
          <g style={{ transformOrigin: "36px 78px" }} className="holo-forearm holo-forearm-l">
            <path {...line} d="M36 78 L34 104" />
            <circle cx="34" cy="104" r="2" {...fill} />
          </g>
        </g>

        {/* Right arm */}
        <g className="holo-arm holo-arm-r" style={{ transformOrigin: "60px 52px" }}>
          <path {...line} d="M60 52 L64 78" />
          <g style={{ transformOrigin: "64px 78px" }} className="holo-forearm holo-forearm-r">
            <path {...line} d="M64 78 L66 104" />
            <circle cx="66" cy="104" r="2" {...fill} />
          </g>
        </g>

        {/* Left leg */}
        <g className="holo-leg holo-leg-l" style={{ transformOrigin: "44px 80px" }}>
          <path {...line} d="M44 80 L42 122" />
          <g style={{ transformOrigin: "42px 122px" }} className="holo-shin holo-shin-l">
            <path {...line} d="M42 122 L40 168" />
            <path {...line} d="M34 170 L46 170" />
          </g>
        </g>

        {/* Right leg */}
        <g className="holo-leg holo-leg-r" style={{ transformOrigin: "56px 80px" }}>
          <path {...line} d="M56 80 L58 122" />
          <g style={{ transformOrigin: "58px 122px" }} className="holo-shin holo-shin-r">
            <path {...line} d="M58 122 L60 168" />
            <path {...line} d="M54 170 L66 170" />
          </g>
        </g>
      </g>
    </svg>
  );
};

export const HologramOverlay = () => {
  const [figures, setFigures] = useState<Figure[]>([]);

  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      const f = spawn();
      setFigures((arr) => [...arr.slice(-2), f]); // max ~3 on screen
      window.setTimeout(() => {
        if (cancelled) return;
        setFigures((arr) => arr.filter((x) => x.id !== f.id));
      }, f.durationSec * 1000 + 600);
      const next = 8000 + Math.random() * 16000;
      window.setTimeout(tick, next);
    };
    const first = window.setTimeout(tick, 3500);
    return () => {
      cancelled = true;
      window.clearTimeout(first);
    };
  }, []);

  return (
    <>
      {figures.map((f) => {
        const isMoving = f.action === "walk" || f.action === "approach";
        return (
          <div
            key={f.id}
            className={`holo-figure holo-move-${f.action}`}
            style={{
              top: `${f.topVh}vh`,
              left: f.direction === 1 ? "-15vw" : "115vw",
              width: `${f.heightPx * 0.55}px`,
              height: `${f.heightPx}px`,
              color: f.color,
              filter: `drop-shadow(0 0 14px ${f.color}) drop-shadow(0 0 28px ${f.color})`,
              ["--holo-dir" as never]: f.direction,
              ["--holo-dur" as never]: `${f.durationSec}s`,
              animation: isMoving
                ? `holo-travel var(--holo-dur) linear forwards, holo-flicker 2.2s ease-in-out infinite`
                : `holo-stationary var(--holo-dur) ease-out forwards, holo-flicker 2.2s ease-in-out infinite`,
              transform: `scaleX(${f.direction === 1 ? 1 : -1})`,
            }}
            aria-hidden
          >
            <Human gender={f.gender} action={f.action} />
          </div>
        );
      })}
    </>
  );
};

export default HologramOverlay;