import { useCallback, useEffect, useRef, useState } from "react";
import { videos } from "@/data/videos";
import { supabase } from "@/integrations/supabase/client";

const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
const ytThumbFallback = (id: string) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
const ytThumbHq = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

type WheelVideo = {
  id: string;
  title: string;
  thumb: string;
  source: "youtube" | "tiktok" | "prime";
  url?: string;
};

// Deterministic gradient placeholder generated from the video id — never empty
const placeholderThumb = (id: string, title: string) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const h1 = h % 360;
  const h2 = (h1 + 60) % 360;
  // Strip lone surrogates / control chars — encodeURIComponent throws on them.
  const safe = (title || "Anime Moment")
    .replace(/[\uD800-\uDFFF]/g, "")
    .replace(/[\u0000-\u001F\u007F<&>]/g, " ")
    .slice(0, 40);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='hsl(${h1},85%,55%)'/>
      <stop offset='1' stop-color='hsl(${h2},85%,40%)'/>
    </linearGradient></defs>
    <rect width='640' height='360' fill='url(#g)'/>
    <text x='50%' y='50%' fill='white' font-family='system-ui,sans-serif' font-size='28' font-weight='700' text-anchor='middle' dominant-baseline='middle'>${safe}</text>
  </svg>`;
  try {
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  } catch {
    // Fallback: base64 — never throws on string content.
    const b64 = typeof btoa !== "undefined" ? btoa(unescape(encodeURIComponent(svg))) : "";
    return `data:image/svg+xml;base64,${b64}`;
  }
};

export const HeroCarousel = () => {
  const [paused, setPaused] = useState(false);
  // Interactive halo bubble: click to cycle shape & RGB color.
  const SHAPES = [
    { name: "circle", clip: "circle(50% at 50% 50%)" },
    { name: "hex", clip: "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)" },
    { name: "star", clip: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" },
    { name: "blob", clip: "polygon(50% 0%, 80% 10%, 100% 35%, 95% 70%, 70% 100%, 35% 95%, 5% 75%, 0% 40%, 20% 10%)" },
    { name: "diamond", clip: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" },
    { name: "square", clip: "polygon(5% 5%, 95% 5%, 95% 95%, 5% 95%)" },
    { name: "rect", clip: "polygon(0% 25%, 100% 25%, 100% 75%, 0% 75%)" },
    { name: "triangle", clip: "polygon(50% 5%, 95% 92%, 5% 92%)" },
    { name: "tri-down", clip: "polygon(5% 8%, 95% 8%, 50% 95%)" },
    { name: "octa", clip: "polygon(30% 5%, 70% 5%, 95% 30%, 95% 70%, 70% 95%, 30% 95%, 5% 70%, 5% 30%)" },
    { name: "cross", clip: "polygon(35% 5%, 65% 5%, 65% 35%, 95% 35%, 95% 65%, 65% 65%, 65% 95%, 35% 95%, 35% 65%, 5% 65%, 5% 35%, 35% 35%)" },
    { name: "arrow", clip: "polygon(5% 30%, 60% 30%, 60% 10%, 95% 50%, 60% 90%, 60% 70%, 5% 70%)" },
    { name: "heart", clip: "polygon(50% 95%, 5% 50%, 5% 25%, 25% 5%, 50% 25%, 75% 5%, 95% 25%, 95% 50%)" },
    { name: "pentagon", clip: "polygon(50% 3%, 98% 38%, 80% 95%, 20% 95%, 2% 38%)" },
    { name: "lightning", clip: "polygon(45% 2%, 70% 2%, 50% 40%, 80% 40%, 30% 98%, 50% 55%, 22% 55%)" },
    { name: "shield", clip: "polygon(50% 2%, 95% 18%, 90% 65%, 50% 98%, 10% 65%, 5% 18%)" },
    { name: "gear", clip: "polygon(48% 0%, 52% 0%, 58% 12%, 72% 8%, 75% 22%, 88% 25%, 84% 38%, 96% 48%, 96% 52%, 84% 62%, 88% 75%, 75% 78%, 72% 92%, 58% 88%, 52% 100%, 48% 100%, 42% 88%, 28% 92%, 25% 78%, 12% 75%, 16% 62%, 4% 52%, 4% 48%, 16% 38%, 12% 25%, 25% 22%, 28% 8%, 42% 12%)" },
    { name: "burst",  clip: "polygon(50% 0%, 58% 18%, 80% 8%, 72% 30%, 100% 30%, 78% 45%, 95% 65%, 70% 60%, 75% 90%, 55% 70%, 45% 100%, 38% 72%, 18% 92%, 22% 65%, 0% 60%, 22% 45%, 0% 28%, 28% 30%, 22% 8%, 42% 18%)" },
    { name: "ribbon", clip: "polygon(0% 35%, 100% 35%, 90% 50%, 100% 65%, 0% 65%, 10% 50%)" },
  ];
  const [shapeIdx, setShapeIdx] = useState(0);
  const [hue, setHue] = useState(0);
  const [pulseKey, setPulseKey] = useState(0);
  // Alternative rolling modes for the 3D wheel — cycled every 12 s.
  const ROLL_MODES = ["wheel", "wave", "oscillate", "spiral", "pendulum", "helix", "tide", "fan"] as const;
  const [rollIdx, setRollIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setRollIdx((i) => (i + 1) % ROLL_MODES.length);
    }, 12000);
    return () => clearInterval(t);
  }, []);
  const rollMode = ROLL_MODES[rollIdx];
  const cycleHalo = useCallback(() => {
    setShapeIdx((i) => (i + 1) % SHAPES.length);
    setHue((h) => (h + 72) % 360);
    setPulseKey((k) => k + 1);
  }, [SHAPES.length]);

  // Auto-morph the halo: shape every 15s, RGB hue continuously.
  useEffect(() => {
    const shapeTimer = setInterval(() => {
      setShapeIdx((i) => (i + 1) % SHAPES.length);
      setPulseKey((k) => k + 1);
    }, 15000);
    const hueTimer = setInterval(() => {
      setHue((h) => (h + 6) % 360);
    }, 120);
    return () => {
      clearInterval(shapeTimer);
      clearInterval(hueTimer);
    };
  }, [SHAPES.length]);

  // Load every imported video (YouTube + TikTok) from the DB.
  // Falls back to the static list while loading or on error.
  const [allVideos, setAllVideos] = useState<WheelVideo[]>(() =>
    videos.map((v) => ({
      id: v.id,
      title: v.title,
      thumb: ytThumb(v.id),
      source: "youtube" as const,
      url: `https://www.youtube.com/watch?v=${v.id}`,
    })),
  );
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("imported_videos")
        .select("external_id, title, thumbnail_url, source, published_at, video_url")
        .order("published_at", { ascending: false })
        .limit(300);
      if (cancelled || error || !data?.length) return;
      const mapped: WheelVideo[] = data.map((r) => ({
        id: r.external_id,
        title: r.title ?? "Anime Moment",
        thumb:
          r.thumbnail_url ||
          (r.source === "youtube" ? ytThumb(r.external_id) : ""),
        source: (r.source as WheelVideo["source"]) ?? "youtube",
        url: r.video_url ?? undefined,
      }));
      setAllVideos(mapped);
    })();
    return () => { cancelled = true; };
  }, []);

  // Preload every thumbnail once so the wheel is instant — no flicker.
  useEffect(() => {
    const cache: HTMLImageElement[] = [];
    for (const v of allVideos) {
      if (!v.thumb) continue;
      const img = new Image();
      img.decoding = "async";
      img.loading = "eager";
      img.referrerPolicy = "no-referrer";
      img.src = v.thumb;
      cache.push(img);
    }
    return () => { cache.length = 0; };
  }, [allVideos]);

  // One card PER video — no duplicates, no pop-in. Each card keeps a stable
  // identity and just rotates around the wheel.
  const N = Math.max(1, allVideos.length);
  const variantPool = ["neon-edge", "holo-card", "depth-card"];

  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 520, h: 520 });
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Dial geometry — circle centered higher in the container
  const CENTER_X = size.w * 0.5;
  const CENTER_Y = size.h * 0.42;
  const R = Math.max(180, Math.min(size.w * 0.4, size.h * 0.55));
  // Card size — much bigger
  const cardW = Math.max(220, Math.min(R * 1.25, 360));
  const cardH = cardW * (9 / 16);
  // Tight vertical travel band so cards visibly OVERLAP and feel stacked
  const margin = cardH * 0.45;
  const yTop = CENTER_Y - R + margin;
  const yBottom = CENTER_Y + R - margin;
  // Horizontal curve amplitude (incurvée vers la droite au milieu)
  const ampX = R * 0.38;

  // Continuous progress in [0,1). The full catalogue gets a real loop, not
  // only the few visible cards, so 34 videos all pass through the center.
  // ~1s per card so the whole catalogue defiles visibly
  const loopSecRef = useRef(26);
  loopSecRef.current = Math.max(20, N * 1.0);
  const [prog, setProg] = useState(0);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  // Mouse-driven speed: -1..+1 from hover position (top = up, bottom = down).
  // 0 means use the default autoplay speed.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;
      // Autoplay — pauses while a card is hovered so the preview is stable.
      if (!pausedRef.current) {
        setProg((p) => {
          let n = (p + dt / loopSecRef.current) % 1;
          if (n < 0) n += 1;
          return n;
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const advance = useCallback((dir: 1 | -1) => {
    setProg((p) => (p + dir / N + 1) % 1);
  }, [N]);

  // Stable cards: one per video; only their angular position changes.
  const cards = allVideos.map((v, i) => ({ key: v.id, v, slotIdx: i }));

  // Drag-to-scroll (mouse + touch): moving vertically scrolls the wheel
  // rapidly. 1 card per ~40px of drag.
  const dragRef = useRef<{ id: number; lastY: number } | null>(null);
  const PX_PER_CARD = 40;
  const onPointerDown = (e: React.PointerEvent) => {
    // Don't steal pointer from card links — capture would suppress the click
    // on mobile/touch and break navigation to the video page.
    const target = e.target as HTMLElement | null;
    if (target && target.closest("a")) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { id: e.pointerId, lastY: e.clientY };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    const dy = e.clientY - d.lastY;
    if (dy === 0) return;
    d.lastY = e.clientY;
    setProg((p) => {
      let n = (p - dy / (PX_PER_CARD * N)) % 1;
      if (n < 0) n += 1;
      return n;
    });
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragRef.current?.id === e.pointerId) dragRef.current = null;
  };


  // iOS-style date wheel: every catalogue video owns a stable card, while only
  // the nearest slots are visible. This prevents the first 5 cards from masking
  // the rest and makes the whole DB catalogue complete the loop.
  const MAX_ANG = 60; // degrees from center → near top/bottom of the wheel
  // Visible arc: ~13 cards on screen at once so the motion is obvious and
  // every catalogue video clearly travels through the center.
  const VISIBLE_RADIUS = Math.min(6, Math.max(3, Math.floor((N - 1) / 2)));
  const wheelR = Math.max(R * 1.35, cardH * 1.9);
  const styleFor = (slotIdx: number): React.CSSProperties => {
    const phase = prog * N;
    const rawOffset = slotIdx - phase;
    let offset = (rawOffset + N / 2) % N;
    if (offset < 0) offset += N;
    offset -= N / 2;
    const absOffset = Math.abs(offset);
    const visible = absOffset <= VISIBLE_RADIUS + 1.5;
    const clampedOffset = Math.max(-VISIBLE_RADIUS, Math.min(VISIBLE_RADIUS, offset));
    const ang = (clampedOffset / VISIBLE_RADIUS) * MAX_ANG;
    const rad = (ang * Math.PI) / 180;
    // Vertical offset on the cylinder
    let y = Math.sin(rad) * wheelR;
    let xMod = 0;
    let extraRotY = 0;
    let extraRotZ = 0;
    const tNow = prog * Math.PI * 2;
    if (rollMode === "wave") {
      // Sinusoidal vertical wave across slot positions.
      y += Math.sin(offset * 0.9 + tNow) * cardH * 0.35;
      xMod = Math.cos(offset * 0.6 + tNow) * cardW * 0.25;
    } else if (rollMode === "oscillate") {
      // The whole wheel sways left/right like a pendulum.
      xMod = Math.sin(tNow) * cardW * 0.45;
      extraRotZ = Math.sin(tNow) * 6;
    } else if (rollMode === "spiral") {
      // Cards twist around their own vertical axis as they pass.
      extraRotY = Math.sin(offset * 0.5 + tNow * 2) * 25;
      y += Math.sin(offset + tNow) * cardH * 0.15;
    } else if (rollMode === "pendulum") {
      // Slow rocking with strong z-axis tilt.
      extraRotZ = Math.sin(tNow * 0.8) * 12;
      y += Math.sin(tNow * 0.8) * cardH * 0.2;
    } else if (rollMode === "helix") {
      // Double-helix: cards spiral around the column with X offset.
      xMod = Math.cos(offset * 0.7 + tNow * 1.4) * cardW * 0.55;
      extraRotY = Math.sin(offset * 0.7 + tNow * 1.4) * 35;
    } else if (rollMode === "tide") {
      // Slow tidal sweep: gentle Y push + soft Z roll.
      y += Math.sin(offset * 0.4 + tNow * 0.6) * cardH * 0.5;
      extraRotZ = Math.cos(offset * 0.4 + tNow * 0.6) * 8;
    } else if (rollMode === "fan") {
      // Cards fan out from a center pivot like a hand of cards.
      extraRotZ = offset * 4 + Math.sin(tNow) * 4;
      xMod = offset * cardW * 0.08;
    }
    // Front-facing factor (1 = center, 0 = edge)
    const front = Math.cos(rad);
    // Opacity & z: front card on top, edges fade smoothly without popping
    const edgeFade = Math.max(0, 1 - Math.max(0, absOffset - (VISIBLE_RADIUS - 0.5)) / 2);
    const opacity = visible ? Math.min(1, Math.max(0, front) * 1.15) * edgeFade : 0;
    const z = visible ? 100 + Math.round((VISIBLE_RADIUS - absOffset) * 10) : 0;
    return {
      left: CENTER_X - cardW / 2,
      top: CENTER_Y - cardH / 2,
      width: cardW,
      aspectRatio: "16 / 9",
      transform: `translate3d(${xMod}px, ${y}px, 0) rotateX(${-ang}deg) rotateY(${extraRotY}deg) rotateZ(${extraRotZ}deg)`,
      transformStyle: "preserve-3d",
      transformOrigin: "center center",
      opacity,
      zIndex: z,
      pointerEvents: visible ? "auto" : "none",
      filter: `drop-shadow(0 0 18px hsl(var(--neon-magenta) / 0.35)) drop-shadow(0 12px 28px hsl(var(--neon-purple) / 0.35))`,
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[460px] sm:h-[520px] overflow-hidden touch-none cursor-grab active:cursor-grabbing"
      style={{ perspective: "1400px", perspectiveOrigin: "50% 50%" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Interactive neon dial ring — click pulses the halo */}
      <button
        type="button"
        aria-label="Pulser le halo et changer l'intensité"
        onClick={cycleHalo}
        className="absolute rounded-full dial-glow"
        style={{
          width: R * 2,
          height: R * 2,
          left: CENTER_X - R,
          top: CENTER_Y - R,
          padding: 0,
          background: `radial-gradient(circle at 50% 35%, hsl(0 0% 100% / 0.18), transparent 55%)`,
          border: `3px solid hsl(${hue} 100% 70%)`,
          boxShadow: `
            inset 0 2px 0 hsl(0 0% 100% / 0.7),
            inset 0 -2px 0 hsl(0 0% 0% / 0.55),
            inset 0 0 28px hsl(${hue} 100% 65% / 0.45),
            0 0 10px hsl(${hue} 100% 70% / 0.85),
            0 0 22px hsl(${(hue + 60) % 360} 100% 65% / 0.4)`,
          cursor: "pointer",
          zIndex: 2,
          transition: "box-shadow .5s ease, border-color .5s ease",
        }}
      />
      {/* Interactive RGB halo behind the cards — click to cycle shape & color */}
      <button
        type="button"
        aria-label="Changer la forme et la couleur du halo"
        onClick={cycleHalo}
        className="absolute halo-spin halo-bubble group/halo"
        style={{
          width: R * 1.9,
          height: R * 1.9,
          left: CENTER_X - R * 0.95,
          top: CENTER_Y - R * 0.95,
          padding: 0,
          border: 0,
          background: "transparent",
          cursor: "pointer",
          zIndex: 1,
        }}
      >
        <span
          key={pulseKey}
          aria-hidden
          className="block w-full h-full transition-[clip-path] duration-700 ease-out animate-scale-in halo-3d-tumble"
          style={{
            clipPath: SHAPES[shapeIdx].clip,
            WebkitClipPath: SHAPES[shapeIdx].clip,
            background: `conic-gradient(from 0deg,
              hsl(${hue} 100% 60%) 0deg,
              hsl(${(hue + 60) % 360} 100% 62%) 60deg,
              hsl(${(hue + 120) % 360} 100% 60%) 120deg,
              hsl(${(hue + 180) % 360} 100% 62%) 180deg,
              hsl(${(hue + 240) % 360} 100% 60%) 240deg,
              hsl(${(hue + 300) % 360} 100% 62%) 300deg,
              hsl(${hue} 100% 60%) 360deg)`,
            filter: "blur(6px) saturate(2.2) brightness(1.35) contrast(1.15)",
            opacity: 0.95,
            transition: "background 0.6s ease, filter 0.6s ease",
          }}
        />
        {/* Satin specular sweep — gives the halo a polished metallic sheen */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            clipPath: SHAPES[shapeIdx].clip,
            WebkitClipPath: SHAPES[shapeIdx].clip,
            background: `linear-gradient(135deg,
              hsl(0 0% 100% / 0.55) 0%,
              hsl(0 0% 100% / 0.12) 22%,
              hsl(0 0% 100% / 0) 42%,
              hsl(0 0% 100% / 0.18) 68%,
              hsl(0 0% 0% / 0.45) 100%)`,
            mixBlendMode: "overlay",
            opacity: 0.9,
          }}
        />
        {/* Glossy top-left highlight — the "polished" hot-spot */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            clipPath: SHAPES[shapeIdx].clip,
            WebkitClipPath: SHAPES[shapeIdx].clip,
            background:
              "radial-gradient(ellipse 55% 35% at 32% 22%, hsl(0 0% 100% / 0.85), hsl(0 0% 100% / 0) 70%)",
            mixBlendMode: "screen",
            filter: "blur(2px)",
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            clipPath: SHAPES[shapeIdx].clip,
            WebkitClipPath: SHAPES[shapeIdx].clip,
            background: `radial-gradient(circle at 50% 50%, hsl(${hue} 100% 75% / 0.55), transparent 65%)`,
            filter: "blur(10px) brightness(1.5)",
            mixBlendMode: "screen",
          }}
        />
      </button>
      {cards.map((c) => {
        const variant = variantPool[c.slotIdx % variantPool.length];
        const href =
          c.v.url ||
          (c.v.source === "youtube"
            ? `https://www.youtube.com/watch?v=${c.v.id}`
            : undefined);
        return (
          <a
            key={c.key}
            href={href || "#"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ouvrir la vidéo : ${c.v.title}`}
            className={`card-3d group absolute rounded-xl ring-1 ring-white/10 hover:z-50 ${variant}`}
            style={{
              ...styleFor(c.slotIdx),
              transition: "opacity 0.18s linear, filter 0.3s ease, transform 0.4s cubic-bezier(.22,1,.36,1)",
              willChange: "transform",
              backfaceVisibility: "hidden",
              textDecoration: "none",
              cursor: "pointer",
            }}
            onPointerEnter={() => setPaused(true)}
            onPointerLeave={() => setPaused(false)}
            onClick={(e) => {
              // Prevent the wheel drag/pan handler from swallowing the click.
              e.stopPropagation();
            }}
          >
            {/* Deep back body — stacked slices give visible thickness */}
            {[-32, -26, -20, -14, -8, -3].map((zd, idx, arr) => {
              const t = (arr.length - 1 - idx) / (arr.length - 1); // 1=back .. 0=near
              return (
                <div
                  key={zd}
                  aria-hidden
                  className="absolute inset-0 rounded-xl"
                  style={{
                    transform: `translateZ(${zd}px)`,
                    background: `linear-gradient(180deg, hsl(var(--neon-purple) / ${0.25 + t * 0.45}), hsl(280 60% 6% / 0.98))`,
                    boxShadow:
                      zd === -32
                        ? "0 0 0 1px hsl(var(--neon-magenta) / 0.55), 0 30px 60px -10px hsl(var(--neon-magenta) / 0.45)"
                        : "inset 0 0 0 1px hsl(0 0% 100% / 0.04)",
                  }}
                />
              );
            })}

            {/* Beveled side faces — real edges visible when tilted */}
            {/* Top face */}
            <div
              aria-hidden
              className="absolute left-0 right-0 top-0 pointer-events-none"
              style={{
                height: "32px",
                transform: "rotateX(90deg) translateZ(0px)",
                transformOrigin: "top center",
                background:
                  "linear-gradient(180deg, hsl(0 0% 100% / 0.35), hsl(290 60% 18% / 0.95))",
                borderRadius: "0 0 6px 6px",
              }}
            />
            {/* Bottom face */}
            <div
              aria-hidden
              className="absolute left-0 right-0 bottom-0 pointer-events-none"
              style={{
                height: "32px",
                transform: "rotateX(-90deg) translateZ(0px)",
                transformOrigin: "bottom center",
                background:
                  "linear-gradient(0deg, hsl(0 0% 0% / 0.85), hsl(290 60% 14% / 0.95))",
                borderRadius: "6px 6px 0 0",
              }}
            />
            {/* Left face */}
            <div
              aria-hidden
              className="absolute top-0 bottom-0 left-0 pointer-events-none"
              style={{
                width: "32px",
                transform: "rotateY(-90deg) translateZ(0px)",
                transformOrigin: "left center",
                background:
                  "linear-gradient(90deg, hsl(290 60% 22% / 0.95), hsl(290 60% 10% / 0.95))",
              }}
            />
            {/* Right face */}
            <div
              aria-hidden
              className="absolute top-0 bottom-0 right-0 pointer-events-none"
              style={{
                width: "32px",
                transform: "rotateY(90deg) translateZ(0px)",
                transformOrigin: "right center",
                background:
                  "linear-gradient(270deg, hsl(var(--neon-magenta) / 0.55), hsl(290 60% 10% / 0.95))",
                boxShadow: "inset 0 0 12px hsl(var(--neon-magenta) / 0.45)",
              }}
            />

            {/* Front face (image) — pushed forward for clear relief */}
            <div
              className="card-3d-front rgb-frame relative w-full aspect-video overflow-hidden rounded-xl bg-muted"
              style={{ transform: "translateZ(2px)" }}
            >
              <img
                src={c.v.thumb || placeholderThumb(c.v.id, c.v.title)}
                alt={c.v.title}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const img = e.currentTarget;
                  const step = img.dataset.fb || "0";
                  if (c.v.source !== "youtube") {
                    img.src = placeholderThumb(c.v.id, c.v.title);
                    return;
                  }
                  if (step === "0") {
                    img.dataset.fb = "1";
                    img.src = ytThumbHq(c.v.id);
                  } else if (step === "1") {
                    img.dataset.fb = "2";
                    img.src = ytThumbFallback(c.v.id);
                  } else {
                    img.src = placeholderThumb(c.v.id, c.v.title);
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              {/* Glossy highlight for relief */}
              <div
                aria-hidden
                className="card-3d-gloss absolute inset-0 pointer-events-none rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(0 0% 100% / 0.32) 0%, hsl(0 0% 100% / 0.06) 28%, hsl(0 0% 100% / 0) 55%, hsl(0 0% 0% / 0.35) 100%)",
                  mixBlendMode: "screen",
                }}
              />
              {/* Inner rim light */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none rounded-xl"
                style={{
                  boxShadow:
                    "inset 0 1px 0 hsl(0 0% 100% / 0.35), inset 0 -1px 0 hsl(0 0% 0% / 0.5), inset 0 0 24px hsl(var(--neon-magenta) / 0.25)",
                }}
              />
              <div className="absolute bottom-2 left-3 right-3 z-10">
                <div className="text-[11px] text-fuchsia-200/90 font-medium">
                  {c.v.source === "tiktok" ? "TikTok" : c.v.source === "prime" ? "Prime Video" : "YouTube"}
                </div>
                <div className="text-xs sm:text-sm font-bold text-white leading-tight line-clamp-2">
                  {c.v.title}
                </div>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
};