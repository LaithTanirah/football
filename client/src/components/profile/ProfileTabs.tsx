import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Trophy, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface ProfileTabsProps {
  bookings: any[];
  bookingsLoading: boolean;
  teams: any[];
  teamsLoading: boolean;
  leagues: any[];
  leaguesLoading: boolean;
}

export function ProfileTabs({
  bookings,
  bookingsLoading,
  teams,
  teamsLoading,
  leagues,
  leaguesLoading,
}: ProfileTabsProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="bookings" className="gap-2">
            <Calendar className="h-4 w-4" />
            {t("profile.myBookings")}
          </TabsTrigger>
          <TabsTrigger value="teams" className="gap-2">
            <Users className="h-4 w-4" />
            {t("profile.myTeams")}
          </TabsTrigger>
          <TabsTrigger value="leagues" className="gap-2">
            <Trophy className="h-4 w-4" />
            {t("profile.myLeagues")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          {bookingsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <EmptyState
              icon={<Calendar className="h-12 w-12" />}
              title={t("profile.noBookings")}
              description={t("profile.noBookingsDesc")}
              action={{
                label: t("profile.browsePitches"),
                href: "/pitches",
              }}
            />
          ) : (
            <>
              <div className="space-y-3">
                {bookings.slice(0, 5).map((booking: any) => (
                  <div
                    key={booking.id}
                    className="p-4 rounded-lg border border-border/30 bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{booking.pitch?.name || "Unknown Pitch"}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(booking.date), "PPP")} • {booking.startTime}
                        </p>
                      </div>
                      {booking.pitch && (
                        <Link to={`/pitches/${booking.pitch.id}`}>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t">
                <Link to="/me/bookings">
                  <Button variant="outline" className="w-full">
                    {t("profile.viewAll")}
                  </Button>
                </Link>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          {teamsLoading ? (
            <div className="grid gap-3 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          ) : teams.length === 0 ? (
            <EmptyState
              icon={<Users className="h-12 w-12" />}
              title={t("profile.noTeams")}
              description={t("profile.noTeamsDesc")}
              action={{
                label: t("profile.createTeam"),
                href: "/teams/create",
              }}
            />
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-2">
                {teams.slice(0, 4).map((team: any) => (
                  <Link
                    key={team.id}
                    to={`/teams/${team.id}`}
                    className="p-4 rounded-lg border border-border/30 bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {team.logoUrl && (
                        <img
                          src={team.logoUrl}
                          alt={team.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{team.name}</p>
                        <p className="text-sm text-muted-foreground">{team.city}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="pt-4 border-t">
                <Link to="/teams">
                  <Button variant="outline" className="w-full">
                    {t("profile.viewAll")}
                  </Button>
                </Link>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="leagues" className="space-y-4">
          {leaguesLoading ? (
            <div className="grid gap-3 md:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          ) : leagues.length === 0 ? (
            <EmptyState
              icon={<Trophy className="h-12 w-12" />}
              title={t("profile.noLeagues")}
              description={t("profile.noLeaguesDesc")}
              action={{
                label: t("profile.joinLeague"),
                href: "/leagues",
              }}
            />
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-2">
                {leagues.slice(0, 4).map((league: any) => (
                  <Link
                    key={league.id}
                    to={`/leagues/${league.id}`}
                    className="p-4 rounded-lg border border-border/30 bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{league.name}</p>
                      <p className="text-sm text-muted-foreground">{league.city}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="pt-4 border-t">
                <Link to="/leagues">
                  <Button variant="outline" className="w-full">
                    {t("profile.viewAll")}
                  </Button>
                </Link>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}

