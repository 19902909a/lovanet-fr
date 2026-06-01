import { PageShell } from "@/components/PageShell";
import { VideoCard } from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { videos } from "@/data/videos";
import { Youtube, ExternalLink } from "lucide-react";

const ChaineYoutube = () => (
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
      {videos.map((v) => <VideoCard key={v.id} video={v} />)}
    </section>
  </PageShell>
);

export default ChaineYoutube;