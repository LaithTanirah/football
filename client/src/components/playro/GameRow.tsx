import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock } from "lucide-react";

interface GameRowProps {
  icon: ReactNode;
  title: string;
  description: string;
  difficulty?: string;
  duration: string;
  href?: string;
  available?: boolean;
}

export function GameRow({ icon, title, description, difficulty, duration, href, available = true }: GameRowProps) {
  const content = (
    <div className="flex items-center gap-4 p-5 bg-background border-2 border-border rounded-lg hover:border-primary/50 transition-all hover:shadow-md">
      <div className="text-4xl flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-lg mb-1 text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1">{description}</p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {difficulty && (
          <Badge variant="outline" className="sports-badge font-semibold">
            {difficulty}
          </Badge>
        )}
        <div className="flex items-center gap-1 text-sm text-muted-foreground font-medium">
          <Clock className="h-4 w-4" />
          {duration}
        </div>
        {available && href ? (
          <Link to={href}>
            <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-4">
              <Play className="h-4 w-4 mr-1" />
              PLAY
            </Button>
          </Link>
        ) : (
          <Button size="sm" variant="outline" disabled className="font-semibold">
            Coming Soon
          </Button>
        )}
      </div>
    </div>
  );

  return content;
}

