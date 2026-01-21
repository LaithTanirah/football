import { Card, CardContent } from "@/ui2/components/ui/Card";
import { cn } from "@/lib/utils";

interface GamesHeroProps {
  title: string;
  subtitle?: string;
}

export function GamesHero({ title, subtitle }: GamesHeroProps) {
  return (
    <Card className="glass-neon-strong rounded-3xl border-2 border-cyan-400/30 shadow-[0_0_25px_rgba(6,182,212,0.2)] overflow-hidden mb-6">
      <CardContent className="p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-base md:text-lg text-gray-300 dark:text-gray-300">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
