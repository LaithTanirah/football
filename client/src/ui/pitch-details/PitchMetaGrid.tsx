import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { Clock, DollarSign, Star, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/ui2/components/ui/Card";
import { cn } from "@/lib/utils";

interface PitchMetaGridProps {
  openTime?: string;
  closeTime?: string;
  pricePerHour: number;
  description?: string;
}

export function PitchMetaGrid({ 
  openTime, 
  closeTime, 
  pricePerHour 
}: PitchMetaGridProps) {
  const { t } = useTranslation();
  const { dir } = useDirection();

  const metaItems = [
    {
      icon: Clock,
      label: t("pitchDetail.openingHours"),
      value: `${openTime?.slice(0, 5) || '08:00'} - ${closeTime?.slice(0, 5) || '22:00'}`,
      accent: "green",
    },
    {
      icon: DollarSign,
      label: t("pitches.pricePerHour"),
      value: `${pricePerHour} ${t("common.currency")}`,
      accent: "cyan",
    },
  ];

  return (
    <section 
      className="animate-fade-in-up"
      style={{ animationDelay: '300ms', animationDuration: '800ms' }}
      dir={dir}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {metaItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card
              key={index}
              className={cn(
                "glass-neon rounded-2xl border-2 transition-all duration-300",
                "hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(6,182,212,0.4),0_0_50px_rgba(236,72,153,0.3)]",
                "hover:border-cyan-400/80",
                item.accent === "green" && "border-green-400/50 hover:border-green-400/70",
                item.accent === "cyan" && "border-cyan-400/50"
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                    "border-2 shadow-lg",
                    item.accent === "green" && "bg-green-500/20 border-green-400/50 text-green-300",
                    item.accent === "cyan" && "bg-cyan-500/20 border-cyan-400/50 text-cyan-300"
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground dark:text-gray-300 mb-1">
                      {item.label}
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {item.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
