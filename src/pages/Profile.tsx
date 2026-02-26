import { motion } from "framer-motion";
import { useState } from "react";
import {
  User, Heart, Download, Settings, LogOut, Music,
  ShoppingBag, CreditCard, Bell, Shield, Edit, Star,
  Clock, TrendingUp, Save, Camera
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { NewsWidget } from "@/components/widgets/NewsWidget";
import { GamesWidget } from "@/components/widgets/GamesWidget";
import { albums } from "@/data/albums";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const purchaseHistory = [
  { id: 1, album: albums[0], date: "2024-01-15", status: "completed" },
  { id: 2, album: albums[1], date: "2024-01-10", status: "completed" },
  { id: 3, album: albums[3], date: "2024-01-05", status: "completed" },
];

const favoriteAlbums = [albums[0], albums[2], albums[4], albums[6]];

const Profile = () => {
  const { user, profile, isAdmin, signOut, refreshProfile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    display_name: "",
    bio: "",
    favorite_genre: "",
    avatar_url: "",
  });

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary animate-pulse font-display text-2xl">Chargement...</div></div>;
  
  if (!user) {
    navigate("/auth");
    return null;
  }

  const startEditing = () => {
    setEditForm({
      display_name: profile?.display_name || "",
      bio: profile?.bio || "",
      favorite_genre: profile?.favorite_genre || "",
      avatar_url: profile?.avatar_url || "",
    });
    setEditing(true);
  };

  const saveProfile = async () => {
    const { error } = await supabase.from("profiles").update({
      display_name: editForm.display_name,
      bio: editForm.bio,
      favorite_genre: editForm.favorite_genre,
      avatar_url: editForm.avatar_url,
      updated_at: new Date().toISOString(),
    }).eq("id", user.id);
    
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profil mis à jour !" });
      setEditing(false);
      refreshProfile();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const displayName = profile?.display_name || user.email?.split("@")[0] || "Utilisateur";
  const avatarUrl = profile?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop";

  return (
    <div className="min-h-screen bg-background overflow-x-hidden pb-24">
      <Navbar />

      {/* Profile Header */}
      <section className="pt-32 pb-12 relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-neon-magenta/20 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <img src={avatarUrl} alt={displayName} className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-[0_0_30px_hsl(var(--primary)/0.5)]" />
                {editing && (
                  <button onClick={() => {
                    const url = prompt("URL de l'avatar:");
                    if (url) setEditForm({...editForm, avatar_url: url});
                  }} className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-110 transition-transform">
                    <Camera className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="text-center md:text-left flex-1">
                {editing ? (
                  <div className="space-y-3">
                    <Input value={editForm.display_name} onChange={(e) => setEditForm({...editForm, display_name: e.target.value})} placeholder="Nom d'affichage" className="font-display text-xl" />
                    <Textarea value={editForm.bio} onChange={(e) => setEditForm({...editForm, bio: e.target.value})} placeholder="Votre bio..." rows={2} />
                    <Input value={editForm.favorite_genre} onChange={(e) => setEditForm({...editForm, favorite_genre: e.target.value})} placeholder="Genre favori" />
                  </div>
                ) : (
                  <>
                    <h1 className="font-display text-3xl font-bold text-glow-cyan mb-2">{displayName}</h1>
                    <p className="text-muted-foreground mb-2">{user.email}</p>
                    {profile?.bio && <p className="text-sm text-muted-foreground mb-4">{profile.bio}</p>}
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <div className="px-4 py-2 rounded-lg bg-card/50">
                        <div className="text-xs text-muted-foreground">Membre depuis</div>
                        <div className="font-semibold text-primary">{new Date(user.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</div>
                      </div>
                      {profile?.favorite_genre && (
                        <div className="px-4 py-2 rounded-lg bg-card/50">
                          <div className="text-xs text-muted-foreground">Genre favori</div>
                          <div className="font-semibold text-primary">{profile.favorite_genre}</div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3">
                {editing ? (
                  <>
                    <Button variant="neon" size="sm" onClick={saveProfile} className="gap-2"><Save className="w-4 h-4" />Sauvegarder</Button>
                    <Button variant="glass" size="sm" onClick={() => setEditing(false)}>Annuler</Button>
                  </>
                ) : (
                  <>
                    <Button variant="glass" size="icon" onClick={startEditing}><Edit className="w-5 h-5" /></Button>
                    {isAdmin && <Link to="/admin"><Button variant="glass" size="icon"><Shield className="w-5 h-5" /></Button></Link>}
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={handleSignOut}><LogOut className="w-5 h-5" /></Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="space-y-6">
              <div className="glass rounded-xl p-6">
                <h3 className="font-display text-lg font-semibold mb-4">Statistiques</h3>
                <div className="space-y-4">
                  {[
                    { icon: Music, label: "Albums achetés", value: "3" },
                    { icon: Heart, label: "Favoris", value: "4" },
                    { icon: Download, label: "Téléchargements", value: "12" },
                    { icon: TrendingUp, label: "Heures d'écoute", value: "42h" },
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

            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="glass w-full justify-start overflow-x-auto">
                  <TabsTrigger value="overview" className="gap-2"><User className="w-4 h-4" />Vue d'ensemble</TabsTrigger>
                  <TabsTrigger value="purchases" className="gap-2"><ShoppingBag className="w-4 h-4" />Achats</TabsTrigger>
                  <TabsTrigger value="favorites" className="gap-2"><Heart className="w-4 h-4" />Favoris</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6">
                    <h3 className="font-display text-lg font-semibold mb-4">Activité récente</h3>
                    <div className="space-y-4">
                      {purchaseHistory.map((purchase) => (
                        <div key={purchase.id} className="flex items-center gap-4 p-3 rounded-lg bg-card/50">
                          <img src={purchase.album.imageUrl} alt={purchase.album.title} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1">
                            <div className="font-medium">{purchase.album.title}</div>
                            <div className="text-sm text-muted-foreground">{purchase.album.artist}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-display font-semibold text-primary">{purchase.album.price}€</div>
                            <div className="text-xs text-muted-foreground">{purchase.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  <NewsWidget />
                </TabsContent>

                <TabsContent value="purchases" className="space-y-6">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6">
                    <h3 className="font-display text-lg font-semibold mb-4">Historique d'achats</h3>
                    <div className="space-y-4">
                      {purchaseHistory.map((purchase) => (
                        <div key={purchase.id} className="flex items-center gap-4 p-4 rounded-lg bg-card/50 hover:bg-card transition-colors">
                          <img src={purchase.album.imageUrl} alt={purchase.album.title} className="w-16 h-16 rounded-lg object-cover" />
                          <div className="flex-1">
                            <div className="font-display font-semibold">{purchase.album.title}</div>
                            <div className="text-sm text-muted-foreground">{purchase.album.artist}</div>
                            <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs">Complété</span>
                          </div>
                          <div className="font-display text-xl font-bold text-primary">{purchase.album.price}€</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="favorites" className="space-y-6">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favoriteAlbums.map((album) => (
                      <div key={album.id} className="glass rounded-xl p-4 flex gap-4 group hover:border-primary/50 transition-all">
                        <img src={album.imageUrl} alt={album.title} className="w-20 h-20 rounded-lg object-cover" />
                        <div className="flex-1">
                          <div className="font-display font-semibold group-hover:text-primary transition-colors">{album.title}</div>
                          <div className="text-sm text-muted-foreground">{album.artist}</div>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 text-neon-magenta fill-current" />
                            <span className="text-sm">{album.rating}</span>
                          </div>
                          <div className="font-display text-lg font-bold text-primary mt-1">{album.price}€</div>
                        </div>
                      </div>
                    ))}
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
