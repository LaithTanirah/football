import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { teamsApi } from '@/lib/api';
import { ModernTeamCard } from '@/ui2/components/layout/TeamCard';
import { PageHeader } from '@/ui2/components/layout/PageHeader';
import { FilterBar } from '@/ui2/components/layout/FilterBar';
import { EmptyState } from '@/components/EmptyState';
import { CitySelect } from '@/components/CitySelect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui2/components/ui/Select';
import { useFilters } from '@/hooks/useFilters';
import { Skeleton } from '@/ui2/components/ui/Skeleton';
import { Card } from '@/ui2/components/ui/Card';
import { Button } from '@/ui2/components/ui/Button';
import { Users, Plus } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export function Teams() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  
  const { filters, updateFilter, clearFilters, apiParams, hasActiveFilters } = useFilters({
    includeSearch: true,
    includeCity: true,
    debounceMs: 300,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['teams', apiParams],
    queryFn: () => teamsApi.getAll(apiParams as any),
  });

  const teams = data?.data.data || [];
  const [sortBy, setSortBy] = useState<'name' | 'city' | 'members'>('name');

  const sortedTeams = [...teams].sort((a: any, b: any) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'city':
        return (a.city || '').localeCompare(b.city || '');
      case 'members':
        return (b.memberCount || 0) - (a.memberCount || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 pt-20 md:pt-24 pb-8 md:pb-12 relative overflow-visible">
      {/* Page Header */}
      <PageHeader
        title={t("teams.title")}
        subtitle={t("teams.subtitle") || "Find or create a team to join leagues"}
      >
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <FilterBar
            searchValue={filters.search}
            onSearchChange={(value) => updateFilter("search", value)}
            searchPlaceholder={t("teams.searchTeams")}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            filters={
              <>
                <CitySelect
                  value={filters.city}
                  onChange={(value) => updateFilter("city", value)}
                  placeholder={t("teams.allCities")}
                  allowEmpty={true}
                />
                <Select value={sortBy} onValueChange={(val) => setSortBy(val as any)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">{t("teams.sortByName")}</SelectItem>
                    <SelectItem value="city">{t("teams.sortByCity")}</SelectItem>
                    <SelectItem value="members">{t("teams.sortByMembers")}</SelectItem>
                  </SelectContent>
                </Select>
              </>
            }
          />
          {user && (
            <Link to="/teams/create">
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                {t("teams.createTeam")}
              </Button>
            </Link>
          )}
        </div>
      </PageHeader>

      {/* Teams Grid */}
      <div className="relative z-10">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : sortedTeams.length === 0 ? (
          <EmptyState
            icon={<Users className="h-12 w-12" />}
            title={t("teams.noTeamsFound")}
            description={t("teams.noTeamsDesc")}
            action={
              user
                ? {
                    label: t("teams.createTeam"),
                    href: '/teams/create',
                  }
                : {
                    label: t("teams.loginToCreate"),
                    href: '/auth/login',
                  }
            }
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedTeams.map((team: any) => (
              <ModernTeamCard key={team.id} team={team} t={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
