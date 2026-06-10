import { useEffect, useState } from "react";
import { Palette, X } from "lucide-react";

/**
 * Floating bubble (bottom-right) with 4 colors that retint the entire site
 * background via CSS variables. Choice persists in localStorage.
 */

type ThemeKey = "default" | "midnight" | "sunset" | "forest" | "candy";

type Theme = {
  key: ThemeKey;
  label: string;
  swatch: string;
  // HSL component strings (no hsl() wrapper)
  background: string;
  card: string;
  border: string;
  primary: string;
  hero: string;
};

const THEMES: Theme[] = [
  {
    key: "default",
    label: "Anime Night",
    swatch: "linear-gradient(135deg,#3b82f6,#ec4899)",
    background: "220 30% 8%",
    card: "220 25% 11%",
    border: "220 20% 18%",
    primary: "211 100% 55%",
    hero: "linear-gradient(135deg,hsl(220 35% 6%) 0%,hsl(220 30% 10%) 50%,hsl(220 25% 14%) 100%)",
  },
  {
    key: "midnight",
    label: "Midnight Indigo",
    swatch: "linear-gradient(135deg,#0a0a1a,#4f46e5)",
    background: "245 45% 7%",
    card: "245 40% 11%",
    border: "245 30% 20%",
    primary: "250 95% 68%",
    hero: "linear-gradient(135deg,hsl(245 50% 5%) 0%,hsl(250 45% 11%) 50%,hsl(260 40% 16%) 100%)",
  },
  {
    key: "sunset",
    label: "Sunset Blaze",
    swatch: "linear-gradient(135deg,#ff6b35,#e84393)",
    background: "18 50% 8%",
    card: "16 45% 12%",
    border: "14 35% 22%",
    primary: "20 95% 60%",
    hero: "linear-gradient(135deg,hsl(18 55% 6%) 0%,hsl(340 45% 11%) 50%,hsl(280 40% 16%) 100%)",
  },
  {
    key: "forest",
    label: "Forest Moss",
    swatch: "linear-gradient(135deg,#1a3c2a,#a0c49d)",
    background: "150 35% 7%",
    card: "150 30% 11%",
    border: "150 25% 20%",
    primary: "150 70% 50%",
    hero: "linear-gradient(135deg,hsl(150 40% 5%) 0%,hsl(155 35% 10%) 50%,hsl(170 30% 14%) 100%)",
  },
  {
    key: "candy",
    label: "Candy Pop",
    swatch: "linear-gradient(135deg,#67e8f9,#c4b5fd)",
    background: "260 35% 10%",
    card: "260 30% 14%",
    border: "260 25% 24%",
    primary: "320 90% 65%",
    hero: "linear-gradient(135deg,hsl(200 70% 12%) 0%,hsl(260 60% 16%) 50%,hsl(320 60% 18%) 100%)",
  },
];

const STORAGE_KEY = "lovanet:theme";

const applyTheme = (t: Theme) => {
  const r = document.documentElement.style;
  r.setProperty("--background", t.background);
  r.setProperty("--card", t.card);
  r.setProperty("--popover", t.card);
  r.setProperty("--secondary", t.card);
  r.setProperty("--muted", t.card);
  r.setProperty("--border", t.border);
  r.setProperty("--input", t.border);
  r.setProperty("--primary", t.primary);
  r.setProperty("--accent", t.primary);
  r.setProperty("--ring", t.primary);
  r.setProperty("--gradient-hero", t.hero);
};

export const ThemeBubble = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ThemeKey>("default");

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as ThemeKey | null) ?? "default";
    const t = THEMES.find((x) => x.key === saved) ?? THEMES[0];
    applyTheme(t);
    setActive(t.key);
  }, []);

  const pick = (t: Theme) => {
    applyTheme(t);
    localStorage.setItem(STORAGE_KEY, t.key);
    setActive(t.key);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div className="rounded-2xl border border-border bg-card/95 backdrop-blur-xl p-3 shadow-2xl animate-scale-in">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2 px-1">
            Thème du site
          </p>
          <div className="grid grid-cols-5 gap-2">
            {THEMES.map((t) => (
              <button
                key={t.key}
                onClick={() => pick(t)}
                title={t.label}
                aria-label={t.label}
                className={`relative w-10 h-10 rounded-full transition-transform hover:scale-110 ${
                  active === t.key ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : ""
                }`}
                style={{ background: t.swatch }}
              />
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 px-1">
            {THEMES.find((t) => t.key === active)?.label}
          </p>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Personnaliser le thème"
        className="relative w-14 h-14 rounded-full shadow-[0_10px_30px_hsl(var(--primary)/0.45)] border border-border bg-card/90 backdrop-blur-xl hover:scale-110 transition-all flex items-center justify-center group overflow-hidden"
      >
        <span
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "conic-gradient(from 0deg,#ff2e93,#ffb13a,#06d6a0,#3a86ff,#8338ec,#ff2e93)",
          }}
        />
        <span className="relative z-10 text-white drop-shadow">
          {open ? <X className="w-5 h-5" /> : <Palette className="w-5 h-5" />}
        </span>
      </button>
    </div>
  );
};

export default ThemeBubble;