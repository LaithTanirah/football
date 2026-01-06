import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MatchTag } from "./MatchTag";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";

interface ArcadeTileProps {
  icon: ReactNode;
  title: string;
  description?: string;
  difficulty?: string;
  estTime?: string;
  available?: boolean;
  href?: string;
  variant?: "featured" | "quick" | "mode";
  className?: string;
}

export function ArcadeTile({
  icon,
  title,
  description,
  difficulty,
  estTime,
  available = true,
  href,
  variant = "quick",
  className,
}: ArcadeTileProps) {
  const baseClasses = "card-elevated relative overflow-hidden group";
  const variantClasses = {
    featured: "p-8 border-2 border-primary/40 bg-gradient-to-br from-card via-card to-primary/5",
    quick: "p-6",
    mode: "p-6",
  };

  const content = (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {/* Neon edge effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute inset-0 border-2 border-primary/30 rounded-lg blur-sm" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-4">
          <div className="text-4xl flex-shrink-0">{icon}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg mb-1">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {difficulty && <MatchTag variant="accent">{difficulty}</MatchTag>}
          {estTime && <MatchTag variant="outline">{estTime}</MatchTag>}
        </div>

        {available && href ? (
          <Link to={href}>
            <Button
              size="sm"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              <Play className="h-4 w-4" />
              Start Match
            </Button>
          </Link>
        ) : (
          <Button size="sm" variant="outline" disabled className="w-full">
            Coming Soon
          </Button>
        )}
      </div>
    </div>
  );

  return content;
}

