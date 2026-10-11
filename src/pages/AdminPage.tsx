import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Table,
  Button,
  Group,
  Badge,
  ActionIcon,
  Paper,
  SimpleGrid,
  Modal,
  Pagination,
  Box,
  Image,
} from '@mantine/core';
import {
  IconPlus,
  IconTrash,
  IconEye,
  IconShieldLock,
  IconFlame,
  IconClock,
  IconChefHat,
} from '@tabler/icons-react';
import type { Recipe } from '../schemas/recipe.schema';
import { recipesService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { RecipeSkeletonGrid } from '../components/common/RecipeSkeleton';

const PAGE_SIZE = 8;

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para exclusão
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const fetchAdminRecipes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const skip = (page - 1) * PAGE_SIZE;
        const res = await recipesService.getAll({ limit: PAGE_SIZE, skip });
        if (isMounted) {
          setRecipes(res.recipes);
          setTotal(res.total);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Falha ao carregar lista administrativa.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAdminRecipes();

    return () => {
      isMounted = false;
    };
  }, [page]);

  const confirmDelete = async () => {
    if (!recipeToDelete) return;
    setIsDeleting(true);

    try {
      await recipesService.delete(recipeToDelete.id);
      // Atualização imutável do estado local removendo a receita
      setRecipes((prev) => prev.filter((r) => r.id !== recipeToDelete.id));
      setTotal((prev) => Math.max(0, prev - 1));
      setRecipeToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao excluir receita.');
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  return (
    <Container size="xl" py="xl">
      {/* Banner Superior com perfil */}
      <Paper p="lg" radius="md" withBorder mb="xl" style={{ backgroundColor: 'var(--mantine-color-orange-light)' }}>
        <Group justify="space-between" align="center" wrap="wrap">
          <Group gap="md">
            <IconShieldLock size={32} color="var(--mantine-color-orange-7)" />
            <div>
              <Title order={1} size="h3" c="orange.9">
                Painel Administrativo do Chef
              </Title>
              <Text size="sm" c="dimmed">
                Logado como: <b>{user?.firstName || user?.username}</b> ({user?.email || 'Admin'})
              </Text>
            </div>
          </Group>

          <Button
            leftSection={<IconPlus size={18} />}
            color="orange"
            radius="md"
            onClick={() => navigate('/admin/nova-receita')}
            id="admin-new-recipe-btn"
          >
            Cadastrar Nova Receita
          </Button>
        </Group>
      </Paper>

      {/* Cartões de Estatísticas */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="xl">
        <Paper p="md" radius="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Total de Receitas
              </Text>
              <Text fw={700} size="xl" mt={4}>
                {total}
              </Text>
            </div>
            <IconChefHat size={28} color="orange" />
          </Group>
        </Paper>

        <Paper p="md" radius="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Página Atual
              </Text>
              <Text fw={700} size="xl" mt={4}>
                {page} de {totalPages}
              </Text>
            </div>
            <IconClock size={28} color="teal" />
          </Group>
        </Paper>

        <Paper p="md" radius="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Permissão
              </Text>
              <Text fw={700} size="xl" mt={4} c="green">
                Acesso Total
              </Text>
            </div>
            <IconFlame size={28} color="red" />
          </Group>
        </Paper>
      </SimpleGrid>

      {error && <ErrorMessage message={error} onRetry={() => setPage(page)} />}

      {/* Tabela de Receitas */}
      {isLoading ? (
        <RecipeSkeletonGrid count={3} />
      ) : (
        <Paper radius="md" withBorder shadow="xs">
          <Table.ScrollContainer minWidth={600}>
            <Table verticalSpacing="sm" highlightOnHover striped id="admin-recipes-table">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Receita</Table.Th>
                  <Table.Th>Culinária</Table.Th>
                  <Table.Th>Dificuldade</Table.Th>
                  <Table.Th>Preparo</Table.Th>
                  <Table.Th>Porções</Table.Th>
                  <Table.Th ta="right">Ações</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {recipes.map((item) => (
                  <Table.Tr key={item.id} data-testid={`admin-row-${item.id}`}>
                    <Table.Td>
                      <Group gap="sm">
                        <Image
                          src={item.image}
                          alt={item.name}
                          w={44}
                          h={44}
                          radius="sm"
                          fallbackSrc="https://placehold.co/100x100?text=Foto"
                        />
                        <div>
                          <Text fw={600} size="sm">
                            {item.name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {item.caloriesPerServing} kcal / porção
                          </Text>
                        </div>
                      </Group>
                    </Table.Td>

                    <Table.Td>
                      <Badge size="sm" variant="light" color="orange">
                        {item.cuisine}
                      </Badge>
                    </Table.Td>

                    <Table.Td>
                      <Badge
                        size="sm"
                        color={
                          item.difficulty.toLowerCase() === 'easy'
                            ? 'teal'
                            : item.difficulty.toLowerCase() === 'medium'
                            ? 'yellow'
                            : 'red'
                        }
                      >
                        {item.difficulty}
                      </Badge>
                    </Table.Td>

                    <Table.Td>
                      <Text size="sm">
                        {(item.prepTimeMinutes || 0) + (item.cookTimeMinutes || 0)} min
                      </Text>
                    </Table.Td>

                    <Table.Td>
                      <Text size="sm">{item.servings}</Text>
                    </Table.Td>

                    <Table.Td ta="right">
                      <Group gap={6} justify="flex-end">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => navigate(`/receitas/${item.id}`)}
                          title="Visualizar Detalhes"
                          aria-label={`Visualizar ${item.name}`}
                        >
                          <IconEye size={16} />
                        </ActionIcon>

                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => setRecipeToDelete(item)}
                          title="Excluir Receita"
                          aria-label={`Excluir ${item.name}`}
                          id={`delete-recipe-btn-${item.id}`}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>

          {totalPages > 1 && (
            <Box p="md" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
              <Group justify="center">
                <Pagination
                  total={totalPages}
                  value={page}
                  onChange={setPage}
                  color="orange"
                  radius="md"
                  size="sm"
                />
              </Group>
            </Box>
          )}
        </Paper>
      )}

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        opened={!!recipeToDelete}
        onClose={() => setRecipeToDelete(null)}
        title="Confirmar Exclusão"
        centered
      >
        <Text size="sm">
          Tem certeza de que deseja remover a receita <b>"{recipeToDelete?.name}"</b>? Esta ação simula a deleção na API DummyJSON via <code>DELETE /recipes/:id</code>.
        </Text>
        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={() => setRecipeToDelete(null)}>
            Cancelar
          </Button>
          <Button
            color="red"
            loading={isDeleting}
            onClick={confirmDelete}
            id="confirm-delete-btn"
          >
            Excluir Receita
          </Button>
        </Group>
      </Modal>
    </Container>
  );
};
