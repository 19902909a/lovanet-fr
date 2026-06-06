import { useEffect, useState, useCallback } from "react";
import { PageShell } from "@/components/PageShell";
import { videos as fallbackVideos } from "@/data/videos";
import { Music2, Heart, MessageCircle, Share2, ArrowUp, ArrowDown, ExternalLink, VolumeX, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Tiktok = () => {
  const list = [...fallbackVideos].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  const [idx, setIdx] = useState(0);
  const [muted, setMuted] = useState(true);
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">("vertical");
  const v = list[idx];

  const go = useCallback(
    (dir: 1 | -1) => setIdx((i) => (i + dir + list.length) % list.length),
    [list.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") go(1);
      else if (e.key === "ArrowUp") go(-1);
      else if (e.key.toLowerCase() === "m") setMuted((m) => !m);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <PageShell>
      <section className="container mx-auto px-4 lg:px-8 py-12 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">Feed officiel</p>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold">
          <span className="bg-gradient-to-r from-pink-400 via-fuchsia-500 to-rose-500 bg-clip-text text-transparent">
            TikTok
          </span>
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Feed vertical infini · swipe haut/bas pour naviguer · démarrage automatique.
        </p>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white text-xs font-bold flex items-center gap-1.5">
              <Music2 className="w-3.5 h-3.5" /> TikTok
            </div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Feed vertical · {idx + 1}/{list.length}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMuted((m) => !m)}
              className="px-3 py-2 rounded-full bg-secondary border border-border text-xs font-semibold hover:border-pink-500/60 transition-colors flex items-center gap-1.5"
            >
              {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              {muted ? "Son OFF" : "Son ON"}
            </button>
            <div className="inline-flex p-1 rounded-full bg-secondary border border-border">
              <button
                onClick={() => setOrientation("vertical")}
                className={cn("px-3 py-1.5 text-xs rounded-full font-semibold", orientation === "vertical" ? "bg-background" : "text-muted-foreground")}
              >
                ▯ Vertical
              </button>
              <button
                onClick={() => setOrientation("horizontal")}
                className={cn("px-3 py-1.5 text-xs rounded-full font-semibold", orientation === "horizontal" ? "bg-background" : "text-muted-foreground")}
              >
                ▭ Horizontal
              </button>
            </div>
          </div>
        </div>

        <div className="relative flex items-center justify-center gap-4">
          {/* Up arrow */}
          <button
            onClick={() => go(-1)}
            className="hidden md:flex w-12 h-12 rounded-full bg-secondary/80 border border-border hover:border-pink-500/60 items-center justify-center transition-colors"
            aria-label="Précédent"
          >
            <ArrowUp className="w-5 h-5" />
          </button>

          {/* Player */}
          <div
            className={cn(
              "relative rounded-3xl overflow-hidden bg-black border border-pink-500/30 shadow-[0_40px_120px_-40px_hsl(var(--neon-magenta)/0.6)]",
              orientation === "vertical" ? "aspect-[9/16] w-full max-w-sm" : "aspect-video w-full max-w-3xl"
            )}
          >
            <iframe
              key={`${v.id}-${muted}`}
              src={`https://www.youtube.com/embed/${v.id}?autoplay=1&rel=0&mute=${muted ? 1 : 0}&loop=1&playlist=${v.id}`}
              title={v.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

            {/* Right-side actions overlay */}
            <div className="absolute right-3 bottom-24 flex flex-col gap-3">
              <button className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 transition-transform">
                <Heart className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </button>
              <a
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 transition-transform"
              >
                <Share2 className="w-5 h-5" />
              </a>
            </div>

            {/* Caption */}
            <div className="absolute left-3 right-16 bottom-3 text-white">
              <p className="text-[10px] uppercase tracking-wider text-white/70">{v.series}</p>
              <h3 className="text-sm font-bold leading-snug line-clamp-3 mt-0.5">{v.title}</h3>
            </div>
          </div>

          {/* Down arrow */}
          <button
            onClick={() => go(1)}
            className="hidden md:flex w-12 h-12 rounded-full bg-secondary/80 border border-border hover:border-pink-500/60 items-center justify-center transition-colors"
            aria-label="Suivant"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden mt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => go(-1)}
            className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <button
            onClick={() => go(1)}
            className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Swipe haut/bas · clavier ↑/↓ · M pour son
        </p>

        <div className="text-center mt-4">
          <a
            href={`https://www.youtube.com/watch?v=${v.id}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
            style={{ background: "var(--gradient-magenta)" }}
          >
            Ouvrir l'original <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>
    </PageShell>
  );
};

export default Tiktok;