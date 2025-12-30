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
import { Breadcrumbs } from '@/components/Breadcrumbs';
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
      <Breadcrumbs items={[{ label: t('community.title') }]} className="mb-6" />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('community.title')}</h1>
          <p className="mt-2 text-muted-foreground">{t('community.subtitle')}</p>
        </div>
        {user && (
          <Link to="/community/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('community.createPost')}
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder={t('community.searchPlaceholder')}
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                        setPosts([]);
                      }}
                      className="pl-9"
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
                    <SelectTrigger>
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
                    <SelectTrigger>
                      <SelectValue placeholder={t('community.sortBy')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">{t('community.newest')}</SelectItem>
                      <SelectItem value="mostLiked">{t('community.mostLiked')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {hasActiveFilters && (
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearFilters}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      {t('community.resetFilters')}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Posts List */}
          {isLoading && page === 1 ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6">
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Filters */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {t('community.sidebar.quickFilters')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={city === '' ? 'default' : 'outline'}
                size="sm"
                className="w-full justify-start"
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
                  className="w-full justify-start"
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

          {/* Popular Pitches */}
          {popularPitchesList.length > 0 && (
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t('community.sidebar.popularPitches')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {popularPitchesList.slice(0, 5).map((pitch: any) => (
                  <Link
                    key={pitch.id}
                    to={`/pitches/${pitch.id}`}
                    className="block p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="font-medium text-sm">
                      {locale === 'ar' ? pitch.nameAr || pitch.name : pitch.nameEn || pitch.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getCityDisplayName(pitch.cityKey || pitch.city, locale)}
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Top Teams */}
          {popularTeamsList.length > 0 && (
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {t('community.sidebar.topTeams')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {popularTeamsList.slice(0, 5).map((team: any) => (
                  <Link
                    key={team.id}
                    to={`/teams/${team.id}`}
                    className="block p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="font-medium text-sm">{team.name}</div>
                    <div className="text-xs text-muted-foreground">{team.city}</div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

