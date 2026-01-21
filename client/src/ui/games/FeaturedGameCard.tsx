import { Link } from "react-router-dom";
import { Button } from "@/ui2/components/ui/Button";
import { Card, CardContent } from "@/ui2/components/ui/Card";
import { Play, Clock } from "lucide-react";
import { DifficultyBadge } from "@/features/games/components/DifficultyBadge";
import { cn } from "@/lib/utils";

interface FeaturedGameCardProps {
  icon: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estTime: string;
  minutesLabel: string;
  playLabel: string;
  comingSoonLabel: string;
  available: boolean;
  href: string;
}

export function FeaturedGameCard({
  icon,
  title,
  description,
  difficulty,
  estTime,
  minutesLabel,
  playLabel,
  comingSoonLabel,
  available,
  href,
}: FeaturedGameCardProps) {
  return (
    <Card className="glass-neon-strong rounded-2xl border-2 border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:border-cyan-400/50 transition-all overflow-hidden">
      <CardContent className="p-6 text-center">
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="font-bold text-2xl mb-3 text-foreground">
          {title}
        </h3>
        <p className="text-gray-300 dark:text-gray-300 mb-6 text-base leading-relaxed">
          {description}
        </p>
        <div className="flex items-center justify-center gap-3 mb-6">
          <DifficultyBadge difficulty={difficulty} />
          <div className="flex items-center gap-1.5 text-sm text-gray-300 dark:text-gray-300 font-medium">
            <Clock className="h-4 w-4 text-cyan-400" />
            <span>{estTime} {minutesLabel}</span>
          </div>
        </div>
        {available ? (
          <Link to={href} className="block">
            <Button
              size="lg"
              className="text-foreground"
            >
              <Play className="h-5 w-5 mr-2" />
              {playLabel}
            </Button>
          </Link>
        ) : (
          <Button
            size="lg"
            variant="outline"
            disabled
            className="w-full py-5 font-semibold glass-neon-subtle border-cyan-400/20 text-gray-400"
          >
            {comingSoonLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
