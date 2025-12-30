import { useState } from "react";
import { useTranslation } from "react-i18next";
import { GameHeader } from "../../components/GameHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

type Player = "X" | "O" | null;
type Board = Player[];

export function TicTacToeGame() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [gameFinished, setGameFinished] = useState(false);
  const [winner, setWinner] = useState<"X" | "O" | "draw" | null>(null);

  const checkWinner = (board: Board): "X" | "O" | "draw" | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6], // diagonals
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] as "X" | "O";
      }
    }

    if (board.every((cell) => cell !== null)) {
      return "draw";
    }

    return null;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || gameFinished) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    
    if (result) {
      setGameFinished(true);
      setWinner(result);
      
      if (result === "draw") {
        toast({
          title: t("games.tictactoe.draw"),
        });
      } else {
        setScores((prev) => ({
          ...prev,
          [result]: prev[result] + 1,
        }));
        toast({
          title: `${t("games.tictactoe.winner")}: ${t(`games.tictactoe.player${result === "X" ? "1" : "2"}`)}`,
        });
      }
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const handleNewGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setGameFinished(false);
    setWinner(null);
  };

  const handleReset = () => {
    handleNewGame();
    setScores({ X: 0, O: 0 });
  };

  const getPlayerIcon = (player: Player) => {
    if (player === "X") return "⚽";
    if (player === "O") return "🥅";
    return null;
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <GameHeader title={t("games.tictactoe.title")} />
      
      <div className="space-y-6">
        {/* Score and Turn */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{t("games.tictactoe.player1")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scores.X}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{t("games.tictactoe.currentTurn")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={currentPlayer === "X" ? "default" : "secondary"} className="text-lg">
                {getPlayerIcon(currentPlayer)}
              </Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{t("games.tictactoe.player2")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scores.O}</div>
            </CardContent>
          </Card>
        </div>

        {/* Game Board */}
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-2">
              {board.map((cell, index) => (
                <button
                  key={index}
                  onClick={() => handleCellClick(index)}
                  disabled={cell !== null || gameFinished}
                  className={`
                    aspect-square rounded-lg border-2 text-4xl font-bold
                    transition-all hover:bg-muted
                    ${cell ? "cursor-not-allowed" : "cursor-pointer"}
                    ${winner && 
                      (winner === "X" && cell === "X" ? "bg-primary/20 border-primary" :
                       winner === "O" && cell === "O" ? "bg-primary/20 border-primary" : "")
                    }
                  `}
                >
                  {getPlayerIcon(cell)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center gap-2">
          <Button onClick={handleNewGame} variant="outline">
            {t("games.tictactoe.newGame")}
          </Button>
          <Button onClick={handleReset} variant="outline">
            {t("games.tictactoe.reset")}
          </Button>
        </div>
      </div>
    </div>
  );
}

