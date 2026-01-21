import { Card, CardContent, CardHeader, CardTitle } from "@/ui2/components/ui/Card";
import { Skeleton } from "@/ui2/components/ui/Skeleton";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  isLoading?: boolean;
  className?: string;
  iconColor?: string;
}

export function AdminStatCard({
  title,
  value,
  icon: Icon,
  trend,
  isLoading,
  className,
  iconColor = "text-cyan-400",
}: AdminStatCardProps) {
  return (
    <Card className={cn("glass-neon-strong rounded-2xl border-2 border-cyan-400/20 shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:border-cyan-400/40 transition-all", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-5 pt-5">
        <CardTitle className="text-sm font-semibold text-gray-300 dark:text-gray-300 uppercase tracking-wide">
          {title}
        </CardTitle>
        {Icon && <Icon className={cn("h-5 w-5", iconColor)} />}
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {isLoading ? (
          <Skeleton className="h-8 w-20 bg-cyan-500/10" />
        ) : (
          <>
            <div className="text-3xl font-bold text-foreground mb-1">
              {value}
            </div>
            {trend && (
              <p
                className={cn(
                  "text-xs mt-1",
                  trend.isPositive
                    ? "text-green-400"
                    : "text-red-400"
                )}
              >
                {trend.value}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
