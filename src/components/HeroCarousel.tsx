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
  const items = videos.slice(0, 6);
  // Free-form stacked layout matching the source capture (% positions inside container)
  // No rotation — cards are straight rectangles overlapping at different offsets.
  const layout = [
    { top: 2,  left: 18, rot: 0, w: 300, z: 6 }, // Mama's — top
    { top: 10, left: 54, rot: 0, w: 200, z: 2 }, // peek behind right
    { top: 28, left: 32, rot: 0, w: 280, z: 5 }, // You're Lucky
    { top: 38, left: 2,  rot: 0, w: 300, z: 4 }, // I Mean
    { top: 52, left: 30, rot: 0, w: 290, z: 3 }, // So It's Something Else
    { top: 66, left: 16, rot: 0, w: 270, z: 7 }, // A Lot Did Happen
  ];

  return (
    <div className="relative w-full h-[460px] sm:h-[520px]">
      {items.map((v, i) => {
        const l = layout[i];
        return (
          <div
            key={v.id}
            className="tilt-card absolute rounded-xl overflow-hidden ring-1 ring-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] hover:z-50"
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
              onLoad={(e) => {
                const img = e.currentTarget;
                // YouTube returns a 120x90 grey placeholder when a size is unavailable
                if (img.naturalWidth > 0 && img.naturalWidth <= 120) {
                  const step = img.dataset.fallback ?? "0";
                  if (step === "0") { img.dataset.fallback = "1"; img.src = ytThumbHq(v.id); }
                  else if (step === "1") { img.dataset.fallback = "2"; img.src = ytThumbFallback(v.id); }
                  else if (step === "2") { img.dataset.fallback = "3"; img.src = placeholderThumb(v.id, v.title); }
                }
              }}
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
              <div className="text-[11px] text-fuchsia-200/90 font-medium">
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