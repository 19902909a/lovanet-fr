import { motion } from "framer-motion";
import { Gamepad2 } from "lucide-react";
import { useState } from "react";
import { SnakeGame } from "./games/SnakeGame";
import { MemoryGame } from "./games/MemoryGame";
import { MusicQuiz } from "./games/MusicQuiz";

type GameType = "snake" | "memory" | "quiz";

const games = [
{ id: "snake" as GameType, name: "Snake", icon: "🐍" },
{ id: "memory" as GameType, name: "Memory", icon: "🧠" },
{ id: "quiz" as GameType, name: "Quiz", icon: "🎵" }];


export const GamesWidget = () => {
  const [activeGame, setActiveGame] = useState<GameType>("snake");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4">

      {/* Game Selector */}
      <div className="glass rounded-xl p-4">
        




        <div className="flex gap-2">
          {games.map((game) =>
          <button
            key={game.id}
            onClick={() => setActiveGame(game.id)}
            className={`
                flex-1 p-3 rounded-lg text-center transition-all
                ${
            activeGame === game.id ?
            "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.5)]" :
            "bg-card hover:bg-card/80 text-muted-foreground"}
              `
            }>

              <div className="text-2xl mb-1">{game.icon}</div>
              <div className="text-xs font-medium">{game.name}</div>
            </button>
          )}
        </div>
      </div>

      {/* Active Game */}
      {activeGame === "snake" && <SnakeGame />}
      {activeGame === "memory" && <MemoryGame />}
      {activeGame === "quiz" && <MusicQuiz />}
    </motion.div>);

};