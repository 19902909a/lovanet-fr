import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Play, Calendar, Youtube, Music2, Tv, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { videos as fallbackVideos } from "@/data/videos";

// Prefer maxresdefault (16:9, full frame) and fall back to hqdefault
const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
const ytThumbFallback = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

type ImportedVideo = {
  id: string;
  source: "youtube" | "tiktok" | "prime";
  external_id: string | null;
  title: string;
  thumbnail_url: string | null;
  video_url: string;
  published_at: string | null;
  episode: string | null;
};

const sourceMeta: Record<ImportedVideo["source"], { label: string; Icon: typeof Youtube }> = {
  youtube: { label: "YouTube", Icon: Youtube },
  tiktok: { label: "TikTok", Icon: Music2 },
  prime: { label: "Prime Video", Icon: Tv },
};

export const RecentEpisodesCarousel = () => {
  const [items, setItems] = useState<ImportedVideo[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("imported_videos")
        .select("id, source, external_id, title, thumbnail_url, video_url, published_at, episode")
        .order("published_at", { ascending: false, nullsFirst: false })
        .limit(30);
      if (!active) return;
      setItems((data as ImportedVideo[] | null) ?? []);
      setLoaded(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  const recents = useMemo<ImportedVideo[]>(() => {
    if (items.length > 0) return items;
    return fallbackVideos
      .filter((v) => v.recent)
      .map((v) => ({
        id: v.id,
        source: "youtube" as const,
        external_id: v.id,
        title: v.title,
        thumbnail_url: ytThumb(v.id),
        video_url: `/lecteurs-video?video=${v.id}`,
        published_at: v.date ?? null,
        episode: v.episode ?? null,
      }));
  }, [items]);

  const visibleRecents = useMemo(() => recents.slice(0, visibleCount), [recents, visibleCount]);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    // Progressive loading: when near the end, reveal more items
    if (el.scrollLeft + el.clientWidth > el.scrollWidth - 320) {
      setVisibleCount((c) => Math.min(c + 4, recents.length));
    }
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
  }, [recents.length]);

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

  const isNew = (d?: string | null) => {
    if (!d) return false;
    const diff = Date.now() - new Date(d).getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
  };

  const linkFor = (v: ImportedVideo): { to: string; external: boolean } => {
    if (v.source === "youtube" && v.external_id) {
      return { to: `/lecteurs-video?video=${v.external_id}`, external: false };
    }
    return { to: v.video_url, external: true };
  };

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

      {loaded && items.length === 0 && (
        <p className="text-sm text-muted-foreground mb-4">
          Aucune vidéo importée pour le moment — la synchronisation peut être déclenchée depuis l'administration.
        </p>
      )}
      <div
        ref={scrollerRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {!loaded &&
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`sk-${i}`}
              className="snap-start shrink-0 w-[340px] sm:w-[400px] rounded-2xl overflow-hidden bg-card border border-border animate-pulse"
            >
              <div className="aspect-video bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        {visibleRecents.map((v) => {
          const { to, external } = linkFor(v);
          const { label, Icon } = sourceMeta[v.source];
          const cover = v.thumbnail_url || (v.external_id ? ytThumb(v.external_id) : "");
          const fresh = isNew(v.published_at);
          const cardClass =
            "group snap-start shrink-0 w-[340px] sm:w-[400px] rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/60 transition-all hover:-translate-y-1";
          const inner = (
            <>
            <div className="relative aspect-video overflow-hidden bg-black">
              <img
                src={cover}
                alt={v.title}
                loading="lazy"
                className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-500"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (v.external_id && !img.dataset.fallback) {
                    img.dataset.fallback = "1";
                    img.src = ytThumbFallback(v.external_id);
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider shadow-[0_0_20px_hsl(var(--primary)/0.5)]">
                <Icon className="w-3 h-3" />
                {label}
              </span>
              <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                {fresh && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-[0_0_18px_hsl(var(--primary)/0.5)] animate-pulse">
                    <Sparkles className="w-3 h-3" />
                    Nouveau
                  </span>
                )}
                {v.episode && (
                  <span className="px-2.5 py-1 rounded-md bg-background/80 backdrop-blur text-foreground text-[11px] font-semibold">
                    {v.episode}
                  </span>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.6)]">
                  <Play className="w-6 h-6 text-primary-foreground fill-current" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3
                title={v.title}
                className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors min-h-[2.5rem]"
              >
                {v.title}
              </h3>
              <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                <span className="truncate pr-2">{label}</span>
                {v.published_at && (
                  <span className="flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3" />
                    {fmt(v.published_at)}
                  </span>
                )}
              </div>
            </div>
            </>
          );
          return external ? (
            <a key={v.id} href={to} target="_blank" rel="noreferrer" className={cardClass}>
              {inner}
            </a>
          ) : (
            <Link key={v.id} to={to} className={cardClass}>
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
};