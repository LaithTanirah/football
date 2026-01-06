import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { pitchesApi } from "@/lib/api";
import { PitchCard } from "@/components/PitchCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { PosterHeader } from "@/components/playro/MatchHeader";
import { VenueRow } from "@/components/playro/VenueRow";
import { CitySelect } from "@/components/CitySelect";
import { useFilters } from "@/hooks/useFilters";
import { Search, Home, X, MapPin, DollarSign } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    <div className="container mx-auto max-w-7xl px-4 py-6 page-section">
      {/* Header with Embedded Search */}
      <div className="mb-8">
        <PosterHeader
          title={t("pitches.title")}
          subtitle={t("pitches.subtitle") || "Discover the best football pitches"}
        />
        <div className="relative max-w-2xl mt-6">
          <Search className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder={t("pitches.searchPlaceholder")}
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="ps-12 h-12 text-base border-2 border-border-soft"
          />
        </div>
      </div>

      {/* Filter Chips Row - Match Tags */}
      <div className="mb-8 flex flex-wrap items-center gap-3 pb-4">
        <CitySelect
          value={filters.city}
          onChange={(value) => updateFilter("city", value)}
          placeholder={t("pitches.cityPlaceholder")}
          allowEmpty={true}
        />
        <Select
          value={filters.type || "__ALL_TYPES__"}
          onValueChange={(val) => updateFilter("type", val === "__ALL_TYPES__" ? "" : val)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t("pitches.allTypes")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__ALL_TYPES__">{t("pitches.allTypes")}</SelectItem>
            <SelectItem value="indoor">{t("pitches.indoor")}</SelectItem>
            <SelectItem value="outdoor">{t("pitches.outdoor")}</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="number"
            placeholder={t("common.minPrice")}
            value={filters.minPrice}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
            className={cn(
              "min-h-[44px] min-w-[120px] sm:min-w-[140px] text-base px-4",
              priceError && "border-destructive"
            )}
          />
          <Input
            type="number"
            placeholder={t("common.maxPrice")}
            value={filters.maxPrice}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
            className={cn(
              "min-h-[44px] min-w-[120px] sm:min-w-[140px] text-base px-4",
              priceError && "border-destructive"
            )}
          />
        </div>
        {priceError && (
          <p className="text-sm text-destructive">{t("common.invalidPriceRange")}</p>
        )}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              clearFilters();
            }}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            {t("common.clearFilters")}
          </Button>
        )}
      </div>

      {/* Venue List Layout */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="border-2 border-border bg-background overflow-hidden p-4 md:p-6">
                <Skeleton className="h-28 w-full" />
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
          <div className="space-y-4">
            {pitches.map((pitch) => (
              <VenueRow
                key={pitch.id}
                name={pitch.name}
                city={pitch.city}
                type={pitch.type || (pitch.indoor ? t("pitches.indoor") : t("pitches.outdoor"))}
                price={pitch.pricePerHour}
                imageUrl={pitch.images && pitch.images.length > 0 ? pitch.images[0] : undefined}
                href={`/pitches/${pitch.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
