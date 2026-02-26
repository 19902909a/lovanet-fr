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
  trending: true
},
{
  id: "2",
  title: "Nouvelle collaboration entre CyberPulse et RetroWave",
  source: "Electronic Mag",
  time: "Il y a 4h",
  category: "music"
},
{
  id: "3",
  title: "L'IA révolutionne la production musicale",
  source: "Tech Music",
  time: "Il y a 6h",
  category: "tech",
  trending: true
},
{
  id: "4",
  title: "Festival Neon Nights annoncé pour l'été",
  source: "Event Weekly",
  time: "Il y a 8h",
  category: "culture"
},
{
  id: "5",
  title: "Les ventes de vinyles en hausse de 40%",
  source: "Music Industry",
  time: "Il y a 12h",
  category: "music"
},
{
  id: "6",
  title: "SynthMaster remporte le Grammy de l'album électronique",
  source: "Grammy Awards",
  time: "Hier",
  category: "music",
  trending: true
}];


const categoryColors = {
  music: "bg-primary/20 text-primary",
  tech: "bg-secondary/20 text-secondary",
  culture: "bg-accent/20 text-accent"
};

export const NewsWidget = () => {
  const [filter, setFilter] = useState<"all" | "music" | "tech" | "culture">("all");

  const filteredNews = filter === "all" ? mockNews : mockNews.filter((n) => n.category === filter);

  return;











































































};