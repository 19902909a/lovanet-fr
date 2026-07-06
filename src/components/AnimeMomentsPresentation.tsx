import { Link } from "react-router-dom";
import {
  Play,
  ShoppingBag,
  Search,
  Bell,
  Share2,
  Flame,
  Youtube,
  Music2,
  Sparkles,
  Calendar,
  Copy,
  MessageCircle,
  Twitter,
  Facebook,
  ArrowRight,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useState } from "react";
import MiniCatalogOrb from "@/components/MiniCatalogOrb";
import heroBg from "@/assets/anime-moments-hero.jpg";
import { videos } from "@/data/videos";

const tags = [
  "Lovanet",
  "Manga animé",
  "YouTube",
  "TikTok",
  "Shop",
  "3D",
  "Live",
  "Selection",
];

const reactions = [
  { emoji: "🔥", label: "Hot", color: "bg-orange-500" },
  { emoji: "😂", label: "Fun", color: "bg-yellow-400" },
  { emoji: "😍", label: "Love", color: "bg-pink-500" },
  { emoji: "⚡", label: "Hype", color: "bg-fuchsia-500" },
  { emoji: "👀", label: "Watch", color: "bg-cyan-400" },
];

const services = [
  {
    to: "/anime-catalog",
    icon: Search,
    title: "Explorer le catalogue",
    desc: "1500+ animés à découvrir",
    accent: "from-fuchsia-500 to-pink-500",
    cta: "Ouvrir",
  },
  {
    to: "/anime-countdown",
    icon: Calendar,
    title: "Countdown sorties",
    desc: "Prochains épisodes & saisons",
    accent: "from-cyan-400 to-sky-500",
    cta: "Voir le planning",
  },
  {
    to: "/chaine-youtube",
    icon: Flame,
    title: "Tendances YouTube",
    desc: "Moments forts du moment",
    accent: "from-red-500 to-rose-500",
    cta: "Regarder",
  },
  {
    to: "/shop",
    icon: ShoppingBag,
    title: "Shop créateur",
    desc: "Drops manga exclusifs",
    accent: "from-violet-500 to-fuchsia-600",
    cta: "Boutique",
  },
];

