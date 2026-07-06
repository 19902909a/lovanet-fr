import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Play, ShoppingBag, Youtube, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageShell } from "@/components/PageShell";
import { HeroCarousel } from "@/components/HeroCarousel";
import MiniCatalogOrb from "@/components/MiniCatalogOrb";
import AnimeMomentsOrb from "@/components/AnimeMomentsOrb";
import NeonFooterBar from "@/components/NeonFooterBar";
import { Button } from "@/components/ui/button";
import { SHOP_PRODUCTS, categoryLabel } from "@/data/shopProducts";
import { ProductArtwork } from "@/components/ProductArtwork";
import { MiniPreviewPlayer } from "@/components/MiniPreviewPlayer";
import { HologramOverlay } from "@/components/HologramOverlay";
import { supabase } from "@/integrations/supabase/client";

const SHOP_REEL_MP4 =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";

/** Fisher–Yates shuffle (non-mutating) so trailers play in a non-repeating order. */
const shuffle = <T,>(arr: T[]): T[] => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Live video/poster preview shown inside the two anime home cards. */
const AnimePreview = ({
  trailerIds,
  posters,
  accent,
}: {
  trailerIds: string[];
  posters: string[];
  accent: "magenta" | "cyan";
}) => {
  const [idx, setIdx] = useState(0);
  // Maintain a shuffled queue + cursor so we never repeat the same video back-to-back
  const [queue, setQueue] = useState<string[]>(() => shuffle(trailerIds));
  const [tIdx, setTIdx] = useState(0);
  useEffect(() => {
    setQueue(shuffle(trailerIds));
    setTIdx(0);
  }, [trailerIds.join("|")]);
  useEffect(() => {
    if (trailerIds.length > 0 || posters.length === 0) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % posters.length), 1800);
    return () => clearInterval(id);
  }, [trailerIds.length, posters.length]);
  // Rotate through the shuffled queue; when we reach the end, reshuffle (avoid same head).
  useEffect(() => {
    if (queue.length < 2) return;
    const id = setInterval(() => {
      setTIdx((i) => {
        const next = i + 1;
        if (next >= queue.length) {
          let reshuffled = shuffle(queue);
          if (reshuffled[0] === queue[queue.length - 1] && reshuffled.length > 1) {
            [reshuffled[0], reshuffled[1]] = [reshuffled[1], reshuffled[0]];
          }
          setQueue(reshuffled);
          return 0;
        }
        return next;
      });
    }, 14000);
    return () => clearInterval(id);
  }, [queue]);
  const trailerId = queue[tIdx];
  const glow =
    accent === "magenta"
      ? "shadow-[0_0_30px_-5px_hsl(var(--neon-magenta)/0.7)]"
      : "shadow-[0_0_30px_-5px_hsl(var(--neon-cyan)/0.7)]";
  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-xl ring-1 ring-white/10 bg-black ${glow} pointer-events-none`}
      aria-hidden
    >
      {trailerId ? (
        <iframe
          key={trailerId}
          className="absolute inset-0 w-full h-full pointer-events-none"
          src={`https://www.youtube-nocookie.com/embed/${trailerId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerId}&modestbranding=1&playsinline=1&rel=0`}
          title="Aperçu animé"
          loading="lazy"
          tabIndex={-1}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : posters.length > 0 ? (
        <img
          src={posters[idx]}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        />
      ) : (
        <div className="absolute inset-0 animate-pulse bg-white/5" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <span className="absolute top-2 left-2 text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-black/60 text-white/90 backdrop-blur">
        Live preview
      </span>
    </div>
  );
};

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
  const [animeTrailers, setAnimeTrailers] = useState<{ countdown: string[]; catalog: string[] }>({
    countdown: [],
    catalog: [],
  });
  const [animePosters, setAnimePosters] = useState<{ countdown: string[]; catalog: string[] }>({
    countdown: [],
    catalog: [],
  });

  useEffect(() => {
    let cancelled = false;
    // Hydrate cached YT ids first so the UI keeps working if Supabase is unreachable.
    try {
      const cached = localStorage.getItem("lovanet.cache.ytIds");
      if (cached) setYtIds(JSON.parse(cached));
    } catch {}
    (async () => {
      const { data } = await supabase
        .from("imported_videos")
        .select("external_id, title, published_at")
        .eq("source", "youtube")
        .not("title", "ilike", "%ruri%")
        .order("published_at", { ascending: false })
        .limit(24);
      if (cancelled || !data) return;
      const ids = data.map((r: any) => r.external_id).filter(Boolean);
      setYtIds(ids);
      try { localStorage.setItem("lovanet.cache.ytIds", JSON.stringify(ids)); } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  // Fetch AniList trailers + posters to feed live video preview on the two anime cards
  useEffect(() => {
    let cancelled = false;
    // Hydrate from local backup so cards stay populated even if AniList is down/removes content.
    try {
      const t = localStorage.getItem("lovanet.cache.animeTrailers");
      const p = localStorage.getItem("lovanet.cache.animePosters");
      if (t) setAnimeTrailers(JSON.parse(t));
      if (p) setAnimePosters(JSON.parse(p));
    } catch {}
    (async () => {
      try {
        const q = `query {
          trending: Page(page: 1, perPage: 50) {
            media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
              coverImage { large }
              trailer { id site }
            }
          }
          upcoming: Page(page: 1, perPage: 50) {
            media(type: ANIME, status: RELEASING, sort: POPULARITY_DESC, isAdult: false) {
              coverImage { large }
              trailer { id site }
            }
          }
        }`;
        const res = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q }),
        });
        const j = await res.json();
        if (cancelled) return;
        const trending = j?.data?.trending?.media ?? [];
        const upcoming = j?.data?.upcoming?.media ?? [];
        const pickTrailers = (arr: any[]) =>
          Array.from(
            new Set(
              arr
                .filter((m) => m?.trailer?.site === "youtube" && m?.trailer?.id)
                .map((m) => m.trailer.id as string),
            ),
          ).slice(0, 30);
        const nextTrailers = {
          catalog: pickTrailers(trending),
          countdown: pickTrailers(upcoming),
        };
        const nextPosters = {
          catalog: trending.map((m: any) => m?.coverImage?.large).filter(Boolean).slice(0, 30),
          countdown: upcoming.map((m: any) => m?.coverImage?.large).filter(Boolean).slice(0, 30),
        };
        setAnimeTrailers(nextTrailers);
        setAnimePosters(nextPosters);
        try {
          localStorage.setItem("lovanet.cache.animeTrailers", JSON.stringify(nextTrailers));
          localStorage.setItem("lovanet.cache.animePosters", JSON.stringify(nextPosters));
        } catch {}
      } catch (e) {
        console.error("AniList trailer fetch", e);
      }
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

        {/* Full-width carousel bar — spans edge to edge with integrated title & orb overlay */}
        <div className="relative w-full pt-6 lg:pt-8">
          <div className="relative w-full">
            <HeroCarousel />
            {/* Cadre verre 3D — contour uniquement */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                border: "1px solid hsl(0 0% 100% / 0.28)",
                boxShadow:
                  "inset 0 1px 0 hsl(0 0% 100% / 0.45), inset 0 -1px 0 hsl(0 0% 0% / 0.45), 0 18px 50px -20px hsl(var(--neon-magenta) / 0.45)",
              }}
            />
            {/* Liseré brillant supérieur */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, hsl(0 0% 100% / 0.75) 50%, transparent 100%)",
                mixBlendMode: "screen",
              }}
            />

            {/* Overlay title + orb, anchored to the left side of the carousel */}
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
              <div className="pointer-events-auto max-w-[42%] sm:max-w-[38%] lg:max-w-[32%] pl-4 sm:pl-6 lg:pl-10 space-y-3">
                <a
                  href="https://www.youtube.com/channel/UC0T9pcWA9_lpdB6-ZucZYmw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium text-fuchsia-200 ring-1 ring-fuchsia-400/40 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 transition-colors"
                >
                  <span className="w-1 h-1 rounded-full bg-fuchsia-400 animate-pulse" />
                  AnimemomentsAnimeofficiel
                </a>
                <h1
                  className="neon-rgb-text-mini font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black leading-[0.9] tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  ANIME<br />MOMENTS
                </h1>
                <div className="relative">
                  <MiniCatalogOrb size={140} cardW={26} cardH={38} />
                </div>
              </div>
            </div>
          </div>
          {/* Barre RGB fluo sous le carrousel */}
          <div className="container mx-auto px-4 lg:px-8 mt-3">
            <NeonFooterBar inline height={22} className="rounded-full overflow-hidden" />
          </div>
        </div>

        {/* CTA + tags + reactions below */}
        <div className="container mx-auto px-4 lg:px-8 py-10 lg:py-14 space-y-5">
          <p className="text-base text-muted-foreground max-w-2xl">
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
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className="px-3 py-1 rounded-full bg-secondary/70 border border-border text-xs text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
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
      </section>

      {/* Anime Moments — quick access to countdown & catalog */}
      <section className="container mx-auto px-4 lg:px-8 pt-4 pb-2">
        <AnimeMomentsOrb />
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            to="/anime-countdown"
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_hsl(var(--neon-magenta)/0.6)] touch-manipulation"
            aria-label="Ouvrir le countdown des animés à venir"
          >
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background:
                  "radial-gradient(60% 60% at 30% 30%, hsl(var(--neon-magenta) / 0.4), transparent 70%)",
              }}
            />
            <AnimePreview
              trailerIds={animeTrailers.countdown}
              posters={animePosters.countdown}
              accent="magenta"
            />
            <h3 className="relative font-display text-2xl font-bold mb-2 mt-4">Animés à venir</h3>
            <span className="relative inline-flex mt-4 text-sm font-semibold text-primary">
              Ouvrir →
            </span>
            {/* Mobile/tablet tap capture — sits above iframes & overlays so the whole card is clickable */}
            <span aria-hidden className="absolute inset-0 z-20" />
          </Link>
          <Link
            to="/anime-catalog"
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_hsl(var(--neon-cyan)/0.6)] touch-manipulation"
            aria-label="Explorer le catalogue d'animés"
          >
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background:
                  "radial-gradient(60% 60% at 70% 40%, hsl(var(--neon-cyan) / 0.4), transparent 70%)",
              }}
            />
            <AnimePreview
              trailerIds={animeTrailers.catalog}
              posters={animePosters.catalog}
              accent="cyan"
            />
            <h3 className="relative font-display text-2xl font-bold mb-2 mt-4">Catalogue Animés</h3>
            <span className="relative inline-flex mt-4 text-sm font-semibold text-primary">
              Explorer le catalogue →
            </span>
            {/* Mobile/tablet tap capture — sits above iframes & overlays so the whole card is clickable */}
            <span aria-hidden className="absolute inset-0 z-20" />
          </Link>
        </div>
      </section>

      {/* Platforms */}
      <section className="container mx-auto px-4 lg:px-8 py-16">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-2">Direct selection</p>
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