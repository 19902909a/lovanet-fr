import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { videos } from "@/data/videos";
import { supabase } from "@/integrations/supabase/client";

const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const ytThumbFallback = (id: string) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;

type WheelVideo = {
  id: string;
  title: string;
  thumb: string;
  source: "youtube" | "tiktok" | "prime";
  url?: string;
};

const SHAPES = [
  "circle(50% at 50% 50%)",
  "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
  "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
  "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
  "polygon(50% 2%, 95% 18%, 90% 65%, 50% 98%, 10% 65%, 5% 18%)",
];

const isConstrainedDevice = () => {
  if (typeof window === "undefined") return false;
  const memory = (navigator as any).deviceMemory ?? 8;
  return window.matchMedia("(pointer: coarse), (max-width: 767px), (prefers-reduced-motion: reduce)").matches || memory < 4;
};

const placeholderThumb = (id: string, title: string) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const h1 = h % 360;
  const h2 = (h1 + 72) % 360;
  const safe = (title || "Anime Moment")
    .replace(/[\uD800-\uDFFF]/g, "")
    .replace(/[\u0000-\u001F\u007F<&>]/g, " ")
    .slice(0, 42);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='hsl(${h1},85%,55%)'/><stop offset='1' stop-color='hsl(${h2},85%,36%)'/></linearGradient></defs>
    <rect width='640' height='360' fill='url(#g)'/><rect width='640' height='360' fill='rgba(0,0,0,.24)'/>
    <text x='50%' y='50%' fill='white' font-family='system-ui,sans-serif' font-size='28' font-weight='800' text-anchor='middle' dominant-baseline='middle'>${safe}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const HeroCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const constrainedRef = useRef(false);
  const pausedRef = useRef(false);
  const dragRef = useRef<{ id: number; startX: number; startY: number; lastX: number; lastY: number; axis: "x" | "y" | null; moved: boolean } | null>(null);

  const [isConstrained, setIsConstrained] = useState(false);
  const [paused, setPaused] = useState(false);
  const [shapeIdx, setShapeIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [size, setSize] = useState({ w: 520, h: 540 });
  const [allVideos, setAllVideos] = useState<WheelVideo[]>(() =>
    videos.map((v) => ({
      id: v.id,
      title: v.title,
      thumb: ytThumb(v.id),
      source: "youtube" as const,
      url: `https://www.youtube.com/watch?v=${v.id}`,
    })),
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(pointer: coarse), (max-width: 767px), (prefers-reduced-motion: reduce)");
    const update = () => {
      const next = isConstrainedDevice();
      constrainedRef.current = next;
      setIsConstrained(next);
    };
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const timer = window.setInterval(() => setShapeIdx((i) => (i + 1) % SHAPES.length), isConstrained ? 18000 : 12000);
    return () => window.clearInterval(timer);
  }, [isConstrained]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("imported_videos")
        .select("external_id, title, thumbnail_url, source, published_at, video_url")
        .order("published_at", { ascending: false })
        .limit(160);
      if (cancelled || error || !data?.length) return;
      const mapped: WheelVideo[] = data
        .map((r) => ({
          id: r.external_id,
          title: r.title ?? "Anime Moment",
          thumb: r.thumbnail_url || (r.source === "youtube" ? ytThumb(r.external_id) : ""),
          source: (r.source as WheelVideo["source"]) ?? "youtube",
          url: r.video_url ?? undefined,
        }))
        .filter((v) => Boolean(v.id));
      const unique = Array.from(new Map(mapped.map((v) => [v.id, v])).values());
      setAllVideos(unique.slice(0, constrainedRef.current ? 48 : 96));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const cache: HTMLImageElement[] = [];
    for (const v of allVideos.slice(0, isConstrained ? 10 : 24)) {
      if (!v.thumb) continue;
      const img = new Image();
      img.decoding = "async";
      img.loading = "eager";
      img.referrerPolicy = "no-referrer";
      img.src = v.thumb;
      cache.push(img);
    }
    return () => {
      cache.length = 0;
    };
  }, [allVideos, isConstrained]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let lastPaint = last;
    const tick = (t: number) => {
      const minFrameMs = constrainedRef.current ? 34 : 17;
      if (t - lastPaint < minFrameMs) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const dt = Math.min(0.08, (t - last) / 1000);
      last = t;
      lastPaint = t;
      if (!pausedRef.current) {
        setProgress((p) => (p + dt / Math.max(22, allVideos.length * 0.85)) % 1);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [allVideos.length]);

  const N = Math.max(1, allVideos.length);
  const visibleRadius = Math.min(isConstrained ? 3 : 5, Math.max(2, Math.floor((N - 1) / 2)));
  const renderedSlots = Math.min(N, visibleRadius * 2 + 3);
  const phase = progress * N;
  const baseSlot = Math.floor(phase);
  const fractional = phase - baseSlot;

  const geometry = useMemo(() => {
    const centerX = size.w * 0.5;
    const centerY = size.h * (isConstrained ? 0.48 : 0.42);
    const radius = Math.max(isConstrained ? 138 : 200, Math.min(size.w * (isConstrained ? 0.32 : 0.28), size.h * 0.55));
    const cardW = Math.max(isConstrained ? 200 : 300, Math.min(radius * 1.55, size.w * (isConstrained ? 0.82 : 0.42), isConstrained ? 340 : 560));
    return { centerX, centerY, radius, cardW, cardH: (cardW * 9) / 16 };
  }, [isConstrained, size.h, size.w]);

  const cards = useMemo(() => {
    const used = new Set<number>();
    return Array.from({ length: renderedSlots }, (_, pos) => pos - Math.floor(renderedSlots / 2))
      .map((rel) => {
        const slotIdx = ((baseSlot + rel) % N + N) % N;
        const v = allVideos[slotIdx];
        return { rel, slotIdx, v, offset: rel - fractional };
      })
      .filter((c) => {
        if (!c.v || used.has(c.slotIdx)) return false;
        used.add(c.slotIdx);
        return true;
      });
  }, [N, allVideos, baseSlot, fractional, renderedSlots]);

  const styleFor = useCallback((offset: number): React.CSSProperties => {
    const maxAng = isConstrained ? 52 : 60;
    const clamped = Math.max(-visibleRadius, Math.min(visibleRadius, offset));
    const ang = (clamped / visibleRadius) * maxAng;
    const rad = (ang * Math.PI) / 180;
    const wheelR = Math.max(geometry.radius * 1.28, geometry.cardH * 1.75);
    const y = Math.sin(rad) * wheelR;
    const depth = Math.cos(rad);
    const edgeFade = Math.max(0, 1 - Math.max(0, Math.abs(offset) - (visibleRadius - 0.35)) / 1.6);
    const opacity = Math.abs(offset) <= visibleRadius + 0.65 ? Math.max(isConstrained ? 0.86 : 0.52, depth * edgeFade) : 0;
    const scale = isConstrained ? 0.94 + depth * 0.06 : 0.9 + depth * 0.1;
    // Sophisticated 3D motion: Y-axis fan + gentle roll on Z, deeper cards pushed back
    const rotY = isConstrained ? 0 : Math.max(-38, Math.min(38, offset * -14));
    const rotZ = isConstrained ? 0 : Math.sin(offset * 0.9) * 4;
    const zDepth = isConstrained ? 0 : (depth - 1) * 60; // center card pops forward
    return {
      left: geometry.centerX - geometry.cardW / 2,
      top: geometry.centerY - geometry.cardH / 2,
      width: geometry.cardW,
      aspectRatio: "16 / 9",
      transform: `translate3d(0, ${y}px, ${zDepth}px) rotateX(${-ang}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`,
      transformStyle: "preserve-3d",
      transformOrigin: "center center",
      opacity,
      zIndex: Math.round(100 + (visibleRadius - Math.abs(offset)) * 10),
      pointerEvents: opacity > 0.6 ? "auto" : "none",
      filter: isConstrained ? "none" : "drop-shadow(0 16px 30px hsl(var(--neon-purple) / 0.35))",
    };
  }, [geometry, isConstrained, visibleRadius]);

  const shiftCards = useCallback((direction: 1 | -1) => {
    setProgress((p) => {
      const next = (p + direction / N) % 1;
      return next < 0 ? next + 1 : next;
    });
  }, [N]);

  const cycleHalo = useCallback(() => setShapeIdx((i) => (i + 1) % SHAPES.length), []);

  const onPointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest("a,button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      axis: null,
      moved: false,
    };
    setPaused(true);
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    const dxTotal = e.clientX - d.startX;
    const dyTotal = e.clientY - d.startY;
    if (d.axis === null) {
      if (Math.abs(dxTotal) < 6 && Math.abs(dyTotal) < 6) return;
      d.axis = Math.abs(dxTotal) > Math.abs(dyTotal) ? "x" : "y";
    }
    const dy = e.clientY - d.lastY;
    const dx = e.clientX - d.lastX;
    d.lastY = e.clientY;
    d.lastX = e.clientX;
    d.moved = true;
    const delta = d.axis === "x" ? dx : dy;
    if (Math.abs(delta) < 1) return;
    setProgress((p) => {
      const next = (p - delta / (N * 48)) % 1;
      return next < 0 ? next + 1 : next;
    });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (dragRef.current?.id === e.pointerId) dragRef.current = null;
    setPaused(false);
    setDragging(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      shiftCards(-1);
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      shiftCards(1);
    } else if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      setPaused((p) => !p);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[380px] sm:h-[560px] lg:h-[640px] overflow-hidden touch-pan-y select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-xl ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{ perspective: isConstrained ? 900 : 1400, perspectiveOrigin: "50% 50%" }}
      role="region"
      aria-roledescription="carrousel"
      aria-label="Carrousel de vidéos anime — glissez ou utilisez les flèches pour naviguer"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {allVideos[baseSlot % N]?.title
          ? `Vidéo active : ${allVideos[baseSlot % N].title}`
          : ""}
      </div>

      <button
        type="button"
        aria-label="Changer la forme du halo"
        onClick={cycleHalo}
        className="absolute rounded-full hero-wheel-halo"
        style={{
          width: geometry.radius * 1.9,
          height: geometry.radius * 1.9,
          left: geometry.centerX - geometry.radius * 0.95,
          top: geometry.centerY - geometry.radius * 0.95,
          clipPath: SHAPES[shapeIdx],
          WebkitClipPath: SHAPES[shapeIdx],
          opacity: isConstrained ? 0.4 : 0.72,
        }}
      />

      <div
        aria-hidden
        className="absolute rounded-full pointer-events-none"
        style={{
          width: geometry.radius * 2,
          height: geometry.radius * 2,
          left: geometry.centerX - geometry.radius,
          top: geometry.centerY - geometry.radius,
          border: "1px solid hsl(var(--neon-cyan) / 0.55)",
          boxShadow: "inset 0 0 22px hsl(var(--neon-magenta) / 0.22), 0 0 24px hsl(var(--neon-cyan) / 0.22)",
        }}
      />

      {cards.map((c) => {
        const internalHref =
          c.v.source === "tiktok"
            ? `/tiktok?video=${encodeURIComponent(c.v.id)}`
            : c.v.source === "prime"
              ? `/prime-video?video=${encodeURIComponent(c.v.id)}`
              : `/lecteurs-video?video=${encodeURIComponent(c.v.id)}&service=youtube`;
        const isCenter = Math.abs(c.offset) < 0.5;
        const isActive = activeSlot === c.slotIdx;
        return (
          <Link
            key={`${c.v.id}-${c.slotIdx}`}
            to={internalHref}
            aria-label={`Ouvrir la vidéo : ${c.v.title}`}
            aria-current={isCenter ? "true" : undefined}
            className={`card-3d group absolute rounded-xl ring-1 ring-white/10 hover:z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-transform duration-150 ${isActive ? "scale-[0.97]" : ""}`}
            style={{
              ...styleFor(c.offset),
              transition: isConstrained ? "opacity 0.12s linear" : "opacity 0.12s linear, filter 0.25s ease",
              willChange: "transform, opacity",
              backfaceVisibility: "visible",
              textDecoration: "none",
              cursor: "pointer",
              contain: "layout paint style",
            }}
            onPointerEnter={() => { if (!isConstrained) setPaused(true); }}
            onPointerLeave={() => { if (!isConstrained) setPaused(false); }}
            onPointerDownCapture={() => setActiveSlot(c.slotIdx)}
            onPointerUpCapture={() => setActiveSlot(null)}
            onPointerCancel={() => setActiveSlot(null)}
            onClick={(e) => {
              const d = dragRef.current;
              if (d?.moved) {
                e.preventDefault();
                e.stopPropagation();
                return;
              }
              e.stopPropagation();
            }}
          >
            <div
              className="card-3d-front rgb-frame relative w-full aspect-video overflow-hidden rounded-xl bg-card"
              style={{
                transform: "translateZ(2px)",
                boxShadow: "0 0 0 1px hsl(var(--neon-magenta) / 0.35), 0 18px 36px -18px hsl(var(--neon-purple) / 0.55)",
              }}
            >
              <img
                src={c.v.thumb || placeholderThumb(c.v.id, c.v.title)}
                alt={c.v.title}
                loading={Math.abs(c.offset) <= 1 ? "eager" : "lazy"}
                decoding="async"
                referrerPolicy="no-referrer"
                className="relative z-[1] w-full h-full object-cover opacity-100"
                style={{ backgroundColor: "hsl(var(--card))" }}
                onError={(e) => {
                  const img = e.currentTarget;
                  const step = img.dataset.fb || "0";
                  if (c.v.source === "youtube" && step === "0") {
                    img.dataset.fb = "1";
                    img.src = ytThumbFallback(c.v.id);
                  } else {
                    img.src = placeholderThumb(c.v.id, c.v.title);
                  }
                }}
              />
              <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/80 via-black/15 to-transparent pointer-events-none" />
              <div className="card-3d-gloss absolute inset-0 z-[3] pointer-events-none rounded-xl" />
              <div className="card-3d-edge absolute inset-0 z-[4] pointer-events-none rounded-xl" aria-hidden />
              <div className="absolute bottom-2 left-3 right-3 z-[4]">
                <div className="text-[11px] text-fuchsia-200/90 font-medium">
                  {c.v.source === "tiktok" ? "TikTok" : c.v.source === "prime" ? "Prime Video" : "YouTube"}
                </div>
                <div className="text-xs sm:text-sm font-bold text-white leading-tight line-clamp-2">
                  {c.v.title}
                </div>
              </div>
            </div>
            {!isConstrained && (
              <div className="card-3d-thickness rounded-xl" aria-hidden />
            )}
          </Link>
        );
      })}

      <div className="absolute inset-x-0 bottom-3 z-[120] flex justify-center gap-3 pointer-events-none">
        <button
          type="button"
          aria-label="Carte précédente"
          onClick={() => shiftCards(-1)}
          className="pointer-events-auto h-11 w-11 rounded-full bg-card/80 border border-border text-foreground shadow-lg backdrop-blur-md touch-manipulation"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label={paused ? "Reprendre le défilement" : "Mettre en pause le défilement"}
          onClick={() => setPaused((p) => !p)}
          className="pointer-events-auto h-11 min-w-11 rounded-full px-4 bg-card/80 border border-border text-foreground text-sm font-semibold shadow-lg backdrop-blur-md touch-manipulation"
        >
          {paused ? "▶" : "❚❚"}
        </button>
        <button
          type="button"
          aria-label="Carte suivante"
          onClick={() => shiftCards(1)}
          className="pointer-events-auto h-11 w-11 rounded-full bg-card/80 border border-border text-foreground shadow-lg backdrop-blur-md touch-manipulation"
        >
          ›
        </button>
      </div>
    </div>
  );
};