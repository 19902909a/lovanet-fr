import { Link } from "react-router-dom";
import { ArrowRight, Film, BookOpen, Sparkles } from "lucide-react";
import mangaBanner from "@/assets/manga-banner.jpg";

export const MangaUniverseBanner = () => {
  return (
    <section className="container mx-auto px-4 lg:px-8 pb-16">
      <Link
        to="/chaine-youtube/manga"
        aria-label="Découvrir l'Univers Manga & Anime"
        className="group relative block overflow-hidden rounded-3xl border border-border shadow-[0_40px_120px_-40px_hsl(var(--neon-magenta)/0.5)] focus:outline-none focus:ring-4 focus:ring-primary/60"
      >
        <img
          src={mangaBanner}
          alt="Univers Manga & Anime — bannière séparation image et vidéo"
          width={1920}
          height={640}
          loading="lazy"
          className="w-full h-56 sm:h-72 md:h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-black/70" />
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-white/50 to-transparent pointer-events-none" />

        <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between gap-4 p-6 sm:p-10">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div className="text-white">
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/70 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Section dédiée
              </p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
                Univers Manga &amp; Anime
              </h2>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-white/70">
            <Film className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest">Image · Vidéo</span>
          </div>

          <span
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white shadow-lg transition-transform group-hover:translate-x-1"
            style={{ background: "var(--gradient-magenta)" }}
          >
            Entrer dans l'univers <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    </section>
  );
};

export default MangaUniverseBanner;