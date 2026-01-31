import { motion } from "framer-motion";
import { Play, Disc3 } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Content */}
      <div className="container mx-auto px-6 pt-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-block mb-6"
            >
              <span className="px-4 py-2 rounded-full glass text-primary text-sm font-medium tracking-wider">
                🎵 NOUVELLE ÈRE MUSICALE
              </span>
            </motion.div>

            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-foreground">LA MUSIQUE</span>
              <br />
              <span className="gradient-text text-glow-blue">DU FUTUR</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Découvrez une nouvelle dimension sonore. Explorez notre collection exclusive de musiques futuristes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/catalog">
                <Button variant="neon" size="xl" className="group w-full sm:w-auto">
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Explorer
                </Button>
              </Link>
              <Link to="/media">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Espace Média
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-8 mt-12"
            >
              {[
                { value: "50K+", label: "Pistes" },
                { value: "1M+", label: "Clients" },
                { value: "24/7", label: "Support" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="font-display text-2xl md:text-3xl font-bold text-glow-blue text-primary">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative">
              {/* Glowing ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--accent)), hsl(var(--primary)))",
                  padding: "3px",
                }}
              >
                <div className="w-full h-full rounded-full bg-background" />
              </motion.div>

              {/* Main vinyl disc */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="relative w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-card to-background flex items-center justify-center box-glow-blue"
              >
                {/* Vinyl grooves */}
                <div className="absolute inset-4 rounded-full border border-primary/20 opacity-95 bg-secondary-foreground" />
                <div className="absolute inset-12 rounded-full border border-primary/15" />
                <div className="absolute inset-20 rounded-full border border-primary/10 bg-[#0059d6]/[0.47]" />
                
                {/* Center label */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Disc3 className="w-12 h-12 md:w-16 md:h-16 text-primary-foreground" />
                </div>
              </motion.div>

              {/* Floating particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                  className="absolute w-2 h-2 rounded-full bg-primary box-glow-blue"
                  style={{
                    top: `${20 + i * 15}%`,
                    left: i % 2 === 0 ? "-10%" : "110%",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};