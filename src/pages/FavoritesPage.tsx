import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Button,
  Group,
  Paper,
  Box,
} from '@mantine/core';
import { IconHeartOff, IconChefHat } from '@tabler/icons-react';
import { useFavorites } from '../hooks/useFavorites';
import { RecipeCard } from '../components/recipes/RecipeCard';

export const FavoritesPage: React.FC = () => {
  const { favorites, clearFavorites } = useFavorites();
  const navigate = useNavigate();

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" align="center" mb="xl">
        <div>
          <Title order={1} size="h2">
            Minhas Receitas Favoritas
          </Title>
          <Text size="sm" c="dimmed">
            {favorites.length} {favorites.length === 1 ? 'receita salva' : 'receitas salvas'} para cozinhar quando quiser
          </Text>
        </div>

        {favorites.length > 0 && (
          <Button
            variant="subtle"
            color="red"
            leftSection={<IconHeartOff size={16} />}
            onClick={clearFavorites}
            id="clear-favorites-btn"
          >
            Limpar Favoritos
          </Button>
        )}
      </Group>

      {favorites.length === 0 ? (
        <Paper p={50} radius="md" withBorder ta="center" my="xl">
          <Box mb="md">
            <IconChefHat size={48} color="var(--mantine-color-orange-6)" />
          </Box>
          <Title order={3} size="h3">
            Nenhuma receita favorita ainda
          </Title>
          <Text size="sm" c="dimmed" maw={460} mx="auto" mt="xs">
            Você ainda não salvou nenhuma receita. Explore o catálogo e clique no ícone de coração para guardar seus pratos preferidos!
          </Text>
          <Button
            variant="filled"
            color="orange"
            size="md"
            mt="xl"
            onClick={() => navigate('/')}
            id="browse-recipes-btn"
          >
            Explorar Catálogo de Receitas
          </Button>
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {favorites.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
};
