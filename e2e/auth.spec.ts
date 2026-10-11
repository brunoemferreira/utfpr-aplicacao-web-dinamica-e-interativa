import { test, expect } from '@playwright/test';

test.describe('Fluxo Completo de Autenticação e Rotas Protegidas', () => {
  test('bloqueia acesso à área admin, redireciona para login e autentica com sucesso', async ({ page }) => {
    // 1. Tenta acessar rota restrita diretamente
    await page.goto('/admin');

    // 2. Deve ser redirecionado para a página de login
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.getByRole('heading', { name: /Acesso Restrito/i })).toBeVisible();

    // 3. Preenche as credenciais com o botão rápido de teste da DummyJSON
    const quickFillBtn = page.getByRole('button', { name: /Preencher Automaticamente/i });
    await quickFillBtn.click();

    // 4. Submete o formulário de login
    const submitBtn = page.getByRole('button', { name: /Entrar no Painel/i });
    await submitBtn.click();

    // 5. Deve ser redirecionado com sucesso de volta para o /admin
    await expect(page).toHaveURL(/.*\/admin/);
    await expect(page.getByRole('heading', { name: /Painel Administrativo do Chef/i })).toBeVisible();
    await expect(page.getByText(/Logado como:/i)).toBeVisible();

    // 6. Realiza logout utilizando localizadores semânticos
    const userMenuBtn = page.getByRole('button', { name: /Emily/i });
    await userMenuBtn.click();

    const logoutBtn = page.getByRole('menuitem', { name: /Sair da Conta/i });
    await logoutBtn.click();

    // 7. Retorna para a página pública e o botão Entrar volta a ficar visível
    await expect(page).toHaveURL(/.*\//);
    await expect(page.getByRole('link', { name: /^Entrar$/i })).toBeVisible();
  });
});
