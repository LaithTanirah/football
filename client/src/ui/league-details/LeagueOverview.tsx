import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/ui2/components/ui/Card";

interface LeagueOverviewProps {
  status: string;
  statusLabel: string;
  season?: string;
  seasonLabel: string;
  startDate?: string;
  startDateLabel: string;
  teamsCount: number;
  teamsRegisteredLabel: string;
  matchesCount: number;
  matchesScheduledLabel: string;
  leagueOverviewLabel: string;
}

export function LeagueOverview({
  status,
  statusLabel,
  season,
  seasonLabel,
  startDate,
  startDateLabel,
  teamsCount,
  teamsRegisteredLabel,
  matchesCount,
  matchesScheduledLabel,
  leagueOverviewLabel,
}: LeagueOverviewProps) {
  return (
    <Card className="glass-neon-strong rounded-3xl border-2 border-cyan-400/20 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">
          {leagueOverviewLabel}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-gray-300 dark:text-gray-300 mb-1">
            {statusLabel}
          </p>
          <p className="text-base text-foreground">{status}</p>
        </div>
        {season && (
          <div>
            <p className="text-sm font-semibold text-gray-300 dark:text-gray-300 mb-1">
              {seasonLabel}
            </p>
            <p className="text-base text-foreground">{season}</p>
          </div>
        )}
        {startDate && (
          <div>
            <p className="text-sm font-semibold text-gray-300 dark:text-gray-300 mb-1">
              {startDateLabel}
            </p>
            <p className="text-base text-foreground">
              {format(new Date(startDate), "MMMM dd, yyyy")}
            </p>
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-gray-300 dark:text-gray-300 mb-1">
            {teamsRegisteredLabel.split(" ")[0]}
          </p>
          <p className="text-base text-foreground">
            {teamsCount} {teamsRegisteredLabel}
          </p>
        </div>
        {matchesCount > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-300 dark:text-gray-300 mb-1">
              Matches
            </p>
            <p className="text-base text-foreground">
              {matchesCount} {matchesScheduledLabel}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
