import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  Button,
  ActionIcon,
  Stack,
  Box,
} from '@mantine/core';
import {
  IconHeart,
  IconClock,
  IconFlame,
  IconStar,
  IconUsers,
} from '@tabler/icons-react';
import type { Recipe } from '../../schemas/recipe.schema';
import { useFavorites } from '../../hooks/useFavorites';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(recipe.id);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'teal';
      case 'medium':
        return 'yellow';
      case 'hard':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
      }}
      className="recipe-card"
      data-testid={`recipe-card-${recipe.id}`}
    >
      <Card.Section style={{ position: 'relative', overflow: 'hidden' }}>
        <Image
          src={recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=600&q=80'}
          height={200}
          alt={recipe.name}
          fallbackSrc="https://placehold.co/600x400?text=Sem+Foto"
          style={{
            transition: 'transform 0.3s ease',
          }}
        />
        <ActionIcon
          variant={favorited ? 'filled' : 'light'}
          color={favorited ? 'red' : 'gray'}
          radius="xl"
          size="lg"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(recipe);
          }}
          aria-label={favorited ? `Remover ${recipe.name} dos favoritos` : `Adicionar ${recipe.name} aos favoritos`}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            backgroundColor: favorited ? undefined : 'rgba(255, 255, 255, 0.85)',
          }}
          id={`fav-btn-${recipe.id}`}
        >
          <IconHeart size={18} fill={favorited ? 'currentColor' : 'none'} />
        </ActionIcon>

        <Badge
          color={getDifficultyColor(recipe.difficulty)}
          variant="filled"
          size="sm"
          style={{ position: 'absolute', bottom: 12, left: 12 }}
        >
          {recipe.difficulty}
        </Badge>
      </Card.Section>

      <Stack gap="xs" mt="md" style={{ flex: 1 }}>
        <Group justify="space-between" align="center">
          <Badge color="orange" variant="light" size="sm">
            {recipe.cuisine}
          </Badge>

          <Group gap={4}>
            <IconStar size={16} color="gold" fill="gold" />
            <Text size="sm" fw={700}>
              {recipe.rating ? recipe.rating.toFixed(1) : '4.5'}
            </Text>
            {recipe.reviewCount !== undefined && (
              <Text size="xs" c="dimmed">
                ({recipe.reviewCount})
              </Text>
            )}
          </Group>
        </Group>

        <Text fw={700} size="lg" lineClamp={1} title={recipe.name}>
          {recipe.name}
        </Text>

        <Group gap="md" mt="xs">
          <Group gap={4} title="Tempo total de preparo">
            <IconClock size={16} color="gray" />
            <Text size="xs" c="dimmed">
              {(recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0)} min
            </Text>
          </Group>

          <Group gap={4} title="Rendimento em porções">
            <IconUsers size={16} color="gray" />
            <Text size="xs" c="dimmed">
              {recipe.servings} porções
            </Text>
          </Group>

          <Group gap={4} title="Calorias por porção">
            <IconFlame size={16} color="gray" />
            <Text size="xs" c="dimmed">
              {recipe.caloriesPerServing} kcal
            </Text>
          </Group>
        </Group>
      </Stack>

      <Box mt="lg">
        <Button
          fullWidth
          variant="light"
          color="orange"
          radius="md"
          onClick={() => navigate(`/receitas/${recipe.id}`)}
          id={`view-recipe-btn-${recipe.id}`}
        >
          Ver Receita Completa
        </Button>
      </Box>
    </Card>
  );
};
