import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Alert,
  Box,
  Badge,
  Group,
  Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconLock, IconUser, IconAlertCircle, IconInfoCircle, IconChefHat } from '@tabler/icons-react';
import { useAuth } from '../hooks/useAuth';
import { loginFormSchema } from '../schemas/auth.schema';
import type { LoginFormData } from '../schemas/auth.schema';
import { zodResolver } from '../utils/zodResolver';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Destino original antes do redirecionamento pelo ProtectedRoute
  const destination = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  const form = useForm<LoginFormData>({
    initialValues: {
      username: '',
      password: '',
    },
    validate: zodResolver(loginFormSchema),
  });

  const handleQuickFill = () => {
    form.setValues({
      username: 'emilys',
      password: 'emilyspass',
    });
    setErrorMessage(null);
  };

  const handleSubmit = async (values: LoginFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await login(values);
      // Redireciona para o destino pretendido
      navigate(destination, { replace: true });
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Falha no login. Verifique seu nome de usuário e senha.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container size={440} py={60}>
      <Paper radius="md" p="xl" withBorder shadow="md">
        <Box ta="center" mb="lg">
          <Group justify="center" mb="xs">
            <Badge variant="filled" color="orange" size="xl" circle p={8}>
              <IconChefHat size={24} />
            </Badge>
          </Group>
          <Title order={1} size="h2" fw={800}>
            Acesso Restrito
          </Title>
          <Text c="dimmed" size="sm" mt={4}>
            Autentique-se com sua conta para gerenciar receitas na área administrativa.
          </Text>
        </Box>

        {/* Dica para preenchimento com dados da API pública DummyJSON */}
        <Alert
          icon={<IconInfoCircle size={18} />}
          title="Credenciais de Teste (DummyJSON)"
          color="blue"
          radius="md"
          mb="lg"
        >
          <Text size="xs">
            Usuário: <b>emilys</b> | Senha: <b>emilyspass</b>
          </Text>
          <Button
            size="compact-xs"
            variant="light"
            color="blue"
            mt="xs"
            onClick={handleQuickFill}
            id="quick-fill-btn"
          >
            Preencher Automaticamente
          </Button>
        </Alert>

        {errorMessage && (
          <Alert
            icon={<IconAlertCircle size={18} />}
            title="Erro de Autenticação"
            color="red"
            radius="md"
            mb="lg"
            id="login-error-alert"
          >
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
          <Stack gap="md">
            <TextInput
              required
              label="Nome de Usuário"
              placeholder="Digite seu usuário (ex: emilys)"
              leftSection={<IconUser size={16} />}
              {...form.getInputProps('username')}
              id="username-input"
              data-testid="username-input"
            />

            <PasswordInput
              required
              label="Senha"
              placeholder="Digite sua senha"
              leftSection={<IconLock size={16} />}
              {...form.getInputProps('password')}
              id="password-input"
              data-testid="password-input"
            />

            <Button
              type="submit"
              fullWidth
              color="orange"
              size="md"
              radius="md"
              loading={isSubmitting}
              mt="sm"
              id="submit-login-btn"
              data-testid="submit-login-btn"
            >
              Entrar no Painel
            </Button>
          </Stack>
        </form>

        <Divider my="lg" />

        <Text size="xs" c="dimmed" ta="center">
          Autenticação JWT processada com segurança via endpoint DummyJSON <code>POST /auth/login</code>.
        </Text>
      </Paper>
    </Container>
  );
};
