import { useRef, useEffect } from "react";
import { CommunityHero } from "./CommunityHero";
import { CommunityFilters } from "./CommunityFilters";
import { PostComposer } from "./PostComposer";
import { CommunityFeedFilters } from "./CommunityFeedFilters";
import { CommunityPostCard } from "./CommunityPostCard";
import { CommunitySidebar } from "./CommunitySidebar";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/ui2/components/ui/Skeleton";
import { Card } from "@/ui2/components/ui/Card";
import { cn } from "@/lib/utils";

interface CommunityUIProps {
  // Hero
  title: string;
  subtitle: string;

  // Filters
  city: string;
  userCity?: string | null;
  onCityChange: (city: string) => void;
  allCitiesLabel: string;
  myCityLabel: string;
  quickFiltersLabel: string;

  // Feed Filters
  search: string;
  onSearchChange: (value: string) => void;
  tagType: "pitches" | "teams" | "";
  onTagTypeChange: (value: "pitches" | "teams" | "") => void;
  sort: "newest" | "mostLiked";
  onSortChange: (value: "newest" | "mostLiked") => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  searchPlaceholder: string;
  filterByCityLabel: string;
  tagTypeLabel: string;
  allTagsLabel: string;
  pitchesLabel: string;
  teamsLabel: string;
  sortByLabel: string;
  newestLabel: string;
  mostLikedLabel: string;
  resetFiltersLabel: string;

  // Posts
  posts: Array<any>;
  isLoading: boolean;
  hasMore: boolean;
  onPostDelete: (postId: string) => void;
  onLoadMore?: () => void;

  // Composer
  user: { id: string } | null;
  createPostLabel: string;
  shareYourThoughtsLabel: string;
  createPostHref: string;

  // Sidebar
  popularPitches: Array<any>;
  popularTeams: Array<any>;
  popularPitchesLabel: string;
  topTeamsLabel: string;
  newLeaguesLabel: string;
  comingSoonLabel: string;

  // Empty State
  noResultsLabel: string;
  noResultsDescLabel: string;
  createFirstPostLabel: string;
}

export function CommunityUI({
  title,
  subtitle,
  city,
  userCity,
  onCityChange,
  allCitiesLabel,
  myCityLabel,
  quickFiltersLabel,
  search,
  onSearchChange,
  tagType,
  onTagTypeChange,
  sort,
  onSortChange,
  hasActiveFilters,
  onClearFilters,
  searchPlaceholder,
  filterByCityLabel,
  tagTypeLabel,
  allTagsLabel,
  pitchesLabel,
  teamsLabel,
  sortByLabel,
  newestLabel,
  mostLikedLabel,
  resetFiltersLabel,
  posts,
  isLoading,
  hasMore,
  onPostDelete,
  onLoadMore,
  user,
  createPostLabel,
  shareYourThoughtsLabel,
  createPostHref,
  popularPitches,
  popularTeams,
  popularPitchesLabel,
  topTeamsLabel,
  newLeaguesLabel,
  comingSoonLabel,
  noResultsLabel,
  noResultsDescLabel,
  createFirstPostLabel,
}: CommunityUIProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  // Infinite scroll
  useEffect(() => {
    if (!onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
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
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <div className="container mx-auto max-w-7xl px-4 pt-20 md:pt-24 pb-8 md:pb-12 relative overflow-visible">
      {/* Hero */}
      <div className="mb-6">
        <CommunityHero title={title} subtitle={subtitle} />
      </div>

      {/* Main Layout - 3 Column Split */}
      <div className="grid lg:grid-cols-12 gap-4">
        {/* Left: Filters Panel */}
        <div className="lg:col-span-3">
          <CommunityFilters
            city={city}
            userCity={userCity}
            onCityChange={onCityChange}
            allCitiesLabel={allCitiesLabel}
            myCityLabel={myCityLabel}
            quickFiltersLabel={quickFiltersLabel}
          />
        </div>

        {/* Center: Feed */}
        <div className="lg:col-span-6 space-y-4">
          {/* Post Composer */}
          {user && (
            <PostComposer
              createPostLabel={createPostLabel}
              shareYourThoughtsLabel={shareYourThoughtsLabel}
              createPostHref={createPostHref}
            />
          )}

          {/* Feed Filters */}
          <CommunityFeedFilters
            search={search}
            onSearchChange={onSearchChange}
            city={city}
            onCityChange={onCityChange}
            tagType={tagType}
            onTagTypeChange={onTagTypeChange}
            sort={sort}
            onSortChange={onSortChange}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={onClearFilters}
            searchPlaceholder={searchPlaceholder}
            filterByCityLabel={filterByCityLabel}
            tagTypeLabel={tagTypeLabel}
            allTagsLabel={allTagsLabel}
            pitchesLabel={pitchesLabel}
            teamsLabel={teamsLabel}
            sortByLabel={sortByLabel}
            newestLabel={newestLabel}
            mostLikedLabel={mostLikedLabel}
            resetFiltersLabel={resetFiltersLabel}
          />

          {/* Feed List */}
          {isLoading && posts.length === 0 ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Card
                  key={i}
                  className="p-6 border-2 border-cyan-400/20 glass-neon-subtle"
                >
                  <Skeleton className="h-32 w-full" />
                </Card>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <EmptyState
              title={noResultsLabel}
              description={noResultsDescLabel}
              action={
                hasActiveFilters
                  ? {
                      label: resetFiltersLabel,
                      onClick: onClearFilters,
                    }
                  : user
                    ? {
                        label: createFirstPostLabel,
                        href: createPostHref,
                      }
                    : undefined
              }
            />
          ) : (
            <>
              <div className="space-y-3">
                {posts.map((post) => (
                  <CommunityPostCard
                    key={post.id}
                    post={post}
                    onDelete={() => onPostDelete(post.id)}
                  />
                ))}
              </div>
              {hasMore && (
                <div
                  ref={observerTarget}
                  className="flex justify-center py-3"
                >
                  {isLoading && <Skeleton className="h-8 w-32" />}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: Sidebar */}
        <div className="lg:col-span-3">
          <CommunitySidebar
            popularPitches={popularPitches}
            popularTeams={popularTeams}
            popularPitchesLabel={popularPitchesLabel}
            topTeamsLabel={topTeamsLabel}
            newLeaguesLabel={newLeaguesLabel}
            comingSoonLabel={comingSoonLabel}
          />
        </div>
      </div>
    </div>
  );
}
