import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { usersApi, bookingsApi, teamsApi, leaguesApi } from "@/lib/api";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ProfileHeaderCard } from "@/components/profile/ProfileHeaderCard";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ProfileSidebarActions } from "@/components/profile/ProfileSidebarActions";

export function Profile() {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  // Fetch user profile data
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => usersApi.getMe(),
    enabled: !!user,
  });

  // Fetch user stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["userStats"],
    queryFn: () => usersApi.getStats(),
    enabled: !!user,
  });

  // Fetch user bookings (limited to 5)
  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ["userBookings", "profile"],
    queryFn: () => bookingsApi.getMyBookings(),
    enabled: !!user,
  });

  // Fetch user teams (limited to 5)
  const { data: teamsData, isLoading: teamsLoading } = useQuery({
    queryKey: ["userTeams", "profile"],
    queryFn: () => teamsApi.getAll({}),
    enabled: !!user,
  });

  // Fetch user leagues (limited to 5)
  const { data: leaguesData, isLoading: leaguesLoading } = useQuery({
    queryKey: ["userLeagues", "profile"],
    queryFn: () => leaguesApi.getAll({}),
    enabled: !!user,
  });

  const profile = profileData?.data.data;
  const stats = statsData?.data.data;
  const bookings = bookingsData?.data.data?.slice(0, 5) || [];
  
  // Filter teams where user is captain or member
  const teams = teamsData?.data.data?.filter((team: any) => {
    if (!user) return false;
    if (team.captainId === user.id) return true;
    if (team.members && Array.isArray(team.members)) {
      return team.members.some((m: any) => m.userId === user.id || (m.user && m.user.id === user.id));
    }
    return false;
  }).slice(0, 5) || [];
  
  // Filter leagues where user is owner
  const leagues = leaguesData?.data.data?.filter((league: any) => 
    league.ownerId === user?.id
  ).slice(0, 5) || [];

  if (!user) {
    return (
      <div className="container mx-auto max-w-[1200px] px-4 py-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("profile.loading")}</p>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="container mx-auto max-w-[1200px] px-4 py-6 page-section">
        <Breadcrumbs items={[{ label: t("profile.title") }]} className="mb-6" />
        <div className="space-y-6">
          <Card className="p-6">
            <Skeleton className="h-32 w-full" />
          </Card>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <Skeleton className="h-48 w-full" />
              </Card>
              <Card className="p-6">
                <Skeleton className="h-64 w-full" />
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="p-6">
                <Skeleton className="h-48 w-full" />
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-[1200px] px-4 py-6 page-section">
      <Breadcrumbs items={[{ label: t("profile.title") }]} className="mb-6" />

      {/* Header Card */}
      <ProfileHeaderCard user={profile || user} />

      {/* Two-column body */}
      <div className="grid gap-6 mt-6 lg:grid-cols-3">
        {/* Left column (main) */}
        <div className="lg:col-span-2 space-y-6">
          {/* About/Bio Card */}
          <Card className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">{t("profile.about")}</h2>
            {profile?.bio ? (
              <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
            ) : (
              <p className="text-muted-foreground italic">{t("profile.noBio")}</p>
            )}
          </Card>

          {/* Stats Card */}
          <ProfileStats stats={stats} isLoading={statsLoading} />

          {/* Tabs Section */}
          <ProfileTabs
            bookings={bookings}
            bookingsLoading={bookingsLoading}
            teams={teams}
            teamsLoading={teamsLoading}
            leagues={leagues}
            leaguesLoading={leaguesLoading}
          />
        </div>

        {/* Right column (sidebar) */}
        <div className="space-y-6">
          <ProfileSidebarActions />
        </div>
      </div>
    </div>
  );
}

