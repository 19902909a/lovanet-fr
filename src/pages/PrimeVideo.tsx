import { useEffect, useRef, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { videos as fallbackVideos, thumb as ytThumb } from "@/data/videos";
import { Play, Volume2, VolumeX, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { HoverPreview } from "@/components/HoverPreview";
import { supabase } from "@/integrations/supabase/client";
import { AdminRemoveVideo } from "@/components/AdminRemoveVideo";

type Item = {
  id: string;
  videoId: string;
  title: string;
  series?: string;
  thumbnail: string;
};

const PrimeVideo = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState<string>("");
  const [muted, setMuted] = useState(true);
  const [autoplayNext, setAutoplayNext] = useState(true);
  const [orientation, setOrientation] = useState<"cinema" | "vertical">("cinema");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Fallback list from static data (Ruri no Houseki + others)
  const fallback: Item[] = fallbackVideos.map((v) => ({
    id: v.id,
    videoId: v.id,
    title: v.title,
    series: v.series,
    thumbnail: ytThumb(v.id),
  }));

  // Load ALL YouTube videos referenced by the channel from the imported library
  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from("imported_videos")
        .select("id, external_id, title, thumbnail_url, published_at, created_at")
        .eq("source", "youtube")
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false })
        .limit(500);
      if (!alive) return;
      const rows = (data ?? [])
        .filter((r: any) => r.external_id)
        .map((r: any): Item => ({
          id: r.id,
          videoId: r.external_id,
          title: r.title,
          thumbnail: r.thumbnail_url || ytThumb(r.external_id),
        }));
      const list = rows.length > 0 ? rows : fallback;
      setItems(list);
      setActive((curr) => curr || list[0]?.videoId || "");
    })();
    return () => {
      alive = false;
    };
  }, []);

  const v = items.find((x) => x.videoId === active) ?? items[0];
  const idx = items.findIndex((x) => x.videoId === v?.videoId);
  const next = items[(idx + 1) % Math.max(items.length, 1)];

  const goNext = () => {
    if (next) {
      setActive(next.videoId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // YouTube IFrame postMessage: listen for "ended" -> auto-advance
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (typeof e.data !== "string") return;
      try {
        const data = JSON.parse(e.data);
        if (data?.event === "onStateChange" && data?.info === 0 && autoplayNext) {
          goNext();
        }
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [autoplayNext, next?.videoId]);

  // Tell the embed to send state events to us
  useEffect(() => {
    const t = setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "listening", id: v?.videoId }),
        "*",
      );
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "addEventListener", args: ["onStateChange"] }),
        "*",
      );
    }, 600);
    return () => clearTimeout(t);
  }, [v?.videoId, muted]);

  if (!v) {
    return (
      <PageShell>
        <section className="container mx-auto px-4 py-24 text-center text-muted-foreground">
          Chargement de la bibliothèque Prime…
        </section>
      </PageShell>
    );
  }

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
            ref={iframeRef}
            key={`${v.videoId}-${muted}`}
            src={`https://www.youtube.com/embed/${v.videoId}?autoplay=1&rel=0&enablejsapi=1&mute=${muted ? 1 : 0}&origin=${typeof window !== "undefined" ? encodeURIComponent(window.location.origin) : ""}`}
            title={v.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setAutoplayNext((a) => !a)}
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold transition-colors",
              autoplayNext
                ? "bg-sky-500/15 border-sky-500/60 text-sky-300"
                : "bg-secondary border-border hover:border-sky-500/60",
            )}
          >
            <Play className="w-4 h-4 fill-current" /> Lecture auto {autoplayNext ? "ON" : "OFF"}
          </button>
          <div className="text-xs text-muted-foreground">
            {idx + 1} / {items.length} · AnimemomentsAnimeofficiel
          </div>
          <button
            onClick={goNext}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600"
          >
            Suivant <SkipForward className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 text-center">
          {v.series && (
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{v.series}</p>
          )}
          <h2 className="font-display text-2xl font-bold mt-1">{v.title}</h2>
          <div className="mt-3 flex justify-center">
            <AdminRemoveVideo
              rowId={v.id}
              source="youtube"
              externalId={v.videoId}
              onRemoved={() => {
                setItems((arr) => arr.filter((x) => x.id !== v.id));
                if (next) setActive(next.videoId);
              }}
              label="Retirer cette vidéo"
            />
          </div>
        </div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pb-16">
        <h3 className="font-display text-xl font-bold mb-4">
          Bibliothèque Prime <span className="text-muted-foreground font-normal">· {items.length} vidéos</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items
            .filter((x) => x.videoId !== v.videoId)
            .map((x) => (
              <button
                key={x.id}
                onClick={() => {
                  setActive(x.videoId);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="rgb-card group text-left rounded-2xl overflow-hidden bg-card border border-border transition-all"
              >
                <HoverPreview
                  videoId={x.videoId}
                  title={x.title}
                  thumbnail={x.thumbnail}
                  vertical={orientation === "vertical"}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                  <span className="absolute top-2 left-2 z-20">
                    <AdminRemoveVideo
                      rowId={x.id}
                      source="youtube"
                      externalId={x.videoId}
                      onRemoved={() => setItems((arr) => arr.filter((it) => it.id !== x.id))}
                    />
                  </span>
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