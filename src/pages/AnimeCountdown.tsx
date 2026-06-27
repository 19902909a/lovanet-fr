import { useEffect, useState } from "react";
import NeonFooterBar from "@/components/NeonFooterBar";
import { Navbar } from "@/components/Navbar";

type Media = {
  id: number;
  title: { romaji?: string; english?: string };
  coverImage: { extraLarge?: string; large?: string; color?: string };
  nextAiringEpisode?: { airingAt: number; episode: number; timeUntilAiring: number };
  genres?: string[];
  format?: string;
  episodes?: number;
  averageScore?: number;
};

const QUERY = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(type: ANIME, status: RELEASING, sort: POPULARITY_DESC, isAdult: false) {
      id
      title { romaji english }
      coverImage { extraLarge large color }
      nextAiringEpisode { airingAt episode timeUntilAiring }
      genres
      format
      episodes
      averageScore
    }
  }
}`;

function formatCountdown(seconds: number) {
  if (seconds <= 0) return "En diffusion";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}j ${h.toString().padStart(2, "0")}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
}

/**
 * Upcoming anime episodes — auto-synced from AniList GraphQL (public, no key).
 * Original card design with live countdown per item.
 */
export default function AnimeCountdown() {
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  const fetchData = async () => {
    try {
      const pages = await Promise.all(
        [1, 2, 3, 4].map((p) =>
          fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ query: QUERY, variables: { page: p, perPage: 50 } }),
          }).then((r) => r.json())
        )
      );
      const all: Media[] = pages.flatMap((j) => j?.data?.Page?.media ?? []);
      const dedup = new Map<number, Media>();
      for (const m of all) if (m.nextAiringEpisode?.airingAt) dedup.set(m.id, m);
      const list = Array.from(dedup.values());
      list.sort(
        (a, b) =>
          (a.nextAiringEpisode?.airingAt ?? 0) - (b.nextAiringEpisode?.airingAt ?? 0)
      );
      if (list.length) {
        setItems(list);
        try { localStorage.setItem("lovanet.cache.countdown", JSON.stringify(list)); } catch {}
      }
    } catch (e) {
      console.error("AniList fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const c = localStorage.getItem("lovanet.cache.countdown");
      if (c) { setItems(JSON.parse(c)); setLoading(false); }
    } catch {}
    fetchData();
    const sync = setInterval(fetchData, 1000 * 60 * 10); // auto-sync every 10 min
    const tick = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => {
      clearInterval(sync);
      clearInterval(tick);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#05040b] text-white pb-20 relative overflow-hidden">
      <Navbar />
      <div className="h-12" />
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          background:
            "radial-gradient(50% 50% at 20% 10%, rgba(255,43,214,0.18), transparent 70%), radial-gradient(40% 40% at 80% 30%, rgba(43,214,255,0.18), transparent 70%)",
        }}
      />

      <header className="relative px-4 md:px-10 pt-10 pb-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-wide">
          <span className="bg-gradient-to-r from-fuchsia-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
            Animés à venir — Compte à rebours
          </span>
        </h1>
      </header>

      <section className="relative px-4 md:px-10">
        {loading && <p className="text-center text-white/60">Chargement…</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((m) => {
            const airingAt = m.nextAiringEpisode!.airingAt;
            const remaining = airingAt - now;
            const color = m.coverImage.color || "#a855f7";
            return (
              <article
                key={m.id}
                className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-transform hover:-translate-y-1"
                style={{ boxShadow: `0 10px 40px ${color}33` }}
              >
                <div className="aspect-[16/9] overflow-hidden relative">
                  {m.coverImage.extraLarge && (
                    <img
                      src={m.coverImage.extraLarge}
                      alt={m.title.romaji || ""}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3">
                    <div className="text-xs text-white/60">
                      Épisode {m.nextAiringEpisode!.episode}
                      {m.episodes ? ` / ${m.episodes}` : ""}
                    </div>
                    <h2 className="text-base font-semibold line-clamp-2">
                      {m.title.english || m.title.romaji}
                    </h2>
                  </div>
                </div>

                <div className="p-4">
                  <div
                    className="text-center font-mono text-lg tracking-wider"
                    style={{ color }}
                  >
                    {formatCountdown(remaining)}
                  </div>
                  <div className="text-center text-[11px] text-white/50 mt-1">
                    {new Date(airingAt * 1000).toLocaleString("fr-FR")}
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                    {m.genres?.slice(0, 3).map((g) => (
                      <span
                        key={g}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                {/* animated edge glow */}
                <span
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{
                    boxShadow: `inset 0 0 30px ${color}55`,
                  }}
                />
              </article>
            );
          })}
        </div>
      </section>

      <NeonFooterBar />
    </main>
  );
}