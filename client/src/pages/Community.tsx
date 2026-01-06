import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { postsApi, pitchesApi, teamsApi } from '@/lib/api';
import { PostCard } from '@/components/PostCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/EmptyState';
import { PosterHeader } from '@/components/playro/MatchHeader';
import { MatchTag } from '@/components/stadium/MatchTag';
import { CitySelect } from '@/components/CitySelect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, X, TrendingUp, Users, MapPin } from 'lucide-react';
import { useLocaleStore } from '@/store/localeStore';
import { JORDAN_CITIES, getCityDisplayName } from '@/lib/cities';

export function Community() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { locale } = useLocaleStore();
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [tagType, setTagType] = useState<'pitches' | 'teams' | ''>('');
  const [tagId, setTagId] = useState('');
  const [sort, setSort] = useState<'newest' | 'mostLiked'>('newest');
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['posts', search, city, tagType, tagId, sort, page],
    queryFn: () =>
      postsApi.getAll({
        search: search || undefined,
        city: city || undefined,
        tagType: tagType || undefined,
        tagId: tagId || undefined,
        sort,
        page,
        limit: 20,
      }),
  });

  // Get popular pitches and teams for sidebar
  const { data: popularPitches } = useQuery({
    queryKey: ['popularPitches'],
    queryFn: () => pitchesApi.getAll({ limit: 5 }),
  });

  const { data: popularTeams } = useQuery({
    queryKey: ['popularTeams'],
    queryFn: () => teamsApi.getAll({ limit: 5 }),
  });

  useEffect(() => {
    if (data?.data.data) {
      if (page === 1) {
        setPosts(data.data.data);
      } else {
        setPosts(prev => [...prev, ...data.data.data]);
      }
      setHasMore(data.data.pagination.page < data.data.pagination.totalPages);
    }
  }, [data, page]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading]);

  const handleClearFilters = () => {
    setSearch('');
    setCity('');
    setTagType('');
    setTagId('');
    setSort('newest');
    setPage(1);
    setPosts([]);
  };

  const hasActiveFilters = search || city || tagType || sort !== 'newest';

  const popularPitchesList = popularPitches?.data.data || [];
  const popularTeamsList = popularTeams?.data.data || [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 page-section">
      <PosterHeader
        title={t('community.title')}
        subtitle={t('community.subtitle')}
      />

      {/* Fan Zone Layout - 3 Column Split */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Left: Fan Filters Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-background border-2 border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 font-bold">
                <TrendingUp className="h-4 w-4" />
                {t('community.sidebar.quickFilters')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={city === '' ? 'default' : 'outline'}
                size="sm"
                className="w-full justify-start font-semibold"
                onClick={() => {
                  setCity('');
                  setPage(1);
                  setPosts([]);
                }}
              >
                {t('community.sidebar.allCities')}
              </Button>
              {user?.city && (
                <Button
                  variant={city === user.city ? 'default' : 'outline'}
                  size="sm"
                  className="w-full justify-start font-semibold"
                  onClick={() => {
                    setCity(user.city!);
                    setPage(1);
                    setPosts([]);
                  }}
                >
                  {t('community.sidebar.myCity')}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Center: Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Inline Composer Card at Top of Feed */}
          {user && (
            <Card className="bg-background border-2 border-border">
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base">{t('community.createPost')}</h3>
                    <p className="text-sm text-muted-foreground">{t('community.shareYourThoughts') || 'Share your thoughts with the community'}</p>
                  </div>
                </div>
                <Link to="/community/create">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-6">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('community.createPost')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
          {/* Compact Filters Row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <Input
                placeholder={t('community.searchPlaceholder')}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                  setPosts([]);
                }}
                className="ps-9"
              />
            </div>
            <CitySelect
              value={city}
              onChange={(value) => {
                setCity(value);
                setPage(1);
                setPosts([]);
              }}
              placeholder={t('community.filterByCity')}
              allowEmpty={true}
            />
            <Select
              value={tagType || '__ALL__'}
              onValueChange={(val) => {
                setTagType(val === '__ALL__' ? '' : (val as 'pitches' | 'teams'));
                setTagId('');
                setPage(1);
                setPosts([]);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={t('community.tagType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__ALL__">{t('community.allTags')}</SelectItem>
                <SelectItem value="pitches">{t('community.pitches')}</SelectItem>
                <SelectItem value="teams">{t('community.teams')}</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sort}
              onValueChange={(val) => {
                setSort(val as 'newest' | 'mostLiked');
                setPage(1);
                setPosts([]);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={t('community.sortBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t('community.newest')}</SelectItem>
                <SelectItem value="mostLiked">{t('community.mostLiked')}</SelectItem>
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                {t('community.resetFilters')}
              </Button>
            )}
          </div>

          {/* Feed List */}
          {isLoading && page === 1 ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6 border-2 border-border-soft bg-bg-panel">
                  <Skeleton className="h-32 w-full" />
                </Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <EmptyState
              title={t('community.noResults')}
              description={t('community.noResultsDesc')}
              action={
                hasActiveFilters
                  ? {
                      label: t('community.resetFilters'),
                      onClick: handleClearFilters,
                    }
                  : user
                    ? {
                        label: t('community.createFirstPost'),
                        href: '/community/create',
                      }
                    : undefined
              }
            />
          ) : (
            <>
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onDelete={() => {
                      setPosts(prev => prev.filter(p => p.id !== post.id));
                    }}
                  />
                ))}
              </div>
              {hasMore && (
                <div ref={observerTarget} className="flex justify-center py-4">
                  {isLoading && <Skeleton className="h-8 w-32" />}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: Highlights Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Top Pitches */}
          {popularPitchesList.length > 0 && (
            <Card className="bg-background border-2 border-border">
              <CardHeader>
              <CardTitle className="text-lg font-bold">{t('community.sidebar.popularPitches')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {popularPitchesList.slice(0, 5).map((pitch: any) => (
                  <Link
                    key={pitch.id}
                    to={`/pitches/${pitch.id}`}
                    className="block p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/30"
                  >
                    <div className="font-bold text-sm mb-1">
                      {locale === 'ar' ? pitch.nameAr || pitch.name : pitch.nameEn || pitch.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getCityDisplayName(pitch.cityKey || pitch.city, locale)}
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
            </Card>
          )}

          {/* Top Teams */}
          {popularTeamsList.length > 0 && (
            <Card className="bg-background border-2 border-border">
              <CardHeader>
                <CardTitle className="text-lg font-bold">{t('community.sidebar.topTeams')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {popularTeamsList.slice(0, 5).map((team: any) => (
                    <Link
                      key={team.id}
                      to={`/teams/${team.id}`}
                      className="block p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/30"
                    >
                      <div className="font-bold text-sm mb-1">{team.name}</div>
                      <div className="text-xs text-muted-foreground">{team.city}</div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Leagues */}
          <Card className="bg-background border-2 border-border">
            <CardHeader>
              <CardTitle className="text-lg font-bold">{t('community.sidebar.newLeagues') || 'Upcoming Leagues'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('community.sidebar.comingSoon') || 'Coming soon'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

