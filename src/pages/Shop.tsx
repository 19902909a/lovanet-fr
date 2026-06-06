import { PageShell } from "@/components/PageShell";
import { products } from "@/data/videos";
import { Button } from "@/components/ui/button";

const Shop = () => (
  <PageShell>
    <section className="container mx-auto px-4 lg:px-8 py-16 text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-primary mb-2">Shop creator</p>
      <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-3">
        <span className="gradient-text">Boutique Anime</span>
      </h1>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Produits YouTube & TikTok à venir — drops manga, figurines et posters exclusifs Lovanet.
      </p>
    </section>

    <section className="container mx-auto px-4 lg:px-8 pb-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((p) => (
        <article key={p.id} className="rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/60 transition-all group">
          <div className="aspect-[4/3] flex items-center justify-center text-8xl bg-gradient-to-br from-primary/15 via-card to-card group-hover:scale-105 transition-transform duration-500">
            {p.emoji}
          </div>
          <div className="p-5">
            <span className="inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/15 text-primary mb-2">{p.tag}</span>
            <h3 className="font-display font-bold text-lg">{p.name}</h3>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted-foreground">Bientôt disponible</span>
              <Button size="sm" variant="outline" className="rounded-full">Notifie-moi</Button>
            </div>
          </div>
        </article>
      ))}
    </section>
  </PageShell>
);

export default Shop;