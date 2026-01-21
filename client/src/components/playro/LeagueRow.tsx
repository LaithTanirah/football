import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { MapPin, Users, Eye } from "lucide-react";
import { useDirection } from "@/hooks/useDirection";
import { cn } from "@/lib/utils";

interface LeagueRowProps {
  name: string;
  city: string;
  season?: string;
  teamCount: number;
  owner?: string;
  status: string;
  href: string;
}

export function LeagueRow({ name, city, season, teamCount, owner, status, href }: LeagueRowProps) {
  const { isRTL } = useDirection();
  
  return (
    <Link to={href} className="block">
      <div className={cn(
        "flex items-center gap-4 p-5 bg-background border-2 border-border rounded-lg hover:border-primary/50 transition-all hover:shadow-md",
        isRTL ? "flex-row-reverse" : "flex-row"
      )}>
        <StatusBadge status={status} />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg mb-2 text-foreground">{name}</h3>
          <div className={cn(
            "flex flex-wrap items-center gap-3 text-sm text-muted-foreground",
            isRTL ? "flex-row-reverse justify-end" : ""
          )}>
            <span className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
              <MapPin className="h-3 w-3" />
              {city}
            </span>
            {season && <span>• {season}</span>}
            <span className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
              <Users className="h-3 w-3" />
              {teamCount} teams
            </span>
            {owner && <span>• Owner: {owner}</span>}
          </div>
        </div>
        <Button size="sm" variant="outline" className={cn("gap-2 font-semibold", isRTL && "flex-row-reverse")}>
          <Eye className="h-3 w-3" />
          View
        </Button>
      </div>
    </Link>
  );
}

