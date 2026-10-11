import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Title, Text, Button, Paper, Box } from '@mantine/core';
import { IconAlertTriangle, IconHome } from '@tabler/icons-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container size={500} py={80}>
      <Paper p="xl" radius="md" withBorder ta="center">
        <Box mb="md">
          <IconAlertTriangle size={56} color="var(--mantine-color-orange-6)" />
        </Box>
        <Title order={1} size="h1" fw={900} c="orange.7">
          404
        </Title>
        <Title order={2} size="h3" mt="xs">
          Página não encontrada
        </Title>
        <Text c="dimmed" size="sm" mt="sm">
          A rota que você tentou acessar não existe ou a receita foi removida do cardápio.
        </Text>
        <Button
          leftSection={<IconHome size={18} />}
          color="orange"
          mt="xl"
          onClick={() => navigate('/')}
        >
          Voltar para a Página Inicial
        </Button>
      </Paper>
    </Container>
  );
};
