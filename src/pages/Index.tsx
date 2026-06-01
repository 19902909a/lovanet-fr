import { Link } from "react-router-dom";
import { Play, ShoppingBag, Youtube, Music2, Cube, Sparkles } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { HeroCarousel } from "@/components/HeroCarousel";
import { VideoCard } from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { videos } from "@/data/videos";
import { products } from "@/data/videos";

const tags = ["Lovanet", "Manga animé", "YouTube", "TikTok", "Shop", "3D", "Live Selection"];
const reactions = [
  { emoji: "🔥", label: "Hot" },
  { emoji: "😂", label: "Fun" },
  { emoji: "😍", label: "Love" },
  { emoji: "⚡", label: "Hype" },
  { emoji: "👀", label: "Watch" },
];

const platforms = [
  { to: "/chaine-youtube", title: "YouTube", desc: "Vidéos anime et shorts officiels", icon: Youtube },
  { to: "/prime-video", title: "Prime Vidéo", desc: "Lecture multi-plateforme immersive", icon: Play },
  { to: "/tiktok", title: "TikTok", desc: "Posts courts et réactions rapides", icon: Music2 },
  { to: "/shop", title: "Shop", desc: "Drops manga liés aux contenus", icon: ShoppingBag },
];

const Index = () => {
  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, hsl(var(--primary)/0.25), transparent 40%), radial-gradient(circle at 80% 60%, hsl(var(--neon-purple)/0.2), transparent 40%)",
          }}
        />

        <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">
              @animemomentsAnimeofficiel · Lovanet manga animé
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.95]">
              ANIME<br />
              <span className="text-glow-cyan text-primary">MOMENTS</span>
            </h1>
            <p className="text-base text-muted-foreground max-w-lg">
              Lovanet présente les mangas animés, vidéos anime, moments forts et contenus directs YouTube / TikTok.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full gap-2 bg-primary hover:bg-primary/90">
                <Link to="/lecteurs-video"><Play className="w-4 h-4 fill-current" /> Regarder maintenant</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full gap-2">
                <Link to="/shop"><ShoppingBag className="w-4 h-4" /> Boutique créateur</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((t) => (
                <span key={t} className="px-3 py-1 rounded-full bg-pill/60 border border-border text-xs tracking-wider uppercase text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {reactions.map((r) => (
                <button
                  key={r.label}
                  className="px-4 py-2 rounded-full bg-pill/60 border border-border text-xs font-semibold uppercase tracking-wider hover:border-primary/60 hover:bg-primary/10 transition-colors"
                >
                  {r.emoji} {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <HeroCarousel />
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-2">Direct selection</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">À regarder sur Lovanet</h2>
          </div>
          <Link to="/lecteurs-video" className="text-sm text-primary hover:underline whitespace-nowrap">Tout voir →</Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {platforms.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className="group p-5 rounded-2xl bg-card border border-border hover:border-primary/60 hover:bg-card/80 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <p.icon className="w-5 h-5" />
              </div>
              <div className="font-display font-bold text-lg group-hover:text-primary transition-colors">{p.title}</div>
              <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
            </Link>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {videos.slice(0, 8).map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </section>

      {/* Shop preview */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-2">Shop creator</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Produits YouTube & TikTok à venir</h2>
          </div>
          <Link to="/shop" className="text-sm text-primary hover:underline whitespace-nowrap">Boutique →</Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.slice(0, 3).map((p) => (
            <Link
              key={p.id}
              to="/shop"
              className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/60 transition-all"
            >
              <div className="aspect-[4/3] flex items-center justify-center text-7xl bg-gradient-to-br from-primary/15 via-card to-card group-hover:scale-105 transition-transform duration-500">
                {p.emoji}
              </div>
              <div className="p-5">
                <div className="font-display font-bold group-hover:text-primary transition-colors">{p.name}</div>
                <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary">{p.tag}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
};

export default Index;