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

      




















































      
    </section>);

};