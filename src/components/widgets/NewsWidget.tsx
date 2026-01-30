import { motion } from "framer-motion";
import { Newspaper, ExternalLink, Clock, TrendingUp } from "lucide-react";
import { useState } from "react";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category: "music" | "tech" | "culture";
  trending?: boolean;
}

const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Le synthwave fait son grand retour en 2024",
    source: "Music Today",
    time: "Il y a 2h",
    category: "music",
    trending: true,
  },
  {
    id: "2",
    title: "Nouvelle collaboration entre CyberPulse et RetroWave",
    source: "Electronic Mag",
    time: "Il y a 4h",
    category: "music",
  },
  {
    id: "3",
    title: "L'IA révolutionne la production musicale",
    source: "Tech Music",
    time: "Il y a 6h",
    category: "tech",
    trending: true,
  },
  {
    id: "4",
    title: "Festival Neon Nights annoncé pour l'été",
    source: "Event Weekly",
    time: "Il y a 8h",
    category: "culture",
  },
  {
    id: "5",
    title: "Les ventes de vinyles en hausse de 40%",
    source: "Music Industry",
    time: "Il y a 12h",
    category: "music",
  },
  {
    id: "6",
    title: "SynthMaster remporte le Grammy de l'album électronique",
    source: "Grammy Awards",
    time: "Hier",
    category: "music",
    trending: true,
  },
];

const categoryColors = {
  music: "bg-primary/20 text-primary",
  tech: "bg-secondary/20 text-secondary",
  culture: "bg-accent/20 text-accent",
};

export const NewsWidget = () => {
  const [filter, setFilter] = useState<"all" | "music" | "tech" | "culture">("all");

  const filteredNews = filter === "all" ? mockNews : mockNews.filter((n) => n.category === filter);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-xl p-6 hover:border-primary/50 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-primary" />
          <h3 className="font-display text-lg font-semibold text-primary">Actualités</h3>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {["all", "music", "tech", "culture"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat as typeof filter)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filter === cat
                ? "bg-primary text-primary-foreground"
                : "bg-card hover:bg-card/80 text-muted-foreground"
            }`}
          >
            {cat === "all" ? "Tout" : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* News List */}
      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
        {filteredNews.map((news, index) => (
          <motion.div
            key={news.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group p-3 rounded-lg bg-card/50 hover:bg-card transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${categoryColors[news.category]}`}>
                    {news.category}
                  </span>
                  {news.trending && (
                    <TrendingUp className="w-3 h-3 text-secondary" />
                  )}
                </div>
                <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                  {news.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>{news.source}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {news.time}
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <button className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors font-medium">
          Voir toutes les actualités →
        </button>
      </div>
    </motion.div>
  );
};
