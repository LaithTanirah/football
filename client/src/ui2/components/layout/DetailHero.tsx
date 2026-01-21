import React from 'react';
import { Badge } from '../ui/Badge';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DetailHeroProps {
  imageUrl?: string;
  title: string;
  subtitle?: string;
  badges?: Array<{ label: string; variant?: 'default' | 'secondary' | 'accent' }>;
  className?: string;
}

export function DetailHero({ imageUrl, title, subtitle, badges, className }: DetailHeroProps) {
  return (
    <div className={cn('mb-8', className)}>
      {/* Image Hero */}
      {imageUrl ? (
        <div className="group relative mb-6 aspect-[21/9] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500/20 via-pink-500/20 to-purple-500/20 shadow-xl border-2 border-cyan-400/50">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/1600x600?text=Pitch";
            }}
          />
          {badges && badges.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3">
                {badges.map((badge, index) => (
                  <Badge 
                    key={index}
                    variant={badge.variant || 'default'}
                    className="text-sm px-4 py-2 rounded-full font-semibold"
                  >
                    {badge.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-6 aspect-[21/9] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500/20 via-pink-500/20 to-purple-500/20 flex items-center justify-center shadow-xl border-2 border-cyan-400/50">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-cyan-500/30 border-2 border-cyan-400/60 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(6,182,212,0.5)]">
              <MapPin className="h-10 w-10 text-cyan-300" />
            </div>
          </div>
        </div>
      )}

      {/* Title Section */}
      <div>
        <h1 className="mb-3 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-muted-foreground dark:text-gray-300">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
