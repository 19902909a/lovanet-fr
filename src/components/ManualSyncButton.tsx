import { useState } from "react";
import { RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type Platform = "youtube" | "tiktok" | "prime" | "all";

type Props = {
  /** Which sync edge functions to trigger. */
  platform?: Platform;
  /** Optional label override. */
  label?: string;
  /** Called after the sync attempt completes (success or error) so the page can refresh. */
  onDone?: () => void;
  /** Fixed floating position (default) or inline. */
  variant?: "floating" | "inline";
  className?: string;
};

/**
 * Bouton universel de synchronisation manuelle.
 * Déclenche les edge functions de sync côté plateforme au cas où l'auto-sync
 * n'aurait pas remonté les dernières vidéos publiées.
 */
export const ManualSyncButton = ({
  platform = "all",
  label = "Sync manuel",
  onDone,
  variant = "floating",
  className,
}: Props) => {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState<string>("");

  const run = async () => {
    if (state === "loading") return;
    setState("loading");
    setMsg("");
    try {
      const jobs: Promise<any>[] = [];
      if (platform === "youtube" || platform === "all") {
        jobs.push(supabase.functions.invoke("youtube-anime-sync", { body: { source: "manual-page" } }));
      }
      if (platform === "tiktok" || platform === "prime" || platform === "all" || platform === "youtube") {
        // sync-videos aggregates TikTok / Prime / cross-platform imports
        jobs.push(supabase.functions.invoke("sync-videos", { body: { source: "manual-page", platform } }));
      }
      const results = await Promise.allSettled(jobs);
      const failed = results.filter((r) => r.status === "rejected" || (r.status === "fulfilled" && (r.value as any)?.error));
      if (failed.length && failed.length === results.length) {
        setState("error");
        setMsg("Sync échouée");
      } else {
        setState("done");
        setMsg(failed.length ? "Sync partielle" : "Sync OK");
      }
      onDone?.();
    } catch (e) {
      console.error("ManualSyncButton failed", e);
      setState("error");
      setMsg("Erreur réseau");
    } finally {
      setTimeout(() => setState((s) => (s === "loading" ? s : "idle")), 3200);
    }
  };

  const Icon =
    state === "done" ? CheckCircle2 : state === "error" ? AlertTriangle : RefreshCw;
  const tone =
    state === "done"
      ? "bg-emerald-500/90 hover:bg-emerald-500 text-white"
      : state === "error"
      ? "bg-red-500/90 hover:bg-red-500 text-white"
      : "bg-black/80 hover:bg-black text-white dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-md border border-white/15";

  return (
    <button
      type="button"
      onClick={run}
      disabled={state === "loading"}
      aria-label="Lancer une synchronisation manuelle"
      title="Force la remontée des dernières vidéos publiées"
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-lg transition-all",
        variant === "floating" && "fixed bottom-5 right-5 z-[70]",
        tone,
        state === "loading" && "opacity-90",
        className,
      )}
    >
      <Icon className={cn("w-4 h-4", state === "loading" && "animate-spin")} />
      <span>{state === "loading" ? "Sync en cours…" : msg || label}</span>
    </button>
  );
};

export default ManualSyncButton;