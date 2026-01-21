import { Trophy, MapPin, Calendar, Users, Plus, Lock, Play } from "lucide-react";
import { Badge } from "@/ui2/components/ui/Badge";
import { Button } from "@/ui2/components/ui/Button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/ui2/components/ui/Card";

interface LeagueHeroProps {
  name: string;
  city: string;
  season?: string;
  startDate?: string;
  teamsCount: number;
  ownerName?: string;
  status: string;
  statusLabel: string;
  seasonLabel: string;
  teamsLabel: string;
  ownerLabel: string;
  isLeagueOwner: boolean;
  onAddTeam?: () => void;
  onLockLeague?: () => void;
  onGenerateSchedule?: () => void;
  canLock: boolean;
  hasSchedule: boolean;
  isGenerating?: boolean;
  addTeamLabel: string;
  lockLeagueLabel: string;
  generateScheduleLabel: string;
  generatingLabel: string;
}

export function LeagueHero({
  name,
  city,
  season,
  startDate,
  teamsCount,
  ownerName,
  status,
  statusLabel,
  seasonLabel,
  teamsLabel,
  ownerLabel,
  isLeagueOwner,
  onAddTeam,
  onLockLeague,
  onGenerateSchedule,
  canLock,
  hasSchedule,
  isGenerating = false,
  addTeamLabel,
  lockLeagueLabel,
  generateScheduleLabel,
  generatingLabel,
}: LeagueHeroProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return (
          <Badge variant="outline" className="border-gray-400/50 text-gray-300">
            {statusLabel}
          </Badge>
        );
      case "ACTIVE":
        return (
          <Badge variant="success" className="border-green-400/50 text-green-300">
            {statusLabel}
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="secondary" className="border-blue-400/50 text-blue-300">
            {statusLabel}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="glass-neon-strong rounded-3xl border-2 border-cyan-400/30 shadow-[0_0_25px_rgba(6,182,212,0.2)] overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 p-3 border border-cyan-400/30">
                <Trophy className="h-6 w-6 text-cyan-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {name}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 dark:text-gray-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-cyan-400" />
                <span className="text-foreground">{city}</span>
              </span>
              {season && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-cyan-400" />
                  <span className="text-foreground">
                    {seasonLabel}: {season}
                  </span>
                </span>
              )}
              {startDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-cyan-400" />
                  <span className="text-foreground">
                    {format(new Date(startDate), "MMM dd, yyyy")}
                  </span>
                </span>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            {getStatusBadge(status)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-300 dark:text-gray-300">
              <Users className="h-4 w-4 text-cyan-400" />
              <span className="text-foreground">
                {teamsCount} {teamsLabel}
              </span>
            </div>
            {ownerName && (
              <div className="text-gray-300 dark:text-gray-300">
                <span className="text-gray-400 dark:text-gray-400">{ownerLabel}: </span>
                <span className="text-foreground">{ownerName}</span>
              </div>
            )}
          </div>
          {isLeagueOwner && (
            <div className="flex flex-wrap gap-2">
              {status === "DRAFT" && (
                <>
                  {onAddTeam && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onAddTeam}
                      className="text-foreground"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {addTeamLabel}
                    </Button>
                  )}
                  {onLockLeague && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onLockLeague}
                      disabled={!canLock}
                      className="text-foreground"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      {lockLeagueLabel}
                    </Button>
                  )}
                </>
              )}
              {status === "ACTIVE" && !hasSchedule && onGenerateSchedule && (
                <Button
                  size="sm"
                  onClick={onGenerateSchedule}
                  disabled={isGenerating}
                  className="text-foreground"
                >
                  <Play className="mr-2 h-4 w-4" />
                  {isGenerating ? generatingLabel : generateScheduleLabel}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
