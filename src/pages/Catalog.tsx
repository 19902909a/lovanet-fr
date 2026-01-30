import { motion } from "framer-motion";
import { useState } from "react";
import { Search, Filter, Grid, List, Star, ChevronDown } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AlbumCard } from "@/components/AlbumCard";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { NewsWidget } from "@/components/widgets/NewsWidget";
import { GamesWidget } from "@/components/widgets/GamesWidget";
import { albums, genres, searchAlbums, getAlbumsByGenre } from "@/data/albums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Catalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Tous");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);

  // Filter and sort albums
  let filteredAlbums = searchQuery ? searchAlbums(searchQuery) : getAlbumsByGenre(selectedGenre);

  // Sort
  filteredAlbums = [...filteredAlbums].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.releaseYear - a.releaseYear;
      default:
        return b.rating - a.rating;
    }
  });

  // Price filter
  filteredAlbums = filteredAlbums.filter(
    (album) => album.price >= priceRange[0] && album.price <= priceRange[1]
  );

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">Catalogue</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Découvrez plus de 50 000 pistes exclusives des meilleurs artistes électroniques
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Rechercher albums, artistes, genres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-card border-border"
                />
              </div>

              {/* Genre Filter */}
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-full lg:w-48 h-12">
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-48 h-12">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Populaires</SelectItem>
                  <SelectItem value="newest">Nouveautés</SelectItem>
                  <SelectItem value="rating">Mieux notés</SelectItem>
                  <SelectItem value="price-low">Prix croissant</SelectItem>
                  <SelectItem value="price-high">Prix décroissant</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "neon" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-5 h-5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "neon" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedGenre !== "Tous" && (
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm flex items-center gap-2">
                  {selectedGenre}
                  <button onClick={() => setSelectedGenre("Tous")} className="hover:text-primary-foreground">
                    ×
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm flex items-center gap-2">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery("")} className="hover:text-secondary-foreground">
                    ×
                  </button>
                </span>
              )}
              <span className="text-sm text-muted-foreground ml-auto">
                {filteredAlbums.length} résultat{filteredAlbums.length > 1 ? "s" : ""}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Widgets */}
            <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
              <WeatherWidget />
              <NewsWidget />
              <GamesWidget />
            </div>

            {/* Albums Grid */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              {filteredAlbums.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="text-6xl mb-4">🎵</div>
                  <h3 className="font-display text-2xl font-bold mb-2">Aucun résultat</h3>
                  <p className="text-muted-foreground">
                    Essayez de modifier vos critères de recherche
                  </p>
                </motion.div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredAlbums.map((album, index) => (
                    <AlbumCard
                      key={album.id}
                      title={album.title}
                      artist={album.artist}
                      price={album.price}
                      imageUrl={album.imageUrl}
                      index={index}
                    />
                  ))}
                </div>
              )}

              {/* Load More */}
              {filteredAlbums.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="text-center mt-12"
                >
                  <Button variant="outline" size="lg" className="gap-2">
                    Charger plus
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-16 glass">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50K+", label: "Pistes disponibles" },
              { value: "2.5K", label: "Artistes" },
              { value: "99.9%", label: "Satisfaction" },
              { value: "24/7", label: "Support" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="font-display text-3xl font-bold text-glow-cyan text-primary">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Catalog;
