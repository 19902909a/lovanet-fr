import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Tablet-shaped video player with an integrated 3D circular carousel of up to
 * 1500 anime trailers from the catalog page + site videos. Auto-plays each
 * trailer to completion and jumps to the next random, non-repeating item.
 * The tablet frame is resizable (drag bottom-right corner).
 */

type Media = {
  id: number | string;
  title: string;
  cover: string;
  ytId: string;
  source: "catalog" | "site";
};

const CATALOG_QUERY = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
      id
      title { romaji english }
      coverImage { large }
      trailer { id site }
    }
  }
}`;

// Lazy-load the YouTube IFrame API once for the whole page.
let ytApiPromise: Promise<any> | null = null;
const loadYTApi = (): Promise<any> => {
  if (typeof window === "undefined") return Promise.reject();
  if ((window as any).YT?.Player) return Promise.resolve((window as any).YT);
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    (window as any).onYouTubeIframeAPIReady = () => resolve((window as any).YT);
  });
  return ytApiPromise;
};

export default function TabletTrailerPlayer() {
  const [items, setItems] = useState<Media[]>([]);
  const [current, setCurrent] = useState<Media | null>(null);
  const playedRef = useRef<Set<string>>(new Set());
  const [phase, setPhase] = useState(0); // 0..1 flow along the 3D spiral
  const draggingRef = useRef<{ x: number; a: number; moved?: boolean } | null>(null);
  const playerHostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  // Load catalog cache + site videos
  useEffect(() => {
    let cancelled = false;

    const merged: Media[] = [];

    // 1) Cached catalog (from AnimeCatalog page) — up to 1500
    try {
      const cached = localStorage.getItem("lovanet.cache.catalog.grid");
      if (cached) {
        const list = JSON.parse(cached) as any[];
        for (const m of list) {
          if (m?.trailer?.id && m?.trailer?.site === "youtube") {
            merged.push({
              id: `c-${m.id}`,
              title: m.title?.english || m.title?.romaji || "Anime",
              cover: m.coverImage?.large || m.coverImage?.extraLarge || "",
              ytId: m.trailer.id,
              source: "catalog",
            });
          }
        }
      }
    } catch {}

    // 2) Site videos from Supabase (YouTube imports)
    (async () => {
      if (!cancelled && merged.length) setItems([...merged].slice(0, 1500));
    })();

    // 3) If catalog cache missing → fetch enough pages to reach 1500 trailers
    (async () => {
      if (merged.length >= 100) {
        setItems([...merged].slice(0, 1500));
        return;
      }
      try {
        const dedup = new Map<string, Media>();
        for (const m of merged) dedup.set(m.ytId, m);
        for (let p = 1; p <= 30 && dedup.size < 1500; p++) {
          const res = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: CATALOG_QUERY, variables: { page: p, perPage: 50 } }),
          });
          const j = await res.json();
          const list = j?.data?.Page?.media ?? [];
          if (!list.length) break;
          for (const m of list) {
            if (m?.trailer?.id && m?.trailer?.site === "youtube" && !dedup.has(m.trailer.id)) {
              dedup.set(m.trailer.id, {
                id: `c-${m.id}`,
                title: m.title?.english || m.title?.romaji || "Anime",
                cover: m.coverImage?.large || "",
                ytId: m.trailer.id,
                source: "catalog",
              });
            }
          }
          if (cancelled) return;
          setItems(Array.from(dedup.values()).slice(0, 1500));
          await new Promise((r) => setTimeout(r, 150));
        }
      } catch {}
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Pick first item once loaded
  useEffect(() => {
    if (!current && items.length) {
      const first = items[Math.floor(Math.random() * items.length)];
      setCurrent(first);
      playedRef.current.add(first.ytId);
    }
  }, [items, current]);

  // Pick random non-repeating next
  const pickNext = (): Media | null => {
    if (!items.length) return null;
    const remaining = items.filter((m) => !playedRef.current.has(m.ytId));
    if (!remaining.length) {
      playedRef.current.clear();
      const n = items[Math.floor(Math.random() * items.length)];
      playedRef.current.add(n.ytId);
      return n;
    }
    const n = remaining[Math.floor(Math.random() * remaining.length)];
    playedRef.current.add(n.ytId);
    return n;
  };

  // Instantiate YT player once we have a host + first item
  useEffect(() => {
    if (!current) return;
    if (!playerHostRef.current) return;
    if (playerRef.current) {
      try { playerRef.current.loadVideoById(current.ytId); } catch {}
      return;
    }
    let disposed = false;
    loadYTApi().then((YT) => {
      if (disposed || !playerHostRef.current || playerRef.current) return;
      playerRef.current = new YT.Player(playerHostRef.current, {
        host: "https://www.youtube-nocookie.com",
        videoId: current.ytId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          mute: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e: any) => { try { e.target.playVideo(); } catch {} },
          onStateChange: (e: any) => {
            if (e.data === 0) {
              const next = pickNext();
              if (next) setCurrent(next);
            }
          },
          onError: () => {
            const next = pickNext();
            if (next) setCurrent(next);
          },
        },
      });
    });
    return () => { disposed = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.ytId]);

  // Slowly advance the phase — one whole item every ~4 s.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;
      if (!draggingRef.current) {
        // Speed in "items per second" — small so scroll is calm.
        setPhase((p) => p + dt * 0.25);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Virtualized 3D spiral — only render a small window of cards so every card
  // has its own screen slot (no stacking, no hidden cards behind others).
  const catalogue = useMemo(() => items.slice(0, 1500), [items]);
  const count = Math.max(catalogue.length, 1);
  const VISIBLE_SLOTS = 13; // odd → nice symmetric center card
  const helixWidth = 1400;
  const helixRadius = 80;
  const slotStep = helixWidth / VISIBLE_SLOTS;

  const onSelect = (m: Media) => {
    playedRef.current.add(m.ytId);
    setCurrent(m);
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 pt-6 pb-4">
      {/* Resizable tablet frame */}
      <div
        className="tablet-frame relative mx-auto"
        style={{
          width: "min(100%, 980px)",
          height: 520,
          minWidth: 320,
          minHeight: 300,
          maxWidth: "100%",
          maxHeight: "90vh",
          resize: "both",
          overflow: "hidden",
          borderRadius: 32,
          padding: 14,
          background:
            "linear-gradient(145deg, #1a1a24 0%, #0b0b12 50%, #1a1a24 100%)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow:
            "0 30px 80px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 40px rgba(217,70,239,0.25)",
        }}
      >
        {/* Speaker slit */}
        <div
          aria-hidden
          className="mx-auto mb-2 rounded-full"
          style={{ width: 60, height: 5, background: "rgba(255,255,255,0.15)" }}
        />
        {/* Screen — full video area */}
        <div
          className="relative w-full rounded-2xl overflow-hidden bg-black"
          style={{ height: "calc(100% - 26px)" }}
        >
          <div ref={playerHostRef} className="absolute inset-0 w-full h-full" />
          {!current && (
            <div className="absolute inset-0 grid place-items-center text-white/50 text-sm">
              Chargement des bandes-annonces…
            </div>
          )}
          {current && (
            <div className="absolute bottom-2 left-3 right-3 flex items-center gap-2 text-[11px] text-white/80 pointer-events-none z-10">
              <span className="px-1.5 py-0.5 rounded-full bg-black/60 uppercase tracking-widest text-[9px]">
                {current.source === "catalog" ? "Catalogue" : "Site"}
              </span>
              <span className="truncate">{current.title}</span>
            </div>
          )}
        </div>
      </div>

      {/* 3D spiral trailer strip BELOW the tablet — drifts slowly to the right */}
      <div
        className="relative w-full select-none mt-4"
        style={{ height: 240, perspective: "1400px", overflow: "hidden" }}
        onPointerDown={(e) => {
          draggingRef.current = { x: e.clientX, a: phase, moved: false };
        }}
        onPointerMove={(e) => {
          if (!draggingRef.current) return;
          const dx = e.clientX - draggingRef.current.x;
          if (Math.abs(dx) > 4) {
            draggingRef.current.moved = true;
            // Dragging right pushes phase back so cards move with the finger.
            setPhase(draggingRef.current.a - dx / slotStep);
          }
        }}
        onPointerUp={() => { draggingRef.current = null; }}
      >
        {/* Soft edge gradients so cards fade in/out at the ends */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10"
          style={{ background: "linear-gradient(to right, rgba(0,0,0,0.7), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10"
          style={{ background: "linear-gradient(to left, rgba(0,0,0,0.7), transparent)" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative"
            style={{
              width: 1,
              height: 1,
              transformStyle: "preserve-3d",
              transform: "rotateX(6deg)",
            }}
          >
            {(() => {
              const base = Math.floor(phase);
              const frac = phase - base; // 0..1
              const slots: JSX.Element[] = [];
              // Render 2 extra slots outside on each side for smooth entry/exit.
              for (let k = -2; k < VISIBLE_SLOTS + 2; k++) {
                const idx = ((base + k) % count + count) % count;
                const m = catalogue[idx];
                if (!m) continue;
                // localPos: continuous position 0..1 across the strip.
                const localPos = (k - frac) / (VISIBLE_SLOTS - 1);
                const x = (localPos - 0.5) * helixWidth;
                // Two full spiral turns across the visible strip.
                const theta = localPos * Math.PI * 4;
                const y = Math.sin(theta) * helixRadius * 0.5;
                const z = Math.cos(theta) * helixRadius;
                const depth = (z + helixRadius) / (helixRadius * 2); // 0..1
                const scale = 0.85 + depth * 0.35;
                const opacity =
                  localPos < 0 || localPos > 1
                    ? Math.max(0, 1 - Math.min(Math.abs(localPos), Math.abs(localPos - 1)) * 3)
                    : 1;
                const isActive = current?.ytId === m.ytId;
                slots.push(
                  <button
                    key={`slot-${k}-${m.ytId}`}
                    onClick={(e) => {
                    if (draggingRef.current?.moved) return;
                    e.stopPropagation();
                    onSelect(m);
                  }}
                    title={m.title}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{
                      width: 78,
                      height: 112,
                      transform: `translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`,
                      opacity,
                      zIndex: Math.round(depth * 1000),
                    }}
                  >
                    <div
                      className="w-full h-full rounded-md overflow-hidden border transition-transform group-hover:scale-125"
                      style={{
                        borderColor: isActive ? "#f0abfc" : "rgba(255,255,255,0.18)",
                        boxShadow: isActive
                          ? "0 0 22px rgba(240,171,252,0.95), 0 8px 20px rgba(0,0,0,0.7)"
                          : "0 8px 18px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06) inset",
                      }}
                    >
                      {m.cover ? (
                        <img
                          src={m.cover}
                          alt=""
                          loading="lazy"
                          draggable={false}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5" />
                      )}
                    </div>
                  </button>,
                );
              }
              return slots;
            })()}
          </div>
        </div>

        <div className="absolute top-1 left-3 text-[10px] uppercase tracking-widest text-white/60">
          {items.length} bandes-annonces · aléatoire non-répété
        </div>
        <div className="absolute top-1 right-3 text-[10px] uppercase tracking-widest text-white/40">
          glisser pour tourner · tablette redimensionnable (coin bas-droit)
        </div>
      </div>
    </div>
  );
}
