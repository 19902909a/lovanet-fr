import { memo } from "react";
import type { HologramActivity } from "@/data/hologramActivities";

// One reusable holographic figure. Uses shared keyframes declared in
// index.css (holo-motion-run, holo-motion-swim, …) and per-instance CSS
// variables so 100 figures share the same animation code but each looks
// distinct: hue-rotated gradient, unique speed, unique prop, unique décor.

type Props = { activity: HologramActivity };

export const HologramCharacter = memo(function HologramCharacter({ activity }: Props) {
  const { hue, duration, motion, prop, decor, name, id } = activity;
  const style = {
    "--holo-hue": `${hue}`,
    "--holo-hue-2": `${(hue + 60) % 360}`,
    "--holo-duration": `${duration}s`,
  } as React.CSSProperties;
  const gradientId = `holo-grad-${id}`;
  const glowId = `holo-glow-${id}`;

  return (
    <article
      className="holo-card"
      style={style}
      aria-label={`Hologramme ${name}`}
      data-motion={motion}
    >
      <div className="holo-decor" aria-hidden>{decor}</div>
      <div className="holo-scanlines" aria-hidden />
      <div className="holo-pedestal" aria-hidden />
      <div className={`holo-figure holo-motion-${motion}`}>
        <svg viewBox="0 0 100 160" className="holo-svg" aria-hidden>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`hsl(${hue} 100% 70%)`} stopOpacity="0.95" />
              <stop offset="50%" stopColor={`hsl(${(hue + 40) % 360} 100% 55%)`} stopOpacity="0.85" />
              <stop offset="100%" stopColor={`hsl(${(hue + 120) % 360} 100% 50%)`} stopOpacity="0.75" />
            </linearGradient>
            <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="1.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g filter={`url(#${glowId})`} stroke={`url(#${gradientId})`} strokeWidth="3" strokeLinecap="round" fill="none">
            <circle cx="50" cy="26" r="10" fill={`url(#${gradientId})`} fillOpacity="0.35" />
            <line x1="50" y1="36" x2="50" y2="92" className="holo-torso" />
            <line x1="50" y1="48" x2="30" y2="72" className="holo-arm-l" />
            <line x1="50" y1="48" x2="70" y2="72" className="holo-arm-r" />
            <line x1="50" y1="92" x2="34" y2="130" className="holo-leg-l" />
            <line x1="50" y1="92" x2="66" y2="130" className="holo-leg-r" />
          </g>
        </svg>
        <span className="holo-prop" aria-hidden>{prop}</span>
      </div>
      <footer className="holo-caption">
        <span className="holo-index">#{id.toString().padStart(3, "0")}</span>
        <span className="holo-name">{name}</span>
      </footer>
    </article>
  );
});