import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Play, ShoppingBag, Youtube, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageShell } from "@/components/PageShell";
import { HeroCarousel } from "@/components/HeroCarousel";
import { Button } from "@/components/ui/button";
import { SHOP_PRODUCTS, categoryLabel } from "@/data/shopProducts";
import { ProductArtwork } from "@/components/ProductArtwork";
import { MiniPreviewPlayer } from "@/components/MiniPreviewPlayer";
import { HologramOverlay } from "@/components/HologramOverlay";
import { supabase } from "@/integrations/supabase/client";

const SHOP_REEL_MP4 =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";

const tags = ["Lovanet", "Manga animé", "YouTube", "TikTok", "Shop", "3D", "Live", "Selection"];
const reactions = [
  { emoji: "🔥", label: "Hot" },
  { emoji: "😂", label: "Fun" },
  { emoji: "😍", label: "Love" },
  { emoji: "⚡", label: "Hype" },
  { emoji: "👀", label: "Watch" },
];

const Index = () => {
  const [ytIds, setYtIds] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("imported_videos")
        .select("external_id, title, published_at")
        .eq("source", "youtube")
        .not("title", "ilike", "%ruri%")
        .order("published_at", { ascending: false })
        .limit(24);
      if (cancelled || !data) return;
      setYtIds(data.map((r: any) => r.external_id).filter(Boolean));
    })();
    return () => { cancelled = true; };
  }, []);

  const ytForYoutube = ytIds.slice(0, 6);
  const ytForPrime = ytIds.slice(6, 12).length ? ytIds.slice(6, 12) : ytIds.slice(0, 6);

  const platforms = [
    { to: "/chaine-youtube", title: "YouTube", desc: "Vidéos anime et shorts officiels", icon: Youtube,
      preview: { kind: "youtube" as const, sources: ytForYoutube } },
    { to: "/prime-video", title: "Prime Vidéo", desc: "Lecture multi-plateforme immersive", icon: Play,
      preview: { kind: "youtube" as const, sources: ytForPrime } },
    { to: "/tiktok", title: "TikTok", desc: "Posts courts et réactions rapides", icon: Music2,
      preview: { kind: "tiktok" as const, sources: [], loadTiktokFromDB: true } },
    { to: "/shop", title: "Shop", desc: "Drops manga liés aux contenus", icon: ShoppingBag,
      preview: { kind: "mp4" as const, sources: [SHOP_REEL_MP4] } },
  ];

  return (
    <PageShell>
      {/* Holograms drifting across the homepage from time to time */}
      <HologramOverlay />
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
              AnimemomentsAnimeofficiel
            </a>
            <h1
              className="neon-rainbow-text font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.95] tracking-tight"
              style={{ letterSpacing: "-0.02em" }}
            >
              ANIME<br />MOMENTS
            </h1>
            <p className="text-base text-muted-foreground max-w-lg">
              Lovanet présente les mangas animés, vidéos anime, moments forts et contenus directs YouTube / TikTok.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="btn-magnetic btn-neon-rainbow rounded-full gap-2 text-white border-0"
              >
                <Link to="/lecteurs-video"><Play className="w-4 h-4 fill-current" /> Regarder maintenant</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="btn-magnetic btn-neon-rainbow-outline rounded-full gap-2">
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

      {/* Anime Moments — quick access to countdown & catalog */}
      <section className="container mx-auto px-4 lg:px-8 pt-4 pb-2">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-2">Anime moments</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Suivez la vague animée</h2>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            to="/anime-countdown"
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_hsl(var(--neon-magenta)/0.6)]"
          >
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background:
                  "radial-gradient(60% 60% at 30% 30%, hsl(var(--neon-magenta) / 0.4), transparent 70%)",
              }}
            />
            <p className="relative text-xs uppercase tracking-widest text-primary mb-2">Auto-sync AniList</p>
            <h3 className="relative font-display text-2xl font-bold mb-2">Animés à venir</h3>
            <p className="relative text-sm text-muted-foreground">
              Compte à rebours live des prochains épisodes, mis à jour automatiquement.
            </p>
            <span className="relative inline-flex mt-4 text-sm font-semibold text-primary">
              Ouvrir le countdown →
            </span>
          </Link>
          <Link
            to="/anime-catalog"
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_hsl(var(--neon-cyan)/0.6)]"
          >
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background:
                  "radial-gradient(60% 60% at 70% 40%, hsl(var(--neon-cyan) / 0.4), transparent 70%)",
              }}
            />
            <p className="relative text-xs uppercase tracking-widest text-primary mb-2">Carrousel 3D</p>
            <h3 className="relative font-display text-2xl font-bold mb-2">Catalogue Animés</h3>
            <p className="relative text-sm text-muted-foreground">
              Tendances actuelles avec carrousel rotatif 3D et fiches détaillées.
            </p>
            <span className="relative inline-flex mt-4 text-sm font-semibold text-primary">
              Explorer le catalogue →
            </span>
          </Link>
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 perspective-[1200px]">
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
                className={cn(
                  "tilt-card btn-magnetic group relative block p-5 rounded-2xl bg-card border border-border transition-all duration-300 cursor-pointer active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                  i === 0 && "neon-edge",
                  i === 1 && "depth-card",
                  i === 2 && "holo-card",
                  i === 3 && "neon-edge",
                )}
              >
                {/* Mini auto-playing preview */}
                <div className="rgb-frame relative mb-4 aspect-video w-full overflow-hidden rounded-xl bg-black ring-1 ring-white/10">
                  <MiniPreviewPlayer
                    kind={p.preview.kind}
                    sources={p.preview.sources}
                    loadTiktokFromDB={p.title === "TikTok"}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute top-2 left-2 text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-black/60 text-white/90 backdrop-blur">
                    Live preview
                  </span>
                </div>
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-3 text-white bg-gradient-to-br shadow-[0_10px_24px_-8px_hsl(var(--neon-magenta)/0.55)] transition-all duration-500 group-hover:scale-125 group-hover:-translate-y-1 group-hover:rotate-[-8deg] group-hover:shadow-[0_18px_40px_-10px_hsl(var(--neon-cyan)/0.7)]",
                    tints[i]
                  )}
                  style={{ transform: "translateZ(40px)" }}
                >
                  <p.icon className="w-6 h-6 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]" />
                </div>
                <div className="font-display font-bold text-lg transition-all duration-300 group-hover:gradient-text group-hover:tracking-wide group-hover:drop-shadow-[0_0_12px_hsl(var(--neon-magenta)/0.7)]">
                  {p.title}
                </div>
                <p className="text-sm text-muted-foreground mt-1 group-hover:text-foreground/90 transition-colors">{p.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                  Ouvrir <span aria-hidden>→</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Shop preview */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-2">Shop creator</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              {SHOP_PRODUCTS.length} produits uniques YouTube & TikTok
            </h2>
          </div>
          <Link to="/shop" className="text-sm text-primary hover:underline whitespace-nowrap">Boutique →</Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {SHOP_PRODUCTS.slice(0, 8).map((p) => (
            <Link
              key={p.id}
              to="/shop"
              className="rgb-card group rounded-2xl overflow-hidden bg-card border border-border transition-all"
            >
              <div className="rgb-frame aspect-square overflow-hidden">
                <div className="rgb-art w-full h-full group-hover:scale-110 transition-transform duration-700">
                  <ProductArtwork seed={p.id} category={p.category} label={p.name} />
                </div>
              </div>
              <div className="p-4">
                <span className="inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary mb-2 relative z-10">
                  {categoryLabel(p.category)}
                </span>
                <div className="font-display font-bold text-sm leading-snug group-hover:text-primary transition-colors">
                  {p.name}
                </div>
                <div className="rgb-price text-xs font-bold mt-1">{p.price} €</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
};

export default Index;