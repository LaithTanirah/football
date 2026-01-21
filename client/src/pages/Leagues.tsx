import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { leaguesApi } from "@/lib/api";
import { ModernLeagueCard } from "@/ui2/components/layout/LeagueCard";
import { PageHeader } from "@/ui2/components/layout/PageHeader";
import { FilterBar } from "@/ui2/components/layout/FilterBar";
import { EmptyState } from "@/components/EmptyState";
import { CitySelect } from "@/components/CitySelect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui2/components/ui/Select";
import { useFilters } from "@/hooks/useFilters";
import { Skeleton } from "@/ui2/components/ui/Skeleton";
import { Card, CardContent } from "@/ui2/components/ui/Card";
import { Button } from "@/ui2/components/ui/Button";
import { Trophy, Plus } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export function Leagues() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState<string>("");
  
  const { filters, updateFilter, clearFilters, apiParams, hasActiveFilters } = useFilters({
    includeSearch: true,
    includeCity: true,
    debounceMs: 300,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["leagues", apiParams, statusFilter],
    queryFn: () =>
      leaguesApi.getAll({
        ...apiParams,
        status: statusFilter || undefined,
      } as any),
  });

  const leagues = data?.data.data || [];

  // Calculate stats
  const stats = useMemo(() => {
    const draft = leagues.filter((l: any) => l.status === "DRAFT").length;
    const active = leagues.filter((l: any) => l.status === "ACTIVE").length;
    const finished = leagues.filter((l: any) => l.status === "COMPLETED").length;
    return { draft, active, finished };
  }, [leagues]);

  return (
    <div className="container mx-auto max-w-7xl px-4 pt-20 md:pt-24 pb-8 md:pb-12 relative overflow-visible">
      {/* Page Header */}
      <PageHeader
        title={t("leagues.title")}
        subtitle={t("leagues.subtitle")}
      >
        <div className="flex flex-col gap-6">
          <FilterBar
            searchValue={filters.search}
            onSearchChange={(value) => updateFilter("search", value)}
            searchPlaceholder={t("leagues.searchLeagues")}
            hasActiveFilters={hasActiveFilters || !!statusFilter}
            onClearFilters={() => {
              clearFilters();
              setStatusFilter("");
            }}
            filters={
              <>
                {/* City Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-300 dark:text-gray-300 uppercase tracking-wide">
                    {t("common.city", "City")}
                  </label>
                  <CitySelect
                    value={filters.city}
                    onChange={(value) => updateFilter("city", value)}
                    placeholder={t("common.allCities", "All Cities")}
                    allowEmpty={true}
                  />
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-300 dark:text-gray-300 uppercase tracking-wide">
                    {t("leagues.allStatus", "Status")}
                  </label>
                  <Select
                    value={statusFilter || "__ALL__"}
                    onValueChange={(val) => setStatusFilter(val === "__ALL__" ? "" : val)}
                  >
                    <SelectTrigger className="w-full h-11 glass-neon-subtle border border-cyan-400/20 text-foregroundplaceholder:text-gray-400 focus:border-cyan-400/50">
                      <SelectValue placeholder={t("leagues.allStatus", "All Status")}>
                        {statusFilter === "ACTIVE" && t("leagues.active")}
                        {statusFilter === "DRAFT" && t("leagues.draft")}
                        {statusFilter === "COMPLETED" && t("leagues.completed")}
                        {!statusFilter && t("leagues.allStatus", "All Status")}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="glass-neon-strong border-cyan-400/30">
                      <SelectItem value="__ALL__" className="text-foregroundhover:bg-cyan-500/20 focus:bg-cyan-500/20">
                        {t("leagues.allStatus", "All Status")}
                      </SelectItem>
                      <SelectItem value="ACTIVE" className="text-foregroundhover:bg-cyan-500/20 focus:bg-cyan-500/20">
                        {t("leagues.active")}
                      </SelectItem>
                      <SelectItem value="DRAFT" className="text-foregroundhover:bg-cyan-500/20 focus:bg-cyan-500/20">
                        {t("leagues.draft")}
                      </SelectItem>
                      <SelectItem value="COMPLETED" className="text-foregroundhover:bg-cyan-500/20 focus:bg-cyan-500/20">
                        {t("leagues.completed")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            }
          />
          {user && (
            <div className="flex justify-end">
              <Link to="/leagues/create">
                <Button size="lg" className="gap-2 glass-neon-strong border border-cyan-400/30 text-foregroundhover:border-cyan-400/50">
                  <Plus className="h-5 w-5" />
                  {t("leagues.createLeague")}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </PageHeader>

      {/* Stats Cards */}
      {leagues.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3 mb-8 relative z-10">
          <Card className="glass-neon-strong">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                    {t("leagues.active")}
                  </p>
                  <p className="text-3xl font-bold text-foreground">{stats.active}</p>
                </div>
                <div className="rounded-2xl bg-green-500/20 p-3">
                  <Trophy className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-neon-strong">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                    {t("leagues.draft")}
                  </p>
                  <p className="text-3xl font-bold text-foreground">{stats.draft}</p>
                </div>
                <div className="rounded-2xl bg-gray-500/20 p-3">
                  <Trophy className="h-6 w-6 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-neon-strong">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground dark:text-gray-300">
                    {t("leagues.completed")}
                  </p>
                  <p className="text-3xl font-bold text-foreground">{stats.finished}</p>
                </div>
                <div className="rounded-2xl bg-blue-500/20 p-3">
                  <Trophy className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Leagues Grid */}
      <div className="relative z-10">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : leagues.length === 0 ? (
          <EmptyState
            icon={<Trophy className="h-12 w-12" />}
            title={t("leagues.noLeaguesFound")}
            description={t("leagues.noLeaguesDesc")}
            action={
              user
                ? {
                    label: t("leagues.createLeague"),
                    href: '/leagues/create',
                  }
                : {
                    label: t("leagues.loginToCreate"),
                    href: '/auth/login',
                  }
            }
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {leagues.map((league: any) => (
              <ModernLeagueCard key={league.id} league={league} t={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
