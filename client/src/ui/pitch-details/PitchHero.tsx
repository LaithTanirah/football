import { MapPin } from "lucide-react";
import { Badge } from "@/ui2/components/ui/Badge";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { cn } from "@/lib/utils";

interface PitchHeroProps {
  name: string;
  address: string;
  city: string;
  type?: string;
  indoor?: boolean;
}

export function PitchHero({ name, address, city, type, indoor }: PitchHeroProps) {
  const { t } = useTranslation();
  const { dir } = useDirection();

  return (
    <section 
      className="animate-fade-in-up"
      dir={dir}
    >
      <div className="mb-6">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-pink-300 to-purple-300 leading-tight">
          {name}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-lg text-foreground/90 dark:text-gray-200">
            <MapPin className="h-5 w-5 text-cyan-400" />
            <span>{address}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge 
            variant={indoor ? 'secondary' : 'default'}
            className="text-sm px-5 py-2 rounded-full font-semibold text-base"
          >
            {type || (indoor ? t("pitches.indoor") : t("pitches.outdoor"))}
          </Badge>
          <Badge 
            variant="accent"
            className="text-sm px-5 py-2 rounded-full font-semibold text-base"
          >
            {city}
          </Badge>
        </div>
      </div>
    </section>
  );
}
