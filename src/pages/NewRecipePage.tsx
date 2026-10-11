import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Button,
  Grid,
  Stack,
  Alert,
  Group,
  Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft, IconCheck, IconAlertCircle, IconChefHat } from '@tabler/icons-react';
import { createRecipeFormSchema } from '../schemas/recipe.schema';
import type { CreateRecipeFormData } from '../schemas/recipe.schema';
import { zodResolver } from '../utils/zodResolver';
import { recipesService } from '../services/api';

export const NewRecipePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<CreateRecipeFormData>({
    initialValues: {
      name: '',
      cuisine: '',
      difficulty: 'Easy',
      prepTimeMinutes: 15,
      cookTimeMinutes: 20,
      servings: 4,
      caloriesPerServing: 350,
      ingredients: '',
      instructions: '',
      image: '',
      tags: '',
    },
    validate: zodResolver(createRecipeFormSchema),
  });

  const handleSubmit = async (values: CreateRecipeFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Processa ingredientes e instruções que foram informados como texto
      const ingredientsArray = values.ingredients
        .split('\n')
        .map((i) => i.trim())
        .filter((i) => i.length > 0);

      const instructionsArray = values.instructions
        .split('\n')
        .map((i) => i.trim())
        .filter((i) => i.length > 0);

      const tagsArray = values.tags
        ? values.tags.split(',').map((t) => t.trim()).filter((t) => t.length > 0)
        : [values.cuisine];

      const newRecipeData = {
        name: values.name,
        cuisine: values.cuisine,
        difficulty: values.difficulty,
        prepTimeMinutes: values.prepTimeMinutes,
        cookTimeMinutes: values.cookTimeMinutes,
        servings: values.servings,
        caloriesPerServing: values.caloriesPerServing,
        ingredients: ingredientsArray,
        instructions: instructionsArray,
        tags: tagsArray,
        image: values.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      };

      await recipesService.create(newRecipeData);

      setSuccessMessage('Receita cadastrada com sucesso via DummyJSON POST /recipes/add!');
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Falha ao cadastrar receita. Tente novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container size="md" py="xl">
      <Button
        leftSection={<IconArrowLeft size={16} />}
        variant="subtle"
        color="gray"
        mb="lg"
        onClick={() => navigate('/admin')}
      >
        Voltar para o Painel
      </Button>

      <Paper radius="md" p="xl" withBorder shadow="sm">
        <Group justify="space-between" mb="xs">
          <div>
            <Title order={1} size="h2">
              Cadastrar Nova Receita
            </Title>
            <Text size="sm" c="dimmed">
              Preencha os dados abaixo. O formulário é validado pelo schema Zod.
            </Text>
          </div>
          <IconChefHat size={36} color="var(--mantine-color-orange-6)" />
        </Group>

        <Divider my="md" />

        {errorMessage && (
          <Alert icon={<IconAlertCircle size={18} />} title="Erro" color="red" radius="md" mb="lg">
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert icon={<IconCheck size={18} />} title="Sucesso" color="teal" radius="md" mb="lg">
            {successMessage}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
          <Stack gap="md">
            <TextInput
              required
              label="Nome do Prato / Receita"
              placeholder="Ex: Risoto de Cogumelos Frescos"
              {...form.getInputProps('name')}
              id="recipe-name-input"
            />

            <Grid gap="md">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  required
                  label="Tipo de Cozinha / Culinária"
                  placeholder="Ex: Italiana, Brasileira, Japonesa"
                  {...form.getInputProps('cuisine')}
                  id="recipe-cuisine-input"
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Select
                  required
                  label="Grau de Dificuldade"
                  data={[
                    { value: 'Easy', label: 'Fácil (Easy)' },
                    { value: 'Medium', label: 'Médio (Medium)' },
                    { value: 'Hard', label: 'Avançado (Hard)' },
                  ]}
                  {...form.getInputProps('difficulty')}
                  id="recipe-difficulty-select"
                />
              </Grid.Col>
            </Grid>

            <Grid gap="md">
              <Grid.Col span={{ base: 6, sm: 3 }}>
                <NumberInput
                  required
                  label="Preparo (minutos)"
                  min={1}
                  {...form.getInputProps('prepTimeMinutes')}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 6, sm: 3 }}>
                <NumberInput
                  required
                  label="Cozimento (minutos)"
                  min={0}
                  {...form.getInputProps('cookTimeMinutes')}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 6, sm: 3 }}>
                <NumberInput
                  required
                  label="Rendimento (porções)"
                  min={1}
                  {...form.getInputProps('servings')}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 6, sm: 3 }}>
                <NumberInput
                  required
                  label="Calorias / porção"
                  min={1}
                  {...form.getInputProps('caloriesPerServing')}
                />
              </Grid.Col>
            </Grid>

            <Textarea
              required
              label="Ingredientes"
              description="Digite um ingrediente por linha"
              placeholder="2 xícaras de arroz arbóreo&#10;200g de cogumelos paris&#10;1 cebola média picada&#10;Azeite de oliva e sal a gosto"
              minRows={4}
              {...form.getInputProps('ingredients')}
              id="recipe-ingredients-textarea"
            />

            <Textarea
              required
              label="Instruções de Preparo"
              description="Digite cada passo em uma nova linha"
              placeholder="Aqueça o azeite em uma panela e refogue a cebola.&#10;Acrescente os cogumelos e salteie por 5 minutos.&#10;Adicione o arroz e o caldo quente gradualmente mexendo sempre.&#10;Finalize com queijo parmesão e sirva quente."
              minRows={4}
              {...form.getInputProps('instructions')}
              id="recipe-instructions-textarea"
            />

            <Grid gap="md">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="URL da Imagem (Opcional)"
                  placeholder="https://exemplo.com/foto-do-prato.jpg"
                  {...form.getInputProps('image')}
                />
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Tags (separadas por vírgula)"
                  placeholder="Ex: Risoto, Cogumelos, Gourmet"
                  {...form.getInputProps('tags')}
                />
              </Grid.Col>
            </Grid>

            <Group justify="flex-end" mt="lg">
              <Button variant="default" onClick={() => navigate('/admin')}>
                Cancelar
              </Button>
              <Button
                type="submit"
                color="orange"
                loading={isSubmitting}
                id="submit-create-recipe-btn"
              >
                Salvar e Publicar Receita
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};
