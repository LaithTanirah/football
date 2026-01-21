import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui2/components/ui/Card";
import { useLocaleStore } from "@/store/localeStore";
import { getCityDisplayName } from "@/lib/cities";

interface CommunitySidebarProps {
  popularPitches: Array<{
    id: string;
    name?: string;
    nameEn?: string;
    nameAr?: string;
    city?: string;
    cityKey?: string;
  }>;
  popularTeams: Array<{
    id: string;
    name: string;
    city: string;
  }>;
  popularPitchesLabel: string;
  topTeamsLabel: string;
  newLeaguesLabel: string;
  comingSoonLabel: string;
}

export function CommunitySidebar({
  popularPitches,
  popularTeams,
  popularPitchesLabel,
  topTeamsLabel,
  newLeaguesLabel,
  comingSoonLabel,
}: CommunitySidebarProps) {
  const { locale } = useLocaleStore();

  return (
    <div className="space-y-4">
      {/* Popular Pitches */}
      {popularPitches.length > 0 && (
        <Card className="glass-neon-strong rounded-2xl border-2 border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-foreground">
              {popularPitchesLabel}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1.5">
              {popularPitches.slice(0, 5).map((pitch: any) => (
                <Link
                  key={pitch.id}
                  to={`/pitches/${pitch.id}`}
                  className="block p-2.5 rounded-xl glass-neon-subtle hover:bg-cyan-500/10 transition-colors border border-cyan-400/20 hover:border-cyan-400/40"
                >
                  <div className="font-semibold text-sm mb-0.5 text-foreground truncate">
                    {locale === "ar"
                      ? pitch.nameAr || pitch.name
                      : pitch.nameEn || pitch.name}
                  </div>
                  <div className="text-xs text-gray-300 dark:text-gray-300 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-cyan-400 flex-shrink-0" />
                    <span className="truncate">{getCityDisplayName(pitch.cityKey || pitch.city, locale)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Teams */}
      {popularTeams.length > 0 && (
        <Card className="glass-neon-strong rounded-2xl border-2 border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-foreground">
              {topTeamsLabel}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1.5">
              {popularTeams.slice(0, 5).map((team: any) => (
                <Link
                  key={team.id}
                  to={`/teams/${team.id}`}
                  className="block p-2.5 rounded-xl glass-neon-subtle hover:bg-cyan-500/10 transition-colors border border-cyan-400/20 hover:border-cyan-400/40"
                >
                  <div className="font-semibold text-sm mb-0.5 text-foreground truncate">
                    {team.name}
                  </div>
                  <div className="text-xs text-gray-300 dark:text-gray-300 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-cyan-400 flex-shrink-0" />
                    <span className="truncate">{team.city}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Leagues */}
      <Card className="glass-neon-strong rounded-2xl border-2 border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-foreground">
            {newLeaguesLabel}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-gray-300 dark:text-gray-300">
            {comingSoonLabel}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
