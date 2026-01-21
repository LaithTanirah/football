import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui2/components/ui/Card";
import { Button } from "@/ui2/components/ui/Button";

interface LeagueTeam {
  team: {
    id: string;
    name: string;
    city: string;
    logoUrl?: string | null;
  };
}

interface LeagueTeamsProps {
  teams: LeagueTeam[];
  viewTeamLabel: string;
}

export function LeagueTeams({ teams, viewTeamLabel }: LeagueTeamsProps) {
  if (teams.length === 0) {
    return (
      <Card className="glass-neon-strong rounded-3xl border-2 border-cyan-400/20">
        <CardContent className="py-12 text-center">
          <p className="text-gray-400 dark:text-gray-400">
            No teams registered yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {teams.map((leagueTeam) => (
        <Card
          key={leagueTeam.team.id}
          className="glass-neon-strong rounded-3xl border-2 border-cyan-400/20 hover:border-cyan-400/40 transition-all overflow-hidden"
        >
          <CardHeader>
            {leagueTeam.team.logoUrl && (
              <div className="mb-4 flex justify-center">
                <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-cyan-400/30 bg-gradient-to-br from-cyan-500/10 to-purple-500/10">
                  <img
                    src={leagueTeam.team.logoUrl}
                    alt={leagueTeam.team.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}
            <CardTitle className="text-xl text-foreground">
              {leagueTeam.team.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-gray-300 dark:text-gray-300">
              <MapPin className="h-4 w-4 text-cyan-400" />
              <span className="text-foreground">{leagueTeam.team.city}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to={`/teams/${leagueTeam.team.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="text-foreground"
              >
                {viewTeamLabel}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
