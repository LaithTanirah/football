import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { MapPin, Users, Eye } from "lucide-react";

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
  return (
    <Link to={href} className="block">
      <div className="flex items-center gap-4 p-5 bg-background border-2 border-border rounded-lg hover:border-primary/50 transition-all hover:shadow-md">
        <StatusBadge status={status} />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg mb-2 text-foreground">{name}</h3>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {city}
            </span>
            {season && <span>• {season}</span>}
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {teamCount} teams
            </span>
            {owner && <span>• Owner: {owner}</span>}
          </div>
        </div>
        <Button size="sm" variant="outline" className="gap-2 font-semibold">
          <Eye className="h-3 w-3" />
          View
        </Button>
      </div>
    </Link>
  );
}

