import { test, expect } from '@playwright/test';

test.describe('Fluxo de Busca, Detalhes e Favoritos de Receitas', () => {
  test('permite buscar receita, visualizar detalhes e gerenciar favoritos', async ({ page }) => {
    // 1. Acessa a página inicial
    await page.goto('/');

    // 2. Aguarda a vitrine de receitas carregar
    await expect(page.getByRole('heading', { name: /Descubra, Cozinhe e Encante/i })).toBeVisible();
    await expect(page.locator('.recipe-card').first()).toBeVisible({ timeout: 10000 });

    // 3. Executa busca por "Pizza"
    const searchInput = page.locator('#search-recipes-input');
    await searchInput.fill('Pizza');

    // Aguarda debounce e filtragem
    await expect(page.getByText(/Resultados para "Pizza"/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/Pizza/i).first()).toBeVisible();

    // 4. Clica no botão para ver a receita completa
    const viewButton = page.locator('[id^="view-recipe-btn-"]').first();
    await viewButton.click();

    // 5. Verifica a tela de detalhes dinâmicos (/receitas/:id)
    await expect(page).toHaveURL(/.*\/receitas\/\d+/);
    await expect(page.getByRole('heading', { name: /Ingredientes/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Modo de Preparo/i })).toBeVisible();

    // 6. Adiciona aos favoritos na tela de detalhes
    const favBtn = page.locator('#detail-fav-btn');
    await favBtn.click();

    // 7. Navega para a página de favoritos usando a barra de navegação
    await page.locator('#nav-favorites').click();
    await expect(page).toHaveURL(/.*\/favoritos/);
    await expect(page.getByRole('heading', { name: /Minhas Receitas Favoritas/i })).toBeVisible();
    await expect(page.locator('.recipe-card').first()).toBeVisible();
  });
});
