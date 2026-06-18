import { useEffect, useState } from "react";

/**
 * Drifts neon "hologram" silhouettes (anime / manga / elegant figures) across
 * the page from time to time. Pure SVG — no external assets. Each figure
 * spawns at a random vertical band and walks across in ~22s, then disappears.
 */
type Figure = {
  id: number;
  kind: "anime-girl" | "anime-boy" | "hero" | "diva" | "cyber-samurai";
  top: number; // vh
  height: number; // px
  color: string;
  flip: boolean;
  duration: number; // s
};

const KINDS: Figure["kind"][] = [
  "anime-girl",
  "anime-boy",
  "hero",
  "diva",
  "cyber-samurai",
];
const COLORS = [
  "#22d3ee", // cyan
  "#f472b6", // pink
  "#a78bfa", // violet
  "#34d399", // mint
  "#fbbf24", // gold
  "#60a5fa", // blue
];

const Silhouette = ({ kind }: { kind: Figure["kind"] }) => {
  // Stylized neon line-art holograms. Tasteful silhouettes — pose & contour
  // only, no anatomical detail.
  const stroke = "currentColor";
  const sw = 1.4;
  const common = {
    fill: "none",
    stroke,
    strokeWidth: sw,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (kind) {
    case "anime-girl":
      return (
        <svg viewBox="0 0 100 220" preserveAspectRatio="xMidYMid meet">
          {/* twin-tail hair */}
          <path {...common} d="M40 18 C30 10 22 24 28 38 M60 18 C70 10 78 24 72 38" />
          {/* head */}
          <ellipse {...common} cx="50" cy="28" rx="12" ry="14" />
          {/* big anime eyes */}
          <circle cx="45" cy="28" r="1.6" fill={stroke} />
          <circle cx="55" cy="28" r="1.6" fill={stroke} />
          {/* body — dress silhouette */}
          <path {...common} d="M50 42 L50 70 M38 70 L62 70 L70 120 L30 120 Z" />
          {/* arms */}
          <path {...common} d="M40 70 L28 110 M60 70 L72 110" />
          {/* legs */}
          <path {...common} d="M44 120 L42 180 M56 120 L58 180" />
          {/* shoes */}
          <path {...common} d="M38 182 L48 182 M54 182 L64 182" />
        </svg>
      );
    case "anime-boy":
      return (
        <svg viewBox="0 0 100 220" preserveAspectRatio="xMidYMid meet">
          <path {...common} d="M38 18 L52 14 L62 24 L60 36" />
          <ellipse {...common} cx="50" cy="30" rx="11" ry="13" />
          <circle cx="46" cy="30" r="1.4" fill={stroke} />
          <circle cx="54" cy="30" r="1.4" fill={stroke} />
          {/* jacket */}
          <path {...common} d="M50 43 L50 56 M36 56 L64 56 L70 110 L30 110 Z" />
          <path {...common} d="M50 56 L50 110" />
          <path {...common} d="M38 56 L26 100 M62 56 L74 100" />
          {/* pants */}
          <path {...common} d="M40 110 L40 184 M60 110 L60 184" />
          <path {...common} d="M34 186 L46 186 M54 186 L66 186" />
        </svg>
      );
    case "hero":
      return (
        <svg viewBox="0 0 100 220" preserveAspectRatio="xMidYMid meet">
          {/* cape */}
          <path {...common} d="M30 50 C18 90 22 140 36 180 M70 50 C82 90 78 140 64 180" opacity={0.7} />
          <circle {...common} cx="50" cy="28" r="12" />
          <path {...common} d="M50 40 L50 60 M34 60 L66 60 L72 110 L28 110 Z" />
          {/* fists on hips */}
          <path {...common} d="M34 70 L20 90 L30 102 M66 70 L80 90 L70 102" />
          <path {...common} d="M42 110 L40 180 M58 110 L60 180" />
        </svg>
      );
    case "diva":
      return (
        <svg viewBox="0 0 100 220" preserveAspectRatio="xMidYMid meet">
          {/* long hair */}
          <path {...common} d="M36 22 C28 50 30 90 36 120 M64 22 C72 50 70 90 64 120" />
          <ellipse {...common} cx="50" cy="28" rx="11" ry="13" />
          {/* elegant gown */}
          <path {...common} d="M50 42 L50 64 M40 64 L60 64 L66 120 L34 120 Z" />
          <path {...common} d="M34 120 C28 160 30 188 40 196 L60 196 C70 188 72 160 66 120" />
          {/* slender arms — hand on hip */}
          <path {...common} d="M40 66 C24 88 28 108 38 110 M60 66 C76 80 78 96 70 108" />
        </svg>
      );
    case "cyber-samurai":
      return (
        <svg viewBox="0 0 100 220" preserveAspectRatio="xMidYMid meet">
          {/* katana */}
          <path {...common} d="M84 12 L24 200" opacity={0.8} />
          <path {...common} d="M22 196 L30 204" />
          {/* helm */}
          <path {...common} d="M38 20 L62 20 L66 38 L34 38 Z" />
          <ellipse {...common} cx="50" cy="34" rx="10" ry="10" />
          {/* visor slit */}
          <path {...common} d="M42 34 L58 34" />
          {/* armor */}
          <path {...common} d="M50 44 L50 60 M34 60 L66 60 L72 112 L28 112 Z" />
          <path {...common} d="M38 60 L26 100 M62 60 L74 100" />
          <path {...common} d="M42 112 L40 184 M58 112 L60 184" />
        </svg>
      );
  }
};

let nextId = 1;

const spawn = (): Figure => {
  const kind = KINDS[Math.floor(Math.random() * KINDS.length)];
  return {
    id: nextId++,
    kind,
    top: 10 + Math.random() * 55, // vh — stay roughly mid-page
    height: 180 + Math.random() * 200, // px
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    flip: Math.random() < 0.5,
    duration: 18 + Math.random() * 12,
  };
};

export const HologramOverlay = () => {
  const [figures, setFigures] = useState<Figure[]>([]);

  useEffect(() => {
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      const f = spawn();
      setFigures((arr) => [...arr, f]);
      // Auto-remove after the animation completes
      window.setTimeout(() => {
        if (cancelled) return;
        setFigures((arr) => arr.filter((x) => x.id !== f.id));
      }, f.duration * 1000 + 500);
      // Random gap before next hologram — 10s..28s
      const next = 10000 + Math.random() * 18000;
      window.setTimeout(tick, next);
    };

    // First hologram appears after a short delay so the page can settle.
    const first = window.setTimeout(tick, 4000);
    return () => {
      cancelled = true;
      window.clearTimeout(first);
    };
  }, []);

  return (
    <>
      {figures.map((f) => (
        <div
          key={f.id}
          className="holo-figure"
          style={{
            top: `${f.top}vh`,
            left: 0,
            width: `${f.height * 0.5}px`,
            height: `${f.height}px`,
            color: f.color,
            transform: `scaleX(${f.flip ? -1 : 1})`,
            animationDuration: `${f.duration}s, 1.8s`,
          }}
          aria-hidden
        >
          <Silhouette kind={f.kind} />
        </div>
      ))}
    </>
  );
};

export default HologramOverlay;