import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { thumb as ytThumb, videos as fallbackVideos } from "@/data/videos";
import { Music2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type ImportedVideo = {
  id: string;
  source: "youtube" | "tiktok" | "prime";
  external_id: string | null;
  title: string;
  thumbnail_url: string | null;
  video_url: string;
  published_at: string | null;
};

const isNew = (d?: string | null) => {
  if (!d) return false;
  return Date.now() - new Date(d).getTime() < 7 * 24 * 60 * 60 * 1000;
};

const Tiktok = () => {
  const [items, setItems] = useState<ImportedVideo[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("imported_videos")
        .select("id, source, external_id, title, thumbnail_url, video_url, published_at")
        .eq("source", "tiktok")
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

  const fallback = [...fallbackVideos]
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  return (
    <PageShell>
    <section className="container mx-auto px-4 lg:px-8 py-16">
      <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mb-4">
        <Music2 className="w-6 h-6" />
      </div>
      <p className="text-xs uppercase tracking-[0.25em] text-primary mb-2">@animemomentsAnimeofficiel</p>
      <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-3">TikTok</h1>
      <p className="text-muted-foreground max-w-2xl">Posts courts, réactions rapides et moments anime viraux.</p>
    </section>

    <section className="container mx-auto px-4 lg:px-8 pb-16">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {loaded && items.length > 0
          ? items.map((v) => {
              const cover = v.thumbnail_url || "";
              const fresh = isNew(v.published_at);
              return (
                <a
                  key={v.id}
                  href={v.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/60"
                >
                  {cover && (
                    <img src={cover} alt={v.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
                  {fresh && (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[9px] font-bold uppercase animate-pulse">
                      <Sparkles className="w-2.5 h-2.5" /> Nouveau
                    </span>
                  )}
                  <div title={v.title} className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold leading-snug line-clamp-3">
                    {v.title}
                  </div>
                </a>
              );
            })
          : fallback.map((v) => (
              <Link
                key={v.id}
                to={`/lecteurs-video?video=${v.id}`}
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/60"
              >
                <img src={ytThumb(v.id)} alt={v.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
                <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold leading-snug line-clamp-3">
                  {v.title}
                </div>
              </Link>
            ))}
      </div>
    </section>
    </PageShell>
  );
};

export default Tiktok;