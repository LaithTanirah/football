import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { useLocation } from "react-router-dom";
import { usersApi, bookingsApi, teamsApi, leaguesApi } from "@/lib/api";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ProfileHeaderCard } from "@/components/profile/ProfileHeaderCard";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ProfileSidebarActions } from "@/components/profile/ProfileSidebarActions";
import { cn } from "@/lib/utils";
import { Users, Trophy, Mail, MapPin, Calendar } from "lucide-react";
import { getCityDisplayName } from "@/lib/cities";
import { useLocaleStore } from "@/store/localeStore";

export function Profile() {
  const { t } = useTranslation();
  const { user: currentUser } = useAuthStore();
  const { locale } = useLocaleStore();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');

  // Determine if viewing own profile or another user's profile
  const isViewingOtherUser = !!userId && userId !== currentUser?.id;
  const targetUserId = userId || currentUser?.id;

  // Fetch user profile data
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["userProfile", targetUserId],
    queryFn: () => userId ? usersApi.getById(userId) : usersApi.getMe(),
    enabled: !!targetUserId,
  });

  // Fetch user stats (only for own profile)
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["userStats", targetUserId],
    queryFn: () => usersApi.getStats(),
    enabled: !!targetUserId && !isViewingOtherUser, // Only fetch stats for own profile
  });

  // Fetch user bookings (only for own profile)
  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ["userBookings", "profile", targetUserId],
    queryFn: () => bookingsApi.getMyBookings(),
    enabled: !!targetUserId && !isViewingOtherUser, // Only fetch bookings for own profile
  });

  // Fetch user teams (filter by targetUserId)
  const { data: teamsData, isLoading: teamsLoading } = useQuery({
    queryKey: ["userTeams", "profile", targetUserId],
    queryFn: () => teamsApi.getAll({}),
    enabled: !!targetUserId,
  });

  // Fetch user leagues (filter by targetUserId)
  const { data: leaguesData, isLoading: leaguesLoading } = useQuery({
    queryKey: ["userLeagues", "profile", targetUserId],
    queryFn: () => leaguesApi.getAll({}),
    enabled: !!targetUserId,
  });

  const profile = profileData?.data?.data || profileData?.data?.user || profileData?.data;
  const stats = statsData?.data.data;
  const bookings = bookingsData?.data.data?.slice(0, 5) || [];
  
  // Filter teams where target user is captain or member
  const teams = teamsData?.data.data?.filter((team: any) => {
    if (!targetUserId) return false;
    if (team.captainId === targetUserId) return true;
    if (team.members && Array.isArray(team.members)) {
      return team.members.some((m: any) => m.userId === targetUserId || (m.user && m.user.id === targetUserId));
    }
    return false;
  }).slice(0, 5) || [];
  
  // Filter leagues where target user is owner
  const leagues = leaguesData?.data.data?.filter((league: any) => 
    league.ownerId === targetUserId
  ).slice(0, 5) || [];

  if (!targetUserId) {
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

      {/* Header Card - Enhanced for other users */}
      <ProfileHeaderCard user={profile || currentUser} isViewingOtherUser={isViewingOtherUser} />

      {/* Two-column body */}
      <div className="grid gap-6 mt-6 lg:grid-cols-3">
        {/* Left column (main) */}
        <div className="lg:col-span-2 space-y-6">
          {/* About/Bio Card - Enhanced styling */}
          <Card className={cn(
            "p-6 card-elevated",
            isViewingOtherUser && "border-2 border-brand-blue/20 bg-gradient-to-br from-bg-surface to-brand-blue/5"
          )}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-1 rounded-full bg-brand-blue" />
              <h2 className="text-section-title font-bold text-text-primary">{t("profile.about")}</h2>
            </div>
            {profile?.bio ? (
              <p className="text-body text-text-muted whitespace-pre-wrap leading-relaxed">{profile.bio}</p>
            ) : (
              <p className="text-body text-text-muted italic">{t("profile.noBio")}</p>
            )}
          </Card>

          {/* Stats Card - Only show for own profile */}
          {!isViewingOtherUser && (
            <ProfileStats stats={stats} isLoading={statsLoading} />
          )}

          {/* Summary Stats for Other Users */}
          {isViewingOtherUser && (
            <Card className="p-6 card-elevated border-2 border-brand-cyan/20 bg-gradient-to-br from-bg-surface to-brand-cyan/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-1 w-1 rounded-full bg-brand-cyan" />
                <h2 className="text-section-title font-bold text-text-primary">{t("profile.activity") || "Activity Summary"}</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-bg-surface border border-border-soft">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-brand-blue" />
                    <span className="text-sm font-medium text-text-muted">{t("profile.teamsCount")}</span>
                  </div>
                  <p className="text-2xl font-bold text-text-primary">{teams.length}</p>
                </div>
                <div className="p-4 rounded-lg bg-bg-surface border border-border-soft">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="h-5 w-5 text-brand-orange" />
                    <span className="text-sm font-medium text-text-muted">{t("profile.leaguesCount")}</span>
                  </div>
                  <p className="text-2xl font-bold text-text-primary">{leagues.length}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Tabs Section */}
          <ProfileTabs
            bookings={isViewingOtherUser ? [] : bookings}
            bookingsLoading={isViewingOtherUser ? false : bookingsLoading}
            teams={teams}
            teamsLoading={teamsLoading}
            leagues={leagues}
            leaguesLoading={leaguesLoading}
            isViewingOtherUser={isViewingOtherUser}
          />
        </div>

        {/* Right column (sidebar) */}
        <div className="space-y-6">
          {!isViewingOtherUser && <ProfileSidebarActions />}
          {isViewingOtherUser && (
            <Card className="p-6 card-elevated border border-border-soft">
              <h3 className="text-lg font-semibold mb-4 text-text-primary">{t("profile.quickInfo") || "Quick Info"}</h3>
              <div className="space-y-3">
                {profile?.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-text-muted" />
                    <span className="text-text-muted">{profile.email}</span>
                  </div>
                )}
                {profile?.city && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-text-muted" />
                    <span className="text-text-muted">{getCityDisplayName(profile.city, locale)}</span>
                  </div>
                )}
                {profile?.createdAt && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-text-muted" />
                    <span className="text-text-muted">
                      {t("profile.memberSince") || "Member since"} {new Date(profile.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