export const AnimeMomentsPresentation = () => {
  const [copied, setCopied] = useState(false);
  const [muted, setMuted] = useState(true);
  const bannerId = videos[0]?.id ?? "bGFUthZjGd4";

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "https://lovanet.fr";
  const shareText = "Lovanet — Anime Moments, catalogue & shop";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <section className="container mx-auto px-4 lg:px-8 py-10 lg:py-14">
      <div className="relative w-full rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-950/80 shadow-[0_0_80px_-20px_hsl(var(--neon-magenta)/0.35)]">
        {/* PRO VIDEO BANNER */}
        <div className="relative w-full aspect-[21/9] sm:aspect-[21/8] overflow-hidden border-b border-white/10">
          <iframe
            key={`${bannerId}-${muted ? "m" : "s"}`}
            className="absolute inset-0 w-full h-full scale-[1.35] pointer-events-none"
            src={`https://www.youtube-nocookie.com/embed/${bannerId}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&loop=1&playlist=${bannerId}&modestbranding=1&playsinline=1&rel=0&showinfo=0`}
            title="Anime Moments — bande-annonce"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-zinc-950/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-transparent to-zinc-950/40" />

          {/* Banner overlays */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600 text-white text-[10px] font-black tracking-widest uppercase shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-70 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              LIVE · Anime Moments
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur border border-white/10 text-white/90 text-[10px] font-bold tracking-widest uppercase">
              Officiel Lovanet
            </span>
          </div>

          <button
            onClick={() => setMuted((m) => !m)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur border border-white/15 flex items-center justify-center text-white transition-colors z-10"
            aria-label={muted ? "Activer le son" : "Couper le son"}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-wrap items-end justify-between gap-3">
            <div className="max-w-2xl">
              <div className="text-[10px] uppercase tracking-[0.3em] text-fuchsia-300 font-bold mb-1">
                Épisode à la une
              </div>
              <h2 className="text-white font-display font-black text-xl sm:text-3xl lg:text-4xl leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                {videos[0]?.title ?? "Anime Moments"} <span className="text-fuchsia-300">— {videos[0]?.series}</span>
              </h2>
            </div>
            <Link
              to="/lecteurs-video"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-bold text-sm hover:bg-fuchsia-300 transition-colors shadow-xl"
            >
              <Play className="w-4 h-4 fill-current" /> Voir l'épisode
            </Link>
          </div>
        </div>

        {/* Cinematic banner background */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt=""
            width={1920}
            height={960}
            className="w-full h-full object-cover opacity-45"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 grid grid-cols-12 gap-6 p-6 sm:p-10 lg:p-14">
          {/* Left: headline + CTAs + tags */}
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-400/30 text-fuchsia-200 text-[10px] font-bold tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500" />
              </span>
              AnimemomentsAnimeofficiel
            </div>

            <h1
              className="neon-rgb-text-mini font-display text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-black leading-[0.9] tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]"
              style={{ letterSpacing: "-0.02em" }}
            >
              ANIME<br />MOMENTS
            </h1>

            <p className="mt-6 max-w-xl text-base lg:text-lg text-zinc-300/90 leading-relaxed">
            </p>

            {/* Primary CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
              <Link
                to="/lecteurs-video"
                className="group relative px-7 py-4 rounded-full text-white font-black text-base inline-flex items-center justify-center gap-3 bg-gradient-to-r from-fuchsia-600 via-pink-500 to-rose-500 shadow-[0_15px_40px_-10px_rgba(236,72,153,0.7)] hover:shadow-[0_20px_50px_-8px_rgba(236,72,153,0.9)] hover:scale-[1.04] active:scale-[0.97] transition-all duration-300"
                aria-label="Regarder les épisodes maintenant"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Regarder maintenant</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/shop"
                className="group px-6 py-4 rounded-full font-bold text-sm inline-flex items-center justify-center gap-2 bg-white text-zinc-900 hover:bg-fuchsia-100 shadow-lg hover:scale-[1.03] transition-all"
                aria-label="Ouvrir la boutique créateur"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Boutique créateur</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/anime-catalog"
                className="group px-6 py-4 rounded-full font-bold text-sm inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/15 text-white border border-white/25 backdrop-blur-md transition-all hover:scale-[1.03]"
                aria-label="Explorer le catalogue d'animés"
              >
                <Sparkles className="w-4 h-4" />
                <span>Catalogue 1500+</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800/60 border border-white/10 text-zinc-300 text-xs hover:text-white hover:border-fuchsia-400/60 transition-colors"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right: orb + quick services */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-5 justify-center">
            <div className="relative mx-auto lg:mx-0 w-full max-w-sm aspect-square flex items-center justify-center">
              <div className="absolute inset-0 bg-fuchsia-500/10 blur-[100px] rounded-full pointer-events-none" />
              <MiniCatalogOrb size={260} cardW={44} cardH={64} />
            </div>

            {/* Quick service widgets */}
            <div className="grid grid-cols-2 gap-3">
              {services.map((s) => (
                <Link
                  key={s.to}
                  to={s.to}
                  className="group relative p-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 hover:border-fuchsia-400/60 hover:bg-black/80 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(236,72,153,0.5)]"
                  aria-label={s.title}
                >
                  <div
                    className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center text-white bg-gradient-to-br ${s.accent} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform`}
                  >
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-bold text-white leading-tight">
                    {s.title}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">{s.desc}</div>
                  <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-fuchsia-300 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all">
                    {s.cta} <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer bar: reactions + share + social */}
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 px-6 sm:px-10 lg:px-14 py-5 border-t border-white/5 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex flex-wrap items-center gap-2">
            {reactions.map((r) => (
              <button
                key={r.label}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-200 transition-colors"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${r.color}`} />
                <span>
                  {r.emoji} {r.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-zinc-500 font-bold">
              Partager
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={copyLink}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
                aria-label="Copier le lien"
              >
                <Copy className="w-4 h-4" />
              </button>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
                aria-label="Partager sur X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
                aria-label="Partager sur Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
                aria-label="Partager sur WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/channel/UC0T9pcWA9_lpdB6-ZucZYmw"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
                aria-label="TikTok"
              >
                <Music2 className="w-4 h-4" />
              </a>
            </div>

            <button
              className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-500/15 hover:bg-fuchsia-500/25 border border-fuchsia-400/30 text-fuchsia-100 text-xs font-bold transition-colors"
            >
              <Bell className="w-3.5 h-3.5" /> M'alerter des sorties
            </button>
          </div>
        </div>

        {copied && (
          <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-black/80 border border-white/10 text-xs text-white shadow-lg">
            Lien copié ✓
          </div>
        )}
      </div>
    </section>
  );
};

export default AnimeMomentsPresentation;