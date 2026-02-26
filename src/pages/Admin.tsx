import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, FileText, Image, Users, Settings, Plus, 
  Trash2, Edit, Eye, EyeOff, Upload, Search, LogOut, Home,
  Music, BarChart3, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface Page {
  id: string;
  slug: string;
  title: string;
  content: any;
  meta_description: string | null;
  is_published: boolean;
  created_at: string;
}

interface MediaItem {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number | null;
  alt_text: string | null;
  created_at: string;
}

interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [pages, setPages] = useState<Page[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [newPage, setNewPage] = useState({ title: "", slug: "", content: "", meta_description: "", is_published: false });
  const [showNewPage, setShowNewPage] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, loading]);

  useEffect(() => {
    if (isAdmin) {
      fetchPages();
      fetchMedia();
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchPages = async () => {
    const { data } = await supabase.from("pages").select("*").order("created_at", { ascending: false });
    if (data) setPages(data as Page[]);
  };

  const fetchMedia = async () => {
    const { data } = await supabase.from("media_library").select("*").order("created_at", { ascending: false });
    if (data) setMedia(data as MediaItem[]);
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (data) setUsers(data as UserProfile[]);
  };

  const handleCreatePage = async () => {
    const { error } = await supabase.from("pages").insert({
      title: newPage.title,
      slug: newPage.slug,
      content: { body: newPage.content },
      meta_description: newPage.meta_description,
      is_published: newPage.is_published,
      created_by: user?.id,
    });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Page créée" });
      setShowNewPage(false);
      setNewPage({ title: "", slug: "", content: "", meta_description: "", is_published: false });
      fetchPages();
    }
  };

  const handleDeletePage = async (id: string) => {
    await supabase.from("pages").delete().eq("id", id);
    fetchPages();
    toast({ title: "Page supprimée" });
  };

  const handleTogglePublish = async (page: Page) => {
    await supabase.from("pages").update({ is_published: !page.is_published }).eq("id", page.id);
    fetchPages();
  };

  const handleDeleteMedia = async (id: string) => {
    await supabase.from("media_library").delete().eq("id", id);
    fetchMedia();
    toast({ title: "Média supprimé" });
  };

  const handleAddMedia = async () => {
    const url = prompt("URL du fichier média:");
    if (!url) return;
    const name = prompt("Nom du fichier:") || "media";
    const type = url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? "image" : url.match(/\.(mp3|wav|ogg|flac)$/i) ? "audio" : "other";
    
    const { error } = await supabase.from("media_library").insert({
      file_name: name,
      file_url: url,
      file_type: type,
      uploaded_by: user?.id,
    });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Média ajouté" });
      fetchMedia();
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary animate-pulse font-display text-2xl">Chargement...</div></div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <motion.header initial={{ y: -100 }} animate={{ y: 0 }} className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-display text-lg font-bold tracking-wider text-glow-cyan">ADMIN PANEL</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/"><Button variant="ghost" size="sm" className="gap-2"><Home className="w-4 h-4" />Site</Button></Link>
            <Button variant="ghost" size="sm" className="gap-2 text-destructive" onClick={signOut}><LogOut className="w-4 h-4" />Déconnexion</Button>
          </div>
        </div>
      </motion.header>

      <div className="pt-20 container mx-auto px-6 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass w-full justify-start overflow-x-auto">
            <TabsTrigger value="dashboard" className="gap-2"><LayoutDashboard className="w-4 h-4" />Dashboard</TabsTrigger>
            <TabsTrigger value="pages" className="gap-2"><FileText className="w-4 h-4" />Pages</TabsTrigger>
            <TabsTrigger value="media" className="gap-2"><Image className="w-4 h-4" />Médias</TabsTrigger>
            <TabsTrigger value="users" className="gap-2"><Users className="w-4 h-4" />Utilisateurs</TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: FileText, label: "Pages", value: pages.length, color: "text-primary" },
                { icon: Image, label: "Médias", value: media.length, color: "text-neon-magenta" },
                { icon: Users, label: "Utilisateurs", value: users.length, color: "text-neon-purple" },
                { icon: BarChart3, label: "Publiées", value: pages.filter(p => p.is_published).length, color: "text-accent" },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    <span className="text-muted-foreground text-sm">{stat.label}</span>
                  </div>
                  <div className="font-display text-3xl font-bold">{stat.value}</div>
                </div>
              ))}
            </motion.div>
          </TabsContent>

          {/* Pages */}
          <TabsContent value="pages" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Gestion des Pages</h2>
              <Button variant="neon" onClick={() => setShowNewPage(!showNewPage)} className="gap-2"><Plus className="w-4 h-4" />Nouvelle Page</Button>
            </div>

            {showNewPage && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass rounded-xl p-6 space-y-4">
                <h3 className="font-display font-semibold">Créer une page</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Titre</Label>
                    <Input value={newPage.title} onChange={(e) => setNewPage({ ...newPage, title: e.target.value })} placeholder="Titre de la page" />
                  </div>
                  <div className="space-y-2">
                    <Label>Slug (URL)</Label>
                    <Input value={newPage.slug} onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })} placeholder="mon-url" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description SEO</Label>
                  <Input value={newPage.meta_description} onChange={(e) => setNewPage({ ...newPage, meta_description: e.target.value })} placeholder="Description pour les moteurs de recherche" />
                </div>
                <div className="space-y-2">
                  <Label>Contenu</Label>
                  <Textarea value={newPage.content} onChange={(e) => setNewPage({ ...newPage, content: e.target.value })} placeholder="Contenu de la page..." rows={6} />
                </div>
                <div className="flex gap-3">
                  <Button variant="neon" onClick={handleCreatePage}>Créer</Button>
                  <Button variant="glass" onClick={() => setShowNewPage(false)}>Annuler</Button>
                </div>
              </motion.div>
            )}

            <div className="space-y-3">
              {pages.map((page) => (
                <div key={page.id} className="glass rounded-xl p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="font-display font-semibold">{page.title}</div>
                    <div className="text-sm text-muted-foreground">/{page.slug}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${page.is_published ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}`}>
                    {page.is_published ? "Publiée" : "Brouillon"}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleTogglePublish(page)}>
                      {page.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeletePage(page.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {pages.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune page créée</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Media */}
          <TabsContent value="media" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Bibliothèque Médias</h2>
              <Button variant="neon" onClick={handleAddMedia} className="gap-2"><Upload className="w-4 h-4" />Ajouter</Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {media.map((item) => (
                <div key={item.id} className="glass rounded-xl overflow-hidden group">
                  {item.file_type === "image" ? (
                    <img src={item.file_url} alt={item.alt_text || item.file_name} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="w-full h-40 bg-card flex items-center justify-center">
                      <Music className="w-12 h-12 text-primary" />
                    </div>
                  )}
                  <div className="p-3">
                    <div className="text-sm font-medium truncate">{item.file_name}</div>
                    <div className="text-xs text-muted-foreground">{item.file_type}</div>
                    <Button variant="ghost" size="sm" className="text-destructive mt-2 w-full" onClick={() => handleDeleteMedia(item.id)}>
                      <Trash2 className="w-3 h-3 mr-1" />Supprimer
                    </Button>
                  </div>
                </div>
              ))}
              {media.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun média</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users" className="space-y-6">
            <h2 className="font-display text-xl font-bold">Utilisateurs</h2>
            <div className="space-y-3">
              {users.map((u) => (
                <div key={u.id} className="glass rounded-xl p-4 flex items-center gap-4">
                  <img src={u.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-primary/30" />
                  <div className="flex-1">
                    <div className="font-medium">{u.display_name || "Sans nom"}</div>
                    <div className="text-xs text-muted-foreground">{u.bio || "Aucune bio"}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString("fr-FR")}</div>
                </div>
              ))}
              {users.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun utilisateur</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
