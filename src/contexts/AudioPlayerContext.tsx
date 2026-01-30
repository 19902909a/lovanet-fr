import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  imageUrl: string;
  price: number;
}

interface AudioPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  queue: Track[];
  playTrack: (track: Track) => void;
  togglePlayPause: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  }
  return context;
};

// Sample audio URLs for demo (royalty-free)
const DEMO_AUDIO_URLS = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
];

export const getAudioUrlForIndex = (index: number) => {
  return DEMO_AUDIO_URLS[index % DEMO_AUDIO_URLS.length];
};

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState<Track[]>([]);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const audio = audioRef.current;

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });

    audio.addEventListener("ended", () => {
      nextTrack();
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const playTrack = useCallback((track: Track) => {
    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.play();
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const setVolume = useCallback((newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setVolumeState(newVolume);
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const nextTrack = useCallback(() => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      setQueue((prev) => prev.slice(1));
      playTrack(nextTrack);
    } else {
      setIsPlaying(false);
    }
  }, [queue, playTrack]);

  const prevTrack = useCallback(() => {
    if (audioRef.current && currentTime > 3) {
      audioRef.current.currentTime = 0;
    }
  }, [currentTime]);

  const addToQueue = useCallback((track: Track) => {
    setQueue((prev) => [...prev, track]);
  }, []);

  const removeFromQueue = useCallback((trackId: string) => {
    setQueue((prev) => prev.filter((t) => t.id !== trackId));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        currentTime,
        duration,
        queue,
        playTrack,
        togglePlayPause,
        setVolume,
        seekTo,
        nextTrack,
        prevTrack,
        addToQueue,
        removeFromQueue,
        clearQueue,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
