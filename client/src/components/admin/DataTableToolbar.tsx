import { ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDirection } from '@/hooks/useDirection';
import { useTranslation } from 'react-i18next';

interface Filter {
  key: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
}

interface DataTableToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: Filter[];
  onFilterChange?: (key: string, value: string) => void;
  onFilterRemove?: (key: string) => void;
  sortValue?: string;
  onSortChange?: (value: string) => void;
  sortOptions?: { value: string; label: string }[];
  resultCount?: number;
  primaryAction?: ReactNode;
  className?: string;
}

export function DataTableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filters = [],
  onFilterChange,
  onFilterRemove,
  sortValue,
  onSortChange,
  sortOptions = [],
  resultCount,
  primaryAction,
  className,
}: DataTableToolbarProps) {
  const { isRTL } = useDirection();
  const { t } = useTranslation();

  const activeFilters = filters.filter((f) => f.value && f.value !== 'all');

  return (
    <div className={cn('space-y-4 px-6 pb-4', className)}>
      {/* Top Row: Search + Primary Action */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 min-w-0">
          <Search className={cn('absolute top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted z-10', isRTL ? 'right-3' : 'left-3')} />
          <Input
            placeholder={searchPlaceholder || t('common.search')}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn('w-full min-w-0', isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4')}
            dir="auto"
          />
        </div>
        {primaryAction && <div className="flex-shrink-0">{primaryAction}</div>}
      </div>

      {/* Second Row: Filters + Sort + Result Count */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-3 flex-1">
          {/* Filters */}
          {filters.map((filter) => {
            const selectedOption = filter.options.find(opt => opt.value === filter.value);
            const hasActiveFilter = filter.value && filter.value !== 'all';
            
            return (
              <div key={filter.key} className="flex flex-col gap-1">
                <label className="text-xs font-medium text-text-muted px-1">
                  {filter.label}
                </label>
                <Select
                  value={filter.value || 'all'}
                  onValueChange={(value) => onFilterChange?.(filter.key, value)}
                >
                  <SelectTrigger className={cn('w-full sm:w-[180px]', hasActiveFilter && 'border-brand-blue')} dir={isRTL ? 'rtl' : 'ltr'}>
                    <SelectValue placeholder={filter.label}>
                      {hasActiveFilter ? (selectedOption?.label || filter.value) : t('common.all')}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent dir={isRTL ? 'rtl' : 'ltr'}>
                    <SelectItem value="all">{t('common.all')}</SelectItem>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })}

          {/* Sort */}
          {sortOptions.length > 0 && onSortChange && (
            <Select value={sortValue || 'default'} onValueChange={onSortChange}>
              <SelectTrigger className="w-full sm:w-[180px]" dir={isRTL ? 'rtl' : 'ltr'}>
                <SelectValue placeholder={t('common.sortBy')} />
              </SelectTrigger>
              <SelectContent dir={isRTL ? 'rtl' : 'ltr'}>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Result Count + Clear Filters */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {resultCount !== undefined && (
            <span className="text-sm text-text-muted whitespace-nowrap">
              {t('admin.table.resultCount', { count: resultCount })}
            </span>
          )}
          {activeFilters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                activeFilters.forEach((filter) => onFilterRemove?.(filter.key));
              }}
              className="h-8"
            >
              <X className="h-4 w-4 me-1" />
              {t('common.clearFilters')}
            </Button>
          )}
        </div>
      </div>

      {/* Active Filter Badges */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => {
            const option = filter.options.find((opt) => opt.value === filter.value);
            return (
              <Badge key={filter.key} variant="outline" className="gap-1">
                <span className="text-xs">{filter.label}:</span>
                <span className="font-semibold">{option?.label || filter.value}</span>
                <button
                  onClick={() => onFilterRemove?.(filter.key)}
                  className="ml-1 hover:bg-bg-surface rounded-full p-0.5"
                  aria-label={t('common.remove')}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}

