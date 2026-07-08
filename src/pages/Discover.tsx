import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { SHOP_PRODUCTS, categoryLabel } from "@/data/shopProducts";
import { videos, thumb } from "@/data/videos";
import { ShoppingBag, Youtube, Music2, Play, Film, Calendar, Sparkles } from "lucide-react";

/**
 * /decouvrir — SEO landing page.
 * Purpose: give Google / Bing / image & video search a single,
 * crawlable index of everything Lovanet offers — products with real
 * <img> thumbnails, video previews with VideoObject JSON-LD, and
 * deep links to every section. No filler text.
 */
const Discover = () => {
  const [catalogSeo, setCatalogSeo] = useState<Array<{
    id: number; title: string; summary: string; year: number | null; score: number | null;
    genres: string[]; cover: string | null; banner: string | null; trailerId: string | null; url: string;
  }>>([]);

  useEffect(() => {
    // Load prebuilt catalog SEO index (up to 1500 titles with trailers, covers & synopsis)
    fetch("/catalog-seo.json").then((r) => (r.ok ? r.json() : [])).then(setCatalogSeo).catch(() => setCatalogSeo([]));
  }, []);

  useEffect(() => {
    document.title = "Univers Lovanet — Vidéos, shorts, boutique, animés";
    const meta = (name: string, value: string, prop = false) => {
      const sel = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(sel) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); prop ? el.setAttribute("property", name) : el.setAttribute("name", name); document.head.appendChild(el); }
      el.content = value;
    };
    meta("description", "Anime.Moments.officiel : Lovanet — la plateforme officielle dédiée à l'anime : chaîne YouTube AnimemomentsAnimeofficiel, shorts TikTok Anime.Moments.officiel, Prime Video, animés à venir, catalogue 1500+ titres et boutique collector.");
    meta("og:title", "Univers Lovanet — AnimemomentsAnimeofficiel", true);
    meta("og:url", "https://lovanet.fr/decouvrir", true);
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = "https://lovanet.fr/decouvrir";
  }, []);

  const sections = [
    { to: "/shop", label: "Boutique 360°", desc: `${SHOP_PRODUCTS.length} produits officiels`, icon: ShoppingBag },
    { to: "/chaine-youtube", label: "Chaîne YouTube", desc: "Vidéos longues & shorts", icon: Youtube },
    { to: "/tiktok", label: "TikTok", desc: "Shorts verticaux", icon: Music2 },
    { to: "/prime-video", label: "Prime Video", desc: "Lecture immersive", icon: Play },
    { to: "/lecteurs-video", label: "Lecteur vidéo", desc: "Player anime", icon: Film },
    { to: "/anime-countdown", label: "Animés à venir", desc: "Countdown live", icon: Calendar },
    { to: "/anime-catalog", label: "Catalogue animés", desc: "5000+ titres", icon: Sparkles },
  ];

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Catalogue AnimemomentsAnimeofficiel",
    itemListElement: SHOP_PRODUCTS.slice(0, 76).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.name,
        description: p.description,
        image: `https://lovanet.fr/products/${p.id}.svg`,
        url: `https://lovanet.fr/shop#${p.id}`,
        brand: { "@type": "Brand", name: "AnimemomentsAnimeofficiel" },
        offers: { "@type": "Offer", price: p.price.toFixed(2), priceCurrency: "EUR", availability: "https://schema.org/InStock" },
      },
    })),
  };

  const videoLd = {
    "@context": "https://schema.org",
    "@graph": videos.map((v) => ({
      "@type": "VideoObject",
      name: v.title,
      description: `${v.series} — ${v.channel ?? "AnimemomentsAnimeofficiel"} ${v.episode ?? ""}`.trim(),
      thumbnailUrl: [thumb(v.id)],
      uploadDate: v.date ?? "2026-01-01",
      contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
      embedUrl: `https://www.youtube.com/embed/${v.id}`,
    })),
  };

  // Chunk the catalog JSON-LD (1500 items) into 3 blocks so each script tag stays reasonable.
  const catalogChunks: typeof catalogSeo[] = [];
  const CHUNK = 500;
  for (let i = 0; i < catalogSeo.length; i += CHUNK) catalogChunks.push(catalogSeo.slice(i, i + CHUNK));

  const catalogItemListLd = (chunk: typeof catalogSeo, offset: number) => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Catalogue Lovanet — animés ${offset + 1}–${offset + chunk.length}`,
    itemListElement: chunk.map((it, i) => ({
      "@type": "ListItem",
      position: offset + i + 1,
      item: it.trailerId
        ? {
            "@type": "VideoObject",
            name: `${it.title} — Trailer officiel`,
            description: it.summary || `${it.title} — trailer et fiche complète sur Lovanet.`,
            thumbnailUrl: [it.cover, `https://i.ytimg.com/vi/${it.trailerId}/hqdefault.jpg`].filter(Boolean),
            uploadDate: it.year ? `${it.year}-01-01` : "2020-01-01",
            contentUrl: `https://www.youtube.com/watch?v=${it.trailerId}`,
            embedUrl: `https://www.youtube.com/embed/${it.trailerId}`,
            genre: it.genres,
            url: it.url,
          }
        : {
            "@type": "CreativeWork",
            name: it.title,
            description: it.summary || `${it.title} — fiche complète sur Lovanet.`,
            image: [it.cover, it.banner].filter(Boolean),
            genre: it.genres,
            url: it.url,
            datePublished: it.year ? `${it.year}-01-01` : undefined,
            aggregateRating: it.score
              ? { "@type": "AggregateRating", ratingValue: (it.score / 10).toFixed(1), bestRating: "10", ratingCount: 1 }
              : undefined,
          },
    })),
  });

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }} />
      {catalogChunks.map((chunk, i) => (
        <script
          key={`catalog-ld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogItemListLd(chunk, i * CHUNK)) }}
        />
      ))}

      <section className="container mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-5xl font-display font-bold gradient-text mb-2">
          Univers Lovanet — AnimemomentsAnimeofficiel
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Vidéos · Shorts · Boutique · Animés · Catalogue
        </p>

        <nav aria-label="Sections" className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-12">
          {sections.map((s) => (
            <Link key={s.to} to={s.to} className="group rounded-2xl border border-border bg-card/60 hover:border-primary p-4 transition-all hover:-translate-y-1">
              <s.icon className="w-6 h-6 mb-2 text-primary" />
              <div className="text-sm font-semibold">{s.label}</div>
              <div className="text-[11px] text-muted-foreground">{s.desc}</div>
            </Link>
          ))}
        </nav>

        <h2 className="text-2xl font-display font-bold mb-4">Vidéos & shorts</h2>
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-12" itemScope itemType="https://schema.org/ItemList">
          {videos.map((v, i) => (
            <li key={v.id} itemProp="itemListElement" itemScope itemType="https://schema.org/VideoObject" className="rounded-xl overflow-hidden border border-border bg-card group">
              <meta itemProp="position" content={String(i + 1)} />
              <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener" className="block">
                <img
                  src={thumb(v.id)}
                  alt={`${v.title} — ${v.series}`}
                  loading="lazy"
                  width={480}
                  height={360}
                  itemProp="thumbnailUrl"
                  className="w-full aspect-video object-cover group-hover:scale-105 transition-transform"
                />
                <div className="p-2">
                  <div className="text-xs font-semibold truncate" itemProp="name">{v.title}</div>
                  <div className="text-[10px] text-muted-foreground" itemProp="description">{v.series} · {v.episode}</div>
                </div>
                <meta itemProp="uploadDate" content={v.date ?? "2026-01-01"} />
                <meta itemProp="contentUrl" content={`https://www.youtube.com/watch?v=${v.id}`} />
                <meta itemProp="embedUrl" content={`https://www.youtube.com/embed/${v.id}`} />
              </a>
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-display font-bold mb-4">Boutique — {SHOP_PRODUCTS.length} produits</h2>
        <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {SHOP_PRODUCTS.map((p) => (
            <li key={p.id} itemScope itemType="https://schema.org/Product" className="rounded-xl overflow-hidden border border-border bg-card group">
              <Link to={`/shop#${p.id}`}>
                <img
                  src={`/products/${p.id}.svg`}
                  alt={`${p.name} — ${categoryLabel(p.category)} AnimemomentsAnimeofficiel`}
                  loading="lazy"
                  width={400}
                  height={400}
                  itemProp="image"
                  className="w-full aspect-square object-cover bg-black/30 group-hover:scale-105 transition-transform"
                />
                <div className="p-2">
                  <div className="text-[11px] text-muted-foreground">{categoryLabel(p.category)}</div>
                  <div className="text-xs font-semibold truncate" itemProp="name">{p.name}</div>
                  <div className="text-xs text-primary" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                    <span itemProp="price">{p.price.toFixed(2)}</span> <span itemProp="priceCurrency">EUR</span>
                  </div>
                </div>
                <meta itemProp="description" content={p.description} />
                <link itemProp="url" href={`https://lovanet.fr/shop#${p.id}`} />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
};

export default Discover;