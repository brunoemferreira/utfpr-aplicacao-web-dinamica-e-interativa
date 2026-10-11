import React from 'react';
import { Container, Text, Group, Box, Anchor } from '@mantine/core';
import { IconChefHat } from '@tabler/icons-react';

export const AppFooter: React.FC = () => {
  return (
    <Box
      component="footer"
      mt={80}
      py="xl"
      style={{
        borderTop: '1px solid var(--mantine-color-default-border)',
        backgroundColor: 'var(--mantine-color-body)',
      }}
    >
      <Container size="xl">
        <Group justify="space-between" align="center" wrap="wrap">
          <Group gap="xs">
            <IconChefHat size={22} color="var(--mantine-color-orange-6)" />
            <Text fw={700} size="sm">
              SaborArt — Aplicação Web Dinâmica e Interativa
            </Text>
          </Group>

          <Text size="xs" c="dimmed">
            Projeto disciplina UTFPR - Desenvolvimento de Aplicações Web Dinâmicas e Interativas • Dados consumidos da API{' '}
            <Anchor href="https://dummyjson.com" target="_blank" rel="noopener noreferrer" c="orange">
              DummyJSON
            </Anchor>
          </Text>
        </Group>
      </Container>
    </Box>
  );
};
