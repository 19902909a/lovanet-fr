import { videos } from "@/data/videos";

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
  const items = videos.slice(0, 5);
  // Free-form stacked layout matching the source capture (% positions inside container)
  const layout = [
    { top: 6,  left: 4,  rot: -4, w: 230, z: 2 },
    { top: 0,  left: 30, rot: -1, w: 280, z: 5 },
    { top: 18, left: 12, rot:  2, w: 260, z: 4 },
    { top: 42, left: 36, rot:  3, w: 250, z: 6 },
    { top: 50, left: 60, rot: -2, w: 240, z: 3 },
  ];

  return (
    <div className="relative w-full h-[460px] sm:h-[520px]">
      {items.map((v, i) => {
        const l = layout[i];
        return (
          <div
            key={v.id}
            className="absolute rounded-xl overflow-hidden ring-1 ring-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] transition-transform duration-500 hover:scale-[1.04] hover:z-50"
            style={{
              top: `${l.top}%`,
              left: `${l.left}%`,
              width: l.w,
              transform: `rotate(${l.rot}deg)`,
              zIndex: l.z,
              aspectRatio: "16 / 9",
            }}
          >
            <img
              src={ytThumb(v.id)}
              alt={v.title}
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => {
                const img = e.currentTarget;
                const step = img.dataset.fallback ?? "0";
                if (step === "0") { img.dataset.fallback = "1"; img.src = ytThumbHq(v.id); }
                else if (step === "1") { img.dataset.fallback = "2"; img.src = ytThumbFallback(v.id); }
                else if (step === "2") { img.dataset.fallback = "3"; img.src = placeholderThumb(v.id, v.title); }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-3 right-3">
              <div className="text-[10px] uppercase tracking-wider text-fuchsia-200/90 font-semibold">
                Anime Moment
              </div>
              <div className="text-xs sm:text-sm font-bold text-white leading-tight line-clamp-2">
                {v.title}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};