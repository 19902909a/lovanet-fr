import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Kind = "youtube" | "tiktok" | "mp4";

type Props = {
  kind: Kind;
  /** YouTube/TikTok IDs OR mp4 URLs. Cycled in order with auto-advance. */
  sources: string[];
  /** Auto-advance interval in ms (used for tiktok/mp4 fallback). */
  rotateMs?: number;
  className?: string;
  /** For tiktok, fetch latest TikTok IDs from imported_videos. */
  loadTiktokFromDB?: boolean;
};

export const MiniPreviewPlayer = ({
  kind,
  sources,
  rotateMs = 12000,
  className = "",
  loadTiktokFromDB,
}: Props) => {
  const [list, setList] = useState<string[]>(sources);
  const [i, setI] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState<boolean>(
    typeof document === "undefined" ? true : !document.hidden
  );

  // Detect constrained devices: only render one preview at a time.
  const constrained = useMemo(() => {
    if (typeof window === "undefined") return false;
    const coarse = window.matchMedia?.("(pointer: coarse)").matches;
    const small = window.innerWidth < 1024;
    const dm = (navigator as any).deviceMemory ?? 8;
    return coarse || small || dm < 4;
  }, []);

  // IntersectionObserver — only mount heavy iframe/video when visible.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setInView(e.isIntersecting);
      },
      { rootMargin: "100px", threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onVis = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (!loadTiktokFromDB) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("imported_videos")
        .select("external_id")
        .eq("source", "tiktok")
        .order("published_at", { ascending: false })
        .limit(20);
      if (cancelled || !data?.length) return;
      const ids = data.map((r: any) => r.external_id).filter(Boolean);
      if (ids.length) setList(ids);
    })();
    return () => { cancelled = true; };
  }, [loadTiktokFromDB]);

  // Auto-rotate for tiktok & mp4 (YouTube uses native playlist param)
  useEffect(() => {
    if (kind === "youtube" || list.length <= 1 || !inView || !tabVisible) return;
    const t = setInterval(() => setI((x) => (x + 1) % list.length), rotateMs);
    return () => clearInterval(t);
  }, [kind, list.length, rotateMs, inView, tabVisible]);

  if (!list.length) return null;

  const active = inView && tabVisible;
  const poster = (
    <div className="w-full h-full bg-gradient-to-br from-black via-zinc-900 to-zinc-800 flex items-center justify-center text-white/40 text-xs">
      ◉
    </div>
  );

  if (kind === "youtube") {
    const playlist = list.join(",");
    const first = list[0];
    const src = `https://www.youtube-nocookie.com/embed/${first}?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&playsinline=1&rel=0&playlist=${playlist}`;
    return (
      <div ref={wrapRef} className={"w-full h-full " + className}>
        {active ? (
          <iframe
            key={playlist}
            src={src}
            title="Mini preview"
            className="w-full h-full pointer-events-none"
            allow="autoplay; encrypted-media; picture-in-picture"
            loading="lazy"
          />
        ) : poster}
      </div>
    );
  }

  if (kind === "tiktok") {
    const id = list[i];
    return (
      <div ref={wrapRef} className={"w-full h-full " + className}>
        {active ? (
          <iframe
            key={id}
            src={`https://www.tiktok.com/player/v1/${id}?autoplay=1&muted=1&controls=0&loop=1&rel=0&description=0&music_info=0`}
            title="TikTok preview"
            className="w-full h-full pointer-events-none"
            allow="autoplay; encrypted-media"
            loading="lazy"
          />
        ) : poster}
      </div>
    );
  }

  // mp4
  const src = list[i];
  return (
    <div ref={wrapRef} className={"w-full h-full " + className}>
      {active ? (
        <video
          ref={videoRef}
          key={src}
          src={src}
          autoPlay
          muted
          loop={list.length === 1}
          playsInline
          preload={constrained ? "metadata" : "auto"}
          onEnded={() => setI((x) => (x + 1) % list.length)}
          className="w-full h-full object-cover pointer-events-none"
        />
      ) : poster}
    </div>
  );
};
