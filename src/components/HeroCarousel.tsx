import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
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

  // Original stacked layout (top → bottom)
  const slots = [
    { top: 2,  left: 18, w: 300, z: 6, variant: "neon-edge" },
    { top: 10, left: 54, w: 200, z: 2, variant: "holo-card" },
    { top: 28, left: 32, w: 280, z: 5, variant: "depth-card" },
    { top: 38, left: 2,  w: 300, z: 4, variant: "holo-card" },
    { top: 52, left: 30, w: 290, z: 3, variant: "neon-edge" },
    { top: 66, left: 16, w: 270, z: 7, variant: "depth-card" },
  ];

  type Card = { key: number; v: Video; slotIdx: number };
  const nextKey = useRef(slots.length);
  const nextPool = useRef(slots.length);
  const [cards, setCards] = useState<Card[]>(() =>
    slots.map((_, i) => ({ key: i, v: videos[i % videos.length], slotIdx: i })),
  );

  // Diaporama: every 10s, all cards rise one slot; top exits, new enters at bottom
  useEffect(() => {
    if (paused) return;
    const tick = () => {
      // 1) Insert the new card at the bottom-offscreen position (slotIdx = slots.length)
      const incoming: Card = {
        key: nextKey.current++,
        v: videos[nextPool.current++ % videos.length],
        slotIdx: slots.length,
      };
      setCards((prev) => [...prev, incoming]);
      // 2) Next frame, shift everyone up by 1 → CSS transitions glide them to new slot
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setCards((prev) => prev.map((c) => ({ ...c, slotIdx: c.slotIdx - 1 })));
        });
      });
      // 3) After the glide, prune the card that exited above
      window.setTimeout(() => {
        setCards((prev) => prev.filter((c) => c.slotIdx > -2));
      }, 1200);
    };
    const id = window.setInterval(tick, 10000);
    return () => window.clearInterval(id);
  }, [paused]);

  const styleFor = (slotIdx: number): React.CSSProperties => {
    if (slotIdx >= 0 && slotIdx < slots.length) {
      const s = slots[slotIdx];
      return {
        top: `${s.top}%`, left: `${s.left}%`, width: s.w, zIndex: s.z, opacity: 1,
        aspectRatio: "16 / 9",
      };
    }
    if (slotIdx < 0) {
      const s = slots[0];
      return {
        top: `-30%`, left: `${s.left}%`, width: s.w, zIndex: s.z, opacity: 0,
        aspectRatio: "16 / 9",
      };
    }
    const s = slots[slots.length - 1];
    return {
      top: `110%`, left: `${s.left}%`, width: s.w, zIndex: s.z, opacity: 0,
      aspectRatio: "16 / 9",
    };
  };

  return (
    <div
      className="relative w-full h-[460px] sm:h-[520px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <button
        type="button"
        onClick={() => setSoundOn((s) => !s)}
        className="btn-magnetic absolute top-2 right-2 z-[60] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur text-white text-xs font-semibold ring-1 ring-white/20 hover:ring-fuchsia-400/60 transition"
        aria-label={soundOn ? "Couper le son" : "Activer le son"}
      >
        {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        {soundOn ? "Son" : "Muet"}
      </button>
      {cards.map((c) => {
        const variant =
          c.slotIdx >= 0 && c.slotIdx < slots.length
            ? slots[c.slotIdx].variant
            : slots[slots.length - 1].variant;
        return (
          <div
            key={c.key}
            className={`tilt-card group absolute rounded-xl overflow-hidden ring-1 ring-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] hover:z-50 ${variant}`}
            style={{
              ...styleFor(c.slotIdx),
              transition:
                "top 1.1s cubic-bezier(0.22, 1, 0.36, 1), left 1.1s cubic-bezier(0.22, 1, 0.36, 1), width 1.1s ease, opacity 0.9s ease",
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