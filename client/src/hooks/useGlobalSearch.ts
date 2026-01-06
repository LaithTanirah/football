import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { teamsApi } from '@/lib/api';
import { leaguesApi } from '@/lib/api';
import { postsApi } from '@/lib/api';
import { pitchesApi } from '@/lib/api';

export interface SearchResult {
  id: string;
  type: 'user' | 'team' | 'league' | 'pitch' | 'post';
  title: string;
  meta?: string;
  icon?: string;
}

interface UseGlobalSearchOptions {
  query: string;
  enabled?: boolean;
  limit?: number;
}

export function useGlobalSearch({ query, enabled = true, limit = 5 }: UseGlobalSearchOptions) {
  const debouncedQuery = query.trim();
  const shouldSearch = enabled && debouncedQuery.length >= 2;

  // Fetch all entity types in parallel
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['global-search', 'users', debouncedQuery],
    queryFn: () => adminApi.getUsers({ search: debouncedQuery }),
    enabled: shouldSearch,
    staleTime: 30000,
  });

  const { data: teamsData, isLoading: teamsLoading } = useQuery({
    queryKey: ['global-search', 'teams', debouncedQuery],
    queryFn: () => teamsApi.getAll({ search: debouncedQuery }),
    enabled: shouldSearch,
    staleTime: 30000,
  });

  const { data: leaguesData, isLoading: leaguesLoading } = useQuery({
    queryKey: ['global-search', 'leagues', debouncedQuery],
    queryFn: () => leaguesApi.getAll({ search: debouncedQuery }),
    enabled: shouldSearch,
    staleTime: 30000,
  });

  const { data: pitchesData, isLoading: pitchesLoading } = useQuery({
    queryKey: ['global-search', 'pitches', debouncedQuery],
    queryFn: () => pitchesApi.getAll({ search: debouncedQuery }),
    enabled: shouldSearch,
    staleTime: 30000,
  });

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['global-search', 'posts', debouncedQuery],
    queryFn: () => postsApi.getAll({ search: debouncedQuery, limit }),
    enabled: shouldSearch,
    staleTime: 30000,
  });

  const isLoading = usersLoading || teamsLoading || leaguesLoading || pitchesLoading || postsLoading;

  // Transform results into unified format
  const results: SearchResult[] = [];

  // Users
  if (usersData?.data.data) {
    usersData.data.data.slice(0, limit).forEach((user: any) => {
      results.push({
        id: user.id,
        type: 'user',
        title: user.name || user.username,
        meta: user.email,
      });
    });
  }

  // Teams
  if (teamsData?.data.data) {
    teamsData.data.data.slice(0, limit).forEach((team: any) => {
      results.push({
        id: team.id,
        type: 'team',
        title: team.name,
        meta: team.city,
      });
    });
  }

  // Leagues
  if (leaguesData?.data.data) {
    leaguesData.data.data.slice(0, limit).forEach((league: any) => {
      results.push({
        id: league.id,
        type: 'league',
        title: league.name,
        meta: league.city || league.status,
      });
    });
  }

  // Pitches
  if (pitchesData?.data.data) {
    pitchesData.data.data.slice(0, limit).forEach((pitch: any) => {
      results.push({
        id: pitch.id,
        type: 'pitch',
        title: pitch.name,
        meta: pitch.city || pitch.address,
      });
    });
  }

  // Posts
  if (postsData?.data.data) {
    postsData.data.data.slice(0, limit).forEach((post: any) => {
      results.push({
        id: post.id,
        type: 'post',
        title: post.content?.substring(0, 50) || 'Post',
        meta: post.author?.name || 'Community',
      });
    });
  }

  // Group results by type
  const groupedResults = {
    users: results.filter(r => r.type === 'user'),
    teams: results.filter(r => r.type === 'team'),
    leagues: results.filter(r => r.type === 'league'),
    pitches: results.filter(r => r.type === 'pitch'),
    posts: results.filter(r => r.type === 'post'),
  };

  const hasResults = results.length > 0;
  const isEmpty = !isLoading && shouldSearch && !hasResults;

  return {
    results,
    groupedResults,
    isLoading,
    isEmpty,
    hasResults,
  };
}

