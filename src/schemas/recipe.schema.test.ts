import { describe, it, expect } from 'vitest';
import {
  recipeSchema,
  createRecipeFormSchema,
  validateRecipe,
} from './recipe.schema';

describe('Recipe Zod Schemas', () => {
  const validRecipe = {
    id: 1,
    name: 'Classic Margherita Pizza',
    ingredients: ['Tomato', 'Mozzarella', 'Basil'],
    instructions: ['Bake at 250C for 10 minutes'],
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    servings: 4,
    difficulty: 'Easy',
    cuisine: 'Italian',
    caloriesPerServing: 280,
    tags: ['Pizza', 'Italian'],
    image: 'https://dummyjson.com/image.jpg',
    rating: 4.8,
    reviewCount: 35,
    mealType: ['Dinner'],
  };

  it('valida com sucesso um objeto de receita com todos os campos válidos', () => {
    const result = recipeSchema.safeParse(validRecipe);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Classic Margherita Pizza');
      expect(result.data.servings).toBe(4);
    }
  });

  it('rejeita receita sem id ou sem nome', () => {
    const invalid = { ...validRecipe, id: undefined, name: '' };
    const result = recipeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('validateRecipe retorna o dado parseado para entradas corretas', () => {
    const parsed = validateRecipe(validRecipe);
    expect(parsed).not.toBeNull();
    expect(parsed?.cuisine).toBe('Italian');
  });

  it('valida formulário de nova receita com campos obrigatórios preenchidos', () => {
    const validFormData = {
      name: 'Risoto de Funghi',
      cuisine: 'Italiana',
      difficulty: 'Medium',
      prepTimeMinutes: 20,
      cookTimeMinutes: 30,
      servings: 2,
      caloriesPerServing: 420,
      ingredients: 'Arroz arbóreo\nFunghi secchi\nCaldo de legumes',
      instructions: 'Hidrate o funghi.\nRefogue o arroz.\nAdicione caldo aos poucos.',
      image: 'https://exemplo.com/foto.jpg',
    };

    const result = createRecipeFormSchema.safeParse(validFormData);
    expect(result.success).toBe(true);
  });

  it('rejeita formulário de nova receita se o título tiver menos de 3 caracteres', () => {
    const invalidFormData = {
      name: 'Oi',
      cuisine: 'Italiana',
      difficulty: 'Easy',
      prepTimeMinutes: 10,
      cookTimeMinutes: 10,
      servings: 2,
      caloriesPerServing: 200,
      ingredients: 'Ingrediente 1',
      instructions: 'Passo 1 passo 2 passo 3',
    };

    const result = createRecipeFormSchema.safeParse(invalidFormData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('pelo menos 3 caracteres');
    }
  });
});
