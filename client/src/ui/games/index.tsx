import { GamesHero } from "./GamesHero";
import { GamesCategoryFilter } from "./GamesCategoryFilter";
import { FeaturedGameCard } from "./FeaturedGameCard";
import { GameRowCard } from "./GameRowCard";
import { EmptyState } from "@/components/EmptyState";

interface Category {
  id: string;
  label: string;
}

interface Game {
  slug: string;
  icon: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estTime: string;
  available: boolean;
}

interface GamesUIProps {
  // Hero
  title: string;
  subtitle?: string;

  // Categories
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (id: string) => void;

  // Games
  featuredGame: Game | null;
  otherGames: Game[];

  // Labels
  minutesLabel: string;
  playLabel: string;
  comingSoonLabel: string;
  noGamesFoundLabel: string;
  noGamesDescLabel: string;
}

export function GamesUI({
  title,
  subtitle,
  categories,
  selectedCategory,
  onCategorySelect,
  featuredGame,
  otherGames,
  minutesLabel,
  playLabel,
  comingSoonLabel,
  noGamesFoundLabel,
  noGamesDescLabel,
}: GamesUIProps) {
  return (
    <div className="container mx-auto max-w-7xl px-4 pt-20 md:pt-24 pb-8 md:pb-12 relative overflow-visible">
      {/* Hero */}
      <GamesHero title={title} subtitle={subtitle} />

      {/* Category Filter */}
      <GamesCategoryFilter
        categories={categories}
        selectedId={selectedCategory}
        onSelect={onCategorySelect}
      />

      {/* Play Zone Layout */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Left: Featured Game */}
        {featuredGame && (
          <div className="lg:col-span-1">
            <FeaturedGameCard
              icon={featuredGame.icon}
              title={featuredGame.title}
              description={featuredGame.description}
              difficulty={featuredGame.difficulty}
              estTime={featuredGame.estTime}
              minutesLabel={minutesLabel}
              playLabel={playLabel}
              comingSoonLabel={comingSoonLabel}
              available={featuredGame.available}
              href={`/games/${featuredGame.slug}`}
            />
          </div>
        )}

        {/* Right: Other Games */}
        <div className="lg:col-span-2 space-y-3">
          {otherGames.length > 0 ? (
            otherGames.map((game) => (
              <GameRowCard
                key={game.slug}
                icon={game.icon}
                title={game.title}
                description={game.description}
                difficulty={game.difficulty}
                duration={`${game.estTime} ${minutesLabel}`}
                href={game.available ? `/games/${game.slug}` : undefined}
                available={game.available}
                playLabel={playLabel}
                comingSoonLabel={comingSoonLabel}
              />
            ))
          ) : (
            <EmptyState
              title={noGamesFoundLabel}
              description={noGamesDescLabel}
            />
          )}
        </div>
      </div>
    </div>
  );
}
