import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { leaguesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/EmptyState";
import { PosterHeader } from "@/components/playro/MatchHeader";
import { LeagueRow } from "@/components/playro/LeagueRow";
import { CitySelect } from "@/components/CitySelect";
import { useFilters } from "@/hooks/useFilters";
import { Trophy, Plus, MapPin, Search, Users, X, Eye } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
    <div className="container mx-auto max-w-7xl px-4 py-6 page-section">
      <PosterHeader
        title={t("leagues.title")}
        subtitle={t("leagues.subtitle")}
        action={
          user
            ? {
                label: t("leagues.createLeague"),
                href: "/leagues/create",
                icon: <Plus className="h-4 w-4" />,
                variant: "orange",
              }
            : undefined
        }
      />

      {/* Horizontal Status Tabs */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-4">
        <button
          onClick={() => setStatusFilter("")}
          className={cn(
            "px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap border-2",
            statusFilter === ""
              ? "bg-primary text-primary-foreground border-primary shadow-md"
              : "bg-background text-foreground/70 border-border hover:border-primary/50 hover:text-foreground"
          )}
        >
          {t("leagues.allStatus")}
        </button>
        <button
          onClick={() => setStatusFilter("DRAFT")}
          className={cn(
            "px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap border-2",
            statusFilter === "DRAFT"
              ? "bg-primary text-primary-foreground border-primary shadow-md"
              : "bg-background text-foreground/70 border-border hover:border-primary/50 hover:text-foreground"
          )}
        >
          {t("leagues.draft")} ({stats.draft})
        </button>
        <button
          onClick={() => setStatusFilter("ACTIVE")}
          className={cn(
            "px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap border-2",
            statusFilter === "ACTIVE"
              ? "bg-secondary text-secondary-foreground border-secondary shadow-md"
              : "bg-background text-foreground/70 border-border hover:border-secondary/50 hover:text-foreground"
          )}
        >
          {t("leagues.active")} ({stats.active})
        </button>
        <button
          onClick={() => setStatusFilter("COMPLETED")}
          className={cn(
            "px-6 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap border-2",
            statusFilter === "COMPLETED"
              ? "bg-accent text-accent-foreground border-accent shadow-md"
              : "bg-background text-foreground/70 border-border hover:border-accent/50 hover:text-foreground"
          )}
        >
          {t("leagues.completed")} ({stats.finished})
        </button>
      </div>

      {/* Match Controls Row */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("leagues.searchLeagues")}
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-9"
          />
        </div>
        <CitySelect
          value={filters.city}
          onChange={(value) => updateFilter("city", value)}
          placeholder={t("leagues.filterByCity")}
          allowEmpty={true}
        />
        <Select
          value={statusFilter || "__ALL_STATUS__"}
          onValueChange={(val) => setStatusFilter(val === "__ALL_STATUS__" ? "" : val)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={t("leagues.allStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__ALL_STATUS__">{t("leagues.allStatus")}</SelectItem>
            <SelectItem value="DRAFT">{t("leagues.draft")}</SelectItem>
            <SelectItem value="ACTIVE">{t("leagues.active")}</SelectItem>
            <SelectItem value="COMPLETED">{t("leagues.completed")}</SelectItem>
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              clearFilters();
              setStatusFilter("");
            }}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            {t("common.clearFilters")}
          </Button>
        )}
      </div>

      {/* League Rows - Table-style layout */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="p-4 md:p-6 border-2 border-border bg-background">
              <Skeleton className="h-16 w-full" />
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
                  href: "/leagues/create",
                }
              : {
                  label: t("leagues.loginToCreate"),
                  href: "/auth/login",
                }
          }
        />
      ) : (
        <div className="space-y-3">
          {leagues.map((league: any) => (
            <LeagueRow
              key={league.id}
              name={league.name}
              city={league.city}
              season={league.season}
              teamCount={league.teamCount || 0}
              owner={league.owner?.name}
              status={league.status}
              href={`/leagues/${league.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
