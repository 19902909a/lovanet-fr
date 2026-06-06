import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { videos } from "@/data/videos";
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
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-rotate every 10s — videos rise upward through the stack
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setOffset((o) => (o + 1) % videos.length);
    }, 10000);
    return () => window.clearInterval(id);
  }, [paused]);

  // 6 stacked slots — each gets its own 3D pose + variant
  const slots = [
    { top: 2,  left: 18, w: 300, z: 6, rx: -8,  ry: 10,  rz: -2, variant: "neon-edge"  },
    { top: 10, left: 54, w: 220, z: 2, rx: 6,   ry: -14, rz: 3,  variant: "holo-card"  },
    { top: 28, left: 32, w: 280, z: 5, rx: -4,  ry: 8,   rz: -1, variant: "depth-card" },
    { top: 38, left: 2,  w: 300, z: 4, rx: 8,   ry: -10, rz: 2,  variant: "holo-card"  },
    { top: 52, left: 30, w: 290, z: 3, rx: -6,  ry: 12,  rz: -3, variant: "neon-edge"  },
    { top: 66, left: 16, w: 270, z: 7, rx: 4,   ry: -8,  rz: 1,  variant: "depth-card" },
  ];
  const items = slots.map((_, i) => videos[(i + offset) % videos.length]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[460px] sm:h-[520px]"
      style={{ perspective: "1400px", perspectiveOrigin: "50% 40%" }}
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

      {/* Progress ring around the sound button */}
      <div className="absolute top-2 right-2 z-[55] pointer-events-none">
        <div
          key={offset}
          className="w-[90px] h-[34px] rounded-full ring-1 ring-fuchsia-400/40"
          style={{
            animation: paused ? "none" : "neon-edge-pulse 10s linear",
          }}
        />
      </div>

      {items.map((v, i) => {
        const l = slots[i];
        return (
          <div
            key={`slot-${i}`}
            className="absolute hover:z-50 overflow-hidden rounded-xl"
            style={{
              top: `${l.top}%`,
              left: `${l.left}%`,
              width: l.w,
              zIndex: l.z,
              aspectRatio: "16 / 9",
              transformStyle: "preserve-3d",
              transform: `rotateX(${l.rx}deg) rotateY(${l.ry}deg) rotateZ(${l.rz}deg)`,
              transition: "transform 0.6s cubic-bezier(0.2,0.8,0.2,1)",
            }}
          >
            <div
              key={`${v.id}-${offset}`}
              className={`animate-hero-rise tilt-card group relative w-full h-full rounded-xl overflow-hidden ring-1 ring-white/10 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.7)] ${l.variant}`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
            <HoverPreview
              videoId={v.id}
              title={v.title}
              thumbnail={ytThumb(v.id)}
              muted={!soundOn}
              onImgLoad={(e) => {
                const img = e.currentTarget;
                if (img.naturalWidth > 0 && img.naturalWidth <= 120) {
                  const step = img.dataset.fallback ?? "0";
                  if (step === "0") { img.dataset.fallback = "1"; img.src = ytThumbHq(v.id); }
                  else if (step === "1") { img.dataset.fallback = "2"; img.src = ytThumbFallback(v.id); }
                  else if (step === "2") { img.dataset.fallback = "3"; img.src = placeholderThumb(v.id, v.title); }
                }
              }}
              onImgError={(e) => {
                const img = e.currentTarget;
                const step = img.dataset.fallback ?? "0";
                if (step === "0") { img.dataset.fallback = "1"; img.src = ytThumbHq(v.id); }
                else if (step === "1") { img.dataset.fallback = "2"; img.src = ytThumbFallback(v.id); }
                else if (step === "2") { img.dataset.fallback = "3"; img.src = placeholderThumb(v.id, v.title); }
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-2 left-3 right-3 z-10">
                <div className="text-[11px] text-fuchsia-200/90 font-medium">
                  Anime Moment
                </div>
                <div className="text-xs sm:text-sm font-bold text-white leading-tight line-clamp-2">
                  {v.title}
                </div>
              </div>
            </HoverPreview>
            </div>
          </div>
        );
      })}
    </div>
  );
};