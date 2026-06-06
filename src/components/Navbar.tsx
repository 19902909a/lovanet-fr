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
      <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center shrink-0 group">
          <img
            src={lovanetLogo.url}
            alt="Lovanet"
            className="h-9 w-auto object-contain group-hover:scale-[1.03] transition-transform duration-300"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1 mx-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 text-sm rounded-full transition-all",
                  isActive
                    ? "bg-secondary text-foreground shadow-[inset_0_0_0_1px_hsl(var(--border))]"
                    : "text-foreground/70 hover:text-foreground"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/shop"
          className="hidden md:inline-flex items-center px-5 py-2 rounded-full text-sm font-semibold text-white shadow-[0_8px_24px_-6px_hsl(var(--neon-magenta)/0.6)] hover:scale-[1.03] transition-transform"
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