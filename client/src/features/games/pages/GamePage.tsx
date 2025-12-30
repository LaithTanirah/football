import { useParams, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getGameBySlug } from "../registry";
import { Skeleton } from "@/components/ui/skeleton";

export function GamePage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();

  if (!slug) {
    return <Navigate to="/games" replace />;
  }

  const game = getGameBySlug(slug);

  if (!game) {
    return <Navigate to="/games" replace />;
  }

  const GameComponent = game.component;

  return <GameComponent />;
}

