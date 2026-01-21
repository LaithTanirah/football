import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MapPin, DollarSign, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PitchCardProps {
  pitch: {
    id: string;
    name: string;
    city: string;
    address?: string;
    type?: string;
    indoor?: boolean;
    description?: string;
    pricePerHour: number;
    images?: string[];
  };
  t: (key: string) => string;
}

export function ModernPitchCard({ pitch, t }: PitchCardProps) {
  const typeLabel = pitch.type || (pitch.indoor ? t("pitches.indoor") : t("pitches.outdoor"));
  const typeColor = pitch.indoor ? 'purple' : 'blue';

  return (
    <Card className="card-hover-neon overflow-hidden h-full flex flex-col group">
      {/* Image Section */}
      {pitch.images && pitch.images.length > 0 ? (
        <div className="relative h-56 w-full overflow-hidden bg-muted flex-shrink-0">
          <img
            src={pitch.images[0]}
            alt={pitch.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x450?text=Pitch';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-4 start-4">
            <Badge 
              variant={typeColor === 'indoor' ? 'secondary' : 'default'}
              className="text-xs font-semibold px-3 py-1"
            >
              {typeLabel}
            </Badge>
          </div>
        </div>
      ) : (
        <div className="h-56 w-full bg-gradient-to-br from-cyan-500/20 via-pink-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-500/30 border-2 border-cyan-400/50 flex items-center justify-center mx-auto mb-2 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <MapPin className="h-8 w-8 text-cyan-300" />
            </div>
          </div>
        </div>
      )}
      
      {/* Content */}
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="line-clamp-2 min-h-[3rem] text-xl">{pitch.name}</CardTitle>
        <CardDescription className="flex items-center gap-2 mt-2">
          <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          <span className="line-clamp-1">
            {pitch.city}
          </span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col min-h-0">
        {pitch.description && (
          <p className="text-sm text-muted-foreground dark:text-gray-300 line-clamp-2 mb-4 flex-shrink-0">
            {pitch.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-auto pt-2 flex-shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/15 dark:bg-cyan-500/25 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <DollarSign className="h-4 w-4 text-cyan-300" />
            <span className="font-bold text-foreground">
              {pitch.pricePerHour} {t("common.currency")}
            </span>
            <span className="text-xs text-muted-foreground">/ {t("pitches.hour")}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex-shrink-0 pt-0 pb-4 px-6">
        <Link to={`/pitches/${pitch.id}`} className="w-full">
          <Button className="w-full group-hover:gap-2 transition-all" variant="outline">
            {t("pitches.viewDetails")}
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
