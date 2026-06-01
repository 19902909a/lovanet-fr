import { useSearchParams } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { videos } from "@/data/videos";
import { VideoCard } from "@/components/VideoCard";
import { useState, useEffect } from "react";

const LecteursVideo = () => {
  const [params, setParams] = useSearchParams();
  const initial = params.get("video") || videos[2].id;
  const [active, setActive] = useState(initial);

  useEffect(() => {
    const v = params.get("video");
    if (v && v !== active) setActive(v);
  }, [params]);

  const activeVideo = videos.find((v) => v.id === active) || videos[0];

  return (
    <PageShell>
      <section className="container mx-auto px-4 lg:px-8 py-12">
        <p className="text-xs uppercase tracking-[0.25em] text-primary mb-2">Lecteurs vidéo</p>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-6">Lecture immersive</h1>

        <div className="rounded-2xl overflow-hidden bg-card border border-border shadow-[0_30px_80px_-30px_hsl(var(--primary)/0.4)]">
          <div className="aspect-video bg-black">
            <iframe
              key={activeVideo.id}
              src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
              title={activeVideo.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-5">
            <p className="text-xs uppercase tracking-wider text-primary">{activeVideo.channel}</p>
            <h2 className="font-display font-bold text-xl mt-1">{activeVideo.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{activeVideo.series}</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pb-16">
        <h3 className="font-display text-xl font-bold mb-4">Sélection en rotation</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {videos
            .filter((v) => v.id !== activeVideo.id)
            .map((v) => (
              <button
                key={v.id}
                onClick={() => {
                  setActive(v.id);
                  setParams({ video: v.id });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-left"
              >
                <VideoCard video={v} />
              </button>
            ))}
        </div>
      </section>
    </PageShell>
  );
};

export default LecteursVideo;