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
  const [shapeIdx, setShapeIdx] = useState(0);
  const SHAPES = [
    "circle(50% at 50% 50%)",
    "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
    "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
    "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
    "polygon(5% 5%, 95% 5%, 95% 95%, 5% 95%)",
  ];

  // Continuous RGB cycling
  useEffect(() => {
    const t = setInterval(() => setHue((h) => (h + 4) % 360), 80);
    return () => clearInterval(t);
  }, []);

  const cycle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setShapeIdx((i) => (i + 1) % SHAPES.length);
    setSpeed((s) => (s >= 90 ? 18 : s + 24));
  }, [SHAPES.length]);

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

  const N = Math.max(items.length, 1);
  const radius = Math.max(70, size * 0.42);

  return (
    <Link
      to="/anime-catalog"
      aria-label="Explorer le catalogue animé"
      className="relative block select-none group"
      style={{ width: size, height: size, perspective: 800 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={cycle}
    >
      {/* Stratified RGB halo — multi-layer 3D depth with interactive shape */}
      {[-24, -14, -6, 0].map((zd, i) => (
        <span
          key={zd}
          aria-hidden
          className="absolute inset-0"
          style={{
            clipPath: SHAPES[shapeIdx],
            WebkitClipPath: SHAPES[shapeIdx],
            transform: `translateZ(${zd}px) rotate(${angle * (i + 1) * 0.3}deg)`,
            background: `conic-gradient(from ${i * 45 + angle}deg,
              hsl(${hue} 100% 60%),
              hsl(${(hue + 90) % 360} 100% 60%),
              hsl(${(hue + 180) % 360} 100% 60%),
              hsl(${(hue + 270) % 360} 100% 60%),
              hsl(${hue} 100% 60%))`,
            filter: `blur(${10 - i * 2}px) saturate(2.2) brightness(${1.2 + i * 0.1})`,
            opacity: 0.55 + i * 0.1,
          }}
        />
      ))}
      <span
        aria-hidden
        className="absolute inset-1"
        style={{
          clipPath: SHAPES[shapeIdx],
          WebkitClipPath: SHAPES[shapeIdx],
          boxShadow: `inset 0 1px 0 rgba(255,255,255,.6), inset 0 -1px 0 rgba(0,0,0,.5), 0 0 22px hsl(${hue} 100% 65% / 0.85), 0 0 44px hsl(${(hue + 120) % 360} 100% 60% / 0.5)`,
          border: `1.5px solid hsl(${hue} 100% 70% / 0.8)`,
          transition: "box-shadow .3s, border-color .3s",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(-14deg) rotateY(${angle}deg)`,
        }}
      >
        {items.map((m, i) => {
          const theta = (360 / N) * i;
          return (
            <div
              key={m.id}
              className="absolute top-1/2 left-1/2 rounded-md overflow-hidden ring-1 ring-white/20"
              style={{
                width: cardW,
                height: cardH,
                marginLeft: -cardW / 2,
                marginTop: -cardH / 2,
                transform: `rotateY(${theta}deg) translateZ(${radius}px)`,
                background: m.color || "#222",
                boxShadow: `0 0 10px ${m.color || "#a855f7"}aa, 0 0 18px hsl(${(hue + i * 12) % 360} 100% 60% / 0.6)`,
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