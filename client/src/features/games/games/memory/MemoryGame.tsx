import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { GameHeader } from "../../components/GameHeader";
import { ScoreSummary } from "../../components/ScoreSummary";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Trophy, Clock, Move } from "lucide-react";

type Difficulty = "easy" | "medium";

interface CardData {
  id: number;
  icon: string;
  flipped: boolean;
  matched: boolean;
}

const FOOTBALL_ICONS = ["⚽", "🏆", "🥅", "👕", "👟", "🎯", "⭐", "🔥", "💪", "🏃", "⚡", "🌟"];

export function MemoryGame() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [pairsFound, setPairsFound] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [bestMoves, setBestMoves] = useState<number | null>(null);

  useEffect(() => {
    if (gameStarted && !gameFinished) {
      const interval = setInterval(() => {
        if (startTime) {
          setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameFinished, startTime]);

  useEffect(() => {
    // Load best scores
    const storedTime = localStorage.getItem(`games.memory.bestTime.${difficulty}`);
    const storedMoves = localStorage.getItem(`games.memory.bestMoves.${difficulty}`);
    if (storedTime) setBestTime(parseInt(storedTime, 10));
    if (storedMoves) setBestMoves(parseInt(storedMoves, 10));
  }, [difficulty]);

  const initializeGame = (diff: Difficulty) => {
    const gridSize = diff === "easy" ? 6 : 8; // 4x3 = 12 cards (6 pairs), 4x4 = 16 cards (8 pairs)
    const icons = FOOTBALL_ICONS.slice(0, gridSize);
    const cardPairs = [...icons, ...icons];
    
    // Shuffle
    const shuffled = cardPairs
      .map((icon, index) => ({ id: index, icon, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setDifficulty(diff);
    setMoves(0);
    setPairsFound(0);
    setFlippedCards([]);
    setGameStarted(true);
    setGameFinished(false);
    setStartTime(Date.now());
    setElapsedTime(0);
  };

  const handleCardClick = (index: number) => {
    if (!gameStarted || gameFinished) return;
    if (cards[index].flipped || cards[index].matched) return;
    if (flippedCards.length >= 2) return;

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].icon === cards[second].icon) {
        // Match found
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[first].matched = true;
          updatedCards[second].matched = true;
          setCards(updatedCards);
          setFlippedCards([]);
          setPairsFound(pairsFound + 1);

          const totalPairs = difficulty === "easy" ? 6 : 8;
          if (pairsFound + 1 === totalPairs) {
            // Game won
            setGameFinished(true);
            const finalTime = Math.floor((Date.now() - (startTime || Date.now())) / 1000);
            
            // Save best scores
            if (!bestTime || finalTime < bestTime) {
              localStorage.setItem(`games.memory.bestTime.${difficulty}`, finalTime.toString());
              setBestTime(finalTime);
            }
            if (!bestMoves || moves + 1 < bestMoves) {
              localStorage.setItem(`games.memory.bestMoves.${difficulty}`, (moves + 1).toString());
              setBestMoves(moves + 1);
            }

            toast({
              title: t("games.memory.congratulations"),
              description: t("games.memory.youWon"),
            });
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[first].flipped = false;
          updatedCards[second].flipped = false;
          setCards(updatedCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!difficulty || !gameStarted) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <GameHeader title={t("games.memory.title")} />
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">{t("games.memory.selectDifficulty")}</h2>
            <div className="space-y-2">
              <Button
                onClick={() => initializeGame("easy")}
                className="w-full"
                size="lg"
              >
                {t("games.memory.easy")}
              </Button>
              <Button
                onClick={() => initializeGame("medium")}
                className="w-full"
                size="lg"
              >
                {t("games.memory.medium")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Easy: 4x3 grid (12 cards = 6 pairs), Medium: 4x4 grid (16 cards = 8 pairs)
  const gridCols = "grid-cols-4";
  const totalPairs = difficulty === "easy" ? 6 : 8;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <GameHeader title={t("games.memory.title")} />
      
      <div className="space-y-6">
        {/* Stats */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Badge variant="outline" className="gap-2">
            <Move className="h-4 w-4" />
            {t("games.memory.moves")}: {moves}
          </Badge>
          <Badge variant="outline" className="gap-2">
            <Clock className="h-4 w-4" />
            {t("games.memory.time")}: {formatTime(elapsedTime)}
          </Badge>
          <Badge variant="outline" className="gap-2">
            <Trophy className="h-4 w-4" />
            {t("games.memory.pairsFound")}: {pairsFound} / {totalPairs}
          </Badge>
        </div>

        {/* Game Grid */}
        <div className={`grid ${gridCols} gap-3 max-w-md mx-auto`}>
          {cards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`
                aspect-square rounded-lg border-2 transition-all
                ${card.matched ? "bg-primary/20 border-primary" : ""}
                ${card.flipped ? "bg-card" : "bg-muted hover:bg-muted/80"}
                ${card.flipped || card.matched ? "" : "cursor-pointer"}
              `}
              disabled={card.flipped || card.matched || gameFinished}
            >
              {card.flipped || card.matched ? (
                <span className="text-3xl">{card.icon}</span>
              ) : (
                <span className="text-2xl opacity-50">?</span>
              )}
            </button>
          ))}
        </div>

        {/* Best Scores */}
        {(bestTime !== null || bestMoves !== null) && (
          <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
            {bestTime !== null && (
              <span>
                {t("games.memory.bestTime")}: {formatTime(bestTime)}
              </span>
            )}
            {bestMoves !== null && (
              <span>
                {t("games.memory.bestMoves")}: {bestMoves}
              </span>
            )}
          </div>
        )}

        {/* Reset Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => {
              setGameStarted(false);
              setDifficulty(null);
            }}
            variant="outline"
          >
            {t("common.back")}
          </Button>
        </div>
      </div>
    </div>
  );
}

