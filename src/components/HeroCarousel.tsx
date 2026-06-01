import { useEffect, useState } from "react";
import { videos, thumb } from "@/data/videos";
import { cn } from "@/lib/utils";

export const HeroCarousel = () => {
  const [active, setActive] = useState(2);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % 5), 3500);
    return () => clearInterval(id);
  }, []);

  const items = videos.slice(0, 5);

  return (
    <div className="relative h-[480px] sm:h-[560px] flex items-center justify-center perspective-[1400px]">
      {items.map((v, i) => {
        const offset = i - active;
        const isActive = offset === 0;
        return (
          <button
            key={v.id}
            onClick={() => setActive(i)}
            className={cn(
              "absolute transition-all duration-700 ease-out cursor-pointer",
              "w-[220px] sm:w-[260px] aspect-[9/14] rounded-2xl overflow-hidden",
              "shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]"
            )}
            style={{
              transform: `translateX(${offset * 180}px) scale(${isActive ? 1.15 : 0.85}) rotateY(${offset * -8}deg)`,
              zIndex: 10 - Math.abs(offset),
              opacity: Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.25,
            }}
          >
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
              <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold tracking-wider uppercase">
                Anime Moment
              </span>
            </div>
            <img
              src={thumb(v.id)}
              alt={v.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
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