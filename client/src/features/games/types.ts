import React from 'react';

export type GameCategory = 'All' | 'Quiz' | 'Memory' | 'Puzzle' | 'Arcade';
export type GameDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface Game {
  slug: string;
  titleKey: string;
  descKey: string;
  category: GameCategory;
  difficulty: GameDifficulty;
  estTime: string;
  icon: string;
  component: React.ComponentType;
  available: boolean;
}

