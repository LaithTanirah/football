import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Trophy, Calendar, FileText } from "lucide-react";

interface ProfileStatsProps {
  stats?: {
    teamsCount: number;
    leaguesCount: number;
    bookingsCount: number;
    postsCount: number;
  };
  isLoading: boolean;
}

export function ProfileStats({ stats, isLoading }: ProfileStatsProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Card className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4">{t("profile.stats")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-12 w-12 mx-auto mb-2 rounded-xl" />
              <Skeleton className="h-4 w-16 mx-auto" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const statItems = [
    {
      label: t("profile.teamsCount"),
      value: stats?.teamsCount || 0,
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: t("profile.leaguesCount"),
      value: stats?.leaguesCount || 0,
      icon: Trophy,
      color: "text-yellow-500",
    },
    {
      label: t("profile.bookingsCount"),
      value: stats?.bookingsCount || 0,
      icon: Calendar,
      color: "text-green-500",
    },
    {
      label: t("profile.postsCount"),
      value: stats?.postsCount || 0,
      icon: FileText,
      color: "text-purple-500",
    },
  ];

  return (
    <Card className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
      <h2 className="text-xl font-semibold mb-4">{t("profile.stats")}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="text-center p-4 rounded-xl bg-muted/50 border border-border/30 hover:bg-muted/70 transition-colors"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-background/50 mb-2 ${item.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold mb-1">{item.value}</div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

