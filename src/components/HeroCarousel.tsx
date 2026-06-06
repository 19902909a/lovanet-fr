import { useEffect, useState } from "react";
import { videos } from "@/data/videos";
import { cn } from "@/lib/utils";

const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
const ytThumbFallback = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

export const HeroCarousel = () => {
  const [active, setActive] = useState(2);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % 5), 3500);
    return () => clearInterval(id);
  }, []);

  const items = videos.slice(0, 5);

  return (
    <div className="relative h-[420px] sm:h-[500px] flex items-center justify-center perspective-[1400px]">
      {items.map((v, i) => {
        const offset = i - active;
        const isActive = offset === 0;
        return (
          <button
            key={v.id}
            onClick={() => setActive(i)}
            className={cn(
              "absolute transition-all duration-700 ease-out cursor-pointer",
              "w-[300px] sm:w-[380px] aspect-video rounded-2xl overflow-hidden",
              "shadow-[0_25px_70px_-15px_hsl(var(--primary)/0.55)] ring-1 ring-white/10"
            )}
            style={{
              transform: `translateX(${offset * 200}px) scale(${isActive ? 1.1 : 0.82}) rotateY(${offset * -10}deg)`,
              zIndex: 10 - Math.abs(offset),
              opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.25,
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0 -z-0"
              style={{
                background:
                  "linear-gradient(135deg, hsl(195 100% 60%) 0%, hsl(270 90% 65%) 50%, hsl(330 95% 65%) 100%)",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-0 opacity-60 mix-blend-screen"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 20%, hsl(180 100% 70% / 0.6), transparent 50%), radial-gradient(circle at 80% 80%, hsl(300 100% 70% / 0.55), transparent 55%)",
              }}
            />
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
              <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold tracking-wider uppercase">
                Anime Moment
              </span>
            </div>
            <img
              src={ytThumb(v.id)}
              alt={v.title}
              className="relative z-10 w-full h-full object-contain"
              loading="lazy"
              onError={(e) => {
                const img = e.currentTarget;
                if (!img.dataset.fallback) {
                  img.dataset.fallback = "1";
                  img.src = ytThumbFallback(v.id);
                }
              }}
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
              <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur text-foreground text-[11px] font-medium whitespace-nowrap max-w-[200px] truncate">
                {v.series}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};