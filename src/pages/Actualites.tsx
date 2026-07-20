import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { videos, thumb } from "@/data/videos";

/**
 * News hub. Emits `NewsArticle` JSON-LD for the latest video drops
 * so Google News + Discover can pick up fresh Lovanet content.
 */
export default function Actualites() {
  useEffect(() => {
    document.title = "Actualités anime — Lovanet";
    const desc =
      "Actualités anime, sorties, épisodes et drops : le fil d'actu officiel Lovanet (AnimemomentsAnimeofficiel & Anime.Moments.officiel).";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", "https://lovanet.fr/actualites");
  }, []);

  const articles = useMemo(() => videos.slice(0, 24), []);

  const newsGraph = {
    "@context": "https://schema.org",
    "@graph": articles.map((v) => ({
      "@type": "NewsArticle",
      headline: v.title,
      image: [thumb(v.id)],
      datePublished: v.date ?? "2026-01-01",
      dateModified: v.date ?? "2026-01-01",
      author: {
        "@type": "Organization",
        name: v.channel ?? "AnimemomentsAnimeofficiel",
      },
      publisher: {
        "@type": "Organization",
        name: "Lovanet",
        logo: { "@type": "ImageObject", url: "https://lovanet.fr/favicon.png" },
      },
      mainEntityOfPage: `https://lovanet.fr/actualites#${v.id}`,
      articleSection: v.series ?? "Anime",
      url: `https://www.youtube.com/watch?v=${v.id}`,
    })),
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsGraph) }}
      />
      <article className="container mx-auto px-4 lg:px-8 py-16">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] neon-rgb-text-soft mb-3">
            Fil d'actualité
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight neon-rgb-text">
            Actualités anime Lovanet
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            Sorties d'épisodes, drops YouTube et TikTok, moments cultes et
            annonces manga — mis à jour en continu via les chaînes officielles
            AnimemomentsAnimeofficiel et Anime.Moments.officiel.
          </p>
        </header>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((v) => (
            <li
              key={v.id}
              id={v.id}
              itemScope
              itemType="https://schema.org/NewsArticle"
              className="glass-card rgb-neon p-3 rounded-2xl group hover:-translate-y-0.5 transition-transform"
            >
              <a
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={thumb(v.id)}
                  alt={`${v.title} — ${v.series}`}
                  className="w-full aspect-video object-cover rounded-xl"
                  loading="lazy"
                  itemProp="image"
                />
                <h2
                  itemProp="headline"
                  className="mt-3 font-display text-sm neon-rgb-text line-clamp-2"
                >
                  {v.title}
                </h2>
                <p className="text-[11px] text-white/60 mt-1">
                  <span itemProp="articleSection">{v.series}</span> ·{" "}
                  <time itemProp="datePublished" dateTime={v.date ?? "2026-01-01"}>
                    {v.date ?? "2026"}
                  </time>
                </p>
                <meta itemProp="author" content={v.channel ?? "AnimemomentsAnimeofficiel"} />
                <meta itemProp="url" content={`https://www.youtube.com/watch?v=${v.id}`} />
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-sm text-white/70">
          Retour à la <Link to="/" className="neon-rgb-text underline">page d'accueil</Link>.
        </p>
      </article>
    </PageShell>
  );
}