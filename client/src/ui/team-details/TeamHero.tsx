import { MapPin, Crown, Pencil, ImageIcon } from "lucide-react";
import { Button } from "@/ui2/components/ui/Button";
import { Badge } from "@/ui2/components/ui/Badge";
import { cn } from "@/lib/utils";

interface TeamHeroProps {
  name: string;
  city: string;
  logoUrl?: string | null;
  isOwner: boolean;
  onUpdateLogo: () => void;
}

export function TeamHero({
  name,
  city,
  logoUrl,
  isOwner,
  onUpdateLogo,
}: TeamHeroProps) {
  return (
    <div className="glass-neon-strong rounded-3xl border-2 border-cyan-400/30 p-8 md:p-10 mb-8 shadow-[0_0_30px_rgba(6,182,212,0.25)] backdrop-blur-xl">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Logo */}
        <div className="flex-shrink-0">
          {logoUrl ? (
            <div className="group relative h-32 w-32 md:h-40 md:w-40 overflow-hidden rounded-full border-4 border-cyan-400/40 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <img
                src={logoUrl}
                alt={name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              {isOwner && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 rounded-full backdrop-blur-sm">
                  <Button
                    type="button"
                    variant="default"
                    size="icon"
                    className="h-10 w-10 rounded-full shadow-lg bg-cyan-500/90 hover:bg-cyan-500 border-2 border-cyan-300"
                    onClick={onUpdateLogo}
                    title="Update logo"
                  >
                    <Pencil className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            isOwner && (
              <Button
                type="button"
                variant="outline"
                onClick={onUpdateLogo}
                className="h-32 w-32 md:h-40 md:w-40 rounded-full flex flex-col items-center justify-center gap-2 border-dashed border-cyan-400/40 hover:border-solid hover:border-cyan-400/60 bg-gradient-to-br from-cyan-500/10 to-purple-500/10"
              >
                <ImageIcon className="h-8 w-8 text-cyan-300" />
                <span className="text-sm text-gray-300">Add Logo</span>
              </Button>
            )
          )}
        </div>

        {/* Team Info */}
        <div className="flex-1 text-center md:text-start">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-foreground tracking-tight">
                {name}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-300 dark:text-gray-300">
                <MapPin className="h-5 w-5 text-cyan-300" />
                <span className="text-lg">{city}</span>
              </div>
            </div>
            {isOwner && (
              <Badge
                variant="secondary"
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border-cyan-400/40 text-cyan-300"
              >
                <Crown className="h-4 w-4" />
                <span>Owner</span>
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
