import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocaleStore } from "@/store/localeStore";
import { GameHeader } from "../../components/GameHeader";
import { ScoreSummary } from "../../components/ScoreSummary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import hangmanWords from "../../data/hangmanWords.json";

const MAX_LIVES = 6;

export function HangmanGame() {
  const { t } = useTranslation();
  const { locale } = useLocaleStore();
  const { toast } = useToast();
  const [word, setWord] = useState<string>("");
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [lives, setLives] = useState(MAX_LIVES);
  const [gameFinished, setGameFinished] = useState(false);
  const [won, setWon] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState<number | null>(null);

  useEffect(() => {
    // Load best streak
    const stored = localStorage.getItem("games.hangman.bestStreak");
    if (stored) {
      setBestStreak(parseInt(stored, 10));
    }
    startNewGame();
  }, [locale]);

  const startNewGame = () => {
    const words = (hangmanWords as any)[locale] || (hangmanWords as any).en;
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setWord(randomWord);
    setGuessedLetters(new Set());
    setLives(MAX_LIVES);
    setGameFinished(false);
    setWon(false);
  };

  const handleLetterGuess = (letter: string) => {
    if (gameFinished || guessedLetters.has(letter)) return;

    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);

    // Check if letter is in word
    // For Arabic, we need to handle it differently
    const isRTL = locale === "ar";
    const wordLetters = isRTL
      ? Array.from(word.replace(/\s/g, ""))
      : word.replace(/\s/g, "").toUpperCase().split("");
    const normalizedLetter = isRTL ? letter : letter.toUpperCase();
    const normalizedWordLetters = isRTL 
      ? wordLetters 
      : wordLetters.map(l => l.toUpperCase());

    if (!normalizedWordLetters.includes(normalizedLetter)) {
      const newLives = lives - 1;
      setLives(newLives);

      if (newLives === 0) {
        setGameFinished(true);
        setWon(false);
        // Reset streak on loss
        setStreak(0);
        toast({
          title: t("games.hangman.youLost"),
          description: `${t("games.hangman.correctWord")}: ${word}`,
          variant: "destructive",
        });
      }
    } else {
      // Check if word is complete
      const allLettersGuessed = wordLetters.every((l) => {
        const normalizedL = isRTL ? l : l.toUpperCase();
        return newGuessed.has(normalizedL);
      });

      if (allLettersGuessed) {
        setGameFinished(true);
        setWon(true);
        const newStreak = streak + 1;
        setStreak(newStreak);
        
        if (!bestStreak || newStreak > bestStreak) {
          localStorage.setItem("games.hangman.bestStreak", newStreak.toString());
          setBestStreak(newStreak);
        }

        toast({
          title: t("games.hangman.youWon"),
          variant: "default",
        });
      }
    }
  };

  const getDisplayWord = () => {
    if (!word) return [];
    const isRTL = locale === "ar";
    return Array.from(word).map((char) => {
      if (char === " ") return " ";
      const normalizedChar = isRTL ? char : char.toUpperCase();
      return guessedLetters.has(normalizedChar) ? char : "_";
    });
  };

  const getAvailableLetters = () => {
    const isRTL = locale === "ar";
    if (isRTL) {
      // Arabic alphabet
      return "ابتثجحخدذرزسشصضطظعغفقكلمنهوي".split("");
    } else {
      // English alphabet
      return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    }
  };

  const renderHangman = () => {
    const parts = [
      lives < 6, // head
      lives < 5, // body
      lives < 4, // left arm
      lives < 3, // right arm
      lives < 2, // left leg
      lives < 1, // right leg
    ];

    return (
      <div className="flex flex-col items-center gap-1 font-mono text-2xl">
        <div>{"┌───┐"}</div>
        <div>{`│   ${parts[0] ? "O" : " "}`}</div>
        <div>{`│  ${parts[2] ? "/" : " "}${parts[1] ? "|" : " "}${parts[3] ? "\\" : " "}`}</div>
        <div>{`│  ${parts[4] ? "/" : " "} ${parts[5] ? "\\" : " "}`}</div>
        <div>{"└─────┘"}</div>
      </div>
    );
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <GameHeader title={t("games.hangman.title")} />
      
      <div className="space-y-6">
        {/* Stats */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Badge variant={lives <= 2 ? "destructive" : "outline"}>
            {t("games.hangman.lives")}: {lives} / {MAX_LIVES}
          </Badge>
          {bestStreak !== null && (
            <Badge variant="outline">
              {t("games.hangman.bestStreak")}: {bestStreak}
            </Badge>
          )}
          {streak > 0 && (
            <Badge variant="default">
              {t("games.hangman.bestStreak")}: {streak}
            </Badge>
          )}
        </div>

        {/* Hangman Drawing */}
        <Card>
          <CardContent className="p-6 flex justify-center">
            {renderHangman()}
          </CardContent>
        </Card>

        {/* Word Display */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-mono tracking-widest">
              {getDisplayWord().map((char, i) => (
                <span key={i} className="inline-block mx-1 min-w-[1ch]">
                  {char}
                </span>
              ))}
            </CardTitle>
            <CardDescription className="text-center">
              {t("games.hangman.word")}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Keyboard */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-7 sm:grid-cols-9 md:grid-cols-10 gap-2">
              {getAvailableLetters().map((letter) => {
                const isGuessed = guessedLetters.has(letter);
                const isRTL = locale === "ar";
                const wordChars = Array.from(word.replace(/\s/g, ""));
                const normalizedWordChars = isRTL 
                  ? wordChars 
                  : wordChars.map(c => c.toUpperCase());
                const normalizedLetter = isRTL ? letter : letter.toUpperCase();
                const isWrong = isGuessed && word && !normalizedWordChars.includes(normalizedLetter);
                
                return (
                  <Button
                    key={letter}
                    variant={isWrong ? "destructive" : isGuessed ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => handleLetterGuess(letter)}
                    disabled={isGuessed || gameFinished}
                    className="min-w-[2.5rem]"
                  >
                    {letter}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center gap-2">
          <Button
            onClick={startNewGame}
            variant="outline"
            disabled={!gameFinished && lives > 0}
          >
            {gameFinished ? t("games.hangman.playAgain") : t("games.hangman.newWord")}
          </Button>
        </div>
      </div>
    </div>
  );
}

