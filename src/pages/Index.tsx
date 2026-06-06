import { Link } from "react-router-dom";
import { Play, ShoppingBag, Youtube, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageShell } from "@/components/PageShell";
import { HeroCarousel } from "@/components/HeroCarousel";
import { VideoCard } from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { videos as rawVideos, products } from "@/data/videos";

const videos = [...rawVideos].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

const tags = ["Lovanet", "Manga animé", "YouTube", "TikTok", "Shop", "3D", "Live", "Selection"];
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
        {/* Animated gradient blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-3xl opacity-30 animate-blob"
            style={{ background: "radial-gradient(circle, hsl(var(--neon-magenta)), transparent 70%)" }} />
          <div className="absolute top-1/3 right-0 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-25 animate-blob animation-delay-2000"
            style={{ background: "radial-gradient(circle, hsl(var(--neon-purple)), transparent 70%)" }} />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000"
            style={{ background: "radial-gradient(circle, hsl(var(--neon-cyan)), transparent 70%)" }} />
        </div>
        {/* Floating sparkles */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="sparkle absolute w-1.5 h-1.5 rounded-full bg-white/70 shadow-[0_0_8px_hsl(var(--neon-magenta))]"
              style={{
                left: `${10 + i * 15}%`,
                bottom: '10%',
                animationDelay: `${i * 0.9}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <a
              href="https://www.youtube.com/channel/UC0T9pcWA9_lpdB6-ZucZYmw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-fuchsia-200 ring-1 ring-fuchsia-400/40 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
              @animemomentsAnimeofficiel · Lovanet manga animé
            </a>
            <h1
              className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.95] tracking-tight"
              style={{
                background:
                  "linear-gradient(135deg, #ffffff 0%, #f472b6 35%, #a855f7 65%, #06b6d4 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                letterSpacing: "-0.02em",
              }}
            >
              ANIME<br />MOMENTS
            </h1>
            <p className="text-base text-muted-foreground max-w-lg">
              Lovanet présente les mangas animés, vidéos anime, moments forts et contenus directs YouTube / TikTok.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="shimmer-btn rounded-full gap-2 text-white border-0 hover:scale-[1.03] transition-transform" style={{ background: "var(--gradient-magenta)" }}>
                <Link to="/lecteurs-video"><Play className="w-4 h-4 fill-current" /> Regarder maintenant</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full gap-2">
                <Link to="/shop"><ShoppingBag className="w-4 h-4" /> Boutique créateur</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((t) => (
                <span key={t} className="px-3 py-1 rounded-full bg-secondary/70 border border-border text-xs text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {reactions.map((r) => (
                <button
                  key={r.label}
                  className="px-4 py-2 rounded-full bg-secondary/70 border border-border text-xs font-semibold hover:border-primary/60 hover:bg-primary/10 transition-colors"
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {platforms.map((p, i) => {
            const tints = [
              "from-rose-500 to-red-600",
              "from-sky-500 to-blue-600",
              "from-pink-500 to-fuchsia-600",
              "from-purple-500 to-violet-600",
            ];
            return (
              <Link
                key={p.to}
                to={p.to}
                className="tilt-card group relative p-5 rounded-2xl bg-card border border-border transition-all duration-300"
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-white bg-gradient-to-br group-hover:scale-110 transition-transform shadow-lg", tints[i])}>
                  <p.icon className="w-5 h-5" />
                </div>
                <div className="font-display font-bold text-lg group-hover:gradient-text transition-colors">{p.title}</div>
                <p className="text-sm text-muted-foreground mt-1">{p.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Moments forts · 16 */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            Moments forts <span className="text-muted-foreground font-normal">· {Math.min(videos.length, 16)}</span>
          </h2>
          <Link to="/lecteurs-video" className="text-sm text-primary hover:underline whitespace-nowrap">Lecteur immersif →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {videos.slice(0, 16).map((v) => (
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
              className="tilt-card group rounded-2xl overflow-hidden bg-card border border-border transition-all"
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