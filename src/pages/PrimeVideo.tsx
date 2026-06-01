import { PageShell } from "@/components/PageShell";
import { VideoCard } from "@/components/VideoCard";
import { videos } from "@/data/videos";
import { Play } from "lucide-react";

const PrimeVideo = () => (
  <PageShell>
    <section className="container mx-auto px-4 lg:px-8 py-16">
      <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mb-4">
        <Play className="w-6 h-6 fill-current" />
      </div>
      <p className="text-xs uppercase tracking-[0.25em] text-primary mb-2">Streaming partenaire</p>
      <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-3">Prime Vidéo</h1>
      <p className="text-muted-foreground max-w-2xl">
        Lecture multi-plateforme immersive — retrouvez les séries anime mises en avant par Lovanet.
      </p>
    </section>
    <section className="container mx-auto px-4 lg:px-8 pb-16 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {videos.slice(0, 8).map((v) => <VideoCard key={v.id} video={v} />)}
    </section>
  </PageShell>
);

export default PrimeVideo;