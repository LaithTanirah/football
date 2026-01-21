import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { GAMES, Game } from "../registry";
import { GameCategory } from "../types";
import { GamesUI } from "@/ui/games";

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
    <GamesUI
      title={t("games.title")}
      subtitle={t("games.subtitle")}
      categories={categoryOptions}
      selectedCategory={selectedCategory}
      onCategorySelect={(id) => setSelectedCategory(id as GameCategory)}
      featuredGame={
        featuredGame
          ? {
              slug: featuredGame.slug,
              icon: featuredGame.icon,
              title: t(featuredGame.titleKey as any),
              description: t(featuredGame.descKey as any),
              difficulty: featuredGame.difficulty,
              estTime: featuredGame.estTime,
              available: featuredGame.available,
            }
          : null
      }
      otherGames={otherGames.map((game) => ({
        slug: game.slug,
        icon: game.icon,
        title: t(game.titleKey as any),
        description: t(game.descKey as any),
        difficulty: game.difficulty,
        estTime: game.estTime,
        available: game.available,
      }))}
      minutesLabel={t("games.minutes")}
      playLabel={t("games.play")}
      comingSoonLabel={t("games.comingSoon")}
      noGamesFoundLabel={t("games.noGamesFound")}
      noGamesDescLabel={t("games.noGamesDesc")}
    />
  );
}

