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
} from "lucide-react";
import { useState } from "react";
import MiniCatalogOrb from "@/components/MiniCatalogOrb";
import heroBg from "@/assets/anime-moments-hero.jpg";

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
  },
  {
    to: "/anime-countdown",
    icon: Calendar,
    title: "Countdown sorties",
    desc: "Prochains épisodes & saisons",
    accent: "from-cyan-400 to-sky-500",
  },
  {
    to: "/chaine-youtube",
    icon: Flame,
    title: "Tendances YouTube",
    desc: "Moments forts du moment",
    accent: "from-red-500 to-rose-500",
  },
  {
    to: "/shop",
    icon: ShoppingBag,
    title: "Shop créateur",
    desc: "Drops manga exclusifs",
    accent: "from-violet-500 to-fuchsia-600",
  },
];

export const AnimeMomentsPresentation = () => {
  const [copied, setCopied] = useState(false);

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
              Le portail Lovanet : mangas animés, bandes-annonces, moments forts,
              chaîne YouTube, TikTok et shop créateur — tout ce qu'il vous faut,
              à portée d'un clic.
            </p>

            {/* Primary CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/lecteurs-video"
                className="btn-magnetic btn-neon-rainbow px-6 py-3 rounded-full text-white font-bold inline-flex items-center gap-2 shadow-[0_10px_30px_-10px_hsl(var(--neon-magenta)/0.7)] transition-all hover:scale-[1.03] active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-current" /> Regarder maintenant
              </Link>
              <Link
                to="/shop"
                className="px-6 py-3 rounded-full font-bold inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/15 backdrop-blur-md transition-colors"
              >
                <ShoppingBag className="w-4 h-4" /> Boutique créateur
              </Link>
              <Link
                to="/anime-catalog"
                className="px-6 py-3 rounded-full font-bold inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/15 backdrop-blur-md transition-colors"
              >
                <Sparkles className="w-4 h-4" /> Catalogue
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
                  className="group relative p-4 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 hover:border-white/25 transition-all hover:-translate-y-0.5"
                >
                  <div
                    className={`w-9 h-9 rounded-xl mb-3 flex items-center justify-center text-white bg-gradient-to-br ${s.accent} shadow-lg`}
                  >
                    <s.icon className="w-4 h-4" />
                  </div>
                  <div className="text-sm font-bold text-white leading-tight">
                    {s.title}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">{s.desc}</div>
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