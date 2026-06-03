import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Play, Calendar } from "lucide-react";
import { videos, thumb, type Video } from "@/data/videos";

export const RecentEpisodesCarousel = () => {
  const recents: Video[] = videos
    .filter((v) => v.recent)
    .slice()
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    update();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.85) * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  const fmt = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
      : "";

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Précédent"
        onClick={() => scrollBy(-1)}
        disabled={!canPrev}
        className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-background/90 border border-border backdrop-blur shadow-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all disabled:opacity-30 disabled:pointer-events-none"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        aria-label="Suivant"
        onClick={() => scrollBy(1)}
        disabled={!canNext}
        className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-background/90 border border-border backdrop-blur shadow-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all disabled:opacity-30 disabled:pointer-events-none"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div
        ref={scrollerRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {recents.map((v) => (
          <Link
            key={v.id}
            to={`/lecteurs-video?video=${v.id}`}
            className="group snap-start shrink-0 w-[280px] sm:w-[320px] rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/60 transition-all hover:-translate-y-1"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={thumb(v.id)}
                alt={v.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider shadow-[0_0_20px_hsl(var(--primary)/0.5)]">
                Nouveau
              </span>
              {v.episode && (
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-background/80 backdrop-blur text-foreground text-[11px] font-semibold">
                  {v.episode}
                </span>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.6)]">
                  <Play className="w-6 h-6 text-primary-foreground fill-current" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {v.title}
              </h3>
              <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                <span className="truncate pr-2">{v.series}</span>
                {v.date && (
                  <span className="flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3" />
                    {fmt(v.date)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};