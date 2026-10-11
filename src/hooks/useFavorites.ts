import { useContext } from 'react';
import { FavoritesContext, type FavoritesContextType } from '../contexts/favorites.context';

/**
 * Custom Hook para consumo seguro do contexto de favoritos.
 * Lança um erro explícito caso seja invocado fora da árvore do <FavoritesProvider>.
 *
 * @throws {Error} Quando utilizado fora de um FavoritesProvider.
 * @returns {FavoritesContextType} Funções e estado das receitas favoritas.
 */
export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites deve ser utilizado dentro de um <FavoritesProvider>');
  }
  return context;
}

export type { FavoritesContextType };
