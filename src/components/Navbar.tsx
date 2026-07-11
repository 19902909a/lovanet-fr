import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, LayoutGrid, ShoppingBag, Youtube, Play, Music2, Film, Mail, Compass, ShoppingCart } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import lovanetLogo from "@/assets/lovanet-logo.jpg.asset.json";
import { useCart } from "@/context/CartContext";

const navItems = [
  { to: "/", label: "Accueil" },
  { to: "/lecteurs-video", label: "Lecteurs vidéo" },
  { to: "/chaine-youtube", label: "YouTube" },
  { to: "/prime-video", label: "Prime Vidéo" },
  { to: "/tiktok", label: "TikTok" },
  { to: "/anime-countdown", label: "À venir" },
  { to: "/anime-catalog", label: "Catalogue" },
  { to: "/decouvrir", label: "Univers Lovanet" },
  { to: "/shop", label: "Shop" },
];

const extraItems = [
  { to: "/contact", label: "Contact" },
];

const megaSections = [
  { to: "/", label: "Accueil", desc: "Page d'accueil Lovanet", icon: Compass },
  { to: "/shop", label: "Boutique", desc: "Affiches, collectors, vêtements", icon: ShoppingBag },
  { to: "/tiktok", label: "TikTok", desc: "Shorts & réactions", icon: Music2 },
  { to: "/chaine-youtube", label: "YouTube", desc: "Vidéos & shorts officiels", icon: Youtube },
  { to: "/chaine-youtube/manga", label: "YouTube Manga", desc: "Chaîne dédiée manga", icon: Youtube },
  { to: "/prime-video", label: "Prime Vidéo", desc: "Lecture immersive multi-plateforme", icon: Play },
  { to: "/lecteurs-video", label: "Lecteur vidéo", desc: "Player immersif anime", icon: Film },
  { to: "/anime-countdown", label: "Animés à venir", desc: "Countdown live des prochains épisodes", icon: Play },
  { to: "/anime-catalog", label: "Catalogue Animés", desc: "Carrousel 3D tendances", icon: Film },
  { to: "/decouvrir", label: "Univers Lovanet", desc: "Vitrine SEO produits & vidéos", icon: Compass },
  { to: "/contact", label: "Contact", desc: "Écrire à l'équipe", icon: Mail },
  { to: "/legals", label: "Mentions légales", desc: "CGV & confidentialité", icon: Mail },
];


export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const { count, setOpen: setCartOpen } = useCart();
  useLocation();

  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 180);
  };
  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMegaOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="container mx-auto px-4 lg:px-8 h-12 flex items-center justify-between gap-4">
        <div
          className="flex items-center gap-2 shrink-0"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <Link
            to="/"
            className="tilt-card btn-magnetic flex items-center group rounded-full p-0.5"
            aria-label="Lovanet — Accueil"
          >
            <img
              src={lovanetLogo.url}
              alt="Lovanet"
              className="h-8 w-8 rounded-full object-cover ring-1 ring-fuchsia-400/40 shadow-[0_0_18px_hsl(var(--neon-magenta)/0.55)] transition-all duration-300 group-hover:ring-fuchsia-300/80 group-hover:shadow-[0_0_28px_hsl(var(--neon-magenta)/0.9),0_0_44px_hsl(var(--neon-cyan)/0.5)] group-active:scale-95"
            />
            <span className="ml-2 font-display text-sm font-bold tracking-wide gradient-text hidden sm:inline">
              Lovanet
            </span>
          </Link>
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={megaOpen}
            aria-controls="mega-menu-panel"
            onClick={() => setMegaOpen((v) => !v)}
            onMouseEnter={() => { cancelClose(); setMegaOpen(true); }}
            className={cn(
              "ml-1 inline-flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-card/60 backdrop-blur-md hover:border-primary/60 hover:text-primary transition-all duration-200",
              megaOpen && "border-primary/70 text-primary shadow-[0_0_18px_hsl(var(--neon-magenta)/0.45)]"
            )}
            aria-label="Ouvrir le méga-menu de navigation"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>

        <nav className="hidden lg:flex items-center gap-1 mx-auto perspective-[800px]">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "nav-3d btn-magnetic px-4 py-2 text-sm rounded-full transition-all duration-300 hover:-translate-y-0.5",
                  isActive
                    ? "text-primary nav-3d-active"
                    : "text-foreground/70 hover:text-primary hover:drop-shadow-[0_0_10px_hsl(var(--neon-cyan)/0.7)]"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/shop"
          className="btn-magnetic tilt-card hidden md:inline-flex items-center px-5 py-2 rounded-full text-sm font-semibold text-white shadow-[0_8px_24px_-6px_hsl(var(--neon-magenta)/0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.05] hover:shadow-[0_14px_36px_-8px_hsl(var(--neon-magenta)/0.85),0_0_28px_hsl(var(--neon-cyan)/0.5)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          style={{ background: "var(--gradient-magenta)" }}
        >
          Boutique
        </Link>
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-border bg-card/60 backdrop-blur hover:border-primary/60 hover:text-primary transition-all"
          aria-label={`Ouvrir le panier (${count} article${count > 1 ? "s" : ""})`}
        >
          <ShoppingCart className="w-4 h-4" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold text-white grid place-items-center shadow-md" style={{ background: "var(--gradient-magenta)" }}>
              {count > 99 ? "99+" : count}
            </span>
          )}
        </button>
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-secondary"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mega menu panel */}
      {megaOpen && (
        <div
          id="mega-menu-panel"
          ref={megaRef}
          role="menu"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          className="absolute left-0 right-0 top-full mt-2 mx-auto px-4 lg:px-8 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="container mx-auto">
            <div className="relative rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur-2xl shadow-[0_20px_80px_-20px_hsl(var(--neon-magenta)/0.35),0_0_0_1px_rgba(255,255,255,0.04)_inset] p-4 sm:p-6 overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
              <div className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full bg-fuchsia-400/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
              <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] uppercase tracking-[0.35em] text-white/70 font-display">Menu</p>
                <button
                  onClick={() => setMegaOpen(false)}
                  className="p-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white/80 backdrop-blur transition-all"
                  aria-label="Fermer le méga-menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {megaSections.map((s) => (
                  <Link
                    key={s.to}
                    to={s.to}
                    role="menuitem"
                    onClick={() => setMegaOpen(false)}
                    className="group relative flex items-start gap-3 p-3 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.09] hover:border-white/25 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-14px_hsl(var(--neon-cyan)/0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    <span className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white/90 bg-white/5 border border-white/15 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/30 group-hover:scale-110 group-hover:text-white">
                      <s.icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display font-semibold text-sm text-white/95 group-hover:text-white transition-colors">
                        {s.label}
                      </span>
                      <span className="block text-[11px] text-white/60 mt-0.5 truncate">
                        {s.desc}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {[...navItems, ...extraItems].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 text-sm rounded-lg",
                    isActive ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-secondary"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};