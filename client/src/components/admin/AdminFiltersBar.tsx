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

interface AdminFiltersBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: Filter[];
  onFilterChange?: (key: string, value: string) => void;
  onFilterRemove?: (key: string) => void;
  sortValue?: string;
  onSortChange?: (value: string) => void;
  sortOptions?: { value: string; label: string }[];
  actions?: ReactNode;
  className?: string;
}

export function AdminFiltersBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  onFilterChange,
  onFilterRemove,
  sortValue,
  onSortChange,
  sortOptions = [],
  actions,
  className,
}: AdminFiltersBarProps) {
  const { isRTL } = useDirection();
  const { t } = useTranslation();

  const activeFilters = filters.filter((f) => f.value);

  return (
    <div className={cn('flex flex-col sm:flex-row gap-4 mb-6', className)}>
      {/* Search */}
      <div className="relative flex-1">
        <Search className={cn('absolute top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted', isRTL ? 'right-4' : 'left-4')} />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn('pl-10 pr-4', isRTL && 'pr-10 pl-4')}
        />
      </div>

      {/* Filters */}
      {filters.map((filter) => (
        <Select
          key={filter.key}
            value={filter.value}
            onValueChange={(value) => onFilterChange?.(filter.key, value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
      ))}

      {/* Sort */}
      {sortOptions.length > 0 && onSortChange && (
        <Select value={sortValue} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t('common.sortBy')} />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Actions */}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

