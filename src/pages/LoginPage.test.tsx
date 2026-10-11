import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test/test-utils';
import { LoginPage } from './LoginPage';

describe('LoginPage Component', () => {
  it('renderiza os campos de usuário e senha acessíveis', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByRole('heading', { name: /Acesso Restrito/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome de Usuário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar no Painel/i })).toBeInTheDocument();
  });

  it('exibe mensagens de validação ao tentar submeter formulário em branco', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    const submitBtn = screen.getByRole('button', { name: /Entrar no Painel/i });
    await user.click(submitBtn);

    expect(await screen.findByText(/no mínimo 3 caracteres/i)).toBeInTheDocument();
    expect(await screen.findByText(/no mínimo 4 caracteres/i)).toBeInTheDocument();
  });

  it('preenche automaticamente as credenciais ao clicar no botão de teste da DummyJSON', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    const quickFillBtn = screen.getByRole('button', { name: /Preencher Automaticamente/i });
    await user.click(quickFillBtn);

    const usernameInput = screen.getByLabelText(/Nome de Usuário/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/Senha/i) as HTMLInputElement;

    expect(usernameInput.value).toBe('emilys');
    expect(passwordInput.value).toBe('emilyspass');
  });
});
