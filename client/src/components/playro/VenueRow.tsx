import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign } from "lucide-react";

interface VenueRowProps {
  name: string;
  city: string;
  type: string;
  price: string;
  imageUrl?: string;
  href: string;
}

export function VenueRow({ name, city, type, price, imageUrl, href }: VenueRowProps) {
  const { t } = useTranslation();
  
  return (
    <Link to={href} className="block card-hover">
      <div className="flex gap-4 p-6 bg-card border border-border rounded-lg transition-all">
        {/* Image */}
        <div className="w-40 h-28 flex-shrink-0 rounded-md overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Venue';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <MapPin className="h-8 w-8" />
            </div>
          )}
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-lg mb-2 text-foreground">{name}</h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {city}
              </span>
              <Badge variant="outline">
                {type}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 font-semibold text-foreground">
              <DollarSign className="h-4 w-4" />
              {price}
            </div>
            <Button size="sm" variant="outline">
              {t("pitches.viewDetails")}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}

