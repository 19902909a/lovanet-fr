import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, ChevronUp, ChevronDown } from "lucide-react";
import { videos, type Video } from "@/data/videos";
import { HoverPreview } from "@/components/HoverPreview";

const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
const ytThumbFallback = (id: string) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
const ytThumbHq = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

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

  // Vertical conveyor that CURVES at the top.
  // Cards rise straight up from the bottom, then swing out along a quarter-arc and loop.
  const N = 7;
  const variants = ["neon-edge", "holo-card", "depth-card", "neon-edge", "holo-card", "depth-card", "neon-edge"];

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

  // Card size + path geometry
  const cardW = Math.max(140, Math.min(size.w * 0.24, 220));
  const cardH = cardW * (9 / 16);
  const x0 = size.w * 0.58;                                  // vertical column x
  const yBottom = size.h - cardH / 2 - 12;                   // first card spawn
  const yArcStart = size.h * 0.42;                           // arc begins here
  const arcR = Math.max(120, Math.min(size.w * 0.32, size.h * 0.36));
  const straightLen = Math.max(0, yBottom - yArcStart);
  const arcLen = (Math.PI / 2) * arcR;
  const total = straightLen + arcLen;
  const ts = total > 0 ? straightLen / total : 0.5;          // cut point in [0,1]

  // Continuous progress in [0,1). Full loop ~ 22s.
  const LOOP_SEC = 22;
  const [prog, setProg] = useState(0);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;
      if (!pausedRef.current) {
        setProg((p) => (p + dt / LOOP_SEC) % 1);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const advance = useCallback((dir: 1 | -1) => {
    setProg((p) => (p + dir / N + 1) % 1);
  }, []);

  // Cycle the video pool so every video shows up over time.
  const baseOffset = Math.floor(prog * N);
  const cards = Array.from({ length: N }, (_, i) => ({
    key: i,
    v: videos[((i + baseOffset) % videos.length + videos.length) % videos.length],
    slotIdx: i,
  }));

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

  // Position along the path for a normalized t in [0,1]: straight then quarter-arc.
  const pointAt = (t: number) => {
    if (t <= ts) {
      const u = ts > 0 ? t / ts : 0;
      return { x: x0, y: yBottom - u * straightLen, tilt: 0, depth: u };
    }
    const u = (t - ts) / (1 - ts);
    const theta = u * (Math.PI / 2);
    return {
      x: x0 - arcR + arcR * Math.cos(theta),
      y: yArcStart - arcR * Math.sin(theta),
      tilt: -theta * (180 / Math.PI), // card leans into the curve
      depth: 1 + u * 0.3,
    };
  };

  const styleFor = (slotIdx: number): React.CSSProperties => {
    // Card slotIdx 0 is the most-advanced one, N-1 just spawned at bottom.
    const t = (prog + slotIdx / N) % 1;
    const p = pointAt(t);
    // Fade in at spawn, fade out before loop
    const fadeIn = Math.min(1, t / 0.05);
    const fadeOut = Math.min(1, (1 - t) / 0.08);
    const opacity = Math.max(0, Math.min(fadeIn, fadeOut));
    // Cards near bottom slightly bigger, smaller as they swing out
    const scale = 1.05 - p.depth * 0.18;
    const z = 10 + Math.round((1 - t) * 30);
    return {
      left: 0,
      top: 0,
      width: cardW,
      aspectRatio: "16 / 9",
      transform: `translate(${p.x - cardW / 2}px, ${p.y - cardH / 2}px) rotate(${p.tilt}deg) scale(${scale})`,
      transformOrigin: "center center",
      opacity,
      zIndex: z,
      filter: `drop-shadow(0 0 18px hsl(var(--neon-magenta) / 0.35)) drop-shadow(0 8px 24px hsl(var(--neon-purple) / 0.25))`,
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[460px] sm:h-[520px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Ambient glow behind the path */}
      <div
        aria-hidden
        className="absolute pointer-events-none rounded-full halo-spin"
        style={{
          width: arcR * 2,
          height: arcR * 2,
          left: x0 - arcR,
          top: yArcStart - arcR,
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
        const variant =
          c.slotIdx >= 0 && c.slotIdx < N
            ? variants[c.slotIdx]
            : variants[N - 1];
        return (
          <div
            key={c.key}
            className={`tilt-card group absolute rounded-xl overflow-hidden ring-1 ring-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] hover:z-50 ${variant}`}
            style={{
              ...styleFor(c.slotIdx),
              transition: "opacity 0.6s ease, filter 0.6s ease",
              willChange: "transform",
            }}
          >
            <HoverPreview
              videoId={c.v.id}
              title={c.v.title}
              thumbnail={ytThumb(c.v.id)}
              muted={!soundOn}
              onImgLoad={(e) => {
                const img = e.currentTarget;
                if (img.naturalWidth > 0 && img.naturalWidth <= 120) {
                  const step = img.dataset.fallback ?? "0";
                  if (step === "0") { img.dataset.fallback = "1"; img.src = ytThumbHq(c.v.id); }
                  else if (step === "1") { img.dataset.fallback = "2"; img.src = ytThumbFallback(c.v.id); }
                  else if (step === "2") { img.dataset.fallback = "3"; img.src = placeholderThumb(c.v.id, c.v.title); }
                }
              }}
              onImgError={(e) => {
                const img = e.currentTarget;
                const step = img.dataset.fallback ?? "0";
                if (step === "0") { img.dataset.fallback = "1"; img.src = ytThumbHq(c.v.id); }
                else if (step === "1") { img.dataset.fallback = "2"; img.src = ytThumbFallback(c.v.id); }
                else if (step === "2") { img.dataset.fallback = "3"; img.src = placeholderThumb(c.v.id, c.v.title); }
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-2 left-3 right-3 z-10">
                <div className="text-[11px] text-fuchsia-200/90 font-medium">
                  Anime Moment
                </div>
                <div className="text-xs sm:text-sm font-bold text-white leading-tight line-clamp-2">
                  {c.v.title}
                </div>
              </div>
            </HoverPreview>
          </div>
        );
      })}
    </div>
  );
};