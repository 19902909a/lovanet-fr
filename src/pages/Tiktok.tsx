import { PageShell } from "@/components/PageShell";
import { thumb, videos } from "@/data/videos";
import { Music2 } from "lucide-react";
import { Link } from "react-router-dom";

const Tiktok = () => (
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
        {videos.map((v) => (
          <Link
            key={v.id}
            to={`/lecteurs-video?video=${v.id}`}
            className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/60"
          >
            <img src={thumb(v.id)} alt={v.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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

export default Tiktok;