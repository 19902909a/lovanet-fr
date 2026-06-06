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

  // Half-dial layout (left semicircle, like the 6 → 9 → 12 hours of a watch)
  const N = 6;
  const START_ANGLE = 300;   // top-most visible slot — small left-side arc
  const STEP = 12;           // tight step → subtle rotation between cards
  const variants = ["neon-edge", "holo-card", "depth-card", "neon-edge", "holo-card", "depth-card"];

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

  // Dial geometry — centered in container; radius and card scale with size
  const R = Math.max(160, Math.min(size.w * 0.42, size.h * 0.42));
  const cardW = Math.max(180, Math.min(R * 0.95, 280));

  type Card = { key: number; v: Video; slotIdx: number };
  const nextKey = useRef(N);
  const nextPool = useRef(N);
  const [cards, setCards] = useState<Card[]>(() =>
    Array.from({ length: N }, (_, i) => ({ key: i, v: videos[i % videos.length], slotIdx: i })),
  );

  // Advance one step: all cards rise (next) or sink (prev) one slot
  const advance = useCallback((dir: 1 | -1) => {
    if (dir === 1) {
      const incoming: Card = {
        key: nextKey.current++,
        v: videos[nextPool.current++ % videos.length],
        slotIdx: N, // enter from below 6 o'clock
      };
      setCards((prev) => [...prev, incoming]);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setCards((prev) => prev.map((c) => ({ ...c, slotIdx: c.slotIdx - 1 })));
        });
      });
      window.setTimeout(() => {
        setCards((prev) => prev.filter((c) => c.slotIdx > -2));
      }, 1200);
    } else {
      // Reverse: new card enters from top, everyone sinks one slot
      nextPool.current = (nextPool.current - 1 + videos.length * 1000) % videos.length;
      const incoming: Card = {
        key: nextKey.current++,
        v: videos[nextPool.current % videos.length],
        slotIdx: -1, // enter from top
      };
      setCards((prev) => [incoming, ...prev]);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setCards((prev) => prev.map((c) => ({ ...c, slotIdx: c.slotIdx + 1 })));
        });
      });
      window.setTimeout(() => {
        setCards((prev) => prev.filter((c) => c.slotIdx < N + 1));
      }, 1200);
    }
  }, []);

  // Auto-advance every 5s
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => advance(1), 5000);
    return () => window.clearInterval(id);
  }, [paused, advance]);

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

  // Polar position on the left half-dial.
  // θ = 0° → 12 o'clock (top), 90° → 3, 180° → 6, 270° → 9 (left).
  const angleFor = (i: number) => START_ANGLE - i * STEP;
  const styleFor = (slotIdx: number): React.CSSProperties => {
    const a = angleFor(slotIdx);
    const rad = (a * Math.PI) / 180;
    const dx = R * Math.sin(rad);   // x offset from the dial center (right edge)
    const dy = -R * Math.cos(rad);  // y offset (screen y grows downward)
    const visible = slotIdx >= 0 && slotIdx < N;
    const tangentTilt = (a - 270) * 0.18; // very gentle tilt — 0 at 9 o'clock
    const middle = (N - 1) / 2;
    const z = visible ? 10 + Math.round(20 - Math.abs(slotIdx - middle) * 3) : 1;
    return {
      left: "50%",
      top: "50%",
      width: cardW,
      aspectRatio: "16 / 9",
      transform: `translate(calc(${dx}px - 50%), calc(${dy}px - 50%)) rotate(${tangentTilt}deg)`,
      transformOrigin: "center center",
      opacity: visible ? 1 : 0,
      zIndex: z,
      filter: visible
        ? `drop-shadow(0 0 18px hsl(var(--neon-magenta) / 0.35)) drop-shadow(0 8px 24px hsl(var(--neon-purple) / 0.25))`
        : "none",
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
      {/* Decorative dial ring (anchored to the right edge, like a watch face) */}
      <div
        aria-hidden
        className="absolute pointer-events-none rounded-full border border-fuchsia-400/25 dial-glow"
        style={{
          width: R * 2,
          height: R * 2,
          left: `calc(50% - ${R}px)`,
          top: `calc(50% - ${R}px)`,
          boxShadow:
            "inset 0 0 80px hsl(var(--neon-magenta) / 0.12), 0 0 60px hsl(var(--neon-cyan) / 0.18)",
        }}
      />
      {/* Soft rotating halo behind the cards for a luminous wheel effect */}
      <div
        aria-hidden
        className="absolute pointer-events-none rounded-full halo-spin"
        style={{
          width: R * 1.6,
          height: R * 1.6,
          left: `calc(50% - ${R * 0.8}px)`,
          top: `calc(50% - ${R * 0.8}px)`,
          background:
            "conic-gradient(from 0deg, hsl(var(--neon-magenta)/0.0), hsl(var(--neon-magenta)/0.35), hsl(var(--neon-cyan)/0.0))",
          filter: "blur(40px)",
          opacity: 0.55,
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
              transition:
                "transform 1.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.9s ease, filter 1.4s ease",
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