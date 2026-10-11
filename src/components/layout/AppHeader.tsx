import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Group,
  Button,
  Text,
  Badge,
  ActionIcon,
  useMantineColorScheme,
  Avatar,
  Menu,
  Box,
} from '@mantine/core';
import {
  IconChefHat,
  IconHeart,
  IconSun,
  IconMoon,
  IconLogout,
  IconPlus,
  IconShieldLock,
} from '@tabler/icons-react';
import { useAuth } from '../../hooks/useAuth';
import { useFavorites } from '../../hooks/useFavorites';

export const AppHeader: React.FC = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { isAuthenticated, user, logout } = useAuth();
  const { totalFavorites } = useFavorites();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '0.95rem',
    padding: '8px 14px',
    borderRadius: '8px',
    color: isActive ? 'var(--mantine-color-orange-6)' : 'inherit',
    backgroundColor: isActive ? 'var(--mantine-color-orange-light)' : 'transparent',
    transition: 'all 0.2s ease',
  });

  return (
    <Box
      component="header"
      style={{
        borderBottom: '1px solid var(--mantine-color-default-border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)',
        backgroundColor: isDark ? 'rgba(26, 27, 30, 0.92)' : 'rgba(255, 255, 255, 0.92)',
      }}
    >
      <Container size="xl" py="sm">
        <Group justify="space-between" align="center">
          {/* Logo & Marca */}
          <NavLink
            to="/"
            style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            <Group gap="xs">
              <ActionIcon size="xl" variant="gradient" gradient={{ from: 'orange', to: 'red', deg: 45 }} radius="md">
                <IconChefHat size={26} stroke={2} />
              </ActionIcon>
              <div>
                <Text fw={800} size="xl" style={{ letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                  Sabor<Text component="span" c="orange.6">Art</Text>
                </Text>
                <Text size="xs" c="dimmed" fw={500}>
                  Receitas & Alta Gastronomia
                </Text>
              </div>
            </Group>
          </NavLink>

          {/* Navegação Declarativa com NavLink */}
          <Group gap="xs">
            <NavLink to="/" style={navLinkStyle} end id="nav-recipes">
              Receitas
            </NavLink>

            <NavLink to="/favoritos" style={navLinkStyle} id="nav-favorites">
              <Group gap={6}>
                <IconHeart size={16} stroke={2} />
                <span>Favoritos</span>
                {totalFavorites > 0 && (
                  <Badge size="sm" variant="filled" color="red" circle>
                    {totalFavorites}
                  </Badge>
                )}
              </Group>
            </NavLink>

            <NavLink to="/admin" style={navLinkStyle} id="nav-admin">
              <Group gap={6}>
                <IconShieldLock size={16} stroke={2} />
                <span>Área Admin</span>
              </Group>
            </NavLink>
          </Group>

          {/* Ações: Tema e Autenticação */}
          <Group gap="sm">
            <ActionIcon
              variant="default"
              size="lg"
              radius="md"
              onClick={() => toggleColorScheme()}
              title={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
              aria-label="Alternar tema"
              id="theme-toggle-btn"
            >
              {isDark ? <IconSun size={20} color="gold" /> : <IconMoon size={20} />}
            </ActionIcon>

            {isAuthenticated && user ? (
              <Menu shadow="md" width={220} position="bottom-end">
                <Menu.Target>
                  <Button
                    variant="subtle"
                    color="orange"
                    radius="md"
                    leftSection={<Avatar src={user.image} alt={user.username} size="sm" radius="xl" />}
                    id="user-profile-menu-btn"
                  >
                    {user.firstName || user.username}
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Painel do Chef</Menu.Label>
                  <Menu.Item
                    leftSection={<IconPlus size={16} />}
                    onClick={() => navigate('/admin/nova-receita')}
                    id="menu-new-recipe"
                  >
                    Nova Receita
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconShieldLock size={16} />}
                    onClick={() => navigate('/admin')}
                    id="menu-admin-panel"
                  >
                    Gerenciar Receitas
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    leftSection={<IconLogout size={16} />}
                    onClick={handleLogout}
                    id="menu-logout-btn"
                  >
                    Sair da Conta
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Button
                component={NavLink}
                to="/login"
                variant="filled"
                color="orange"
                radius="md"
                id="header-login-btn"
              >
                Entrar
              </Button>
            )}
          </Group>
        </Group>
      </Container>
    </Box>
  );
};
