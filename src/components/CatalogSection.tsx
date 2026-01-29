import { motion } from "framer-motion";
import { AlbumCard } from "./AlbumCard";
const albums = [{
  title: "Neon Dreams",
  artist: "CyberPulse",
  price: 19.99,
  imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop"
}, {
  title: "Digital Horizon",
  artist: "SynthMaster",
  price: 24.99,
  imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop"
}, {
  title: "Future Bass Vol.1",
  artist: "ElectroByte",
  price: 14.99,
  imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&h=500&fit=crop"
}, {
  title: "Midnight Drive",
  artist: "RetroWave",
  price: 29.99,
  imageUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=500&h=500&fit=crop"
}, {
  title: "Electric Soul",
  artist: "VaporDream",
  price: 17.99,
  imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
}, {
  title: "Cosmic Journey",
  artist: "StarBeat",
  price: 22.99,
  imageUrl: "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=500&h=500&fit=crop"
}];
export const CatalogSection = () => {
  return <section id="catalog" className="py-24 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass text-secondary text-sm font-medium tracking-wider mb-4">
            ✨ CATALOGUE
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text text-primary bg-primary">Albums Populaires</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
                                              Sélection titre .    
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album, index) => <AlbumCard key={album.title} {...album} index={index} />)}
        </div>

        {/* View All Button */}
        <motion.div initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true
      }} transition={{
        delay: 0.5
      }} className="text-center mt-12">
          <motion.button whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-primary/50 text-primary font-display tracking-wider hover:bg-primary/10 hover:border-primary transition-all duration-300">
            Voir tout le catalogue
            <span className="text-xl">→</span>
          </motion.button>
        </motion.div>
      </div>
    </section>;
};