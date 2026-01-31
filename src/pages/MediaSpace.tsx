import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MediaPlayer } from "@/components/MediaPlayer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Library, Upload, History, Settings, Music, Video, Image as ImageIcon, FileText } from "lucide-react";

const MediaSpace = () => {
  return (
    <div className="min-h-screen bg-transparent overflow-x-hidden pb-24 relative z-10">
      <Navbar />

      <main className="container mx-auto px-6 pt-32 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text text-glow-blue">Espace Multimédia</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Votre espace personnel pour gérer et lire tous vos fichiers multimédias
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: Music, label: "Audio", count: "0", color: "text-primary" },
            { icon: Video, label: "Vidéo", count: "0", color: "text-accent" },
            { icon: ImageIcon, label: "Images", count: "0", color: "text-secondary" },
            { icon: FileText, label: "Documents", count: "0", color: "text-muted-foreground" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass p-4 rounded-xl text-center hover-lift"
            >
              <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
              <p className="font-display text-2xl font-bold">{stat.count}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="player" className="space-y-6">
          <TabsList className="glass-white w-full justify-start gap-2 p-2 rounded-xl">
            <TabsTrigger value="player" className="gap-2 data-[state=active]:bg-primary/20">
              <Upload className="w-4 h-4" />
              Lecteur
            </TabsTrigger>
            <TabsTrigger value="library" className="gap-2 data-[state=active]:bg-primary/20">
              <Library className="w-4 h-4" />
              Bibliothèque
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2 data-[state=active]:bg-primary/20">
              <History className="w-4 h-4" />
              Historique
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-primary/20">
              <Settings className="w-4 h-4" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="player" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <MediaPlayer />
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-white rounded-xl p-6"
            >
              <h3 className="font-display text-lg font-semibold mb-4">
                Formats Supportés
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                    <Music className="w-4 h-4" /> Audio
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• MP3, WAV, OGG</li>
                    <li>• FLAC, AAC, M4A</li>
                    <li>• WebM Audio</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-accent mb-2 flex items-center gap-2">
                    <Video className="w-4 h-4" /> Vidéo
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• MP4, WebM, OGV</li>
                    <li>• MOV, AVI</li>
                    <li>• MKV (support limité)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-secondary mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Images
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• JPG, PNG, GIF</li>
                    <li>• WebP, SVG</li>
                    <li>• BMP, ICO</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Documents
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• PDF</li>
                    <li>• TXT, DOC, DOCX</li>
                    <li>• Et plus...</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="library">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-8 text-center"
            >
              <Library className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-display text-xl font-semibold mb-2">
                Bibliothèque Vide
              </h3>
              <p className="text-muted-foreground">
                Importez des fichiers dans le lecteur pour les retrouver ici
              </p>
            </motion.div>
          </TabsContent>

          <TabsContent value="history">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-8 text-center"
            >
              <History className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-display text-xl font-semibold mb-2">
                Aucun Historique
              </h3>
              <p className="text-muted-foreground">
                Votre historique de lecture apparaîtra ici
              </p>
            </motion.div>
          </TabsContent>

          <TabsContent value="settings">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6 space-y-6"
            >
              <h3 className="font-display text-xl font-semibold">Paramètres du Lecteur</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Lecture automatique</h4>
                    <p className="text-sm text-muted-foreground">
                      Lire automatiquement le fichier suivant
                    </p>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Qualité haute définition</h4>
                    <p className="text-sm text-muted-foreground">
                      Préférer la qualité maximale
                    </p>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Mode boucle</h4>
                    <p className="text-sm text-muted-foreground">
                      Répéter la lecture en continu
                    </p>
                  </div>
                  <div className="w-12 h-6 bg-muted rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default MediaSpace;
