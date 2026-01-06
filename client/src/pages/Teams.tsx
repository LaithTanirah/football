import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { teamsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/EmptyState';
import { PosterHeader } from '@/components/playro/MatchHeader';
import { ClubTile } from '@/components/playro/ClubTile';
import { CitySelect } from '@/components/CitySelect';
import { useFilters } from '@/hooks/useFilters';
import { Users, Plus, Search, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

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
    <div className="container mx-auto max-w-7xl px-4 py-6 page-section">
      <PosterHeader
        title={t("teams.title")}
        subtitle={t("teams.subtitle")}
        action={
          user
            ? {
                label: t("teams.createTeam"),
                href: '/teams/create',
                icon: <Plus className="h-4 w-4" />,
                variant: "orange",
              }
            : undefined
        }
      />

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Left: Club Filters Panel */}
        <div className="lg:col-span-1">
          <Card className="bg-bg-panel border-2 border-border-soft">
            <CardContent>
              <h3 className="font-bold mb-6 text-lg text-text-primary">{t("common.filters")}</h3>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-text-primary">{t("common.sortBy")}</label>
                  <Select value={sortBy} onValueChange={(val) => setSortBy(val as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">{t("teams.sortByName")}</SelectItem>
                      <SelectItem value="city">{t("teams.sortByCity")}</SelectItem>
                      <SelectItem value="members">{t("teams.sortByMembers")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-text-primary">{t("teams.filterByCity")}</label>
                  <CitySelect
                    value={filters.city}
                    onChange={(value) => updateFilter("city", value)}
                    placeholder={t("teams.allCities")}
                    allowEmpty={true}
                  />
                </div>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="w-full gap-2 font-semibold"
                  >
                    <X className="h-4 w-4" />
                    {t("common.clearFilters")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Teams Grid */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <Input
              placeholder={t("teams.searchTeams")}
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="ps-9"
            />
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-4 md:p-6 border">
                  <Skeleton className="h-24 w-full" />
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
            <div className="grid gap-4 md:grid-cols-2">
              {sortedTeams.map((team: any) => (
                <ClubTile
                  key={team.id}
                  name={team.name}
                  city={team.city}
                  membersCount={team.memberCount || 0}
                  captain={team.captain?.name}
                  logoUrl={team.logoUrl}
                  href={`/teams/${team.id}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

