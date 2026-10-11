import React, { useState, useEffect } from 'react';
import type { Recipe } from '../schemas/recipe.schema';
import { FavoritesContext, type FavoritesContextType } from './favorites.context';

const FAVORITES_STORAGE_KEY = 'culinary_saved_recipes';

interface FavoritesProviderProps {
  children: React.ReactNode;
}

/**
 * Componente Provider que armazena e sincroniza a lista de receitas favoritas
 * no localStorage com garantias de imutabilidade.
 */
export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Recipe[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? (JSON.parse(stored) as Recipe[]) : [];
    } catch {
      return [];
    }
  });

  // Sincroniza estado com o localStorage com imutabilidade
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (err) {
      console.warn('Erro ao salvar favoritos no storage local:', err);
    }
  }, [favorites]);

  const isFavorite = (id: number): boolean => {
    return favorites.some((item) => item.id === id);
  };

  const toggleFavorite = (recipe: Recipe): void => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === recipe.id);
      if (exists) {
        return prev.filter((item) => item.id !== recipe.id);
      }
      return [...prev, recipe];
    });
  };

  const removeFavorite = (id: number): void => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const clearFavorites = (): void => {
    setFavorites([]);
  };

  const value: FavoritesContextType = {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
    totalFavorites: favorites.length,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};
