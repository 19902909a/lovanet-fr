import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ListMusic, X } from "lucide-react";
import { useAudioPlayer } from "@/contexts/AudioPlayerContext";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { useState } from "react";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const AudioPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    queue,
    togglePlayPause,
    setVolume,
    seekTo,
    nextTrack,
    prevTrack,
    removeFromQueue,
  } = useAudioPlayer();

  const [showQueue, setShowQueue] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);

  const handleMuteToggle = () => {
    if (isMuted) {
      setVolume(prevVolume);
    } else {
      setPrevVolume(volume);
      setVolume(0);
    }
    setIsMuted(!isMuted);
  };

  if (!currentTrack) return null;

  return (
    <>
      {/* Queue Panel */}
      <AnimatePresence>
        {showQueue && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-4 w-80 max-h-96 glass rounded-xl overflow-hidden z-50"
          >
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold">File d'attente</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowQueue(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="max-h-64 overflow-y-auto p-2 space-y-2">
              {queue.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">
                  La file d'attente est vide
                </p>
              ) : (
                queue.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-card/50 transition-colors"
                  >
                    <img
                      src={track.imageUrl}
                      alt={track.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{track.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={() => removeFromQueue(track.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player Bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-0 left-0 right-0 glass border-t border-border/50 z-40"
      >
        <div className="container mx-auto px-4">
          {/* Progress bar */}
          <div className="py-1">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={([value]) => seekTo(value)}
              className="h-1"
            />
          </div>

          <div className="flex items-center justify-between py-3">
            {/* Track Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <motion.img
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
                src={currentTrack.imageUrl}
                alt={currentTrack.title}
                className="w-14 h-14 rounded-lg object-cover shadow-lg"
              />
              <div className="min-w-0">
                <h4 className="font-display text-sm font-semibold truncate text-glow-cyan">
                  {currentTrack.title}
                </h4>
                <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground hidden sm:block">
                {formatTime(currentTime)}
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevTrack}
                  className="hover:text-primary"
                >
                  <SkipBack className="w-5 h-5" />
                </Button>

                <Button
                  variant="neon"
                  size="icon"
                  onClick={togglePlayPause}
                  className="w-12 h-12 rounded-full"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-0.5" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextTrack}
                  className="hover:text-primary"
                >
                  <SkipForward className="w-5 h-5" />
                </Button>
              </div>

              <span className="text-xs text-muted-foreground hidden sm:block">
                {formatTime(duration)}
              </span>
            </div>

            {/* Volume & Queue */}
            <div className="flex items-center gap-4 flex-1 justify-end">
              <div className="hidden md:flex items-center gap-2 w-32">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleMuteToggle}
                  className="shrink-0"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>
                <Slider
                  value={[volume]}
                  max={1}
                  step={0.01}
                  onValueChange={([value]) => {
                    setVolume(value);
                    setIsMuted(false);
                  }}
                  className="w-20"
                />
              </div>

              <Button
                variant={showQueue ? "neon" : "ghost"}
                size="icon"
                onClick={() => setShowQueue(!showQueue)}
                className="relative"
              >
                <ListMusic className="w-5 h-5" />
                {queue.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full text-xs flex items-center justify-center">
                    {queue.length}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
