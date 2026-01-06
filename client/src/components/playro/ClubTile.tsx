import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, MapPin } from "lucide-react";

interface ClubTileProps {
  name: string;
  city?: string;
  membersCount?: number;
  captain?: string;
  logoUrl?: string;
  href: string;
}

export function ClubTile({ name, city, membersCount, captain, logoUrl, href }: ClubTileProps) {
  // Use hash of name to deterministically assign color
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const headerColor = hash % 2 === 0 ? "bg-primary" : "bg-secondary";
  
  return (
    <Link to={href} className="block">
      <div className="bg-background border-2 border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg">
        {/* Colored header band */}
        <div className={`h-3 ${headerColor}`} />
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            {logoUrl && (
              <div className="h-16 w-16 rounded-full border-2 border-primary/30 overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={logoUrl}
                  alt={name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl mb-2 text-foreground">{name}</h3>
              {city && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                  <MapPin className="h-3 w-3" />
                  {city}
                </div>
              )}
              {membersCount !== undefined && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                  <Users className="h-3 w-3" />
                  {membersCount} members
                </div>
              )}
              {captain && (
                <p className="text-xs text-muted-foreground">Captain: {captain}</p>
              )}
            </div>
          </div>
          <Button size="sm" variant="outline" className="w-full font-semibold">
            View Squad
          </Button>
        </div>
      </div>
    </Link>
  );
}

