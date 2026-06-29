import { useEffect, useRef, useState } from "react";
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
      setAngle((a) => (a + dt * 18) % 360);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, []);

  const N = Math.max(items.length, 1);
  const radius = Math.max(70, size * 0.42);

  return (
    <Link
      to="/anime-catalog"
      aria-label="Explorer le catalogue animé"
      className="relative block select-none group"
      style={{ width: size, height: size, perspective: 800 }}
    >
      {/* glossy halo behind */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, #f0f, #0ff, #ff0, #f0f)",
          filter: "blur(14px) saturate(1.8)",
          opacity: 0.55,
        }}
      />
      <span
        aria-hidden
        className="absolute inset-2 rounded-full border border-white/25"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,.5), inset 0 -1px 0 rgba(0,0,0,.5), 0 0 18px rgba(255,0,255,.45)",
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
                boxShadow: `0 0 10px ${m.color || "#a855f7"}aa`,
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