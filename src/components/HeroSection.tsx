import { motion } from "framer-motion";
import { Play, Headphones } from "lucide-react";
import { Button } from "./ui/button";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Subtle Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-ios-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-32 w-96 h-96 bg-ios-purple/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ios-pink/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-ios-green rounded-full animate-pulse-soft" />
              Nouvelle collection disponible
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
              Votre musique,
              <br />
              <span className="text-gradient">votre style</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Découvrez une collection exclusive de musique premium. 
              Suivez vos commandes en temps réel avec notre traceur personnalisé.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="ios" size="xl" className="group">
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Découvrir
              </Button>
              <Button variant="ios-secondary" size="xl">
                <Headphones className="w-5 h-5" />
                Écouter
              </Button>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-8 mt-12 justify-center lg:justify-start"
            >
              {[
                { value: "50K+", label: "Pistes" },
                { value: "1M+", label: "Clients" },
                { value: "4.9★", label: "Note" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl md:text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual Element - iOS style card stack */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              {/* Stacked cards effect */}
              <motion.div
                animate={{ rotate: -6 }}
                className="absolute inset-4 rounded-3xl bg-ios-purple/20 shadow-ios-lg"
              />
              <motion.div
                animate={{ rotate: 3 }}
                className="absolute inset-2 rounded-3xl bg-ios-blue/20 shadow-ios-lg"
              />
              
              {/* Main card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-3xl bg-card shadow-ios-lg overflow-hidden"
              >
                <div className="absolute inset-0 gradient-ios opacity-90" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-6"
                  >
                    <Headphones className="w-10 h-10 md:w-12 md:h-12" />
                  </motion.div>
                  <div className="text-center">
                    <h3 className="text-xl md:text-2xl font-bold mb-2">Premium Sound</h3>
                    <p className="text-white/80 text-sm">Qualité studio 24-bit</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-4 -right-4 px-4 py-2 rounded-2xl bg-card shadow-ios-md text-sm font-medium"
              >
                🎵 +200 nouvelles pistes
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 px-4 py-2 rounded-2xl bg-card shadow-ios-md text-sm font-medium"
              >
                ⚡ Livraison instantanée
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
