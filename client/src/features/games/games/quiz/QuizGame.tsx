import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocaleStore } from "@/store/localeStore";
import { GameHeader } from "../../components/GameHeader";
import { ScoreSummary } from "../../components/ScoreSummary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import quizQuestions from "../../data/quizQuestions.json";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  category: string;
  difficulty: string;
}

export function QuizGame() {
  const { t } = useTranslation();
  const { locale } = useLocaleStore();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);

  useEffect(() => {
    // Load questions based on locale
    const localeQuestions = (quizQuestions as any)[locale] || (quizQuestions as any).en;
    // Shuffle and take 10 questions
    const shuffled = [...localeQuestions].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffled);

    // Load best score from localStorage
    const stored = localStorage.getItem("games.quiz.bestScore");
    if (stored) {
      setBestScore(parseInt(stored, 10));
    }
  }, [locale]);

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctIndex;

    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: t("games.quiz.correct"),
        variant: "default",
      });
    } else {
      toast({
        title: t("games.quiz.incorrect"),
        variant: "destructive",
      });
    }

    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Game finished
      setGameFinished(true);
      // Save best score
      const currentBest = bestScore || 0;
      if (score > currentBest) {
        localStorage.setItem("games.quiz.bestScore", score.toString());
        setBestScore(score);
      }
    }
  };

  const handlePlayAgain = () => {
    // Reload questions
    const localeQuestions = (quizQuestions as any)[locale] || (quizQuestions as any).en;
    const shuffled = [...localeQuestions].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setGameFinished(false);
  };

  if (questions.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <GameHeader title={t("games.quiz.title")} />
        <div className="text-center">{t("common.loading")}</div>
      </div>
    );
  }

  if (gameFinished) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <GameHeader title={t("games.quiz.title")} />
        <div className="space-y-6">
          <ScoreSummary
            title={t("games.quiz.finalScore")}
            score={score}
            total={questions.length}
            bestScore={bestScore || undefined}
            bestScoreLabel={t("games.quiz.bestScore")}
          />
          <div className="flex justify-center">
            <Button onClick={handlePlayAgain} size="lg">
              {t("games.quiz.playAgain")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <GameHeader title={t("games.quiz.title")} />
      
      <div className="space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-between">
          <Badge variant="outline">
            {t("games.quiz.question")} {currentQuestionIndex + 1} {t("games.quiz.of")} {questions.length}
          </Badge>
          <Badge variant="secondary">
            {t("games.quiz.score")}: {score} / {questions.length}
          </Badge>
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
              if (showResult) {
                if (index === currentQuestion.correctIndex) {
                  variant = "default";
                } else if (index === selectedAnswer && index !== currentQuestion.correctIndex) {
                  variant = "destructive";
                }
              }

              return (
                <Button
                  key={index}
                  variant={variant}
                  className="w-full justify-start text-left h-auto py-3 px-4"
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                >
                  {option}
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          {!showResult ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              size="lg"
            >
              {t("games.quiz.submit")}
            </Button>
          ) : (
            <Button onClick={handleNext} size="lg">
              {currentQuestionIndex < questions.length - 1
                ? t("games.quiz.next")
                : t("games.quiz.finalScore")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

