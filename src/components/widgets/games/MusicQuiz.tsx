import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RotateCcw, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Quel genre musical est associé aux années 80?",
    options: ["Dubstep", "Synthwave", "Drum & Bass", "House"],
    correctAnswer: 1,
    category: "Histoire",
  },
  {
    id: 2,
    question: "Quel instrument est essentiel dans le synthwave?",
    options: ["Guitare acoustique", "Violon", "Synthétiseur", "Harmonica"],
    correctAnswer: 2,
    category: "Instruments",
  },
  {
    id: 3,
    question: "Quelle est la fréquence standard d'accordage?",
    options: ["432 Hz", "440 Hz", "420 Hz", "450 Hz"],
    correctAnswer: 1,
    category: "Technique",
  },
  {
    id: 4,
    question: "Qui a popularisé le terme 'Vaporwave'?",
    options: ["Daft Punk", "Kraftwerk", "Macintosh Plus", "Giorgio Moroder"],
    correctAnswer: 2,
    category: "Culture",
  },
  {
    id: 5,
    question: "Quel BPM est typique du future bass?",
    options: ["70-90 BPM", "100-120 BPM", "130-150 BPM", "170-180 BPM"],
    correctAnswer: 2,
    category: "Technique",
  },
  {
    id: 6,
    question: "Quel pays est le berceau de la techno?",
    options: ["Allemagne", "France", "USA", "Royaume-Uni"],
    correctAnswer: 2,
    category: "Histoire",
  },
  {
    id: 7,
    question: "Qu'est-ce qu'un 'drop' en musique électronique?",
    options: ["Un silence", "Un moment de climax", "Une fin de chanson", "Un solo"],
    correctAnswer: 1,
    category: "Technique",
  },
  {
    id: 8,
    question: "Quel logiciel est populaire pour la production musicale?",
    options: ["Photoshop", "Ableton Live", "Excel", "Word"],
    correctAnswer: 1,
    category: "Production",
  },
];

export const MusicQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [highScore, setHighScore] = useState(0);

  const initializeQuiz = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 5);
    setShuffledQuestions(shuffled);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameOver(false);
  };

  useEffect(() => {
    initializeQuiz();
  }, []);

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return;

    setSelectedAnswer(answerIndex);
    setShowResult(true);

    if (answerIndex === shuffledQuestions[currentQuestion].correctAnswer) {
      setScore((s) => s + 20);
    }

    setTimeout(() => {
      if (currentQuestion < shuffledQuestions.length - 1) {
        setCurrentQuestion((q) => q + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameOver(true);
        const finalScore = answerIndex === shuffledQuestions[currentQuestion].correctAnswer
          ? score + 20
          : score;
        if (finalScore > highScore) {
          setHighScore(finalScore);
        }
      }
    }, 1500);
  };

  if (shuffledQuestions.length === 0) return null;

  const question = shuffledQuestions[currentQuestion];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-display text-sm font-semibold text-primary">🎵 Quiz Musical</h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {currentQuestion + 1}/{shuffledQuestions.length}
          </span>
          <span className="text-xs text-secondary flex items-center gap-1">
            <Trophy className="w-3 h-3" /> {score}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!gameOver ? (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-3">
              <span className="text-xs text-primary/60 px-2 py-0.5 bg-primary/10 rounded-full">
                {question.category}
              </span>
              <p className="mt-2 text-sm font-medium">{question.question}</p>
            </div>

            <div className="space-y-2">
              {question.options.map((option, index) => {
                const isCorrect = index === question.correctAnswer;
                const isSelected = index === selectedAnswer;

                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: showResult ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(index)}
                    disabled={showResult}
                    className={`
                      w-full p-3 rounded-lg text-left text-sm transition-all flex items-center justify-between
                      ${
                        showResult
                          ? isCorrect
                            ? "bg-green-500/20 border-green-500 text-green-400"
                            : isSelected
                            ? "bg-red-500/20 border-red-500 text-red-400"
                            : "bg-card/50 border-border"
                          : "bg-card/50 hover:bg-card border-border hover:border-primary/50"
                      }
                      border
                    `}
                  >
                    <span>{option}</span>
                    {showResult && isCorrect && <Check className="w-4 h-4" />}
                    {showResult && isSelected && !isCorrect && <X className="w-4 h-4" />}
                  </motion.button>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-1 bg-card rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%` }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <div className="text-4xl mb-2">
              {score >= 80 ? "🏆" : score >= 60 ? "🎉" : score >= 40 ? "👍" : "💪"}
            </div>
            <p className="font-display text-xl font-bold text-primary mb-1">
              {score} points
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              {score >= 80
                ? "Excellent! Tu es un expert!"
                : score >= 60
                ? "Très bien joué!"
                : score >= 40
                ? "Pas mal du tout!"
                : "Continue à apprendre!"}
            </p>
            {highScore > 0 && (
              <p className="text-xs text-secondary mb-3">
                Meilleur score: {highScore}
              </p>
            )}
            <Button variant="neon" size="sm" onClick={initializeQuiz}>
              <RotateCcw className="w-4 h-4 mr-1" /> Rejouer
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
