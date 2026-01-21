import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocaleStore } from '@/store/localeStore';
import { JORDAN_CITIES, getCityDisplayName, type City } from '@/lib/cities';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui2/components/ui/Select';
import { Input } from '@/ui2/components/ui/Input';
import { cn } from '@/lib/utils';
import { useDirection } from '@/hooks/useDirection';

interface CitySelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  allowEmpty?: boolean;
}

// Separate component for city item content to handle RTL properly
function CitySelectItemContent({ city, locale }: { city: City; locale: 'ar' | 'en' }) {
  return (
    <span className="text-gray-200 dark:text-gray-100">
      {locale === 'ar' ? city.ar : city.en}
    </span>
  );
}

export function CitySelect({
  value = '',
  onChange,
  placeholder,
  className,
  required = false,
  allowEmpty = true,
}: CitySelectProps) {
  const { t } = useTranslation();
  const { locale } = useLocaleStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) {
      return JORDAN_CITIES;
    }

    const query = searchQuery.toLowerCase();
    return JORDAN_CITIES.filter((city) => {
      const enMatch = city.en.toLowerCase().includes(query);
      const arMatch = city.ar.includes(query);
      const keyMatch = city.key.toLowerCase().includes(query);
      return enMatch || arMatch || keyMatch;
    });
  }, [searchQuery]);

  const placeholderText = placeholder || t('common.city', 'City');
  
  // Select component cannot accept empty string - ALWAYS use a controlled Select
  // Strategy: Always provide a valid value that exists in the options list
  // - If value exists and is valid city key, use it
  // - Otherwise, use '__ALL__' as the default (which will be converted to '' in onChange)
  // This ensures Select is always controlled and never receives empty string
  const normalizedValue = (value && value.trim() !== '' && value !== '__ALL__' && JORDAN_CITIES.some(c => c.key === value))
    ? value 
    : '__ALL__'; // Always use '__ALL__' for empty/invalid values

  const handleValueChange = (newValue: string) => {
    if (newValue === '__ALL__') {
      onChange('');
    } else {
      onChange(newValue);
    }
    setSearchQuery('');
  };

  const displayValue = normalizedValue !== '__ALL__' 
    ? getCityDisplayName(normalizedValue, locale) 
    : '';

  // Always render controlled Select with a valid value
  return (
      <Select 
        value={normalizedValue} 
        onValueChange={handleValueChange} 
        required={required}
      >
        <SelectTrigger className={cn('w-full h-11 glass-neon-subtle border border-cyan-400/20 text-foregroundplaceholder:text-gray-400 focus:border-cyan-400/50', className)}>
          <SelectValue placeholder={placeholderText}>
            {displayValue || placeholderText}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px] z-[200] glass-neon-strong border-cyan-400/30">
          {/* Search input */}
          <div className="p-2 border-b border-cyan-400/20 sticky top-0 bg-popover z-10">
            <Input
              placeholder={t('common.search', 'Search...')}
              value={searchQuery}
              onChange={(e) => {
                e.stopPropagation();
                setSearchQuery(e.target.value);
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter' && filteredCities.length === 1) {
                  onChange(filteredCities[0].key);
                  setSearchQuery('');
                }
              }}
              className="h-8 text-gray-200 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              autoFocus
            />
          </div>

          {/* All cities option */}
          {allowEmpty && (
            <SelectItem value="__ALL__" onSelect={() => setSearchQuery('')}>
              {t('common.allCities', 'All cities')}
            </SelectItem>
          )}

          {/* Filtered cities list */}
          {filteredCities.length === 0 ? (
            <div className="px-2 py-6 text-center text-sm text-gray-300 dark:text-gray-400">
              {t('common.noResults', 'No results found')}
            </div>
          ) : (
            filteredCities
              .filter((city) => city.key && city.key.trim() !== '') // Safety: filter out any empty keys
              .map((city) => (
                <SelectItem
                  key={city.key}
                  value={city.key}
                  onSelect={() => setSearchQuery('')}
                >
                  <CitySelectItemContent city={city} locale={locale} />
                </SelectItem>
              ))
          )}
        </SelectContent>
      </Select>
    );
}

