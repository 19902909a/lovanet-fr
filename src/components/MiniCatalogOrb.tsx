import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

type Cover = { id: number; img: string; color?: string; title?: string };

/**
 * Small 3D rotating circular carousel that mirrors the catalogue cards.
 * Reads cached AniList data from localStorage (populated by /anime-catalog).
 * Falls back to a quick fetch if no cache.
 */
const QUERY = `query{Page(page:1,perPage:40){media(type:ANIME,sort:TRENDING_DESC,isAdult:false){id title{romaji english} coverImage{large color}}}}`;

export default function MiniCatalogOrb({
  size = 220,
  cardW = 36,
  cardH = 54,
}: { size?: number; cardW?: number; cardH?: number }) {
  const [items, setItems] = useState<Cover[]>([]);
  const [angle, setAngle] = useState(0);
  const raf = useRef<number>();
  const [hue, setHue] = useState(0);
  const [speed, setSpeed] = useState(18);
  const [hovered, setHovered] = useState(false);
  const [pulse, setPulse] = useState(0);
  const [morph, setMorph] = useState(0);

  // Continuous RGB cycling + morph pulse
  useEffect(() => {
    const t = setInterval(() => {
      setHue((h) => (h + 4) % 360);
      setPulse((p) => (p + 1) % 360);
    }, 60);
    return () => clearInterval(t);
  }, []);

  const cycle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setMorph((i) => (i + 1) % 4);
    setSpeed((s) => (s >= 90 ? 18 : s + 24));
  }, []);

  useEffect(() => {
    const hydrate = (raw: any[]): Cover[] =>
      (raw || [])
        .map((m: any) => ({
          id: m.id,
          img: m?.coverImage?.large || m?.coverImage?.extraLarge,
          color: m?.coverImage?.color,
          title: m?.title?.english || m?.title?.romaji,
        }))
        .filter((c) => !!c.img)
        .slice(0, 28);
    try {
      const g = localStorage.getItem("lovanet.cache.catalog.grid");
      const t = localStorage.getItem("lovanet.cache.catalog.top");
      const arr = g ? JSON.parse(g) : t ? JSON.parse(t) : null;
      if (arr?.length) setItems(hydrate(arr));
    } catch {}
    fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: QUERY }),
    })
      .then((r) => r.json())
      .then((j) => {
        const list = j?.data?.Page?.media ?? [];
        if (list.length) setItems(hydrate(list));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let last = performance.now();
    const tick = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;
      const sp = hovered ? speed * 2.2 : speed;
      setAngle((a) => (a + dt * sp) % 360);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [hovered, speed]);

  // Space out cards: cap visible count so they don't overlap
  const visible = items.slice(0, 14);
  const N = Math.max(visible.length, 1);
  const radius = Math.max(90, size * 0.58);
  const pulseScale = 1 + Math.sin((pulse * Math.PI) / 180) * 0.04;
  const wobble = Math.sin((pulse * Math.PI) / 90) * 6;

  return (
    <Link
      to="/anime-catalog"
      aria-label="Explorer le catalogue animé"
      className="relative block select-none group"
      style={{ width: size, height: size, perspective: 900 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={cycle}
    >
      {/* Diffuse plasma glow behind everything */}
      <span
        aria-hidden
        className="absolute -inset-6 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%,
            hsl(${hue} 100% 65% / 0.55),
            hsl(${(hue + 120) % 360} 100% 55% / 0.35) 40%,
            transparent 70%)`,
          filter: "blur(24px)",
          transform: `scale(${pulseScale})`,
        }}
      />
      {/* Orbital neon rings — tilted at different angles for a gyroscope feel */}
      {[
        { tiltX: 70, tiltY: 0, spin: 1, dash: "6 10" },
        { tiltX: 20, tiltY: 60, spin: -1.4, dash: "4 14" },
        { tiltX: 55, tiltY: -40, spin: 0.8, dash: "10 6" },
      ].map((r, i) => (
        <svg
          key={i}
          aria-hidden
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            transform: `rotateX(${r.tiltX + (morph * 8)}deg) rotateY(${r.tiltY + morph * 12}deg) rotateZ(${angle * r.spin}deg)`,
            transformStyle: "preserve-3d",
            filter: `drop-shadow(0 0 6px hsl(${(hue + i * 90) % 360} 100% 65% / 0.9))`,
          }}
        >
          <defs>
            <linearGradient id={`ring-g-${i}`} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor={`hsl(${hue} 100% 65%)`} />
              <stop offset="50%" stopColor={`hsl(${(hue + 120) % 360} 100% 60%)`} />
              <stop offset="100%" stopColor={`hsl(${(hue + 240) % 360} 100% 60%)`} />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r={44 - i * 3}
            fill="none"
            stroke={`url(#ring-g-${i})`}
            strokeWidth={1.4}
            strokeDasharray={r.dash}
            strokeLinecap="round"
            opacity={0.9}
          />
        </svg>
      ))}
      {/* Floating particles orbiting the sphere */}
      {Array.from({ length: 10 }).map((_, i) => {
        const t = (angle * 2 + i * 36) % 360;
        const r = radius + 14;
        const x = Math.cos((t * Math.PI) / 180) * r;
        const y = Math.sin((t * Math.PI) / 180 * 1.6) * (r * 0.4);
        return (
          <span
            key={i}
            aria-hidden
            className="absolute top-1/2 left-1/2 rounded-full pointer-events-none"
            style={{
              width: 4,
              height: 4,
              transform: `translate(${x}px, ${y}px)`,
              background: `hsl(${(hue + i * 30) % 360} 100% 70%)`,
              boxShadow: `0 0 10px hsl(${(hue + i * 30) % 360} 100% 70%)`,
            }}
          />
        );
      })}
      <div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${-14 + wobble}deg) rotateY(${angle}deg) rotateZ(${wobble * 0.4}deg) scale(${pulseScale})`,
        }}
      >
        {items.map((m, i) => {
          const theta = (360 / N) * i;
          const lift = Math.sin(((angle + i * 30) * Math.PI) / 180) * 6;
          return (
            <div
              key={m.id}
              className="absolute top-1/2 left-1/2 rounded-md overflow-hidden ring-1 ring-white/20"
              style={{
                width: cardW,
                height: cardH,
                marginLeft: -cardW / 2,
                marginTop: -cardH / 2,
                transform: `rotateY(${theta}deg) translateY(${lift}px) translateZ(${radius}px)`,
                background: m.color || "#222",
                boxShadow: `0 0 8px ${m.color || "#a855f7"}aa, 0 0 20px hsl(${(hue + i * 12) % 360} 100% 60% / 0.7)`,
                backfaceVisibility: "hidden",
              }}
            >
              <img
                src={m.img}
                alt={m.title || ""}
                loading="lazy"
                draggable={false}
                className="w-full h-full object-cover"
              />
            </div>
          );
        })}
      </div>
      <span className="absolute -bottom-5 left-0 right-0 text-center text-[10px] uppercase tracking-[0.3em] text-white/70">
        Catalogue
      </span>
    </Link>
  );
}