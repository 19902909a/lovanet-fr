import { useState } from "react";
import { Link } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { videos, thumb } from "@/data/videos";
import { Play, Volume2, VolumeX, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { HoverPreview } from "@/components/HoverPreview";

const PrimeVideo = () => {
  const [active, setActive] = useState(videos[0].id);
  const [muted, setMuted] = useState(true);
  const [orientation, setOrientation] = useState<"cinema" | "vertical">("cinema");
  const v = videos.find((x) => x.id === active) || videos[0];
  const idx = videos.findIndex((x) => x.id === v.id);
  const next = videos[(idx + 1) % videos.length];

  return (
    <PageShell>
      <section className="container mx-auto px-4 lg:px-8 py-12 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-300 mb-2">Streaming partenaire</p>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold">
          <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Prime Vidéo
          </span>
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Lecteur cinématique · démarrage automatique · option vertical pour les shorts.
        </p>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold flex items-center gap-1.5">
              ◆ prime
            </div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Lecteur cinématique</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMuted((m) => !m)}
              className="px-3 py-2 rounded-full bg-secondary border border-border text-xs font-semibold hover:border-primary/60 transition-colors flex items-center gap-1.5"
            >
              {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              {muted ? "Activer son" : "Muet"}
            </button>
            <div className="inline-flex p-1 rounded-full bg-secondary border border-border">
              <button
                onClick={() => setOrientation("cinema")}
                className={cn("px-3 py-1.5 text-xs rounded-full font-semibold", orientation === "cinema" ? "bg-background" : "text-muted-foreground")}
              >
                ▭ Cinéma
              </button>
              <button
                onClick={() => setOrientation("vertical")}
                className={cn("px-3 py-1.5 text-xs rounded-full font-semibold", orientation === "vertical" ? "bg-background" : "text-muted-foreground")}
              >
                ▯ Vertical
              </button>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "mx-auto rounded-3xl overflow-hidden bg-black border border-sky-500/30 shadow-[0_40px_120px_-40px_hsl(211_100%_50%/0.5)]",
            orientation === "cinema" ? "aspect-video w-full" : "aspect-[9/16] max-w-md"
          )}
        >
          <iframe
            key={`${v.id}-${muted}`}
            src={`https://www.youtube.com/embed/${v.id}?autoplay=1&rel=0&mute=${muted ? 1 : 0}`}
            title={v.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setActive(next.id)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary border border-border hover:border-sky-500/60 text-sm font-semibold transition-colors"
          >
            Lecture HD <Play className="w-4 h-4 fill-current" />
          </button>
          <button
            onClick={() => setActive(next.id)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600"
          >
            Suivant <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{v.series}</p>
          <h2 className="font-display text-2xl font-bold mt-1">{v.title}</h2>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pb-16">
        <h3 className="font-display text-xl font-bold mb-4">À découvrir</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {videos
            .filter((x) => x.id !== v.id)
            .map((x) => (
              <button
                key={x.id}
                onClick={() => {
                  setActive(x.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="tilt-card group text-left rounded-2xl overflow-hidden bg-card border border-border transition-all"
              >
                <HoverPreview
                  videoId={x.id}
                  title={x.title}
                  thumbnail={thumb(x.id)}
                  vertical={orientation === "vertical"}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                  <span className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-md text-[10px] font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white">
                    PRIME
                  </span>
                </HoverPreview>
                <div className="p-3">
                  <div className="text-sm font-semibold line-clamp-2 group-hover:text-sky-400 transition-colors">{x.title}</div>
                </div>
              </button>
            ))}
        </div>
      </section>
    </PageShell>
  );
};

export default PrimeVideo;