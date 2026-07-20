import { useEffect, useState } from "react";

/**
 * Cycles a nav item through a shared pool of destinations every `intervalMs`.
 * Each nav slot starts at a different offset so the labels feel alive but
 * every destination remains reachable within one full rotation.
 */
export type NavRotation = { to: string; label: string };

export function useCyclingNav(pool: NavRotation[], offset: number, intervalMs = 10000) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return pool[(offset + tick) % pool.length];
}