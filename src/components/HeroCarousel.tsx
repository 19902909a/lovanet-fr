import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, ChevronUp, ChevronDown } from "lucide-react";
import { videos } from "@/data/videos";
import { supabase } from "@/integrations/supabase/client";

const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
const ytThumbFallback = (id: string) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
const ytThumbHq = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

type WheelVideo = { id: string; title: string; thumb: string };

// Deterministic gradient placeholder generated from the video id — never empty
const placeholderThumb = (id: string, title: string) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const h1 = h % 360;
  const h2 = (h1 + 60) % 360;
  const safe = (title || "Anime Moment").replace(/[<&>]/g, " ").slice(0, 40);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='hsl(${h1},85%,55%)'/>
      <stop offset='1' stop-color='hsl(${h2},85%,40%)'/>
    </linearGradient></defs>
    <rect width='640' height='360' fill='url(#g)'/>
    <text x='50%' y='50%' fill='white' font-family='system-ui,sans-serif' font-size='28' font-weight='700' text-anchor='middle' dominant-baseline='middle'>${safe}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const HeroCarousel = () => {
  const [soundOn, setSoundOn] = useState(false);
  const [paused, setPaused] = useState(false);

  // Load every imported video (YouTube + TikTok) from the DB.
  // Falls back to the static list while loading or on error.
  const [allVideos, setAllVideos] = useState<WheelVideo[]>(() =>
    videos.map((v) => ({ id: v.id, title: v.title, thumb: ytThumb(v.id) })),
  );
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("imported_videos")
        .select("external_id, title, thumbnail_url, source, published_at")
        .eq("source", "youtube")
        .order("published_at", { ascending: false })
        .limit(200);
      if (cancelled || error || !data?.length) return;
      const mapped: WheelVideo[] = data.map((r) => ({
        id: r.external_id,
        title: r.title ?? "Anime Moment",
        thumb:
          r.thumbnail_url ||
          (r.source === "youtube" ? ytThumb(r.external_id) : ""),
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
      // Continuous autoplay — never blocks, never pauses on hover.
      setProg((p) => {
        let n = (p + dt / loopSecRef.current) % 1;
        if (n < 0) n += 1;
        return n;
      });
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

  // Touch swipe (vertical) on mobile
  const touchStartY = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current == null) return;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dy) > 40) advance(dy < 0 ? 1 : -1);
    touchStartY.current = null;
  };


  // iOS-style date wheel: every catalogue video owns a stable card, while only
  // the nearest slots are visible. This prevents the first 5 cards from masking
  // the rest and makes the whole DB catalogue complete the loop.
  const MAX_ANG = 60; // degrees from center → near top/bottom of the wheel
  // Visible arc: ~13 cards on screen at once so the motion is obvious and
  // every catalogue video clearly travels through the center.
  const VISIBLE_RADIUS = Math.min(6, Math.max(3, Math.floor((N - 1) / 2)));
  const wheelR = Math.max(R * 1.05, cardH * 1.45);
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
    const y = Math.sin(rad) * wheelR;
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
      transform: `translate3d(0, ${y}px, 0) rotateX(${-ang}deg)`,
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
      className="relative w-full h-[460px] sm:h-[520px] overflow-hidden"
      style={{ perspective: "1400px", perspectiveOrigin: "50% 50%" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Neon dial ring (decorative background) */}
      <div
        aria-hidden
        className="absolute pointer-events-none rounded-full border border-fuchsia-400/40 dial-glow"
        style={{
          width: R * 2,
          height: R * 2,
          left: CENTER_X - R,
          top: CENTER_Y - R,
          boxShadow:
            "inset 0 0 80px hsl(var(--neon-magenta) / 0.15), 0 0 60px hsl(var(--neon-magenta) / 0.35)",
        }}
      />
      {/* Soft rotating halo behind the cards */}
      <div
        aria-hidden
        className="absolute pointer-events-none rounded-full halo-spin"
        style={{
          width: R * 1.6,
          height: R * 1.6,
          left: CENTER_X - R * 0.8,
          top: CENTER_Y - R * 0.8,
          background:
            "conic-gradient(from 0deg, hsl(var(--neon-magenta)/0.0), hsl(var(--neon-magenta)/0.3), hsl(var(--neon-cyan)/0.0))",
          filter: "blur(50px)",
          opacity: 0.45,
        }}
      />
      <button
        type="button"
        onClick={() => setSoundOn((s) => !s)}
        className="btn-magnetic absolute top-2 right-2 z-[60] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur text-white text-xs font-semibold ring-1 ring-white/20 hover:ring-fuchsia-400/60 transition"
        aria-label={soundOn ? "Couper le son" : "Activer le son"}
      >
        {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        {soundOn ? "Son" : "Muet"}
      </button>

      {/* Prev / Next controls */}
      <button
        type="button"
        onClick={() => advance(-1)}
        aria-label="Précédent"
        className="btn-magnetic absolute left-2 top-1/2 -translate-y-12 z-[60] w-10 h-10 rounded-full bg-black/60 backdrop-blur text-white ring-1 ring-white/20 hover:ring-fuchsia-400/60 transition flex items-center justify-center"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => advance(1)}
        aria-label="Suivant"
        className="btn-magnetic absolute left-2 top-1/2 translate-y-2 z-[60] w-10 h-10 rounded-full bg-black/60 backdrop-blur text-white ring-1 ring-white/20 hover:ring-fuchsia-400/60 transition flex items-center justify-center"
      >
        <ChevronDown className="w-5 h-5" />
      </button>

      {cards.map((c) => {
        const variant = variantPool[c.slotIdx % variantPool.length];
        return (
          <div
            key={c.key}
            className={`group absolute rounded-xl ring-1 ring-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] hover:z-50 ${variant}`}
            style={{
              ...styleFor(c.slotIdx),
      transition: "opacity 0.18s linear, filter 0.3s ease",
              willChange: "transform",
              contain: "layout paint",
              backfaceVisibility: "hidden",
            }}
          >
            {/* Thick 3D body — slices stacked on Z to simulate card depth */}
            {[-14, -10, -6, -2].map((zd) => (
              <div
                key={zd}
                aria-hidden
                className="absolute inset-0 rounded-xl"
                style={{
                  transform: `translateZ(${zd}px)`,
                  background: `linear-gradient(180deg, hsl(var(--neon-purple) / ${0.55 + (zd + 14) * 0.02}), hsl(0 0% 4% / 0.95))`,
                  boxShadow: zd === -14 ? "0 0 0 1px hsl(var(--neon-magenta) / 0.35)" : undefined,
                }}
              />
            ))}
            {/* Front face */}
            <div
              className="relative w-full aspect-video overflow-hidden rounded-xl bg-muted"
              style={{ transform: "translateZ(0)" }}
            >
              <img
                src={c.v.thumb || placeholderThumb(c.v.id, c.v.title)}
                alt={c.v.title}
                loading="eager"
                decoding="async"
                draggable={false}
                className="w-full h-full object-cover select-none pointer-events-none"
                onLoad={(e) => {
                  const img = e.currentTarget;
                  if (img.naturalWidth > 0 && img.naturalWidth <= 120) {
                    const step = img.dataset.fallback ?? "0";
                    if (step === "0") { img.dataset.fallback = "1"; img.src = ytThumbHq(c.v.id); }
                    else if (step === "1") { img.dataset.fallback = "2"; img.src = ytThumbFallback(c.v.id); }
                    else if (step === "2") { img.dataset.fallback = "3"; img.src = placeholderThumb(c.v.id, c.v.title); }
                  }
                }}
                onError={(e) => {
                  const img = e.currentTarget;
                  const step = img.dataset.fallback ?? "0";
                  if (step === "0") { img.dataset.fallback = "1"; img.src = ytThumbHq(c.v.id); }
                  else if (step === "1") { img.dataset.fallback = "2"; img.src = ytThumbFallback(c.v.id); }
                  else if (step === "2") { img.dataset.fallback = "3"; img.src = placeholderThumb(c.v.id, c.v.title); }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              {/* Glossy highlight for relief */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none rounded-xl"
                style={{
                  background:
                    "linear-gradient(155deg, hsl(0 0% 100% / 0.18) 0%, hsl(0 0% 100% / 0) 35%, hsl(0 0% 100% / 0) 65%, hsl(0 0% 0% / 0.25) 100%)",
                }}
              />
              <div className="absolute bottom-2 left-3 right-3 z-10">
                <div className="text-[11px] text-fuchsia-200/90 font-medium">
                  Anime Moment
                </div>
                <div className="text-xs sm:text-sm font-bold text-white leading-tight line-clamp-2">
                  {c.v.title}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};