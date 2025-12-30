import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { GameCard } from "../components/GameCard";
import { GAMES, Game } from "../registry";
import { GameCategory } from "../types";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

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

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Hero Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("games.title")}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("games.subtitle")}
        </p>
      </div>

      {/* Filters and Search */}
      <div className="space-y-4 mb-8">
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("games.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {t(`games.category${category}` as any)}
            </Button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={t("games.noGamesFound")}
          description={t("games.noGamesDesc")}
        />
      )}
    </div>
  );
}

