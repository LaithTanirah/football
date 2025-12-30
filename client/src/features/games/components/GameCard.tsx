import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DifficultyBadge } from "./DifficultyBadge";
import { Game } from "../types";
import { Clock } from "lucide-react";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const { t } = useTranslation();

  const difficultyKey = `games.difficulty${game.difficulty}` as keyof typeof import("@/lib/i18n/locales/en.json")["games"];

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="text-4xl">{game.icon}</div>
          <DifficultyBadge difficulty={game.difficulty} />
        </div>
        <CardTitle>{t(game.titleKey as any)}</CardTitle>
        <CardDescription>{t(game.descKey as any)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{game.estTime} {t("games.minutes")}</span>
        </div>
      </CardContent>
      <CardFooter>
        {game.available ? (
          <Link to={`/games/${game.slug}`} className="w-full">
            <Button className="w-full">{t("games.play")}</Button>
          </Link>
        ) : (
          <Button className="w-full" variant="outline" disabled>
            {t("games.comingSoon")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

