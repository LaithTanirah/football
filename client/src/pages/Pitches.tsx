import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { pitchesApi } from "@/lib/api";
import { ModernPitchCard } from "@/ui2/components/layout/PitchCard";
import { PageHeader } from "@/ui2/components/layout/PageHeader";
import { FilterBar } from "@/ui2/components/layout/FilterBar";
import { EmptyState } from "@/components/EmptyState";
import { CitySelect } from "@/components/CitySelect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui2/components/ui/Select";
import { Input } from "@/ui2/components/ui/Input";
import { useFilters } from "@/hooks/useFilters";
import { Skeleton } from "@/ui2/components/ui/Skeleton";
import { Card } from "@/ui2/components/ui/Card";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pitches() {
  const { t } = useTranslation();
  
  const { filters, updateFilter, clearFilters, apiParams, priceError, hasActiveFilters } = useFilters({
    includeSearch: true,
    includeCity: true,
    includeType: true,
    includePrice: true,
    debounceMs: 300,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["pitches", apiParams],
    queryFn: () =>
      pitchesApi.getAll({
        ...apiParams,
        type: filters.type || undefined,
      } as any),
  });

  const pitches = data?.data.data || [];

  return (
    <div className="container mx-auto max-w-7xl px-4 pt-28 md:pt-32 pb-8 md:pb-12 relative overflow-visible">
      {/* Page Header */}
      <PageHeader
        title={t("pitches.title")}
        subtitle={t("pitches.subtitle") || "Discover the best football pitches"}
      >
        <FilterBar
          searchValue={filters.search}
          onSearchChange={(value) => updateFilter("search", value)}
          searchPlaceholder={t("pitches.searchPlaceholder")}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          filters={
            <>
              {/* City Filter */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-300 dark:text-gray-300">
                  {t("pitches.cityPlaceholder")}
                </label>
                <CitySelect
                  value={filters.city}
                  onChange={(value) => updateFilter("city", value)}
                  placeholder={t("pitches.cityPlaceholder")}
                  allowEmpty={true}
                />
              </div>

              {/* Type Filter */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-300 dark:text-gray-300">
                  {t("pitches.allTypes")}
                </label>
                <Select
                  value={filters.type || "__ALL_TYPES__"}
                  onValueChange={(val) => updateFilter("type", val === "__ALL_TYPES__" ? "" : val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("pitches.allTypes")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__ALL_TYPES__">{t("pitches.allTypes")}</SelectItem>
                    <SelectItem value="indoor">{t("pitches.indoor")}</SelectItem>
                    <SelectItem value="outdoor">{t("pitches.outdoor")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Min Price */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-300 dark:text-gray-300">
                  {t("common.minPrice")}
                </label>
                <Input
                  type="number"
                  placeholder={t("common.minPrice")}
                  value={filters.minPrice}
                  onChange={(e) => updateFilter("minPrice", e.target.value)}
                  className={cn(
                    "h-11",
                    priceError && "border-red-400"
                  )}
                />
              </div>

              {/* Max Price */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-300 dark:text-gray-300">
                  {t("common.maxPrice")}
                </label>
                <Input
                  type="number"
                  placeholder={t("common.maxPrice")}
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter("maxPrice", e.target.value)}
                  className={cn(
                    "h-11",
                    priceError && "border-red-400"
                  )}
                />
              </div>

              {/* Price Error Message */}
              {priceError && (
                <div className="col-span-full">
                  <p className="text-xs text-red-400 mt-2">{t("common.invalidPriceRange")}</p>
                </div>
              )}
            </>
          }
        />
      </PageHeader>

      {/* Pitches Grid */}
      <div className="relative z-10">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-56 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : pitches.length === 0 ? (
          <EmptyState
            icon={<Home className="h-12 w-12" />}
            title={t("pitches.noPitchesFound")}
            description={t("pitches.noPitchesDesc")}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pitches.map((pitch) => (
              <ModernPitchCard key={pitch.id} pitch={pitch} t={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
