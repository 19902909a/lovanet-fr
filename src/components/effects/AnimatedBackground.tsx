import { motion } from "framer-motion";

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface to-background" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Floating orbs with royal blue */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{ background: "hsl(var(--royal-blue) / 0.4)" }}
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.25, 0.15],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] rounded-full blur-[150px]"
        style={{ background: "hsl(var(--royal-blue-light) / 0.3)" }}
      />
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[180px]"
        style={{ background: "hsl(var(--accent) / 0.15)" }}
      />

      {/* White flash overlay */}
      <motion.div
        animate={{
          opacity: [0, 0, 0.12, 0, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          times: [0, 0.9, 0.95, 1, 1],
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-white pointer-events-none"
      />

      {/* Periodic shine sweeps */}
      <motion.div
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 6,
          ease: "easeInOut",
        }}
        className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
      />

      {/* Scan lines */}
      <motion.div
        animate={{ y: ["-100%", "100vh"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />

      {/* Particle dots */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/40"
          initial={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1920),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1080),
          }}
          animate={{
            y: [null, Math.random() * -200 - 100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-primary/10 to-transparent" />

      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.4)_100%)]" />
    </div>
  );
};
