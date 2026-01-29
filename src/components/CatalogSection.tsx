import { motion } from "framer-motion";
import { AlbumCard } from "./AlbumCard";
import { Sparkles } from "lucide-react";

const albums = [
  {
    title: "Neon Dreams",
    artist: "CyberPulse",
    price: 19.99,
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop",
  },
  {
    title: "Digital Horizon",
    artist: "SynthMaster",
    price: 24.99,
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop",
  },
  {
    title: "Future Bass Vol.1",
    artist: "ElectroByte",
    price: 14.99,
    imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&h=500&fit=crop",
  },
  {
    title: "Midnight Drive",
    artist: "RetroWave",
    price: 29.99,
    imageUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=500&h=500&fit=crop",
  },
  {
    title: "Electric Soul",
    artist: "VaporDream",
    price: 17.99,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
  },
  {
    title: "Cosmic Journey",
    artist: "StarBeat",
    price: 22.99,
    imageUrl: "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=500&h=500&fit=crop",
  },
];

export const CatalogSection = () => {
  return (
    <section id="catalog" className="py-24 relative">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ios-purple/10 text-ios-purple text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Tendances
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Albums <span className="text-gradient">populaires</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre sélection des meilleurs albums. Qualité premium, téléchargement instantané.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album, index) => (
            <AlbumCard
              key={album.title}
              {...album}
              index={index}
            />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-card shadow-ios-md text-foreground font-semibold hover:shadow-ios-lg transition-all duration-300"
          >
            Voir tout le catalogue
            <span className="text-primary">→</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
