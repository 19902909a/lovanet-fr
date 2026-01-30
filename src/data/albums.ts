import { Track, getAudioUrlForIndex } from "@/contexts/AudioPlayerContext";

export interface Album {
  id: string;
  title: string;
  artist: string;
  price: number;
  imageUrl: string;
  genre: string;
  releaseYear: number;
  rating: number;
  tracks: Track[];
  description: string;
}

export const albums: Album[] = [
  {
    id: "1",
    title: "Neon Dreams",
    artist: "CyberPulse",
    price: 19.99,
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop",
    genre: "Synthwave",
    releaseYear: 2024,
    rating: 4.8,
    description: "Un voyage électronique à travers les paysages urbains futuristes. Cet album emblématique de CyberPulse capture l'essence de la nuit avec des synthétiseurs rétro-futuristes.",
    tracks: [
      { id: "1-1", title: "Neon Sunrise", artist: "CyberPulse", duration: 245, audioUrl: getAudioUrlForIndex(0), imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop", price: 2.99 },
      { id: "1-2", title: "Digital Love", artist: "CyberPulse", duration: 312, audioUrl: getAudioUrlForIndex(1), imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop", price: 2.99 },
      { id: "1-3", title: "Midnight Drive", artist: "CyberPulse", duration: 278, audioUrl: getAudioUrlForIndex(2), imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop", price: 2.99 },
      { id: "1-4", title: "Electric Dreams", artist: "CyberPulse", duration: 356, audioUrl: getAudioUrlForIndex(3), imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop", price: 2.99 },
    ],
  },
  {
    id: "2",
    title: "Digital Horizon",
    artist: "SynthMaster",
    price: 24.99,
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop",
    genre: "Electronic",
    releaseYear: 2024,
    rating: 4.6,
    description: "SynthMaster repousse les limites de la musique électronique avec des beats hypnotiques et des mélodies envoûtantes qui vous transportent au-delà de l'horizon digital.",
    tracks: [
      { id: "2-1", title: "Horizon Call", artist: "SynthMaster", duration: 298, audioUrl: getAudioUrlForIndex(1), imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop", price: 3.49 },
      { id: "2-2", title: "Binary Stars", artist: "SynthMaster", duration: 334, audioUrl: getAudioUrlForIndex(2), imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop", price: 3.49 },
      { id: "2-3", title: "Data Stream", artist: "SynthMaster", duration: 267, audioUrl: getAudioUrlForIndex(3), imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop", price: 3.49 },
    ],
  },
  {
    id: "3",
    title: "Future Bass Vol.1",
    artist: "ElectroByte",
    price: 14.99,
    imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&h=500&fit=crop",
    genre: "Future Bass",
    releaseYear: 2023,
    rating: 4.9,
    description: "La première compilation d'ElectroByte présente les sons les plus avant-gardistes du future bass. Des drops massifs et des mélodies aériennes pour les clubbers exigeants.",
    tracks: [
      { id: "3-1", title: "Bass Drop", artist: "ElectroByte", duration: 234, audioUrl: getAudioUrlForIndex(2), imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&h=500&fit=crop", price: 1.99 },
      { id: "3-2", title: "Future Vibes", artist: "ElectroByte", duration: 289, audioUrl: getAudioUrlForIndex(3), imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&h=500&fit=crop", price: 1.99 },
      { id: "3-3", title: "Cloud Nine", artist: "ElectroByte", duration: 312, audioUrl: getAudioUrlForIndex(4), imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&h=500&fit=crop", price: 1.99 },
      { id: "3-4", title: "Sunset Boulevard", artist: "ElectroByte", duration: 278, audioUrl: getAudioUrlForIndex(5), imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&h=500&fit=crop", price: 1.99 },
      { id: "3-5", title: "Night Rider", artist: "ElectroByte", duration: 345, audioUrl: getAudioUrlForIndex(0), imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&h=500&fit=crop", price: 1.99 },
    ],
  },
  {
    id: "4",
    title: "Midnight Drive",
    artist: "RetroWave",
    price: 29.99,
    imageUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=500&h=500&fit=crop",
    genre: "Retrowave",
    releaseYear: 2024,
    rating: 4.7,
    description: "RetroWave capture l'essence des années 80 avec une production moderne. Parfait pour les longues routes nocturnes et les sessions de gaming intenses.",
    tracks: [
      { id: "4-1", title: "Chrome Highway", artist: "RetroWave", duration: 267, audioUrl: getAudioUrlForIndex(3), imageUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=500&h=500&fit=crop", price: 3.99 },
      { id: "4-2", title: "Miami Nights", artist: "RetroWave", duration: 298, audioUrl: getAudioUrlForIndex(4), imageUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=500&h=500&fit=crop", price: 3.99 },
      { id: "4-3", title: "Turbo Speed", artist: "RetroWave", duration: 234, audioUrl: getAudioUrlForIndex(5), imageUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=500&h=500&fit=crop", price: 3.99 },
    ],
  },
  {
    id: "5",
    title: "Electric Soul",
    artist: "VaporDream",
    price: 17.99,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    genre: "Vaporwave",
    releaseYear: 2023,
    rating: 4.5,
    description: "Une exploration nostalgique et mélancolique des sons vaporwave. VaporDream crée une atmosphère unique entre rêve et réalité virtuelle.",
    tracks: [
      { id: "5-1", title: "Mall Memories", artist: "VaporDream", duration: 345, audioUrl: getAudioUrlForIndex(4), imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop", price: 2.49 },
      { id: "5-2", title: "Plaza Sunset", artist: "VaporDream", duration: 289, audioUrl: getAudioUrlForIndex(5), imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop", price: 2.49 },
      { id: "5-3", title: "Digital Tears", artist: "VaporDream", duration: 312, audioUrl: getAudioUrlForIndex(0), imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop", price: 2.49 },
      { id: "5-4", title: "Endless Scroll", artist: "VaporDream", duration: 278, audioUrl: getAudioUrlForIndex(1), imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop", price: 2.49 },
    ],
  },
  {
    id: "6",
    title: "Cosmic Journey",
    artist: "StarBeat",
    price: 22.99,
    imageUrl: "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=500&h=500&fit=crop",
    genre: "Space Ambient",
    releaseYear: 2024,
    rating: 4.8,
    description: "StarBeat vous emmène dans un voyage interstellaire avec des compositions ambiantes et spatiales. Idéal pour la méditation et la contemplation cosmique.",
    tracks: [
      { id: "6-1", title: "Nebula", artist: "StarBeat", duration: 456, audioUrl: getAudioUrlForIndex(5), imageUrl: "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=500&h=500&fit=crop", price: 3.29 },
      { id: "6-2", title: "Black Hole Sun", artist: "StarBeat", duration: 398, audioUrl: getAudioUrlForIndex(0), imageUrl: "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=500&h=500&fit=crop", price: 3.29 },
      { id: "6-3", title: "Gravity Well", artist: "StarBeat", duration: 423, audioUrl: getAudioUrlForIndex(1), imageUrl: "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=500&h=500&fit=crop", price: 3.29 },
    ],
  },
  {
    id: "7",
    title: "Techno Cathedral",
    artist: "DarkBeat",
    price: 21.99,
    imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&h=500&fit=crop",
    genre: "Techno",
    releaseYear: 2024,
    rating: 4.6,
    description: "DarkBeat présente une collection de techno industriel sombre et hypnotique. Des beats implacables pour les nuits les plus intenses.",
    tracks: [
      { id: "7-1", title: "Cathedral", artist: "DarkBeat", duration: 378, audioUrl: getAudioUrlForIndex(2), imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&h=500&fit=crop", price: 2.99 },
      { id: "7-2", title: "Industrial Zone", artist: "DarkBeat", duration: 412, audioUrl: getAudioUrlForIndex(3), imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&h=500&fit=crop", price: 2.99 },
      { id: "7-3", title: "Machine Heart", artist: "DarkBeat", duration: 345, audioUrl: getAudioUrlForIndex(4), imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&h=500&fit=crop", price: 2.99 },
    ],
  },
  {
    id: "8",
    title: "Chill Horizon",
    artist: "LoFi Dreams",
    price: 15.99,
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=500&fit=crop",
    genre: "Lo-Fi",
    releaseYear: 2023,
    rating: 4.9,
    description: "Des beats lo-fi relaxants parfaits pour étudier, travailler ou simplement se détendre. LoFi Dreams crée l'ambiance idéale pour votre quotidien.",
    tracks: [
      { id: "8-1", title: "Study Session", artist: "LoFi Dreams", duration: 234, audioUrl: getAudioUrlForIndex(0), imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=500&fit=crop", price: 1.99 },
      { id: "8-2", title: "Coffee Break", artist: "LoFi Dreams", duration: 267, audioUrl: getAudioUrlForIndex(1), imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=500&fit=crop", price: 1.99 },
      { id: "8-3", title: "Rainy Day", artist: "LoFi Dreams", duration: 289, audioUrl: getAudioUrlForIndex(2), imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=500&fit=crop", price: 1.99 },
      { id: "8-4", title: "Night Owl", artist: "LoFi Dreams", duration: 312, audioUrl: getAudioUrlForIndex(3), imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=500&fit=crop", price: 1.99 },
    ],
  },
];

export const genres = ["Tous", "Synthwave", "Electronic", "Future Bass", "Retrowave", "Vaporwave", "Space Ambient", "Techno", "Lo-Fi"];

export const getAlbumById = (id: string) => albums.find((album) => album.id === id);

export const getAlbumsByGenre = (genre: string) => 
  genre === "Tous" ? albums : albums.filter((album) => album.genre === genre);

export const searchAlbums = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return albums.filter(
    (album) =>
      album.title.toLowerCase().includes(lowercaseQuery) ||
      album.artist.toLowerCase().includes(lowercaseQuery) ||
      album.genre.toLowerCase().includes(lowercaseQuery)
  );
};
