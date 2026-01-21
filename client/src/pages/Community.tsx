import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { postsApi, pitchesApi, teamsApi } from '@/lib/api';
import { CommunityUI } from '@/ui/community';
import { useLocaleStore } from '@/store/localeStore';

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

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      setPage(prev => prev + 1);
    }
  };

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

  const handlePostDelete = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  return (
    <CommunityUI
      title={t('community.title')}
      subtitle={t('community.subtitle')}
      city={city}
      userCity={user?.city}
      onCityChange={(value) => {
        setCity(value);
        setPage(1);
        setPosts([]);
      }}
      allCitiesLabel={t('community.sidebar.allCities')}
      myCityLabel={t('community.sidebar.myCity')}
      quickFiltersLabel={t('community.sidebar.quickFilters')}
      search={search}
      onSearchChange={(value) => {
        setSearch(value);
        setPage(1);
        setPosts([]);
      }}
      tagType={tagType}
      onTagTypeChange={(value) => {
        setTagType(value);
        setTagId('');
        setPage(1);
        setPosts([]);
      }}
      sort={sort}
      onSortChange={(value) => {
        setSort(value);
        setPage(1);
        setPosts([]);
      }}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={handleClearFilters}
      searchPlaceholder={t('community.searchPlaceholder')}
      filterByCityLabel={t('community.filterByCity')}
      tagTypeLabel={t('community.tagType')}
      allTagsLabel={t('community.allTags')}
      pitchesLabel={t('community.pitches')}
      teamsLabel={t('community.teams')}
      sortByLabel={t('community.sortBy')}
      newestLabel={t('community.newest')}
      mostLikedLabel={t('community.mostLiked')}
      resetFiltersLabel={t('community.resetFilters')}
      posts={posts}
      isLoading={isLoading}
      hasMore={hasMore}
      onPostDelete={handlePostDelete}
      onLoadMore={handleLoadMore}
      user={user}
      createPostLabel={t('community.createPost')}
      shareYourThoughtsLabel={t('community.shareYourThoughts') || 'Share your thoughts with the community'}
      createPostHref="/community/create"
      popularPitches={popularPitchesList}
      popularTeams={popularTeamsList}
      popularPitchesLabel={t('community.sidebar.popularPitches')}
      topTeamsLabel={t('community.sidebar.topTeams')}
      newLeaguesLabel={t('community.sidebar.newLeagues')}
      comingSoonLabel={t('community.sidebar.comingSoon')}
      noResultsLabel={t('community.noResults')}
      noResultsDescLabel={t('community.noResultsDesc')}
      createFirstPostLabel={t('community.createFirstPost')}
    />
  );
}

