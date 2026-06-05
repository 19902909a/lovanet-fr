import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { videos as fallbackVideos, thumb as ytThumb } from "@/data/videos";
import { Youtube, ExternalLink, Play, Calendar, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

const isNew = (d?: string | null) => {
  if (!d) return false;
  return Date.now() - new Date(d).getTime() < 7 * 24 * 60 * 60 * 1000;
};

const fmt = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "";

const ChaineYoutube = () => {
  const [items, setItems] = useState<ImportedVideo[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("imported_videos")
        .select("id, source, external_id, title, thumbnail_url, video_url, published_at, episode")
        .eq("source", "youtube")
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false })
        .limit(200);
      if (!active) return;
      setItems((data as ImportedVideo[] | null) ?? []);
      setLoaded(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  const fallback: ImportedVideo[] = [...fallbackVideos]
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
    .map((v) => ({
      id: v.id,
      source: "youtube",
      external_id: v.id,
      title: v.title,
      thumbnail_url: ytThumb(v.id),
      video_url: `/lecteurs-video?video=${v.id}`,
      published_at: v.date ?? null,
      episode: v.episode ?? null,
    }));

  const list = loaded && items.length > 0 ? items : fallback;

  return (
    <PageShell>
    <section className="container mx-auto px-4 lg:px-8 py-16">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
          <Youtube className="w-6 h-6" />
        </div>
        <p className="text-xs uppercase tracking-[0.25em] text-primary">Chaîne officielle</p>
      </div>
      <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-3">YouTube · AnimeMoments</h1>
      <p className="text-muted-foreground max-w-2xl mb-6">
        Vidéos anime, shorts officiels et moments forts diffusés directement depuis la chaîne Lovanet.
      </p>
      <Button asChild className="rounded-full gap-2 bg-primary hover:bg-primary/90">
        <a href="https://www.youtube.com" target="_blank" rel="noreferrer">
          Ouvrir YouTube <ExternalLink className="w-4 h-4" />
        </a>
      </Button>
    </section>

      <section className="container mx-auto px-4 lg:px-8 pb-16 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {list.map((v) => {
          const cover = v.thumbnail_url || (v.external_id ? ytThumb(v.external_id) : "");
          const fresh = isNew(v.published_at);
          const to = v.external_id ? `/lecteurs-video?video=${v.external_id}` : v.video_url;
          return (
            <Link
              key={v.id}
              to={to}
              className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/60 transition-all hover:-translate-y-1"
            >
              <div className="relative aspect-video overflow-hidden">
                <img src={cover} alt={v.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                {fresh && (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold uppercase tracking-wider animate-pulse">
                    <Sparkles className="w-3 h-3" /> Nouveau
                  </span>
                )}
                {v.episode && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-background/80 backdrop-blur text-foreground text-[11px] font-semibold">
                    {v.episode}
                  </span>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
                    <Play className="w-6 h-6 text-primary-foreground fill-current" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 title={v.title} className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors min-h-[2.5rem]">
                  {v.title}
                </h3>
                {v.published_at && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" /> {fmt(v.published_at)}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </section>
    </PageShell>
  );
};

export default ChaineYoutube;