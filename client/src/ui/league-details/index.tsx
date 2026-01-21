import { TabsContent } from "@/ui2/components/ui/Tabs";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LeagueHero } from "./LeagueHero";
import { LeagueTabs } from "./LeagueTabs";
import { LeagueOverview } from "./LeagueOverview";
import { LeagueTeams } from "./LeagueTeams";
import { StandingsTable } from "@/components/StandingsTable";
import { FixturesList } from "@/components/FixturesList";
import { Card, CardContent } from "@/ui2/components/ui/Card";
import { Button } from "@/ui2/components/ui/Button";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDirection } from "@/hooks/useDirection";

interface LeagueDetailsUIProps {
  // League data
  league: {
    id: string;
    name: string;
    city: string;
    season?: string;
    startDate?: string;
    status: string;
    teams?: Array<{
      team: {
        id: string;
        name: string;
        city: string;
        logoUrl?: string | null;
      };
    }>;
    owner?: {
      name: string;
    };
  };

  // Standings and matches
  standings: Array<{
    teamId: string;
    teamName: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
    logoUrl?: string;
  }>;
  matches: Array<any>;
  hasSchedule: boolean;

  // User and permissions
  isLeagueOwner: boolean;
  userTeamIds: string[];
  canLock: boolean;

  // Handlers
  onAddTeam?: () => void;
  onLockLeague?: () => void;
  onGenerateSchedule?: () => void;
  isGenerating?: boolean;

  // Translations
  breadcrumbLabel: string;
  overviewLabel: string;
  teamsLabel: string;
  fixturesLabel: string;
  standingsLabel: string;
  resultsLabel: string;
  statusLabel: string;
  seasonLabel: string;
  teamsRegisteredLabel: string;
  ownerLabel: string;
  addTeamLabel: string;
  lockLeagueLabel: string;
  generateScheduleLabel: string;
  generatingLabel: string;
  leagueOverviewLabel: string;
  startDateLabel: string;
  matchesScheduledLabel: string;
  viewTeamLabel: string;
  noStandingsAvailableLabel: string;
  noResultsYetLabel: string;
  noScheduleMessage?: string;
  lockLeagueMessage?: string;
}

export function LeagueDetailsUI({
  league,
  standings,
  matches,
  hasSchedule,
  isLeagueOwner,
  userTeamIds,
  canLock,
  onAddTeam,
  onLockLeague,
  onGenerateSchedule,
  isGenerating = false,
  breadcrumbLabel,
  overviewLabel,
  teamsLabel,
  fixturesLabel,
  standingsLabel,
  resultsLabel,
  statusLabel,
  seasonLabel,
  teamsRegisteredLabel,
  ownerLabel,
  addTeamLabel,
  lockLeagueLabel,
  generateScheduleLabel,
  generatingLabel,
  leagueOverviewLabel,
  startDateLabel,
  matchesScheduledLabel,
  viewTeamLabel,
  noStandingsAvailableLabel,
  noResultsYetLabel,
  noScheduleMessage,
  lockLeagueMessage,
}: LeagueDetailsUIProps) {
  const { isRTL } = useDirection();

  return (
    <div className="container mx-auto max-w-7xl px-4 pt-20 md:pt-24 pb-8 md:pb-12 relative overflow-visible">
      {/* Breadcrumbs */}
      <div className="mb-8">
        <Breadcrumbs
          items={[
            { label: breadcrumbLabel, href: "/leagues" },
            { label: league.name },
          ]}
        />
      </div>

      {/* Hero Section */}
      <div className="mb-12">
        <LeagueHero
          name={league.name}
          city={league.city}
          season={league.season}
          startDate={league.startDate}
          teamsCount={league.teams?.length || 0}
          ownerName={league.owner?.name}
          status={league.status}
          statusLabel={statusLabel}
          seasonLabel={seasonLabel}
          teamsLabel={teamsLabel}
          ownerLabel={ownerLabel}
          isLeagueOwner={isLeagueOwner}
          onAddTeam={onAddTeam}
          onLockLeague={onLockLeague}
          onGenerateSchedule={onGenerateSchedule}
          canLock={canLock}
          hasSchedule={hasSchedule}
          isGenerating={isGenerating}
          addTeamLabel={addTeamLabel}
          lockLeagueLabel={lockLeagueLabel}
          generateScheduleLabel={generateScheduleLabel}
          generatingLabel={generatingLabel}
        />
      </div>

      {/* Tabs */}
      <LeagueTabs
        overviewLabel={overviewLabel}
        teamsLabel={teamsLabel}
        fixturesLabel={fixturesLabel}
        standingsLabel={standingsLabel}
        resultsLabel={resultsLabel}
      >
        <TabsContent value="overview" className="mt-6">
          <LeagueOverview
            status={league.status}
            statusLabel={statusLabel}
            season={league.season}
            seasonLabel={seasonLabel}
            startDate={league.startDate}
            startDateLabel={startDateLabel}
            teamsCount={league.teams?.length || 0}
            teamsRegisteredLabel={teamsRegisteredLabel}
            matchesCount={matches.length}
            matchesScheduledLabel={matchesScheduledLabel}
            leagueOverviewLabel={leagueOverviewLabel}
          />
        </TabsContent>

        <TabsContent value="teams" className="mt-6">
          <LeagueTeams
            teams={league.teams || []}
            viewTeamLabel={viewTeamLabel}
          />
        </TabsContent>

        <TabsContent value="fixtures" className="mt-6">
          {hasSchedule ? (
            <FixturesList
              matches={matches}
              leagueId={league.id}
              isLeagueOwner={isLeagueOwner}
              userTeamIds={userTeamIds}
            />
          ) : (
            <Card className="glass-neon-strong rounded-3xl border-2 border-cyan-400/20">
              <CardContent className="py-12 text-center">
                <p className="text-gray-300 dark:text-gray-300 mb-4">
                  {noScheduleMessage || lockLeagueMessage}
                </p>
                {isLeagueOwner && league.status === "ACTIVE" && onGenerateSchedule && (
                  <Button
                    onClick={onGenerateSchedule}
                    disabled={isGenerating}
                    className="glass-neon-strong border border-cyan-400/30 text-foreground hover:border-cyan-400/50"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {isGenerating ? generatingLabel : generateScheduleLabel}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="standings" className="mt-6">
          {standings.length > 0 ? (
            <Card className="glass-neon-strong rounded-3xl border-2 border-cyan-400/20">
              <CardContent className="p-6">
                <StandingsTable
                  standings={standings.map((standing) => {
                    // Find team logo from league teams
                    const leagueTeam = league.teams?.find(
                      (lt: any) => lt.team.id === standing.teamId
                    );
                    return {
                      ...standing,
                      logoUrl: leagueTeam?.team?.logoUrl,
                    };
                  })}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="glass-neon-strong rounded-3xl border-2 border-cyan-400/20">
              <CardContent className="py-12 text-center">
                <p className="text-gray-300 dark:text-gray-300">
                  {noStandingsAvailableLabel}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          {hasSchedule ? (
            <FixturesList
              matches={matches.filter((m: any) => m.result)}
              leagueId={league.id}
              isLeagueOwner={isLeagueOwner}
              userTeamIds={userTeamIds}
            />
          ) : (
            <Card className="glass-neon-strong rounded-3xl border-2 border-cyan-400/20">
              <CardContent className="py-12 text-center">
                <p className="text-gray-300 dark:text-gray-300">
                  {noResultsYetLabel}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </LeagueTabs>
    </div>
  );
}
