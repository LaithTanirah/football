import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDirection } from '@/hooks/useDirection';
import { useDebounce } from '@/hooks/useDebounce';
import { useGlobalSearch, SearchResult } from '@/hooks/useGlobalSearch';
import { Input } from '@/components/ui/input';
import { Search, X, Users, UsersRound, Trophy, MapPin, FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface GlobalSearchProps {
  className?: string;
  sidebarCollapsed?: boolean;
}

const typeIcons = {
  user: Users,
  team: UsersRound,
  league: Trophy,
  pitch: MapPin,
  post: FileText,
};

const typeLabels = {
  user: 'admin.nav.users',
  team: 'admin.nav.teams',
  league: 'admin.nav.leagues',
  pitch: 'admin.nav.pitches',
  post: 'admin.nav.posts',
};

export function GlobalSearch({ className, sidebarCollapsed }: GlobalSearchProps) {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);
  const { results, groupedResults, isLoading, isEmpty, hasResults } = useGlobalSearch({
    query: debouncedQuery,
    enabled: open && debouncedQuery.length >= 2,
    limit: 5,
  });

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      ) as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!hasResults && !isLoading) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelectResult(results[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        setQuery('');
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    let path = '';
    switch (result.type) {
      case 'user':
        path = `/admin/users`;
        break;
      case 'team':
        path = `/admin/teams`;
        break;
      case 'league':
        path = `/admin/leagues`;
        break;
      case 'pitch':
        path = `/admin/pitches`;
        break;
      case 'post':
        path = `/admin/posts`;
        break;
    }
    
    // Store the search query in sessionStorage to auto-filter the table
    if (result.id) {
      sessionStorage.setItem(`admin-${result.type}-filter`, result.id);
    }
    
    navigate(path);
    setOpen(false);
    setQuery('');
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setQuery('');
    setOpen(false);
    inputRef.current?.focus();
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-primary/20 text-foreground font-medium">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'relative flex-1 min-w-[240px]',
            sidebarCollapsed ? 'max-w-lg' : 'max-w-md',
            className
          )}
        >
          <Search
            className={cn(
              'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none',
              isRTL ? 'right-3' : 'left-3'
            )}
          />
          <Input
            ref={inputRef}
            placeholder={t('admin.search.placeholder')}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => {
              if (query.length >= 2) setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            className={cn(
              'w-full glass-neon-subtle border border-cyan-400/20 text-foreground placeholder:text-muted-foreground focus:border-cyan-400/50',
              isRTL 
                ? (query ? 'pr-10 pl-10' : 'pr-10 pl-4')
                : (query ? 'pl-10 pr-10' : 'pl-10 pr-4')
            )}
            dir="auto"
          />
          {query && (
            <button
              onClick={handleClear}
              className={cn(
                'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors z-10',
                isRTL ? 'left-3' : 'right-3'
              )}
              aria-label={t('common.close')}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'w-[var(--radix-popover-trigger-width)] max-w-[600px] p-0 mt-2',
          isRTL && 'text-right'
        )}
        align={isRTL ? 'end' : 'start'}
        side="bottom"
        sideOffset={4}
        style={{ zIndex: 100 }}
      >
        <div ref={resultsRef} className="max-h-[400px] overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">{t('common.loading')}</span>
            </div>
          )}

          {isEmpty && !isLoading && (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-300">{t('admin.search.noResults')}</p>
            </div>
          )}

          {hasResults && !isLoading && (
            <div className="py-2">
              {/* Users Section */}
              {groupedResults.users.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-300 uppercase tracking-wide border-b border-cyan-400/20">
                    {t(typeLabels.user)}
                  </div>
                  {groupedResults.users.map((result, idx) => {
                    const globalIndex = results.indexOf(result);
                    return (
                      <button
                        key={result.id}
                        data-index={globalIndex}
                        onClick={() => handleSelectResult(result)}
                        className={cn(
                          'w-full px-4 py-2 text-left hover:bg-cyan-500/10 transition-colors glass-neon-subtle',
                          selectedIndex === globalIndex && 'bg-cyan-500/20',
                          isRTL && 'text-right'
                        )}
                        dir="auto"
                      >
                        <div className="flex items-center gap-3">
                          <Users className="h-4 w-4 text-primary flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground truncate">
                              {highlightText(result.title, debouncedQuery)}
                            </div>
                            {result.meta && (
                              <div className="text-xs text-gray-300 truncate mt-0.5">
                                {result.meta}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Teams Section */}
              {groupedResults.teams.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">
                    {t(typeLabels.team)}
                  </div>
                  {groupedResults.teams.map((result, idx) => {
                    const globalIndex = results.indexOf(result);
                    return (
                      <button
                        key={result.id}
                        data-index={globalIndex}
                        onClick={() => handleSelectResult(result)}
                        className={cn(
                          'w-full px-4 py-2 text-left hover:bg-cyan-500/10 transition-colors glass-neon-subtle',
                          selectedIndex === globalIndex && 'bg-cyan-500/20',
                          isRTL && 'text-right'
                        )}
                        dir="auto"
                      >
                        <div className="flex items-center gap-3">
                          <UsersRound className="h-4 w-4 text-primary flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground truncate">
                              {highlightText(result.title, debouncedQuery)}
                            </div>
                            {result.meta && (
                              <div className="text-xs text-gray-300 truncate mt-0.5">
                                {result.meta}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Leagues Section */}
              {groupedResults.leagues.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">
                    {t(typeLabels.league)}
                  </div>
                  {groupedResults.leagues.map((result, idx) => {
                    const globalIndex = results.indexOf(result);
                    return (
                      <button
                        key={result.id}
                        data-index={globalIndex}
                        onClick={() => handleSelectResult(result)}
                        className={cn(
                          'w-full px-4 py-2 text-left hover:bg-cyan-500/10 transition-colors glass-neon-subtle',
                          selectedIndex === globalIndex && 'bg-cyan-500/20',
                          isRTL && 'text-right'
                        )}
                        dir="auto"
                      >
                        <div className="flex items-center gap-3">
                          <Trophy className="h-4 w-4 text-primary flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground truncate">
                              {highlightText(result.title, debouncedQuery)}
                            </div>
                            {result.meta && (
                              <div className="text-xs text-gray-300 truncate mt-0.5">
                                {result.meta}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Pitches Section */}
              {groupedResults.pitches.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">
                    {t(typeLabels.pitch)}
                  </div>
                  {groupedResults.pitches.map((result, idx) => {
                    const globalIndex = results.indexOf(result);
                    return (
                      <button
                        key={result.id}
                        data-index={globalIndex}
                        onClick={() => handleSelectResult(result)}
                        className={cn(
                          'w-full px-4 py-2 text-left hover:bg-cyan-500/10 transition-colors glass-neon-subtle',
                          selectedIndex === globalIndex && 'bg-cyan-500/20',
                          isRTL && 'text-right'
                        )}
                        dir="auto"
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground truncate">
                              {highlightText(result.title, debouncedQuery)}
                            </div>
                            {result.meta && (
                              <div className="text-xs text-gray-300 truncate mt-0.5">
                                {result.meta}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Posts Section */}
              {groupedResults.posts.length > 0 && (
                <div className="mb-2">
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">
                    {t(typeLabels.post)}
                  </div>
                  {groupedResults.posts.map((result, idx) => {
                    const globalIndex = results.indexOf(result);
                    return (
                      <button
                        key={result.id}
                        data-index={globalIndex}
                        onClick={() => handleSelectResult(result)}
                        className={cn(
                          'w-full px-4 py-2 text-left hover:bg-cyan-500/10 transition-colors glass-neon-subtle',
                          selectedIndex === globalIndex && 'bg-cyan-500/20',
                          isRTL && 'text-right'
                        )}
                        dir="auto"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground truncate">
                              {highlightText(result.title, debouncedQuery)}
                            </div>
                            {result.meta && (
                              <div className="text-xs text-gray-300 truncate mt-0.5">
                                {result.meta}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

