import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterChip {
  id: string;
  label: string;
  onRemove: () => void;
}

interface CommandBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterChip[];
  onClearFilters?: () => void;
  children?: ReactNode; // For additional controls (dropdowns, sort, etc.)
  className?: string;
}

export function CommandBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  onClearFilters,
  children,
  className,
}: CommandBarProps) {
  const hasActiveFilters = filters.length > 0 || (searchValue && searchValue.length > 0);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Search + Controls Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        {onSearchChange && (
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-11 border-2 border-border-soft focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>
        )}

        {/* Additional Controls (dropdowns, sort, etc.) */}
        {children}

        {/* Clear Filters Button */}
        {hasActiveFilters && onClearFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="gap-2 font-semibold"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filter Chips */}
      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <Badge
              key={filter.id}
              variant="outline"
              className="gap-2 px-3 py-1.5 font-semibold cursor-pointer hover:bg-brand-blue/10 hover:border-brand-blue transition-colors"
            >
              {filter.label}
              <button
                onClick={filter.onRemove}
                className="ml-1 hover:text-destructive transition-colors"
                aria-label="Remove filter"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

