import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import lovanetLogo from "@/assets/lovanet-logo.jpg.asset.json";

const navItems = [
  { to: "/", label: "Accueil" },
  { to: "/lecteurs-video", label: "Lecteurs vidéo" },
  { to: "/chaine-youtube", label: "YouTube" },
  { to: "/prime-video", label: "Prime Vidéo" },
  { to: "/tiktok", label: "TikTok" },
  { to: "/shop", label: "Shop" },
];

const extraItems = [
  { to: "/nlounq", label: "NLOUNQ" },
  { to: "/contact", label: "Contact" },
];


export const Navbar = () => {
  const [open, setOpen] = useState(false);
  useLocation();

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="container mx-auto px-4 lg:px-8 h-12 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="tilt-card btn-magnetic flex items-center shrink-0 group rounded-full p-0.5"
          aria-label="Lovanet"
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
          className="lg:hidden p-2 rounded-lg hover:bg-secondary"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

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