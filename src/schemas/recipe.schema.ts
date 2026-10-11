import { z } from 'zod';

export const recipeSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'O nome da receita é obrigatório'),
  ingredients: z.array(z.string()).default([]),
  instructions: z.array(z.string()).default([]),
  prepTimeMinutes: z.number().nonnegative().default(0),
  cookTimeMinutes: z.number().nonnegative().default(0),
  servings: z.number().positive().default(1),
  difficulty: z.string().default('Easy'),
  cuisine: z.string().default('Geral'),
  caloriesPerServing: z.number().nonnegative().default(0),
  tags: z.array(z.string()).default([]),
  userId: z.number().optional(),
  image: z.string().default('https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80'),
  rating: z.number().min(0).max(5).default(4.5),
  reviewCount: z.number().nonnegative().default(0),
  mealType: z.array(z.string()).default(['Geral']),
});

export type Recipe = z.infer<typeof recipeSchema>;

export const recipesResponseSchema = z.object({
  recipes: z.array(recipeSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type RecipesResponse = z.infer<typeof recipesResponseSchema>;

// Schema para o formulário de cadastro de nova receita
export const createRecipeFormSchema = z.object({
  name: z.string().min(3, 'O título da receita deve ter pelo menos 3 caracteres'),
  cuisine: z.string().min(2, 'Informe o tipo de cozinha (ex: Italiana, Brasileira, etc.)'),
  difficulty: z.string().min(1, 'Selecione uma dificuldade'),
  prepTimeMinutes: z.number().min(1, 'Tempo de preparo deve ser maior que 0'),
  cookTimeMinutes: z.number().min(0, 'Tempo de cozimento deve ser igual ou maior que 0'),
  servings: z.number().min(1, 'Rendimento deve ter pelo menos 1 porção'),
  caloriesPerServing: z.number().min(1, 'Calorias por porção devem ser maiores que 0'),
  ingredients: z.string().min(5, 'Informe os ingredientes (um por linha)'),
  instructions: z.string().min(10, 'Informe as instruções de preparo (uma por linha)'),
  image: z.string().url('Informe uma URL de imagem válida').optional().or(z.literal('')),
  tags: z.string().optional(),
});

export type CreateRecipeFormData = z.infer<typeof createRecipeFormSchema>;

/**
 * Validador seguro com safeParse para a lista de receitas
 */
export function validateRecipesResponse(data: unknown): RecipesResponse | null {
  const result = recipesResponseSchema.safeParse(data);
  if (!result.success) {
    console.warn('Falha na validação Zod de RecipesResponse:', result.error.format());
    return null;
  }
  return result.data;
}

/**
 * Validador seguro com safeParse para uma única receita
 */
export function validateRecipe(data: unknown): Recipe | null {
  const result = recipeSchema.safeParse(data);
  if (!result.success) {
    console.warn('Falha na validação Zod de Recipe:', result.error.format());
    return null;
  }
  return result.data;
}
