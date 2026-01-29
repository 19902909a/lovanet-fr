import { motion } from "framer-motion";
import { Play, Heart, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
interface AlbumCardProps {
  title: string;
  artist: string;
  price: number;
  imageUrl: string;
  index: number;
}
export const AlbumCard = ({
  title,
  artist,
  price,
  imageUrl,
  index
}: AlbumCardProps) => {
  return <motion.div initial={{
    opacity: 0,
    y: 50
  }} whileInView={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5,
    delay: index * 0.1
  }} viewport={{
    once: true
  }} className="group relative">
      <div className="relative overflow-hidden rounded-xl bg-card border border-border/50 transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_hsl(var(--primary)/0.2)]">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Play button */}
          <motion.div initial={{
          scale: 0
        }} whileHover={{
          scale: 1.1
        }} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button variant="neon" size="icon" className="w-16 h-16 rounded-full">
              <Play className="w-8 h-8 ml-1" />
            </Button>
          </motion.div>

          {/* Like button */}
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
            <Heart className="w-5 h-5 text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          
          
          
          <div className="flex items-center justify-between">
            <div className="font-display text-xl font-bold text-primary">
              {price.toFixed(2)}€
            </div>
            <Button variant="glass" size="sm" className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              Ajouter
            </Button>
          </div>
        </div>

        {/* Glow effect on hover */}
        <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10" />
      </div>
    </motion.div>;
};