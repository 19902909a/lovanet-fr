import { motion } from "framer-motion";
import { AlbumCard } from "./AlbumCard";
import { albums } from "@/data/albums";
import { Link } from "react-router-dom";

export const CatalogSection = () => {
  const displayAlbums = albums.slice(0, 6);

  return (
    <section id="catalog" className="py-24 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full glass text-sm font-medium tracking-wider mb-4 text-primary">
            ✨ NOUVEAUTÉS
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Albums Populaires</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre sélection des meilleures productions électroniques du moment
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayAlbums.map((album, index) => (
            <AlbumCard
              key={album.id}
              id={album.id}
              title={album.title}
              artist={album.artist}
              price={album.price}
              imageUrl={album.imageUrl}
              index={index}
            />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link to="/catalog">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-primary/50 text-primary font-display tracking-wider hover:bg-primary/10 hover:border-primary transition-all duration-300"
            >
              Voir tout le catalogue
              <span className="text-xl">→</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};