import { createContext } from 'react';
import type { Recipe } from '../schemas/recipe.schema';

/**
 * Contrato de tipos do contexto de receitas favoritas.
 */
export interface FavoritesContextType {
  /** Lista imutável de receitas favoritadas */
  readonly favorites: Recipe[];
  /** Verifica se uma receita específica já foi adicionada aos favoritos */
  isFavorite: (id: number) => boolean;
  /** Alterna o estado de favorito de uma receita (adiciona ou remove) */
  toggleFavorite: (recipe: Recipe) => void;
  /** Remove uma receita dos favoritos pelo seu ID */
  removeFavorite: (id: number) => void;
  /** Limpa todas as receitas favoritas armazenadas */
  clearFavorites: () => void;
  /** Quantidade total de receitas salvas */
  readonly totalFavorites: number;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
