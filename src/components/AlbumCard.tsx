import { motion } from "framer-motion";
import { Play, Pause, Heart, ShoppingCart, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useAudioPlayer, Track, getAudioUrlForIndex } from "@/contexts/AudioPlayerContext";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { toast } from "sonner";

interface AlbumCardProps {
  title: string;
  artist: string;
  price: number;
  imageUrl: string;
  index: number;
  id?: string;
}

export const AlbumCard = ({
  title,
  artist,
  price,
  imageUrl,
  index,
  id
}: AlbumCardProps) => {
  const { playTrack, currentTrack, isPlaying, togglePlayPause, addToQueue } = useAudioPlayer();
  const { addToCart, isInCart } = useCart();
  const [isLiked, setIsLiked] = useState(false);

  const trackId = id || `album-${index}`;
  const isCurrentTrack = currentTrack?.id === trackId;

  const track: Track = {
    id: trackId,
    title,
    artist,
    duration: 240 + index * 30,
    audioUrl: getAudioUrlForIndex(index),
    imageUrl,
    price
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentTrack) {
      togglePlayPause();
    } else {
      playTrack(track);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(track);
    toast.success(`${title} ajouté au panier!`);
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(track);
    toast.success(`${title} ajouté à la file d'attente`);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Retiré des favoris" : "Ajouté aux favoris");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative">

      <div className="relative overflow-hidden rounded-xl bg-card border border-border/50 transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_hsl(var(--primary)/0.2)]">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          





          {/* Overlay */}
          

          {/* Play button */}
          <motion.div
            initial={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">

            <Button
              variant="neon"
              size="icon"
              className="w-16 h-16 rounded-full"
              onClick={handlePlay}>

              {isCurrentTrack && isPlaying ?
              <Pause className="w-8 h-8" /> :

              <Play className="w-8 h-8 ml-1" />
              }
            </Button>
          </motion.div>

          {/* Queue button */}
          <button
            onClick={handleAddToQueue}
            className="absolute top-4 left-4 w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">

            <Plus className="w-5 h-5 text-primary" />
          </button>

          {/* Like button */}
          <button
            onClick={handleLike}
            className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">

            <Heart
              className={`w-5 h-5 ${isLiked ? "text-secondary fill-secondary" : "text-secondary"}`} />

          </button>

          {/* Now Playing Indicator */}
          {isCurrentTrack &&
          <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center gap-2">
              <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-primary-foreground" />

              En lecture
            </div>
          }
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-display font-semibold truncate mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground truncate mb-3">{artist}</p>

          <div className="flex items-center justify-between">
            <div className="font-display text-xl font-bold text-primary">
              {price.toFixed(2)}€
            </div>
            <Button
              variant={isInCart(trackId) ? "neon" : "glass"}
              size="sm"
              className="gap-2"
              onClick={handleAddToCart}>

              <ShoppingCart className="w-4 h-4" />
              {isInCart(trackId) ? "Ajouté" : "Ajouter"}
            </Button>
          </div>
        </div>

        {/* Glow effect on hover */}
        <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10" />
      </div>
    </motion.div>);

};