import { PageShell } from "@/components/PageShell";
import { Sparkles } from "lucide-react";

const Nlounq = () => (
  <PageShell>
    <section className="container mx-auto px-4 lg:px-8 py-24 text-center">
      <div className="tilt-card holo-card w-16 h-16 mx-auto rounded-2xl bg-primary/15 text-primary flex items-center justify-center mb-6">
        <Sparkles className="w-7 h-7" />
      </div>
      <p className="text-xs uppercase tracking-[0.25em] text-primary mb-2">Mention officielle</p>
      <h1 className="font-display text-6xl sm:text-7xl font-extrabold text-glow-cyan text-primary mb-4">NLOUNQ</h1>
      <p className="text-muted-foreground max-w-xl mx-auto">
        NLOUNQ est la signature créative de Lovanet — un label dédié aux contenus anime premium,
        aux drops exclusifs et aux expériences immersives multi-plateformes.
      </p>
    </section>
  </PageShell>
);

export default Nlounq;