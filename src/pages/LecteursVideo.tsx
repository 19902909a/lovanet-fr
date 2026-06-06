import { Link, useSearchParams } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { videos as rawVideos, thumb } from "@/data/videos";
import { useState, useEffect, useMemo } from "react";
import { Volume2, VolumeX, ExternalLink, ArrowRight, Youtube, Play, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Service = "youtube" | "prime" | "tiktok";

const SERVICES: { id: Service; label: string; icon: any; tint: string }[] = [
  { id: "youtube", label: "YouTube", icon: Youtube, tint: "from-rose-500 to-red-600" },
  { id: "prime", label: "Prime", icon: Play, tint: "from-sky-500 to-blue-600" },
  { id: "tiktok", label: "TikTok", icon: Music2, tint: "from-pink-500 to-fuchsia-600" },
];

const LecteursVideo = () => {
  const [params, setParams] = useSearchParams();
  const videos = useMemo(
    () => [...rawVideos].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "")),
    [],
  );
  const initial = params.get("video") || videos[0].id;
  const [active, setActive] = useState(initial);
  const [service, setService] = useState<Service>((params.get("service") as Service) || "youtube");
  const [muted, setMuted] = useState(true);
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");

  useEffect(() => {
    const v = params.get("video");
    if (v && v !== active) setActive(v);
  }, [params, active]);

  const activeVideo = videos.find((v) => v.id === active) || videos[0];
  const idx = videos.findIndex((v) => v.id === activeVideo.id);
  const next = videos[(idx + 1) % videos.length];

  const select = (id: string) => {
    setActive(id);
    setParams({ video: id, service });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PageShell>
      <section className="container mx-auto px-4 lg:px-8 py-12">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">Lecteurs vidéo</p>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold">
          <span className="gradient-text">Lecture immersive</span>
        </h1>

        {/* Service tabs */}
        <div className="inline-flex mt-6 p-1 rounded-full bg-secondary border border-border">
          {SERVICES.map((s) => (
            <button
              key={s.id}
              onClick={() => setService(s.id)}
              className={cn(
                "px-5 py-2 text-sm font-semibold rounded-full transition-all flex items-center gap-2",
                service === s.id
                  ? `bg-gradient-to-r ${s.tint} text-white shadow-md`
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <s.icon className="w-4 h-4" /> {s.label}
            </button>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pb-6">
        {/* Player header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center">
              <Youtube className="w-4 h-4 text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {SERVICES.find((x) => x.id === service)?.label} · Lecteur officiel
              </div>
              <div className="text-sm font-semibold">@animemomentsAnimeofficiel</div>
            </div>
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
                onClick={() => setOrientation("horizontal")}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-full font-semibold transition-colors",
                  orientation === "horizontal" ? "bg-background text-foreground" : "text-muted-foreground"
                )}
              >
                ▭ Horizontal
              </button>
              <button
                onClick={() => setOrientation("vertical")}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-full font-semibold transition-colors",
                  orientation === "vertical" ? "bg-background text-foreground" : "text-muted-foreground"
                )}
              >
                ▯ Vertical
              </button>
            </div>
          </div>
        </div>

        {/* Player */}
        <div
          className={cn(
            "mx-auto rounded-3xl overflow-hidden bg-black border border-border shadow-[0_40px_120px_-40px_hsl(var(--neon-magenta)/0.4)] transition-all",
            orientation === "horizontal" ? "aspect-video w-full" : "aspect-[9/16] max-w-md"
          )}
        >
          <iframe
            key={`${activeVideo.id}-${muted}`}
            src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0&mute=${muted ? 1 : 0}`}
            title={activeVideo.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <button
            onClick={() => select(next.id)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary border border-border hover:border-primary/60 text-sm font-semibold transition-colors"
          >
            Suivant <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href={`https://www.youtube.com/watch?v=${activeVideo.id}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
            style={{ background: "var(--gradient-magenta)" }}
          >
            Ouvrir sur YouTube <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="mt-6 text-center">
          <h2 className="font-display text-2xl font-bold">{activeVideo.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {activeVideo.series} {activeVideo.episode && `· ${activeVideo.episode}`}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pb-16">
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">Sélection en rotation</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {videos
            .filter((v) => v.id !== activeVideo.id)
            .map((v) => (
              <button
                key={v.id}
                onClick={() => select(v.id)}
                className="group text-left rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/60 transition-all"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={thumb(v.id)}
                    alt={v.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-white">
                    YouTube
                  </span>
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {v.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    {v.series} {v.episode && `· ${v.episode}`}
                  </div>
                </div>
              </button>
            ))}
        </div>
      </section>
    </PageShell>
  );
};

export default LecteursVideo;