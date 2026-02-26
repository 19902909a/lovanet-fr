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