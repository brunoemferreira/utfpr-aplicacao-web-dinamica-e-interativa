import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils';
import { RecipeCard } from './RecipeCard';
import type { Recipe } from '../../schemas/recipe.schema';

const mockRecipe: Recipe = {
  id: 42,
  name: 'Bruschetta Tradicional',
  cuisine: 'Italian',
  difficulty: 'Easy',
  prepTimeMinutes: 10,
  cookTimeMinutes: 5,
  servings: 4,
  caloriesPerServing: 180,
  ingredients: ['Pão italiano', 'Tomates maduros', 'Manjericão', 'Azeite'],
  instructions: ['Torre o pão', 'Misture os tomates com azeite', 'Monte e sirva'],
  tags: ['Italian', 'Appetizer'],
  image: 'https://dummyjson.com/bruschetta.jpg',
  rating: 4.9,
  reviewCount: 40,
  mealType: ['Dinner'],
};

describe('RecipeCard Component', () => {
  it('renderiza os dados da receita de forma acessível', () => {
    renderWithProviders(<RecipeCard recipe={mockRecipe} />);

    expect(screen.getByText('Bruschetta Tradicional')).toBeInTheDocument();
    expect(screen.getByText('Italian')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText(/15 min/)).toBeInTheDocument();
    expect(screen.getByText(/4 porções/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ver Receita Completa/i })).toBeInTheDocument();
  });

  it('permite favoritar e desfavoritar a receita via interação do usuário', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RecipeCard recipe={mockRecipe} />);

    const favButton = screen.getByLabelText(/Adicionar Bruschetta Tradicional aos favoritos/i);
    expect(favButton).toBeInTheDocument();

    // Clica para favoritar
    await user.click(favButton);

    // O botão deve alternar para estado de remover dos favoritos
    expect(
      screen.getByLabelText(/Remover Bruschetta Tradicional dos favoritos/i)
    ).toBeInTheDocument();
  });
});
