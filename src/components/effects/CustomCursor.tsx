import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Add hover detection for clickable elements
    const clickables = document.querySelectorAll("a, button, input, [role='button'], .clickable");
    clickables.forEach((el) => {
      el.addEventListener("mouseenter", handleHoverStart);
      el.addEventListener("mouseleave", handleHoverEnd);
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      clickables.forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverStart);
        el.removeEventListener("mouseleave", handleHoverEnd);
      });
    };
  }, []);

  return (
    <>
      {/* Outer targeting ring */}
      <motion.div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 30,
          y: mousePosition.y - 30,
          scale: isHovering ? 1.5 : isClicking ? 0.8 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60" className="animate-spin" style={{ animationDuration: "8s" }}>
          {/* Outer circle */}
          <circle
            cx="30"
            cy="30"
            r="28"
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeDasharray="8 4"
            opacity="0.6"
          />
          {/* Inner targeting marks */}
          <line x1="30" y1="5" x2="30" y2="15" stroke="white" strokeWidth="1.5" opacity="0.8" />
          <line x1="30" y1="45" x2="30" y2="55" stroke="white" strokeWidth="1.5" opacity="0.8" />
          <line x1="5" y1="30" x2="15" y2="30" stroke="white" strokeWidth="1.5" opacity="0.8" />
          <line x1="45" y1="30" x2="55" y2="30" stroke="white" strokeWidth="1.5" opacity="0.8" />
          {/* Corner brackets */}
          <path d="M10 20 L10 10 L20 10" fill="none" stroke="white" strokeWidth="1.5" opacity="0.7" />
          <path d="M50 20 L50 10 L40 10" fill="none" stroke="white" strokeWidth="1.5" opacity="0.7" />
          <path d="M10 40 L10 50 L20 50" fill="none" stroke="white" strokeWidth="1.5" opacity="0.7" />
          <path d="M50 40 L50 50 L40 50" fill="none" stroke="white" strokeWidth="1.5" opacity="0.7" />
        </svg>
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] w-3 h-3 rounded-full bg-white mix-blend-difference"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: isClicking ? 2 : 1,
        }}
        transition={{ type: "spring", stiffness: 800, damping: 35, mass: 0.2 }}
      >
        <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-50" />
      </motion.div>

      {/* Zoom effect ring on hover */}
      {isHovering && (
        <motion.div
          className="fixed pointer-events-none z-[9998]"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            x: mousePosition.x - 50,
            y: mousePosition.y - 50,
            scale: 1,
            opacity: 1,
          }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="w-[100px] h-[100px] rounded-full border-2 border-primary/50 box-glow-blue" />
        </motion.div>
      )}
    </>
  );
};
