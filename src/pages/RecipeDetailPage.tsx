import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Image,
  Title,
  Text,
  Badge,
  Group,
  Button,
  Stack,
  Paper,
  Checkbox,
  ActionIcon,
  Box,
  Divider,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconClock,
  IconUsers,
  IconFlame,
  IconStar,
  IconHeart,
  IconChefHat,
  IconCheck,
} from '@tabler/icons-react';
import type { Recipe } from '../schemas/recipe.schema';
import { recipesService } from '../services/api';
import { useFavorites } from '../hooks/useFavorites';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { RecipeSkeletonGrid } from '../components/common/RecipeSkeleton';

export const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estado local com imutabilidade para checklist de ingredientes
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  // Estado local para controle do rendimento de porções
  const [servingsMultiplier, setServingsMultiplier] = useState<number>(1);

  useEffect(() => {
    let isMounted = true;

    const fetchRecipeDetail = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);

      try {
        const data = await recipesService.getById(id);
        if (isMounted) {
          setRecipe(data);
          setCheckedIngredients([]);
          setServingsMultiplier(1);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Falha ao carregar os detalhes da receita.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchRecipeDetail();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleToggleIngredient = (ingredient: string) => {
    setCheckedIngredients((prev) => {
      if (prev.includes(ingredient)) {
        return prev.filter((item) => item !== ingredient);
      }
      return [...prev, ingredient]; // Atualização imutável com spread
    });
  };

  if (isLoading) {
    return (
      <Container size="lg" py="xl">
        <RecipeSkeletonGrid count={1} />
      </Container>
    );
  }

  if (error || !recipe) {
    return (
      <Container size="md" py="xl">
        <ErrorMessage
          message={error || 'Receita não encontrada.'}
          onRetry={() => navigate('/')}
        />
        <Button
          leftSection={<IconArrowLeft size={16} />}
          variant="default"
          onClick={() => navigate('/')}
          mt="md"
        >
          Voltar para o Catálogo
        </Button>
      </Container>
    );
  }

  const favorited = isFavorite(recipe.id);

  return (
    <Container size="lg" py="xl">
      {/* Botão de retorno */}
      <Button
        leftSection={<IconArrowLeft size={16} />}
        variant="subtle"
        color="gray"
        mb="lg"
        onClick={() => navigate(-1)}
        id="back-to-recipes-btn"
      >
        Voltar
      </Button>

      {/* Cabeçalho da Receita */}
      <Grid gap="xl">
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Box style={{ position: 'relative' }}>
            <Image
              src={recipe.image}
              alt={recipe.name}
              radius="lg"
              fallbackSrc="https://placehold.co/600x400?text=Sem+Foto"
              style={{ width: '100%', maxHeight: 420, objectFit: 'cover' }}
            />
            <ActionIcon
              variant={favorited ? 'filled' : 'light'}
              color={favorited ? 'red' : 'gray'}
              radius="xl"
              size="xl"
              onClick={() => toggleFavorite(recipe)}
              aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: favorited ? undefined : 'rgba(255, 255, 255, 0.9)',
              }}
              id="detail-fav-btn"
            >
              <IconHeart size={24} fill={favorited ? 'currentColor' : 'none'} />
            </ActionIcon>
          </Box>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          <Stack gap="md">
            <Group justify="space-between" align="center">
              <Badge color="orange" size="lg" variant="light">
                {recipe.cuisine}
              </Badge>
              <Badge color="teal" size="lg" variant="filled">
                {recipe.difficulty}
              </Badge>
            </Group>

            <Title order={1} style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', lineHeight: 1.2 }}>
              {recipe.name}
            </Title>

            <Group gap="md">
              <Group gap={4}>
                <IconStar size={20} color="gold" fill="gold" />
                <Text fw={700} size="md">
                  {recipe.rating}
                </Text>
                <Text c="dimmed" size="sm">
                  ({recipe.reviewCount} avaliações)
                </Text>
              </Group>
              <Divider orientation="vertical" />
              <Group gap={4}>
                <IconChefHat size={20} color="gray" />
                <Text size="sm" c="dimmed">
                  {recipe.mealType?.join(', ') || 'Geral'}
                </Text>
              </Group>
            </Group>

            {/* Informações Rápidas */}
            <Paper p="md" radius="md" withBorder mt="xs">
              <Grid gap="xs" ta="center">
                <Grid.Col span={4}>
                  <IconClock size={20} color="var(--mantine-color-orange-6)" />
                  <Text size="xs" c="dimmed" mt={2}>
                    Preparo / Cozimento
                  </Text>
                  <Text fw={700} size="sm">
                    {recipe.prepTimeMinutes}m / {recipe.cookTimeMinutes}m
                  </Text>
                </Grid.Col>

                <Grid.Col span={4}>
                  <IconUsers size={20} color="var(--mantine-color-orange-6)" />
                  <Text size="xs" c="dimmed" mt={2}>
                    Rendimento
                  </Text>
                  <Text fw={700} size="sm">
                    {recipe.servings * servingsMultiplier} porções
                  </Text>
                </Grid.Col>

                <Grid.Col span={4}>
                  <IconFlame size={20} color="var(--mantine-color-orange-6)" />
                  <Text size="xs" c="dimmed" mt={2}>
                    Calorias
                  </Text>
                  <Text fw={700} size="sm">
                    {recipe.caloriesPerServing} kcal
                  </Text>
                </Grid.Col>
              </Grid>
            </Paper>

            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <Group gap={6} mt="xs">
                {recipe.tags.map((tag) => (
                  <Badge key={tag} variant="outline" color="gray" size="sm">
                    #{tag}
                  </Badge>
                ))}
              </Group>
            )}
          </Stack>
        </Grid.Col>
      </Grid>

      <Divider my={40} />

      {/* Ingredientes e Modo de Preparo */}
      <Grid gap="xl">
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Paper p="xl" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={2} size="h3">
                Ingredientes
              </Title>
              <Group gap="xs">
                <Button
                  size="compact-xs"
                  variant="default"
                  onClick={() => setServingsMultiplier((prev) => Math.max(1, prev - 1))}
                  title="Diminuir rendimento"
                >
                  -
                </Button>
                <Text size="xs" fw={700}>
                  {servingsMultiplier}x
                </Text>
                <Button
                  size="compact-xs"
                  variant="default"
                  onClick={() => setServingsMultiplier((prev) => prev + 1)}
                  title="Aumentar rendimento"
                >
                  +
                </Button>
              </Group>
            </Group>

            <Text size="xs" c="dimmed" mb="md">
              Marque os itens conforme for separando na bancada:
            </Text>

            <Stack gap="sm">
              {recipe.ingredients.map((ingredient, idx) => {
                const isChecked = checkedIngredients.includes(ingredient);
                return (
                  <Paper
                    key={idx}
                    p="xs"
                    radius="sm"
                    withBorder
                    style={{
                      backgroundColor: isChecked ? 'var(--mantine-color-teal-light)' : undefined,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onClick={() => handleToggleIngredient(ingredient)}
                  >
                    <Checkbox
                      label={ingredient}
                      checked={isChecked}
                      onChange={() => handleToggleIngredient(ingredient)}
                      color="teal"
                      style={{
                        textDecoration: isChecked ? 'line-through' : 'none',
                      }}
                    />
                  </Paper>
                );
              })}
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          <Paper p="xl" radius="md" withBorder>
            <Title order={2} size="h3" mb="md">
              Modo de Preparo
            </Title>

            <Stack gap="md">
              {recipe.instructions.map((step, idx) => (
                <Group key={idx} align="flex-start" wrap="nowrap">
                  <Badge size="lg" circle color="orange" variant="filled">
                    {idx + 1}
                  </Badge>
                  <Text size="sm" style={{ flex: 1, lineHeight: 1.6 }}>
                    {step}
                  </Text>
                </Group>
              ))}
            </Stack>

            <Box mt="xl" p="md" style={{ backgroundColor: 'var(--mantine-color-orange-light)', borderRadius: '8px' }}>
              <Group gap="xs">
                <IconCheck size={18} color="var(--mantine-color-orange-7)" />
                <Text size="xs" fw={600} c="orange.9">
                  Dica do Chef: Ajuste os temperos ao seu paladar e bom apetite!
                </Text>
              </Group>
            </Box>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};
