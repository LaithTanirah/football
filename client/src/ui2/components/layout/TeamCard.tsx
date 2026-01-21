import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Users, MapPin, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    city: string;
    memberCount?: number;
    captain?: { name: string };
    logoUrl?: string;
  };
  t: (key: string) => string;
}

export function ModernTeamCard({ team, t }: TeamCardProps) {
  return (
    <Card className="card-hover-neon overflow-hidden h-full flex flex-col group">
      {/* Logo/Header Section */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent flex-shrink-0 flex items-center justify-center">
        {team.logoUrl ? (
          <img
            src={team.logoUrl}
            alt={team.name}
            className="h-32 w-32 object-cover rounded-full border-4 border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Team';
            }}
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-purple-500/30 border-4 border-purple-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <Users className="h-16 w-16 text-purple-300" />
          </div>
        )}
      </div>
      
      {/* Content */}
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="line-clamp-2 min-h-[3rem] text-xl">{team.name}</CardTitle>
        <CardDescription className="flex items-center gap-2 mt-2">
          <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          <span className="line-clamp-1">{team.city}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col min-h-0">
        <div className="space-y-3 flex-grow">
          {team.memberCount !== undefined && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 border border-purple-400/30">
              <Users className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-semibold text-foreground">
                {team.memberCount} {t("teams.members")}
              </span>
            </div>
          )}
          {team.captain && (
            <div className="text-sm text-muted-foreground dark:text-gray-300">
              <span className="font-medium">{t("teams.captain")}: </span>
              {team.captain.name}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex-shrink-0 pt-0 pb-4 px-6">
        <Link to={`/teams/${team.id}`} className="w-full">
          <Button className="w-full group-hover:gap-2 transition-all" variant="outline">
            {t("teams.viewTeam")}
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
