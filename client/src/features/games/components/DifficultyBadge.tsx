import { useTranslation } from "react-i18next";
import { Badge } from "@/ui2/components/ui/Badge";
import { GameDifficulty } from "../types";
import { cn } from "@/lib/utils";

interface DifficultyBadgeProps {
  difficulty: GameDifficulty;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const { t } = useTranslation();

  const styleMap: Record<GameDifficulty, string> = {
    Easy: "bg-green-500/20 text-green-400 border-green-500/30",
    Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Hard: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <Badge
      className={cn(
        "font-semibold border-2 glass-neon-subtle",
        styleMap[difficulty]
      )}
    >
      {t(`games.difficulty${difficulty}` as any)}
    </Badge>
  );
}

