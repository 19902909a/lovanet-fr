import { useEffect, useMemo, useRef, useState } from "react";
import NeonFooterBar from "@/components/NeonFooterBar";
import { Navbar } from "@/components/Navbar";
import CardSkinBubble from "@/components/CardSkinBubble";

type Media = {
  id: number;
  title: { romaji?: string; english?: string; native?: string };
  coverImage: { extraLarge?: string; large?: string; color?: string };
  bannerImage?: string;
  averageScore?: number;
  episodes?: number;
  genres?: string[];
  format?: string;
  seasonYear?: number;
  description?: string;
  trailer?: { id?: string; site?: string } | null;
};

const QUERY_TRENDING = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
      id
      title { romaji english native }
      coverImage { extraLarge large color }
      bannerImage
      averageScore
      episodes
      genres
      format
      seasonYear
      description(asHtml: false)
      trailer { id site }
    }
  }
}`;

/**
 * 3D rotating card carousel — original implementation.
 * Auto-syncs trending anime from AniList GraphQL (public, no key).
 */
export default function AnimeCatalog() {
  const [items, setItems] = useState<Media[]>([]);
  const [gridItems, setGridItems] = useState<Media[]>([]);
  const [gridLoading, setGridLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [angle, setAngle] = useState(0);
  const [tilt, setTilt] = useState(-8); // -45..+45 — raise/lower the wheel
  const [active, setActive] = useState<Media | null>(null);
  const [promoted, setPromoted] = useState<Media[]>([]);
  const [promotedAngle, setPromotedAngle] = useState(0);
  const [trailerMedia, setTrailerMedia] = useState<Media | null>(null);
  const rafRef = useRef<number>();
  const draggingRef = useRef<{ x: number; a: number } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ query: QUERY_TRENDING, variables: { page: 1, perPage: 30 } }),
      });
      const json = await res.json();
      const list = json?.data?.Page?.media ?? [];
      if (list.length) {
        setItems(list);
        try { localStorage.setItem("lovanet.cache.catalog.top", JSON.stringify(list)); } catch {}
      }
    } catch (e) {
      console.error("AniList fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  // Heavy grid below — fetches up to 5000 trending anime across 100 pages.
  const fetchGrid = async () => {
    setGridLoading(true);
    try {
      const dedup = new Map<number, Media>();
      // Batch by 2 to stay polite with AniList rate limits. 100 pages × 50 = 5000 titles.
      const pages = Array.from({ length: 100 }, (_, i) => i + 1);
      for (let i = 0; i < pages.length; i += 2) {
        const batch = pages.slice(i, i + 2);
        const results = await Promise.all(
          batch.map((p) =>
            fetch("https://graphql.anilist.co", {
              method: "POST",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: JSON.stringify({ query: QUERY_TRENDING, variables: { page: p, perPage: 50 } }),
            })
              .then((r) => r.json())
              .catch(() => null)
          )
        );
        let stop = false;
        for (const j of results) {
          const list = j?.data?.Page?.media ?? [];
          if (!list.length) stop = true;
          for (const m of list) {
            if (!dedup.has(m.id)) dedup.set(m.id, m);
          }
        }
        // Progressive render so the user sees cards as they arrive.
        const snapshot = Array.from(dedup.values());
        setGridItems(snapshot);
        try { localStorage.setItem("lovanet.cache.catalog.grid", JSON.stringify(snapshot.slice(0, 1500))); } catch {}
        if (stop) break;
        // small pause between batches
        await new Promise((r) => setTimeout(r, 120));
      }
    } catch (e) {
      console.error("AniList grid fetch error", e);
    } finally {
      setGridLoading(false);
      try {
        const all = Array.from(new Map<number, Media>().entries());
        // best-effort persist current state
      } catch {}
    }
  };

  useEffect(() => {
    // Hydrate from local backup so the page works even if AniList is unreachable.
    try {
      const t = localStorage.getItem("lovanet.cache.catalog.top");
      const g = localStorage.getItem("lovanet.cache.catalog.grid");
      if (t) { setItems(JSON.parse(t)); setLoading(false); }
      if (g) { setGridItems(JSON.parse(g)); setGridLoading(false); }
    } catch {}
    fetchData();
    fetchGrid();
    const id = setInterval(fetchData, 1000 * 60 * 15); // auto-sync every 15 min
    const gid = setInterval(fetchGrid, 1000 * 60 * 30);
    return () => {
      clearInterval(id);
      clearInterval(gid);
    };
  }, []);

  // auto-rotation
  useEffect(() => {
    let last = performance.now();
    const tick = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;
      if (!draggingRef.current) {
        setAngle((a) => a + dt * 8);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const radius = useMemo(() => {
    if (items.length < 8) return 380;
    return Math.max(420, items.length * 32);
  }, [items.length]);

  const promotedRadius = useMemo(() => {
    return Math.max(180, Math.min(260, promoted.length * 24));
  }, [promoted.length]);

  // Auto-rotate promoted carousel
  useEffect(() => {
    if (!promoted.length) return;
    let last = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;
      setPromotedAngle((a) => a + dt * 14);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [promoted.length]);

  // Chunk grid into rows
  const rowSize = 10;
  const rows = useMemo(() => {
    const out: Media[][] = [];
    for (let i = 0; i < gridItems.length; i += rowSize) {
      out.push(gridItems.slice(i, i + rowSize));
    }
    return out;
  }, [gridItems]);

  const promoteRow = (rowItems: Media[]) => {
    setPromoted((prev) => {
      const map = new Map(prev.map((m) => [m.id, m]));
      rowItems.forEach((m) => map.set(m.id, m));
      return Array.from(map.values()).slice(0, 24);
    });
    // Auto-pick first trailer of the row if available
    const first = rowItems.find((m) => m.trailer?.id && m.trailer?.site === "youtube");
    if (first) setTrailerMedia(first);
  };

  return (
    <main className="min-h-screen text-foreground overflow-hidden relative" style={{ background: "transparent" }}>
      <Navbar />
      <div className="h-12" />

      {/* Trailer player + promoted carousel (only when something promoted) */}
      {promoted.length > 0 && (
        <section className="relative px-4 md:px-10 pt-4 pb-2">
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-[0_0_60px_rgba(168,85,247,0.35)]">
              {trailerMedia?.trailer?.id && trailerMedia.trailer.site === "youtube" ? (
                <iframe
                  key={trailerMedia.trailer.id}
                  src={`https://www.youtube-nocookie.com/embed/${trailerMedia.trailer.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1&mute=1`}
                  title={trailerMedia.title.english || trailerMedia.title.romaji || "Trailer"}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm">
                  Sélectionnez une carte pour lire le trailer
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-2 px-1">
              <span className="text-xs text-white/70 truncate">
                {trailerMedia ? (trailerMedia.title.english || trailerMedia.title.romaji) : "—"}
              </span>
              <button
                onClick={() => { setPromoted([]); setTrailerMedia(null); }}
                className="text-[10px] uppercase tracking-widest text-white/60 hover:text-white border border-white/20 rounded-full px-2 py-1"
              >
                Vider
              </button>
            </div>
          </div>

          {/* Smaller promoted circle carousel */}
          <div
            className="relative h-[280px] mt-3 w-full select-none"
            style={{ perspective: "1000px" }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="relative"
                style={{
                  width: 1,
                  height: 1,
                  transformStyle: "preserve-3d",
                  transform: `rotateX(-6deg) rotateY(${promotedAngle}deg)`,
                }}
              >
                {promoted.map((m, i) => {
                  const theta = (360 / Math.max(promoted.length, 1)) * i;
                  const isActive = trailerMedia?.id === m.id;
                  return (
                    <button
                      key={`p-${m.id}`}
                      onClick={() => setTrailerMedia(m)}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      style={{
                        width: 90,
                        height: 135,
                        transform: `rotateY(${theta}deg) translateZ(${promotedRadius}px)`,
                      }}
                    >
                      <div
                        className={`w-full h-full rounded-lg overflow-hidden border ${isActive ? "border-fuchsia-400 shadow-[0_0_20px_#f0f]" : "border-white/15"}`}
                      >
                        {m.coverImage.large && (
                          <img
                            src={m.coverImage.large}
                            alt=""
                            loading="lazy"
                            className="w-full h-full object-cover"
                            draggable={false}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Top carousel */}
      <section
        className="relative h-[70vh] min-h-[520px] w-full select-none"
        style={{ perspective: "1400px" }}
        onPointerDown={(e) => {
          draggingRef.current = { x: e.clientX, a: angle };
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!draggingRef.current) return;
          const dx = e.clientX - draggingRef.current.x;
          setAngle(draggingRef.current.a + dx * 0.3);
        }}
        onPointerUp={() => {
          draggingRef.current = null;
        }}
      >
        {/* background aura */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 40%, rgba(168,85,247,0.25), transparent 70%), radial-gradient(40% 40% at 70% 60%, rgba(43,214,255,0.18), transparent 70%)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative"
            style={{
              width: 1,
              height: 1,
              transformStyle: "preserve-3d",
              transform: `rotateX(${tilt}deg) rotateY(${angle}deg)`,
              transition: "transform 0.05s linear",
            }}
          >
            {items.map((m, i) => {
              const theta = (360 / Math.max(items.length, 1)) * i;
              return (
                <button
                  key={m.id}
                  onClick={() => setActive(m)}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group"
                  style={{
                    width: 200,
                    height: 300,
                    transform: `rotateY(${theta}deg) translateZ(${radius}px)`,
                  }}
                >
                  <div
                    className="w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)] transition-transform group-hover:scale-105"
                    style={{
                      background: m.coverImage.color || "#111",
                      boxShadow: `0 0 30px ${m.coverImage.color ?? "#a855f7"}55`,
                    }}
                  >
                    {m.coverImage.extraLarge && (
                      <img
                        src={m.coverImage.extraLarge}
                        alt={m.title.romaji || m.title.english || ""}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    )}
                  </div>
                  <div
                    className="mt-2 text-xs text-center line-clamp-2 px-2 py-1 rounded-md border"
                    style={{
                      background: "var(--card-skin-bg, #fff)",
                      color: "var(--card-skin-fg, #0a0a0a)",
                      borderColor: "var(--card-skin-border, rgba(0,0,0,0.12))",
                    }}
                  >
                    {m.title.english || m.title.romaji}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="absolute top-6 left-0 right-0 text-center pointer-events-none">
          <h1 className="text-3xl md:text-5xl font-bold tracking-wide">
            <span className="bg-gradient-to-r from-fuchsia-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
              Catalogue Animés — Tendances
            </span>
          </h1>
        </div>
        {/* Tilt slider — lever/baisser les cartes du carrousel */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-2 bg-black/40 backdrop-blur px-2 py-3 rounded-full border border-white/10 pointer-events-auto">
          <span className="text-[10px] uppercase tracking-widest text-white/60">Incliner</span>
          <input
            type="range"
            min={-45}
            max={45}
            value={tilt}
            onChange={(e) => setTilt(Number(e.target.value))}
            className="h-32 w-6 accent-fuchsia-400"
            style={{ writingMode: "vertical-lr" as any, WebkitAppearance: "slider-vertical" as any }}
            aria-label="Lever ou baisser les cartes du carrousel"
          />
          <button
            type="button"
            onClick={() => setTilt(-8)}
            className="text-[10px] text-white/70 hover:text-white"
          >
            Reset
          </button>
        </div>
      </section>

      {/* Barre RGB fluo sous le carrousel cercle */}
      <div className="px-4 md:px-10 pt-2">
        <NeonFooterBar inline height={22} className="rounded-full overflow-hidden" />
      </div>
      <CardSkinBubble />

      {/* Grid below */}
      <section className="px-4 md:px-10 py-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-white/80">
            Tout le catalogue · {gridItems.length} titres
          </h2>
          {gridLoading && (
            <span className="text-xs text-white/50">Chargement en cours…</span>
          )}
        </div>
        <div className="space-y-2">
          {rows.map((row, ri) => (
            <div key={`row-${ri}`} className="relative group/row">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
                {row.map((m) => (
                  <button
                    key={`g-${m.id}`}
                    onClick={() => setActive(m)}
                    className="group text-left rounded-lg overflow-hidden border"
                    style={{
                      background: "var(--card-skin-bg, #fff)",
                      color: "var(--card-skin-fg, #0a0a0a)",
                      borderColor: "var(--card-skin-border, rgba(0,0,0,0.12))",
                    }}
                  >
                    <div
                      className="aspect-[2/3] overflow-hidden border-b relative"
                      style={{ borderColor: "var(--card-skin-border, rgba(0,0,0,0.08))" }}
                    >
                      {m.coverImage.large && (
                        <img
                          src={m.coverImage.large}
                          alt={m.title.romaji || ""}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            const img = e.currentTarget;
                            if (m.coverImage.extraLarge && img.src !== m.coverImage.extraLarge) {
                              img.src = m.coverImage.extraLarge;
                            } else {
                              img.style.display = "none";
                            }
                          }}
                        />
                      )}
                      {typeof m.averageScore === "number" && (
                        <span className="absolute top-1 right-1 text-[9px] px-1 py-0.5 rounded bg-black/70 text-cyan-300">
                          {m.averageScore}
                        </span>
                      )}
                      {m.trailer?.id && m.trailer?.site === "youtube" && (
                        <span className="absolute bottom-1 left-1 text-[10px] px-1 py-0.5 rounded bg-fuchsia-500/80 text-white">
                          ▶
                        </span>
                      )}
                    </div>
                    <div className="px-1.5 pt-1 pb-1.5">
                      <div className="text-[10px] line-clamp-2 leading-tight">
                        {m.title.english || m.title.romaji}
                      </div>
                      <div className="text-[9px] opacity-60">
                        {m.format} · {m.seasonYear ?? "—"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {/* Floating bubble: promote this row into the small circle carousel */}
              <button
                type="button"
                onClick={() => promoteRow(row)}
                title="Transférer cette ligne au carrousel cercle"
                aria-label="Transférer cette ligne au carrousel cercle"
                className="absolute -right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 text-white text-sm font-bold shadow-[0_0_20px_rgba(217,70,239,0.6)] border border-white/20 opacity-0 group-hover/row:opacity-100 transition-opacity hover:scale-110"
              >
                ↑
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Detail modal */}
      {active && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <div
            className="max-w-3xl w-full bg-[#0c0a16] border border-white/10 rounded-2xl overflow-hidden max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* In-modal video player — trailers first, banner fallback */}
            {active.trailer?.id && active.trailer?.site === "youtube" ? (
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  key={active.trailer.id}
                  src={`https://www.youtube-nocookie.com/embed/${active.trailer.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  title={active.title.english || active.title.romaji || "Trailer"}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              </div>
            ) : active.bannerImage ? (
              <img src={active.bannerImage} alt="" className="w-full h-40 object-cover" />
            ) : null}
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">
                {active.title.english || active.title.romaji}
              </h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {active.genres?.map((g) => (
                  <span
                    key={g}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80"
                  >
                    {g}
                  </span>
                ))}
              </div>
              <p className="text-sm text-white/70 max-h-60 overflow-auto">
                {active.description?.replace(/<[^>]+>/g, "") ?? "Aucune description."}
              </p>
              <button
                onClick={() => setActive(null)}
                className="mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      <NeonFooterBar />
    </main>
  );
}