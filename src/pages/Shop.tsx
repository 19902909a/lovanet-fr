import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Product360Viewer } from "@/components/Product360Viewer";
import { ProductArtwork } from "@/components/ProductArtwork";
import { SHOP_CATEGORIES, SHOP_PRODUCTS, type ShopProduct, type ShopCategory, categoryLabel } from "@/data/shopProducts";
import { Youtube } from "lucide-react";

const SOURCE_LABEL: Record<ShopProduct["source"], string> = {
  youtube: "YouTube drop",
  tiktok: "TikTok drop",
  both: "YouTube + TikTok",
};

const Shop = () => {
  const [filter, setFilter] = useState<ShopCategory | "all">("all");
  const [active, setActive] = useState<ShopProduct | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? SHOP_PRODUCTS : SHOP_PRODUCTS.filter((p) => p.category === filter)),
    [filter]
  );

  // SEO: emit ItemList + Product JSON-LD so search engines identify each
  // product (name, description, price, image, brand) on the shop page.
  useEffect(() => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://lovanet.fr";
    const ld = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Boutique AnimemomentsAnimeofficiel",
      itemListElement: SHOP_PRODUCTS.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          "@id": `${origin}/shop#${p.id}`,
          sku: p.id,
          name: p.name,
          description: p.description,
          category: categoryLabel(p.category),
          brand: { "@type": "Brand", name: "AnimemomentsAnimeofficiel" },
          image: `${origin}/og-product-${p.id}.svg`,
          offers: {
            "@type": "Offer",
            priceCurrency: "EUR",
            price: p.price.toFixed(2),
            availability: "https://schema.org/InStock",
            url: `${origin}/shop#${p.id}`,
          },
        },
      })),
    };
    const tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.id = "shop-itemlist-jsonld";
    tag.textContent = JSON.stringify(ld);
    const old = document.getElementById("shop-itemlist-jsonld");
    if (old) old.remove();
    document.head.appendChild(tag);

    const prevTitle = document.title;
    document.title = "Boutique AnimemomentsAnimeofficiel — Affiches, Collectors, Vêtements 360°";
    const desc = document.querySelector('meta[name="description"]');
    const prevDesc = desc?.getAttribute("content") ?? "";
    desc?.setAttribute(
      "content",
      `${SHOP_PRODUCTS.length} produits AnimemomentsAnimeofficiel : affiches, collectors, vêtements, chaussures, musique, mangas en rotation 360°.`,
    );
    return () => {
      tag.remove();
      document.title = prevTitle;
      if (desc && prevDesc) desc.setAttribute("content", prevDesc);
    };
  }, []);

  return (
    <PageShell>
      <section className="container mx-auto px-4 lg:px-8 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-primary mb-2">Shop creator · AnimemomentsAnimeofficiel</p>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-3">
          <span className="gradient-text">Boutique Anime 360°</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {SHOP_PRODUCTS.length} produits uniques AnimemomentsAnimeofficiel — affiches, collectors, vêtements,
          chaussures, musique, mangas et objets du quotidien. Chaque visuel est généré individuellement.
          Cliquez un produit pour le faire tourner en 360°.
        </p>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pb-6">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[{ id: "all" as const, label: "Tous" }, ...SHOP_CATEGORIES].map((c) => {
            const isActive = filter === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setFilter(c.id as ShopCategory | "all")}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-all border ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-[0_0_18px_hsl(var(--neon-magenta)/0.55)]"
                    : "bg-card border-border text-muted-foreground hover:text-primary hover:border-primary/50"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pb-16 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((p) => (
          <article
            key={p.id}
            id={p.id}
            itemScope
            itemType="https://schema.org/Product"
            className="tilt-card rounded-2xl overflow-hidden bg-card border border-border transition-all group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            onClick={() => setActive(p)}
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActive(p)}
          >
            <figure className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/15 via-card to-card m-0">
              <div className="absolute inset-0 group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700">
                <ProductArtwork
                  seed={p.id}
                  category={p.category}
                  label={`${p.name} — AnimemomentsAnimeofficiel ${categoryLabel(p.category)}`}
                />
              </div>
              <figcaption className="sr-only" itemProp="image">
                {p.name} — visuel produit AnimemomentsAnimeofficiel
              </figcaption>
              <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-background/70 backdrop-blur text-primary border border-primary/40">
                360°
              </span>
              <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-background/70 backdrop-blur text-foreground/80">
                {categoryLabel(p.category)}
              </span>
            </figure>
            <div className="p-5">
              <span className="inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary mb-2">
                {p.tag}
              </span>
              <h3 className="font-display font-bold text-base leading-snug min-h-[3rem]" itemProp="name">
                {p.name}
              </h3>
              <meta itemProp="sku" content={p.id} />
              <meta itemProp="description" content={p.description} />
              <div className="flex items-center justify-between mt-3">
                <span
                  className="font-display font-bold text-primary"
                  itemProp="offers"
                  itemScope
                  itemType="https://schema.org/Offer"
                >
                  <span itemProp="price" content={p.price.toFixed(2)}>
                    {p.price}
                  </span>{" "}
                  <span itemProp="priceCurrency" content="EUR">€</span>
                </span>
                <Button size="sm" variant="outline" className="rounded-full">
                  Voir 360°
                </Button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-3xl">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">{active.name}</DialogTitle>
                <DialogDescription className="flex flex-wrap gap-2 items-center pt-1">
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                    {categoryLabel(active.category)}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary text-foreground/80 inline-flex items-center gap-1">
                    <Youtube className="w-3 h-3" /> {SOURCE_LABEL[active.source]}
                  </span>
                </DialogDescription>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6">
                <Product360Viewer>
                  <ProductArtwork seed={active.id} category={active.category} label={active.name} />
                </Product360Viewer>
                <div className="flex flex-col">
                  <p className="text-sm text-muted-foreground leading-relaxed">{active.description}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="font-display text-3xl font-extrabold gradient-text">{active.price} €</span>
                    <Button className="rounded-full">Ajouter au panier</Button>
                  </div>
                  <p className="mt-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Référence {active.id} · {active.tag}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
};

export default Shop;