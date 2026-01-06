import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { PosterHeader } from "@/components/playro/MatchHeader";
import { CategoryStrip } from "@/components/playro/CategoryStrip";
import { GameRow } from "@/components/playro/GameRow";
import { MediaSkeleton } from "@/components/playro/MediaSkeleton";
import { GAMES, Game } from "../registry";
import { GameCategory } from "../types";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { DifficultyBadge } from "../components/DifficultyBadge";

export function GamesHubPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>("All");

  const categories: GameCategory[] = ["All", "Quiz", "Memory", "Puzzle", "Arcade"];

  const filteredGames = useMemo(() => {
    return GAMES.filter((game) => {
      const matchesCategory = selectedCategory === "All" || game.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        t(game.titleKey as any).toLowerCase().includes(searchQuery.toLowerCase()) ||
        t(game.descKey as any).toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory, t]);

  const featuredGame = filteredGames.find((g) => g.available) || filteredGames[0];

  const otherGames = filteredGames.filter((g) => g.available && g !== featuredGame);
  const categoryOptions = categories.map((cat) => ({
    id: cat,
    label: t(`games.category${cat}` as any),
  }));

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <PosterHeader
        title={t("games.title")}
        subtitle={t("games.subtitle")}
      />

      {/* Horizontal Game Categories Rail */}
      <CategoryStrip
        categories={categoryOptions}
        selectedId={selectedCategory}
        onSelect={(id) => setSelectedCategory(id as GameCategory)}
      />

      {/* Play Zone Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Featured Game (Large Poster Tile) */}
        {featuredGame && (
          <div className="lg:col-span-1">
            <div className="bg-background border-2 border-primary/30 rounded-lg p-8 hover:shadow-lg transition-all">
              <div className="text-center mb-6">
                <div className="text-7xl mb-6">{featuredGame.icon}</div>
                <h3 className="font-bold text-3xl mb-3 text-foreground">{t(featuredGame.titleKey as any)}</h3>
                <p className="text-muted-foreground mb-6 text-base">{t(featuredGame.descKey as any)}</p>
                <div className="flex items-center justify-center gap-3 mb-8">
                  <DifficultyBadge difficulty={featuredGame.difficulty} />
                  <span className="text-sm text-muted-foreground font-medium">
                    {featuredGame.estTime} {t("games.minutes")}
                  </span>
                </div>
                {featuredGame.available ? (
                  <Link to={`/games/${featuredGame.slug}`}>
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold w-full py-6 text-base shadow-lg">
                      <Play className="h-5 w-5 mr-2" />
                      {t("games.play")}
                    </Button>
                  </Link>
                ) : (
                  <Button size="lg" variant="outline" disabled className="w-full py-6 font-semibold">
                    {t("games.comingSoon")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Right: Other Games as Horizontal Rows */}
        <div className="lg:col-span-2 space-y-4">
          {otherGames.length > 0 ? (
            otherGames.map((game) => (
              <GameRow
                key={game.slug}
                icon={game.icon}
                title={t(game.titleKey as any)}
                description={t(game.descKey as any)}
                difficulty={game.difficulty}
                duration={`${game.estTime} ${t("games.minutes")}`}
                href={game.available ? `/games/${game.slug}` : undefined}
                available={game.available}
              />
            ))
          ) : filteredGames.length === 0 ? (
            <EmptyState
              title={t("games.noGamesFound")}
              description={t("games.noGamesDesc")}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

