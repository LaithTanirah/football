import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leaguesApi, matchesApi, teamsApi } from "@/lib/api";
import { useToast } from "@/ui2/components/ui/use-toast";
import { Button } from "@/ui2/components/ui/Button";
import {
  Card,
  CardContent,
} from "@/ui2/components/ui/Card";
import { Skeleton } from "@/ui2/components/ui/Skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui2/components/ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui2/components/ui/Select";
import { useAuthStore } from "@/store/authStore";
import { LeagueDetailsUI } from "@/ui/league-details";

export function LeagueDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [addTeamDialogOpen, setAddTeamDialogOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState("");

  const { data: leagueData, isLoading: leagueLoading } = useQuery({
    queryKey: ["league", id],
    queryFn: () => leaguesApi.getById(id!),
    enabled: !!id,
  });

  const { data: standingsData } = useQuery({
    queryKey: ["standings", id],
    queryFn: () => leaguesApi.getStandings(id!),
    enabled: !!id,
  });

  const { data: matchesData } = useQuery({
    queryKey: ["matches", id],
    queryFn: () => matchesApi.getLeagueMatches(id!),
    enabled: !!id,
  });

  const { data: teamsData, isLoading: teamsLoading } = useQuery({
    queryKey: ["teams", "all"],
    queryFn: () => teamsApi.getAll(),
    enabled: !!id && user !== null && addTeamDialogOpen,
  });

  const league = leagueData?.data.data;
  const standings = standingsData?.data.data || [];
  const matches = matchesData?.data.data || [];

  const isLeagueOwner = user && league && league.owner?.id === user.id;

  // Get user's team IDs from league teams
  const userTeamIds =
    user && league
      ? league.teams
          ?.filter((lt: any) =>
            lt.team?.members?.some((m: any) => m.user?.id === user.id)
          )
          .map((lt: any) => lt.team.id) || []
      : [];

  const lockMutation = useMutation({
    mutationFn: () => leaguesApi.lock(id!),
    onSuccess: () => {
      toast({
        title: t("common.success"),
        description: t("leagueDetail.lockLeagueSuccess"),
      });
      queryClient.invalidateQueries({ queryKey: ["league", id] });
    },
    onError: (error: any) => {
      toast({
        title: t("common.error"),
        description:
          error.response?.data?.message || t("leagueDetail.lockLeagueError"),
        variant: "destructive",
      });
    },
  });

  const generateScheduleMutation = useMutation({
    mutationFn: () => matchesApi.generateSchedule(id!),
    onSuccess: () => {
      toast({
        title: t("common.success"),
        description: t("leagueDetail.generateScheduleSuccess"),
      });
      queryClient.invalidateQueries({ queryKey: ["matches", id] });
    },
    onError: (error: any) => {
      toast({
        title: t("common.error"),
        description:
          error.response?.data?.message ||
          t("leagueDetail.generateScheduleError"),
        variant: "destructive",
      });
    },
  });

  const addTeamMutation = useMutation({
    mutationFn: ({ teamId }: { teamId: string }) =>
      leaguesApi.addTeam(id!, { teamId }),
    onSuccess: () => {
      toast({
        title: t("common.success"),
        description: t("leagueDetail.addTeamSuccess"),
      });
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ["league", id] });
      queryClient.invalidateQueries({ queryKey: ["standings", id] });
      queryClient.invalidateQueries({ queryKey: ["matches", id] });
      queryClient.invalidateQueries({ queryKey: ["leagues"] });
      setAddTeamDialogOpen(false);
      setSelectedTeamId("");
    },
    onError: (error: any) => {
      toast({
        title: t("common.error"),
        description:
          error.response?.data?.message || t("leagueDetail.addTeamError"),
        variant: "destructive",
      });
    },
  });

  if (leagueLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 pt-20 md:pt-24 pb-8 md:pb-12">
        <Skeleton className="mb-6 h-6 w-48" />
        <Card>
          <CardContent>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="mt-2 h-4 w-32" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!league) {
    return (
      <div className="container mx-auto max-w-7xl px-4 pt-20 md:pt-24 pb-8 md:pb-12">
        <Card className="glass-neon-strong rounded-3xl border-2 border-cyan-400/20">
          <CardContent className="py-12 text-center">
            <p className="text-gray-300 dark:text-gray-300 mb-4">League not found</p>
            <Button 
              onClick={() => navigate("/leagues")} 
              className="glass-neon-subtle border border-cyan-400/30 text-foregroundhover:border-cyan-400/50"
            >
              Back to Leagues
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasSchedule = matches.length > 0;

  return (
    <>
      <LeagueDetailsUI
        league={league}
        standings={standings}
        matches={matches}
        hasSchedule={hasSchedule}
        isLeagueOwner={isLeagueOwner || false}
        userTeamIds={userTeamIds}
        canLock={(league.teams?.length || 0) >= 2}
        onAddTeam={() => setAddTeamDialogOpen(true)}
        onLockLeague={() => lockMutation.mutate()}
        onGenerateSchedule={() => generateScheduleMutation.mutate()}
        isGenerating={generateScheduleMutation.isPending}
        breadcrumbLabel={t("nav.leagues")}
        overviewLabel={t("leagueDetail.overview")}
        teamsLabel={t("leagueDetail.teams")}
        fixturesLabel={t("leagueDetail.fixtures")}
        standingsLabel={t("leagueDetail.standings")}
        resultsLabel={t("leagueDetail.results")}
        statusLabel={t(`leagues.${league.status.toLowerCase()}`)}
        seasonLabel={t("leagues.season")}
        teamsRegisteredLabel={t("leagueDetail.teamsRegistered")}
        ownerLabel={t("leagueDetail.owner") || "Owner"}
        addTeamLabel={t("leagueDetail.addTeam")}
        lockLeagueLabel={t("leagueDetail.lockLeague")}
        generateScheduleLabel={t("leagueDetail.generateSchedule")}
        generatingLabel={t("leagueDetail.generating")}
        leagueOverviewLabel={t("leagueDetail.leagueOverview")}
        startDateLabel={t("leagueDetail.startDate")}
        matchesScheduledLabel={t("leagueDetail.matchesScheduled")}
        viewTeamLabel={t("teams.viewTeam")}
        noStandingsAvailableLabel={t("leagueDetail.noStandingsAvailable")}
        noResultsYetLabel={t("leagueDetail.noResultsYet")}
        noScheduleMessage={
          league.status === "DRAFT"
            ? "Lock the league and generate schedule to see fixtures"
            : "Schedule not generated yet"
        }
        lockLeagueMessage={
          league.status === "DRAFT"
            ? "Lock the league and generate schedule to see fixtures"
            : "Schedule not generated yet"
        }
      />

      <Dialog open={addTeamDialogOpen} onOpenChange={setAddTeamDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("leagueDetail.addTeamToLeague")}</DialogTitle>
            <DialogDescription>
              {t("leagueDetail.selectTeam")}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {teamsLoading ? (
              <div className="text-sm text-muted-foreground">
                Loading teams...
              </div>
            ) : (
              <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  {(() => {
                    const allTeams = teamsData?.data.data || [];
                    // Filter: show teams where user is captain OR all teams if user is league owner
                    const availableTeams = isLeagueOwner
                      ? allTeams.filter(
                          (team: any) =>
                            !league.teams?.some(
                              (lt: any) => lt.team.id === team.id
                            )
                        )
                      : allTeams.filter(
                          (team: any) =>
                            (team.captain?.id === user?.id ||
                              team.members?.some(
                                (m: any) => m.user?.id === user?.id
                              )) &&
                            !league.teams?.some(
                              (lt: any) => lt.team.id === team.id
                            )
                        );

                    if (availableTeams.length === 0) {
                      return (
                        <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                          {isLeagueOwner
                            ? t("leagueDetail.noTeamsAvailable")
                            : t("leagueDetail.needToBeCaptain")}
                        </div>
                      );
                    }

                    return availableTeams.map((team: any) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name} - {team.city}
                      </SelectItem>
                    ));
                  })()}
                </SelectContent>
              </Select>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddTeamDialogOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={() => {
                if (selectedTeamId) {
                  addTeamMutation.mutate({ teamId: selectedTeamId });
                }
              }}
              disabled={!selectedTeamId || addTeamMutation.isPending}
            >
              {addTeamMutation.isPending
                ? t("leagueDetail.adding")
                : t("leagueDetail.addTeam")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
