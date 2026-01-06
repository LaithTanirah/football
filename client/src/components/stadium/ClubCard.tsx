import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MatchTag } from "./MatchTag";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";

interface ClubCardProps {
  name: string;
  city?: string;
  membersCount?: number;
  captain?: string;
  logoUrl?: string;
  preferredPitch?: boolean;
  href: string;
  className?: string;
}

export function ClubCard({
  name,
  city,
  membersCount,
  captain,
  logoUrl,
  preferredPitch,
  href,
  className,
}: ClubCardProps) {
  return (
    <div className={cn("card-elevated overflow-hidden", className)}>
      {/* Club header with color band */}
      <div className="h-2 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          {logoUrl && (
            <div className="relative flex-shrink-0">
              <div className="h-16 w-16 rounded-full border-2 border-primary/30 overflow-hidden bg-muted ring-2 ring-primary/10">
                <img
                  src={logoUrl}
                  alt={name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-xl truncate">{name}</h3>
              {preferredPitch && <MatchTag variant="accent">Preferred</MatchTag>}
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              {city && <div>{city}</div>}
              {membersCount !== undefined && (
                <div>{membersCount} members</div>
              )}
              {captain && <div className="text-xs">Captain: {captain}</div>}
            </div>
          </div>
        </div>
        <Link to={href}>
          <Button size="sm" variant="outline" className="w-full gap-2">
            <Eye className="h-3 w-3" />
            View Squad
          </Button>
        </Link>
      </div>
    </div>
  );
}

