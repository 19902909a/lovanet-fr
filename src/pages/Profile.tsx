import { motion } from "framer-motion";
import { useState } from "react";
import {
  User,
  Heart,
  Download,
  Settings,
  LogOut,
  Music,
  ShoppingBag,
  CreditCard,
  Bell,
  Shield,
  Edit,
  Star,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { NewsWidget } from "@/components/widgets/NewsWidget";
import { GamesWidget } from "@/components/widgets/GamesWidget";
import { albums } from "@/data/albums";

// Mock user data
const userData = {
  name: "Alex Neon",
  email: "alex@neonwave.com",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
  memberSince: "Janvier 2024",
  totalPurchases: 47,
  favoriteGenre: "Synthwave",
  level: "Gold Member",
};

const purchaseHistory = [
  { id: 1, album: albums[0], date: "2024-01-15", status: "completed" },
  { id: 2, album: albums[1], date: "2024-01-10", status: "completed" },
  { id: 3, album: albums[3], date: "2024-01-05", status: "completed" },
  { id: 4, album: albums[5], date: "2023-12-28", status: "completed" },
];

const favoriteAlbums = [albums[0], albums[2], albums[4], albums[6]];

const downloadHistory = [
  { name: "Neon Dreams - FLAC", size: "245 MB", date: "2024-01-15" },
  { name: "Digital Horizon - MP3 320", size: "89 MB", date: "2024-01-10" },
  { name: "Midnight Drive - WAV", size: "512 MB", date: "2024-01-05" },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Profile Header */}
      <section className="pt-32 pb-12 relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-8"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
                />
                <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-110 transition-transform">
                  <Edit className="w-5 h-5" />
                </button>
                <div className="absolute -top-2 -right-2 px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
                  {userData.level}
                </div>
              </div>

              {/* User Info */}
              <div className="text-center md:text-left flex-1">
                <h1 className="font-display text-3xl font-bold text-glow-cyan mb-2">
                  {userData.name}
                </h1>
                <p className="text-muted-foreground mb-4">{userData.email}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="px-4 py-2 rounded-lg bg-card/50">
                    <div className="text-xs text-muted-foreground">Membre depuis</div>
                    <div className="font-semibold text-primary">{userData.memberSince}</div>
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-card/50">
                    <div className="text-xs text-muted-foreground">Achats</div>
                    <div className="font-semibold text-primary">{userData.totalPurchases}</div>
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-card/50">
                    <div className="text-xs text-muted-foreground">Genre favori</div>
                    <div className="font-semibold text-primary">{userData.favoriteGenre}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="glass" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
                <Button variant="glass" size="icon">
                  <Bell className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive">
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="glass rounded-xl p-6">
                <h3 className="font-display text-lg font-semibold mb-4">Statistiques</h3>
                <div className="space-y-4">
                  {[
                    { icon: Music, label: "Albums achetés", value: "47" },
                    { icon: Heart, label: "Favoris", value: "23" },
                    { icon: Download, label: "Téléchargements", value: "156" },
                    { icon: TrendingUp, label: "Heures d'écoute", value: "342h" },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <stat.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                        <div className="font-display font-semibold">{stat.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <WeatherWidget />
              <GamesWidget />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="glass w-full justify-start overflow-x-auto">
                  <TabsTrigger value="overview" className="gap-2">
                    <User className="w-4 h-4" /> Vue d'ensemble
                  </TabsTrigger>
                  <TabsTrigger value="purchases" className="gap-2">
                    <ShoppingBag className="w-4 h-4" /> Achats
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="gap-2">
                    <Heart className="w-4 h-4" /> Favoris
                  </TabsTrigger>
                  <TabsTrigger value="downloads" className="gap-2">
                    <Download className="w-4 h-4" /> Téléchargements
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="gap-2">
                    <Settings className="w-4 h-4" /> Paramètres
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  {/* Recent Activity */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-xl p-6"
                  >
                    <h3 className="font-display text-lg font-semibold mb-4">Activité récente</h3>
                    <div className="space-y-4">
                      {purchaseHistory.slice(0, 3).map((purchase) => (
                        <div key={purchase.id} className="flex items-center gap-4 p-3 rounded-lg bg-card/50">
                          <img
                            src={purchase.album.imageUrl}
                            alt={purchase.album.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{purchase.album.title}</div>
                            <div className="text-sm text-muted-foreground">{purchase.album.artist}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-display font-semibold text-primary">
                              {purchase.album.price}€
                            </div>
                            <div className="text-xs text-muted-foreground">{purchase.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* News Widget */}
                  <NewsWidget />
                </TabsContent>

                {/* Purchases Tab */}
                <TabsContent value="purchases" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-xl p-6"
                  >
                    <h3 className="font-display text-lg font-semibold mb-4">Historique d'achats</h3>
                    <div className="space-y-4">
                      {purchaseHistory.map((purchase) => (
                        <div key={purchase.id} className="flex items-center gap-4 p-4 rounded-lg bg-card/50 hover:bg-card transition-colors">
                          <img
                            src={purchase.album.imageUrl}
                            alt={purchase.album.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="font-display font-semibold">{purchase.album.title}</div>
                            <div className="text-sm text-muted-foreground">{purchase.album.artist}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs">
                                Complété
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {purchase.date}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-display text-xl font-bold text-primary">
                              {purchase.album.price}€
                            </div>
                            <Button variant="glass" size="sm" className="mt-2">
                              <Download className="w-4 h-4 mr-1" /> Télécharger
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </TabsContent>

                {/* Favorites Tab */}
                <TabsContent value="favorites" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {favoriteAlbums.map((album) => (
                      <div key={album.id} className="glass rounded-xl p-4 flex gap-4 group hover:border-primary/50 transition-all">
                        <img
                          src={album.imageUrl}
                          alt={album.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-display font-semibold group-hover:text-primary transition-colors">
                            {album.title}
                          </div>
                          <div className="text-sm text-muted-foreground">{album.artist}</div>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 text-secondary fill-secondary" />
                            <span className="text-sm">{album.rating}</span>
                          </div>
                          <div className="font-display text-lg font-bold text-primary mt-1">
                            {album.price}€
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-secondary">
                          <Heart className="w-5 h-5 fill-secondary" />
                        </Button>
                      </div>
                    ))}
                  </motion.div>
                </TabsContent>

                {/* Downloads Tab */}
                <TabsContent value="downloads" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-xl p-6"
                  >
                    <h3 className="font-display text-lg font-semibold mb-4">Fichiers disponibles</h3>
                    <div className="space-y-3">
                      {downloadHistory.map((file, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-card/50 hover:bg-card transition-colors">
                          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Music className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{file.name}</div>
                            <div className="text-xs text-muted-foreground">{file.size} • {file.date}</div>
                          </div>
                          <Button variant="neon" size="sm">
                            <Download className="w-4 h-4 mr-1" /> Télécharger
                          </Button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-xl p-6"
                  >
                    <h3 className="font-display text-lg font-semibold mb-4">Paramètres du compte</h3>
                    <div className="space-y-4">
                      {[
                        { icon: User, label: "Informations personnelles", desc: "Modifier votre profil" },
                        { icon: CreditCard, label: "Moyens de paiement", desc: "Gérer vos cartes" },
                        { icon: Bell, label: "Notifications", desc: "Préférences de notification" },
                        { icon: Shield, label: "Sécurité", desc: "Mot de passe et 2FA" },
                      ].map((setting) => (
                        <div
                          key={setting.label}
                          className="flex items-center gap-4 p-4 rounded-lg bg-card/50 hover:bg-card cursor-pointer transition-colors"
                        >
                          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                            <setting.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{setting.label}</div>
                            <div className="text-sm text-muted-foreground">{setting.desc}</div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Edit className="w-5 h-5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Profile;
