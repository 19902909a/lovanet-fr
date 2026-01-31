import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Upload,
  X,
  Music,
  Video,
  Image as ImageIcon,
  FileText,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";

interface MediaFile {
  id: string;
  name: string;
  type: "audio" | "video" | "image" | "document";
  url: string;
  file: File;
}

export const MediaPlayer = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [currentFile, setCurrentFile] = useState<MediaFile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getFileType = (file: File): MediaFile["type"] => {
    if (file.type.startsWith("audio/")) return "audio";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("image/")) return "image";
    return "document";
  };

  const handleFileUpload = useCallback((uploadedFiles: FileList | null) => {
    if (!uploadedFiles) return;

    const newFiles: MediaFile[] = Array.from(uploadedFiles).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: getFileType(file),
      url: URL.createObjectURL(file),
      file,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    if (!currentFile && newFiles.length > 0) {
      setCurrentFile(newFiles[0]);
    }
  }, [currentFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const playFile = (file: MediaFile) => {
    setCurrentFile(file);
    setIsPlaying(true);
    setTimeout(() => {
      if (file.type === "audio" && audioRef.current) {
        audioRef.current.play();
      } else if (file.type === "video" && videoRef.current) {
        videoRef.current.play();
      }
    }, 100);
  };

  const togglePlayPause = () => {
    const media = currentFile?.type === "video" ? videoRef.current : audioRef.current;
    if (media) {
      if (isPlaying) {
        media.pause();
      } else {
        media.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement | HTMLVideoElement>) => {
    setCurrentTime(e.currentTarget.currentTime);
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement | HTMLVideoElement>) => {
    setDuration(e.currentTarget.duration);
  };

  const handleSeek = (value: number[]) => {
    const media = currentFile?.type === "video" ? videoRef.current : audioRef.current;
    if (media) {
      media.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    if (audioRef.current) audioRef.current.volume = newVolume;
    if (videoRef.current) videoRef.current.volume = newVolume;
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    
    const vol = newMuted ? 0 : volume;
    if (audioRef.current) audioRef.current.volume = vol;
    if (videoRef.current) videoRef.current.volume = vol;
  };

  const removeFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      URL.revokeObjectURL(file.url);
    }
    setFiles(files.filter(f => f.id !== id));
    if (currentFile?.id === id) {
      setCurrentFile(null);
      setIsPlaying(false);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getFileIcon = (type: MediaFile["type"]) => {
    switch (type) {
      case "audio": return <Music className="w-5 h-5" />;
      case "video": return <Video className="w-5 h-5" />;
      case "image": return <ImageIcon className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const nextFile = () => {
    if (!currentFile || files.length <= 1) return;
    const currentIndex = files.findIndex(f => f.id === currentFile.id);
    const nextIndex = (currentIndex + 1) % files.length;
    playFile(files[nextIndex]);
  };

  const prevFile = () => {
    if (!currentFile || files.length <= 1) return;
    const currentIndex = files.findIndex(f => f.id === currentFile.id);
    const prevIndex = (currentIndex - 1 + files.length) % files.length;
    playFile(files[prevIndex]);
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-glow-blue">
          Lecteur Multimédia
        </h2>
        <div className="flex gap-2">
          <Button
            variant="glass"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Importer
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="audio/*,video/*,image/*,.pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
        </div>
      </div>

      {/* Drop Zone / Preview Area */}
      <div
        className={`relative min-h-[300px] transition-colors ${
          isDragging ? "bg-primary/20" : ""
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <AnimatePresence mode="wait">
          {currentFile ? (
            <motion.div
              key={currentFile.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full min-h-[300px] flex items-center justify-center p-4"
            >
              {currentFile.type === "audio" && (
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: isPlaying ? 360 : 0 }}
                    transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
                    className="w-48 h-48 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center box-glow-blue"
                  >
                    <Music className="w-20 h-20 text-primary-foreground" />
                  </motion.div>
                  <h3 className="font-display text-xl font-semibold">{currentFile.name}</h3>
                  <audio
                    ref={audioRef}
                    src={currentFile.url}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={nextFile}
                  />
                </div>
              )}

              {currentFile.type === "video" && (
                <div className="relative w-full max-w-4xl">
                  <video
                    ref={videoRef}
                    src={currentFile.url}
                    className="w-full rounded-lg"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={nextFile}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? <Minimize2 /> : <Maximize2 />}
                  </Button>
                </div>
              )}

              {currentFile.type === "image" && (
                <div className="relative">
                  <img
                    src={currentFile.url}
                    alt={currentFile.name}
                    className="max-h-[500px] rounded-lg object-contain"
                  />
                  <p className="text-center mt-4 font-medium">{currentFile.name}</p>
                </div>
              )}

              {currentFile.type === "document" && (
                <div className="text-center p-8">
                  <FileText className="w-24 h-24 mx-auto mb-4 text-primary" />
                  <h3 className="font-display text-xl font-semibold mb-2">{currentFile.name}</h3>
                  <Button variant="neon" onClick={() => window.open(currentFile.url, "_blank")}>
                    Ouvrir le document
                  </Button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[300px] text-center p-8"
            >
              <Upload className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">
                Glissez-déposez vos fichiers ici
              </p>
              <p className="text-muted-foreground text-sm">
                Audio, Vidéo, Images, Documents supportés
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center border-2 border-dashed border-primary rounded-lg m-4"
          >
            <p className="text-xl font-display font-semibold text-glow-blue">
              Déposez vos fichiers ici
            </p>
          </motion.div>
        )}
      </div>

      {/* Controls for audio/video */}
      {currentFile && (currentFile.type === "audio" || currentFile.type === "video") && (
        <div className="p-4 border-t border-border/50">
          {/* Progress bar */}
          <div className="mb-4">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={prevFile}>
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button
                variant="neon"
                size="icon"
                className="w-12 h-12 rounded-full"
                onClick={togglePlayPause}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={nextFile}>
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-24"
              />
            </div>
          </div>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="p-4 border-t border-border/50 max-h-48 overflow-y-auto">
          <h3 className="font-display text-sm font-semibold mb-3">Bibliothèque ({files.length})</h3>
          <div className="space-y-2">
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  currentFile?.id === file.id
                    ? "bg-primary/20 border border-primary/30"
                    : "bg-card/50 hover:bg-card"
                }`}
                onClick={() => playFile(file)}
              >
                <div className="text-primary">{getFileIcon(file.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{file.type}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
