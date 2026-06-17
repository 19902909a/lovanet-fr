import { useEffect, useRef, useState } from "react";
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
    if (kind === "youtube" || list.length <= 1) return;
    const t = setInterval(() => setI((x) => (x + 1) % list.length), rotateMs);
    return () => clearInterval(t);
  }, [kind, list.length, rotateMs]);

  if (!list.length) return null;

  if (kind === "youtube") {
    const playlist = list.join(",");
    const first = list[0];
    const src = `https://www.youtube.com/embed/${first}?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&playsinline=1&rel=0&playlist=${playlist}`;
    return (
      <iframe
        key={playlist}
        src={src}
        title="Mini preview"
        className={"w-full h-full pointer-events-none " + className}
        allow="autoplay; encrypted-media; picture-in-picture"
        loading="lazy"
      />
    );
  }

  if (kind === "tiktok") {
    const id = list[i];
    return (
      <iframe
        key={id}
        src={`https://www.tiktok.com/player/v1/${id}?autoplay=1&muted=1&controls=0&loop=1&rel=0&description=0&music_info=0`}
        title="TikTok preview"
        className={"w-full h-full pointer-events-none " + className}
        allow="autoplay; encrypted-media"
        loading="lazy"
      />
    );
  }

  // mp4
  const src = list[i];
  return (
    <video
      ref={videoRef}
      key={src}
      src={src}
      autoPlay
      muted
      loop={list.length === 1}
      playsInline
      onEnded={() => setI((x) => (x + 1) % list.length)}
      className={"w-full h-full object-cover pointer-events-none " + className}
    />
  );
};
