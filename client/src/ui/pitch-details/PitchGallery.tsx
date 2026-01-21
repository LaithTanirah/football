import { MapPin } from "lucide-react";
import { useDirection } from "@/hooks/useDirection";
import { cn } from "@/lib/utils";

interface PitchGalleryProps {
  images?: string[];
  name: string;
}

export function PitchGallery({ images, name }: PitchGalleryProps) {
  const { dir } = useDirection();
  const hasImages = images && images.length > 0;
  const primaryImage = hasImages ? images[0] : null;

  return (
    <section 
      className="animate-fade-in-up"
      style={{ animationDelay: '100ms', animationDuration: '800ms' }}
      dir={dir}
    >
      <div className="relative w-full aspect-[16/10] lg:aspect-[21/9] rounded-3xl overflow-hidden group">
        {primaryImage ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl -z-10 animate-pulse" />
            <img
              src={primaryImage}
              alt={name}
              className={cn(
                "h-full w-full object-cover",
                "group-hover:scale-[1.02] transition-transform duration-700"
              )}
              style={{
                animation: "slowZoom 8s ease-in-out infinite"
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/1200x600?text=Pitch";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-pink-500/10" />
          </>
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 relative">
            <div className="text-center z-10">
              <div className="w-24 h-24 rounded-full bg-cyan-500/30 border-2 border-cyan-400/60 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(6,182,212,0.6)] animate-pulse">
                <MapPin className="h-12 w-12 text-cyan-300" />
              </div>
              <p className="text-lg text-foreground/70 dark:text-gray-300 font-medium">
                No image available
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
          </div>
        )}
        
        {/* Decorative glow effects */}
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </section>
  );
}
