import { Link, NavLink, useLocation } from "react-router-dom";
import { Play, ExternalLink, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", label: "Anime Moments" },
  { to: "/chaine-youtube", label: "Chaîne YouTube" },
  { to: "/prime-video", label: "Prime Vidéo" },
  { to: "/tiktok", label: "TikTok" },
  { to: "/shop", label: "Shop Anime" },
  { to: "/nlounq", label: "NLOUNQ" },
  { to: "/contact", label: "Contact" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  useLocation();

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full border-2 border-primary/60 flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Play className="w-4 h-4 text-primary fill-primary" />
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-display font-extrabold tracking-wider text-sm">ANIMEMOMENTS</span>
            <span className="text-[10px] text-muted-foreground tracking-[0.2em]">
              ANIMEOFFICIEL <span className="text-primary font-semibold">OFFICIAL</span>
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 text-sm rounded-lg transition-colors",
                  isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="gap-2 rounded-full">
            <a href="https://www.tiktok.com" target="_blank" rel="noreferrer">
              TikTok <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </Button>
          <Button asChild size="sm" className="gap-2 rounded-full bg-primary hover:bg-primary/90">
            <a href="https://www.youtube.com" target="_blank" rel="noreferrer">
              YouTube <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </Button>
        </div>

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
            {navItems.map((item) => (
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