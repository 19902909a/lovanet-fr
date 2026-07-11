import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { HologramCharacter } from "@/components/HologramCharacter";
import { HOLOGRAM_ACTIVITIES } from "@/data/hologramActivities";

// Premium showcase — 100 procedurally distinct holographic characters,
// each performing a unique activity with its own décor, hue and motion.
// Rendered as SVG + CSS so it stays smooth on mobile while pushing the
// visual envelope. Self-contained: adding it does not touch any existing
// route or component.

const MOTION_FAMILIES = [
  "all", "run", "swim", "kick", "skate", "roll", "jump", "spin", "punch",
  "wave", "dance", "meditate", "lift", "throw", "climb", "surf", "ride",
  "flow", "cast",
] as const;

export default function Hologrammes() {
  const [filter, setFilter] = useState<(typeof MOTION_FAMILIES)[number]>("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return HOLOGRAM_ACTIVITIES.filter((a) => {
      if (filter !== "all" && a.motion !== filter) return false;
      if (q && !a.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [filter, query]);

  return (
    <PageShell>
      <main className="holo-page">
        <div className="holo-page-bg" aria-hidden />
        <header className="holo-hero">
          <p className="holo-eyebrow">Lovanet · Premium showcase</p>
          <h1 className="holo-title">100 Hologrammes en action</h1>
          <p className="holo-sub">
            Cent personnages holographiques uniques — natation, foot, roller, skate,
            danse, magie, sport extrême — chacun avec sa démarche, son décor et son
            aura chromatique. Survolez une figure pour l'activer.
          </p>
          <div className="holo-controls">
            <input
              className="holo-search"
              placeholder="Rechercher une activité…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Rechercher un hologramme"
            />
            <div className="holo-chips" role="tablist">
              {MOTION_FAMILIES.map((m) => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={filter === m}
                  className={`holo-chip${filter === m ? " is-active" : ""}`}
                  onClick={() => setFilter(m)}
                >
                  {m}
                </button>
              ))}
            </div>
            <p className="holo-count">
              {visible.length} / {HOLOGRAM_ACTIVITIES.length} hologrammes visibles
            </p>
          </div>
        </header>

        <section className="holo-grid" aria-label="Grille des 100 hologrammes">
          {visible.map((a) => (
            <HologramCharacter key={a.id} activity={a} />
          ))}
        </section>
      </main>
    </PageShell>
  );
}