import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { GameDifficulty } from "../types";

interface DifficultyBadgeProps {
  difficulty: GameDifficulty;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const { t } = useTranslation();

  const variantMap: Record<GameDifficulty, "default" | "secondary" | "warning"> = {
    Easy: "secondary",
    Medium: "default",
    Hard: "warning",
  };

  return (
    <Badge variant={variantMap[difficulty]}>
      {t(`games.difficulty${difficulty}` as any)}
    </Badge>
  );
}

