import { Search, X } from "lucide-react";
import { Input } from "@/ui2/components/ui/Input";
import { Button } from "@/ui2/components/ui/Button";
import { CitySelect } from "@/components/CitySelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui2/components/ui/Select";
import { cn } from "@/lib/utils";
import { useDirection } from "@/hooks/useDirection";

interface CommunityFeedFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  city: string;
  onCityChange: (value: string) => void;
  tagType: "pitches" | "teams" | "";
  onTagTypeChange: (value: "pitches" | "teams" | "") => void;
  sort: "newest" | "mostLiked";
  onSortChange: (value: "newest" | "mostLiked") => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  searchPlaceholder: string;
  filterByCityLabel: string;
  tagTypeLabel: string;
  allTagsLabel: string;
  pitchesLabel: string;
  teamsLabel: string;
  sortByLabel: string;
  newestLabel: string;
  mostLikedLabel: string;
  resetFiltersLabel: string;
}

export function CommunityFeedFilters({
  search,
  onSearchChange,
  city,
  onCityChange,
  tagType,
  onTagTypeChange,
  sort,
  onSortChange,
  hasActiveFilters,
  onClearFilters,
  searchPlaceholder,
  filterByCityLabel,
  tagTypeLabel,
  allTagsLabel,
  pitchesLabel,
  teamsLabel,
  sortByLabel,
  newestLabel,
  mostLikedLabel,
  resetFiltersLabel,
}: CommunityFeedFiltersProps) {
  const { isRTL } = useDirection();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-[200px]">
        <Search
          className={cn(
            "absolute top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-400 z-10",
            isRTL ? "end-3" : "start-3"
          )}
        />
        <Input
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            "h-10 glass-neon-subtle border border-cyan-400/20 text-foreground placeholder:text-gray-400 focus:border-cyan-400/50 text-sm",
            isRTL ? "pe-9" : "ps-9"
          )}
        />
      </div>
      <CitySelect
        value={city}
        onChange={onCityChange}
        placeholder={filterByCityLabel}
        allowEmpty={true}
      />
      <Select
        value={tagType || "__ALL__"}
        onValueChange={(val) =>
          onTagTypeChange(val === "__ALL__" ? "" : (val as "pitches" | "teams"))
        }
      >
        <SelectTrigger className="w-[120px] h-10 glass-neon-subtle border border-cyan-400/20 text-foreground text-sm">
          <SelectValue placeholder={tagTypeLabel} />
        </SelectTrigger>
        <SelectContent className="glass-neon-strong border-cyan-400/30">
          <SelectItem value="__ALL__" className="text-foreground hover:bg-cyan-500/20">
            {allTagsLabel}
          </SelectItem>
          <SelectItem value="pitches" className="text-foreground hover:bg-cyan-500/20">
            {pitchesLabel}
          </SelectItem>
          <SelectItem value="teams" className="text-foreground hover:bg-cyan-500/20">
            {teamsLabel}
          </SelectItem>
        </SelectContent>
      </Select>
      <Select value={sort} onValueChange={(val) => onSortChange(val as "newest" | "mostLiked")}>
        <SelectTrigger className="w-[120px] h-10 glass-neon-subtle border border-cyan-400/20 text-foreground text-sm">
          <SelectValue placeholder={sortByLabel} />
        </SelectTrigger>
        <SelectContent className="glass-neon-strong border-cyan-400/30">
          <SelectItem value="newest" className="text-foreground hover:bg-cyan-500/20">
            {newestLabel}
          </SelectItem>
          <SelectItem value="mostLiked" className="text-foreground hover:bg-cyan-500/20">
            {mostLikedLabel}
          </SelectItem>
        </SelectContent>
      </Select>
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="gap-1.5 glass-neon-subtle border border-cyan-400/30 text-foreground hover:border-cyan-400/50 h-10 text-sm"
        >
          <X className="h-3.5 w-3.5" />
          {resetFiltersLabel}
        </Button>
      )}
    </div>
  );
}
