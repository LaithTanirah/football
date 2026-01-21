import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Trophy, MapPin, Users, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDirection } from '@/hooks/useDirection';

interface LeagueCardProps {
  league: {
    id: string;
    name: string;
    city: string;
    status: string;
    startDate?: string;
    endDate?: string;
    teamCount?: number;
    maxTeams?: number;
  };
  t: (key: string) => string;
}

const statusColors = {
  DRAFT: { bg: 'bg-gray-500/20', border: 'border-gray-400/50', text: 'text-gray-300' },
  ACTIVE: { bg: 'bg-green-500/20', border: 'border-green-400/50', text: 'text-green-300' },
  COMPLETED: { bg: 'bg-blue-500/20', border: 'border-blue-400/50', text: 'text-blue-300' },
};

export function ModernLeagueCard({ league, t }: LeagueCardProps) {
  const statusColor = statusColors[league.status as keyof typeof statusColors] || statusColors.DRAFT;
  const { isRTL } = useDirection();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <Card className="card-hover-neon overflow-hidden h-full flex flex-col group">
      {/* Header Section */}
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-pink-500/20 via-pink-500/10 to-transparent flex-shrink-0 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-pink-500/20 border border-pink-400/18 flex items-center justify-center shadow-soft">
          <Trophy className="h-12 w-12 text-pink-300" />
        </div>
        <div className="absolute top-4 end-4">
          <Badge 
            variant={league.status === 'ACTIVE' ? 'success' : league.status === 'COMPLETED' ? 'default' : 'draft'}
            className="text-xs font-semibold px-3 py-1"
          >
            {league.status === 'ACTIVE' ? t("leagues.active") : 
             league.status === 'COMPLETED' ? t("leagues.completed") : 
             t("leagues.draft")}
          </Badge>
        </div>
      </div>
      
      {/* Content */}
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="line-clamp-2 min-h-[3rem] text-xl">{league.name}</CardTitle>
        <CardDescription className="flex items-center gap-2 mt-2">
          <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          <span className="line-clamp-1">{league.city}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col min-h-0">
        <div className="space-y-3 flex-grow">
          {league.teamCount !== undefined && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 border border-pink-400/15">
              <Users className="h-4 w-4 text-pink-400" />
              <span className="text-sm font-semibold text-foreground">
                {league.teamCount}{league.maxTeams ? ` / ${league.maxTeams}` : ''} {t("leagues.teams")}
              </span>
            </div>
          )}
          {league.startDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-gray-300">
              <Calendar className="h-4 w-4" />
              <span>{new Date(league.startDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex-shrink-0 pt-0 pb-4 px-6">
        <Link to={`/leagues/${league.id}`} className="w-full">
          <Button className={cn(
            "w-full group-hover:gap-2 transition-all flex items-center",
            isRTL ? "flex-row-reverse" : ""
          )} variant="outline">
            {t("leagues.viewLeague")}
            <ArrowIcon className={cn(
              "h-4 w-4 transition-transform",
              isRTL ? "mr-2 group-hover:-translate-x-1" : "ml-2 group-hover:translate-x-1"
            )} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
