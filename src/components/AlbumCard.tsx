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

export const AlbumCard = ({ title, artist, price, imageUrl, index }: AlbumCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-3xl bg-card shadow-ios-md transition-all duration-300 hover:shadow-ios-lg hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Play button */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1 }}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <Button 
              variant="ios" 
              size="icon" 
              className="w-14 h-14 rounded-full shadow-ios-lg"
            >
              <Play className="w-6 h-6 ml-0.5" />
            </Button>
          </motion.div>

          {/* Like button */}
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-ios-sm">
            <Heart className="w-5 h-5 text-ios-red" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-1 truncate text-foreground">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4">{artist}</p>
          
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-primary">
              {price.toFixed(2)}€
            </div>
            <Button variant="ios-secondary" size="sm" className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              Ajouter
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
