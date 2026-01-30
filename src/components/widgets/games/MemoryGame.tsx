import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

const ICONS = ["🎵", "🎸", "🎹", "🎤", "🎧", "🎺", "🎻", "🥁"];

interface Card {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryGame = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);

  const initializeGame = () => {
    const gameIcons = [...ICONS, ...ICONS];
    const shuffled = gameIcons
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({
        id: index,
        icon,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setIsLocked(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (id: number) => {
    if (isLocked) return;
    if (flippedCards.length === 2) return;
    if (cards[id].isFlipped || cards[id].isMatched) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setIsLocked(true);

      const [first, second] = newFlipped;
      if (cards[first].icon === cards[second].icon) {
        // Match!
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].isMatched = true;
          matchedCards[second].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);
          setMatches((m) => m + 1);
          setIsLocked(false);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (matches === 8) {
      if (bestScore === null || moves < bestScore) {
        setBestScore(moves);
      }
    }
  }, [matches, moves, bestScore]);

  const isWon = matches === 8;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-display text-sm font-semibold text-primary">🧠 Memory</h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Coups: {moves}</span>
          {bestScore && (
            <span className="text-xs text-secondary flex items-center gap-1">
              <Trophy className="w-3 h-3" /> {bestScore}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick(card.id)}
            className={`
              aspect-square flex items-center justify-center rounded-lg cursor-pointer text-xl
              transition-all duration-300
              ${
                card.isFlipped || card.isMatched
                  ? "bg-primary/20 border-primary"
                  : "bg-card hover:bg-card/80"
              }
              ${card.isMatched ? "opacity-50" : ""}
              border
            `}
          >
            <motion.span
              initial={{ rotateY: 180 }}
              animate={{ rotateY: card.isFlipped || card.isMatched ? 0 : 180 }}
              transition={{ duration: 0.3 }}
              style={{ backfaceVisibility: "hidden" }}
            >
              {card.isFlipped || card.isMatched ? card.icon : ""}
            </motion.span>
          </motion.div>
        ))}
      </div>

      {isWon && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-3 p-2 bg-primary/20 rounded-lg"
        >
          <p className="font-display text-sm font-bold text-primary">
            🎉 Félicitations!
          </p>
          <p className="text-xs text-muted-foreground">
            Terminé en {moves} coups
          </p>
        </motion.div>
      )}

      <div className="flex justify-center">
        <Button variant="glass" size="sm" onClick={initializeGame}>
          <RotateCcw className="w-4 h-4 mr-1" /> Nouvelle partie
        </Button>
      </div>
    </motion.div>
  );
};
