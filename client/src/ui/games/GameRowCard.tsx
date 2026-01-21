import { Link } from "react-router-dom";
import { Button } from "@/ui2/components/ui/Button";
import { Card, CardContent } from "@/ui2/components/ui/Card";
import { Badge } from "@/ui2/components/ui/Badge";
import { Play, Clock } from "lucide-react";
import { DifficultyBadge } from "@/features/games/components/DifficultyBadge";
import { cn } from "@/lib/utils";

interface GameRowCardProps {
  icon: string;
  title: string;
  description: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  duration: string;
  href?: string;
  available?: boolean;
  playLabel: string;
  comingSoonLabel: string;
}

export function GameRowCard({
  icon,
  title,
  description,
  difficulty,
  duration,
  href,
  available = true,
  playLabel,
  comingSoonLabel,
}: GameRowCardProps) {
  const content = (
    <Card className="glass-neon-strong rounded-2xl border-2 border-cyan-400/20 hover:border-cyan-400/40 transition-all overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl flex-shrink-0">{icon}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg mb-1 text-foreground truncate">
              {title}
            </h3>
            <p className="text-sm text-gray-300 dark:text-gray-300 line-clamp-1">
              {description}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {difficulty && <DifficultyBadge difficulty={difficulty} />}
            <div className="flex items-center gap-1.5 text-sm text-gray-300 dark:text-gray-300 font-medium">
              <Clock className="h-4 w-4 text-cyan-400" />
              <span>{duration}</span>
            </div>
            {available && href ? (
              <Link to={href}>
                <Button
                  size="sm"
                  className="text-foreground"
                >
                  <Play className="h-4 w-4 mr-1" />
                  {playLabel}
                </Button>
              </Link>
            ) : (
              <Button
                size="sm"
                variant="outline"
                disabled
                className="font-semibold glass-neon-subtle border-cyan-400/20 text-gray-400"
              >
                {comingSoonLabel}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return content;
}
