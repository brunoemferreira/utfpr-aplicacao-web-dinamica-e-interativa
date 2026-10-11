import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  TextInput,
  Group,
  SimpleGrid,
  Pagination,
  Box,
  Badge,
  Paper,
  Button,
} from '@mantine/core';
import { IconSearch, IconX, IconSparkles } from '@tabler/icons-react';
import type { Recipe } from '../schemas/recipe.schema';
import { recipesService } from '../services/api';
import { RecipeCard } from '../components/recipes/RecipeCard';
import { RecipeSkeletonGrid } from '../components/common/RecipeSkeleton';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { useDebounce } from '../hooks/useDebounce';

const PAGE_SIZE = 9;

const POPULAR_CUISINES = [
  'Todas',
  'Italian',
  'Asian',
  'Mexican',
  'American',
  'Indian',
  'Mediterranean',
];

export const HomePage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('Todas');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Hook customizado de debounce para busca sem sobrecarregar a API
  const debouncedSearch = useDebounce(searchTerm, 400);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(1);
  };

  // Busca dados da API DummyJSON de acordo com a página, pesquisa e categoria
  useEffect(() => {
    let isSubscribed = true;

    const fetchRecipes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const skip = (page - 1) * PAGE_SIZE;
        let response;

        if (debouncedSearch.trim()) {
          response = await recipesService.search(debouncedSearch.trim(), {
            limit: PAGE_SIZE,
            skip,
          });
        } else if (selectedCuisine !== 'Todas') {
          response = await recipesService.getByTag(selectedCuisine, {
            limit: PAGE_SIZE,
            skip,
          });
        } else {
          response = await recipesService.getAll({
            limit: PAGE_SIZE,
            skip,
          });
        }

        if (isSubscribed) {
          setRecipes(response.recipes);
          setTotal(response.total);
        }
      } catch (err) {
        if (isSubscribed) {
          const message = err instanceof Error ? err.message : 'Falha ao carregar receitas.';
          setError(message);
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    fetchRecipes();

    // Função de limpeza para evitar atualização de estado após desmontagem
    return () => {
      isSubscribed = false;
    };
  }, [page, debouncedSearch, selectedCuisine]);

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  return (
    <div>
      {/* Hero Section */}
      <Box
        py={{ base: 40, md: 60 }}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 146, 43, 0.15) 0%, rgba(255, 107, 107, 0.08) 100%)',
          borderBottom: '1px solid var(--mantine-color-default-border)',
        }}
      >
        <Container size="xl">
          <Group justify="center" mb="xs">
            <Badge variant="gradient" gradient={{ from: 'orange', to: 'red' }} size="lg" leftSection={<IconSparkles size={14} />}>
              Explore Mais de 50 Receitas Incríveis
            </Badge>
          </Group>

          <Title
            order={1}
            ta="center"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, letterSpacing: '-1px' }}
          >
            Descubra, Cozinhe e Encante
          </Title>

          <Text c="dimmed" ta="center" size="lg" maw={640} mx="auto" mt="sm">
            Encontre inspiração para qualquer ocasião. Filtre por tipo de culinária, pesquise pratos específicos e salve suas receitas favoritas.
          </Text>

          {/* Campo de Busca */}
          <Box maw={600} mx="auto" mt="xl">
            <TextInput
              size="lg"
              radius="xl"
              placeholder="Pesquisar por receita, ingrediente ou estilo..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.currentTarget.value)}
              leftSection={<IconSearch size={20} />}
              rightSection={
                searchTerm ? (
                  <Button
                    variant="subtle"
                    color="gray"
                    size="xs"
                    p={4}
                    onClick={handleClearSearch}
                    aria-label="Limpar pesquisa"
                  >
                    <IconX size={16} />
                  </Button>
                ) : null
              }
              id="search-recipes-input"
            />
          </Box>

          {/* Filtros rápidos de Culinária */}
          <Group justify="center" gap="xs" mt="lg" wrap="wrap">
            {POPULAR_CUISINES.map((cuisine) => {
              const isActive = selectedCuisine === cuisine;
              return (
                <Button
                  key={cuisine}
                  variant={isActive ? 'filled' : 'default'}
                  color="orange"
                  size="xs"
                  radius="xl"
                  onClick={() => {
                    setSelectedCuisine(cuisine);
                    setSearchTerm('');
                    setPage(1);
                  }}
                  id={`filter-${cuisine.toLowerCase()}`}
                >
                  {cuisine}
                </Button>
              );
            })}
          </Group>
        </Container>
      </Box>

      {/* Conteúdo Principal */}
      <Container size="xl" py="xl">
        <Group justify="space-between" align="center" mb="lg">
          <div>
            <Title order={2} size="h3">
              {debouncedSearch
                ? `Resultados para "${debouncedSearch}"`
                : selectedCuisine !== 'Todas'
                ? `Culinária: ${selectedCuisine}`
                : 'Vitrine de Receitas'}
            </Title>
            <Text size="sm" c="dimmed">
              Exibindo {recipes.length} de {total} receitas encontradas
            </Text>
          </div>
        </Group>

        {error && <ErrorMessage message={error} onRetry={() => setPage(page)} />}

        {isLoading ? (
          <RecipeSkeletonGrid count={PAGE_SIZE} />
        ) : recipes.length === 0 ? (
          <Paper p="xl" radius="md" withBorder ta="center" my="xl">
            <Title order={3} size="h4" c="dimmed">
              Nenhuma receita encontrada
            </Title>
            <Text size="sm" c="dimmed" mt="xs">
              Tente buscar por outro termo ou selecione a categoria "Todas".
            </Text>
            <Button
              variant="light"
              color="orange"
              mt="md"
              onClick={() => {
                setSearchTerm('');
                setSelectedCuisine('Todas');
                setPage(1);
              }}
            >
              Limpar Filtros
            </Button>
          </Paper>
        ) : (
          <>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </SimpleGrid>

            {/* Paginação com Mantine UI */}
            {totalPages > 1 && (
              <Group justify="center" mt={48}>
                <Pagination
                  total={totalPages}
                  value={page}
                  onChange={setPage}
                  color="orange"
                  radius="md"
                  size="md"
                  withEdges
                  id="recipes-pagination"
                />
              </Group>
            )}
          </>
        )}
      </Container>
    </div>
  );
};
