import { Game } from "./types";
import { QuizGame } from "./games/quiz/QuizGame";
import { MemoryGame } from "./games/memory/MemoryGame";
import { HangmanGame } from "./games/hangman/HangmanGame";
import { TicTacToeGame } from "./games/tictactoe/TicTacToeGame";
import { GuessPlayerGame } from "./games/guessPlayer/GuessPlayerGame";

export const GAMES: Game[] = [
  {
    slug: "quiz",
    titleKey: "games.quiz.title",
    descKey: "games.quiz.description",
    category: "Quiz",
    difficulty: "Medium",
    estTime: "2-5",
    icon: "⚽",
    component: QuizGame,
    available: true,
  },
  {
    slug: "memory",
    titleKey: "games.memory.title",
    descKey: "games.memory.description",
    category: "Memory",
    difficulty: "Easy",
    estTime: "3-7",
    icon: "🧠",
    component: MemoryGame,
    available: true,
  },
  {
    slug: "hangman",
    titleKey: "games.hangman.title",
    descKey: "games.hangman.description",
    category: "Puzzle",
    difficulty: "Medium",
    estTime: "2-5",
    icon: "🎯",
    component: HangmanGame,
    available: true,
  },
  {
    slug: "tictactoe",
    titleKey: "games.tictactoe.title",
    descKey: "games.tictactoe.description",
    category: "Arcade",
    difficulty: "Easy",
    estTime: "1-3",
    icon: "⭕",
    component: TicTacToeGame,
    available: true,
  },
  {
    slug: "guess-player",
    titleKey: "games.guessPlayer.title",
    descKey: "games.guessPlayer.description",
    category: "Quiz",
    difficulty: "Hard",
    estTime: "3-5",
    icon: "👤",
    component: GuessPlayerGame,
    available: false,
  },
];

export function getGameBySlug(slug: string): Game | undefined {
  return GAMES.find((game) => game.slug === slug);
}

