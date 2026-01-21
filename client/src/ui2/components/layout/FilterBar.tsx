import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { cn } from '@/lib/utils';
import { useDirection } from '@/hooks/useDirection';
import { Search, X, Filter } from 'lucide-react';

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  className?: string;
}

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  onClearFilters,
  hasActiveFilters,
  className,
}: FilterBarProps) {
  const { t } = useTranslation();
  const { isRTL, dir } = useDirection();

  return (
    <div className={cn('space-y-4 relative z-10', className)}>
      {/* Search Bar */}
      <div className="relative w-full max-w-2xl">
        <Search className={cn(
          "absolute top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-400 z-10",
          isRTL ? "end-3" : "start-3"
        )} />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            "h-12 text-base",
            isRTL ? "pe-10" : "ps-10"
          )}
        />
      </div>

      {/* Filters Section */}
      {filters && (
        <div 
          dir={dir}
          className={cn(
            "glass-neon-strong rounded-2xl border border-cyan-400/30 dark:border-cyan-400/40",
            "p-4 md:p-6",
            "shadow-[0_0_20px_rgba(6,182,212,0.1)] dark:shadow-[0_0_30px_rgba(6,182,212,0.2)]",
            "overflow-visible"
          )}
        >
          {/* Filter Header */}
          <div 
            dir={dir}
            className="flex items-center justify-between mb-4 pb-4 border-b border-cyan-400/20"
          >
            {isRTL ? (
              <>
                {hasActiveFilters && onClearFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onClearFilters}
                    className="h-8 px-3 text-xs gap-1.5 flex-row-reverse text-gray-300 dark:text-gray-300 hover:text-cyan-300 hover:border-cyan-400/50"
                  >
                    <X className="h-3.5 w-3.5" />
                    {t("common.clearFilters")}
                  </Button>
                )}
                <div className="flex items-center gap-2 flex-row-reverse">
                  <Filter className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-sm font-semibold text-gray-200 dark:text-gray-100">
                    {t("common.filters")}
                  </h3>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-sm font-semibold text-gray-200 dark:text-gray-100">
                    {t("common.filters")}
                  </h3>
                </div>
                {hasActiveFilters && onClearFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onClearFilters}
                    className="h-8 px-3 text-xs gap-1.5 text-gray-300 dark:text-gray-300 hover:text-cyan-300 hover:border-cyan-400/50"
                  >
                    <X className="h-3.5 w-3.5" />
                    {t("common.clearFilters")}
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Filter Controls */}
          <div className={cn(
            "grid gap-4",
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
            isRTL ? "text-right" : "text-left"
          )}>
            {filters}
          </div>
        </div>
      )}
    </div>
  );
}
