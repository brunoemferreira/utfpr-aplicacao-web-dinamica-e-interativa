import axios from 'axios';
import type { LoginFormData, UserAuthResponse } from '../schemas/auth.schema';
import { validateUserAuth } from '../schemas/auth.schema';
import type { Recipe, RecipesResponse } from '../schemas/recipe.schema';
import { validateRecipe, validateRecipesResponse } from '../schemas/recipe.schema';

export const AUTH_TOKEN_KEY = 'culinary_auth_jwt';
export const AUTH_USER_KEY = 'culinary_auth_user';

export const api = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor de requisição: injeta o token JWT no header Authorization
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Ignora falha de acesso a localStorage em ambientes isolados
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de resposta: formata erros amigáveis de rede e autorização
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let friendlyMessage = 'Ocorreu um erro inesperado ao se comunicar com a API.';

    if (error.response) {
      const status = error.response.status;
      if (status === 400) {
        friendlyMessage = error.response.data?.message || 'Dados inválidos enviados na requisição.';
      } else if (status === 401) {
        friendlyMessage = 'Credenciais inválidas ou sessão expirada. Por favor, autentique-se novamente.';
      } else if (status === 403) {
        friendlyMessage = 'Você não possui permissão para acessar este recurso.';
      } else if (status === 404) {
        friendlyMessage = 'A receita ou recurso solicitado não foi encontrado.';
      } else if (status >= 500) {
        friendlyMessage = 'Instabilidade temporária nos servidores da API DummyJSON.';
      }
    } else if (error.request) {
      friendlyMessage = 'Sem resposta do servidor. Verifique sua conexão com a internet.';
    }

    const enhancedError = new Error(friendlyMessage);
    (enhancedError as unknown as { originalError: unknown }).originalError = error;
    return Promise.reject(enhancedError);
  }
);

// Serviços de Autenticação
export const authService = {
  async login(credentials: LoginFormData): Promise<UserAuthResponse> {
    const response = await api.post('/auth/login', {
      username: credentials.username,
      password: credentials.password,
      expiresInMins: 120,
    });

    const validated = validateUserAuth(response.data);
    if (!validated) {
      throw new Error('Formato inesperado na resposta de autenticação.');
    }
    return validated;
  },
};

// Serviços de Receitas
export const recipesService = {
  async getAll(params: { limit?: number; skip?: number } = {}): Promise<RecipesResponse> {
    const { limit = 9, skip = 0 } = params;
    const response = await api.get('/recipes', {
      params: { limit, skip },
    });

    const validated = validateRecipesResponse(response.data);
    if (!validated) {
      throw new Error('Falha ao validar lista de receitas recebida da API.');
    }
    return validated;
  },

  async search(query: string, params: { limit?: number; skip?: number } = {}): Promise<RecipesResponse> {
    const { limit = 9, skip = 0 } = params;
    const response = await api.get('/recipes/search', {
      params: { q: query, limit, skip },
    });

    const validated = validateRecipesResponse(response.data);
    if (!validated) {
      throw new Error('Falha ao validar resultados de busca.');
    }
    return validated;
  },

  async getById(id: number | string): Promise<Recipe> {
    const response = await api.get(`/recipes/${id}`);
    const validated = validateRecipe(response.data);
    if (!validated) {
      throw new Error('Falha ao validar detalhes da receita recebida.');
    }
    return validated;
  },

  async getTags(): Promise<string[]> {
    const response = await api.get('/recipes/tags');
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  },

  async getByTag(tag: string, params: { limit?: number; skip?: number } = {}): Promise<RecipesResponse> {
    const { limit = 9, skip = 0 } = params;
    const response = await api.get(`/recipes/tag/${encodeURIComponent(tag)}`, {
      params: { limit, skip },
    });

    const validated = validateRecipesResponse(response.data);
    if (!validated) {
      throw new Error('Falha ao validar receitas filtradas por tag.');
    }
    return validated;
  },

  async create(recipeData: Partial<Recipe>): Promise<Recipe> {
    const response = await api.post('/recipes/add', recipeData);
    const validated = validateRecipe(response.data);
    if (!validated) {
      // DummyJSON retorna o objeto criado
      return response.data as Recipe;
    }
    return validated;
  },

  async delete(id: number | string): Promise<boolean> {
    await api.delete(`/recipes/${id}`);
    return true;
  },
};
