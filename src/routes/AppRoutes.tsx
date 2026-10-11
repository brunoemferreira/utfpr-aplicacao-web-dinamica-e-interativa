import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { HomePage } from '../pages/HomePage';
import { RecipeDetailPage } from '../pages/RecipeDetailPage';
import { FavoritesPage } from '../pages/FavoritesPage';
import { LoginPage } from '../pages/LoginPage';
import { AdminPage } from '../pages/AdminPage';
import { NewRecipePage } from '../pages/NewRecipePage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Rotas Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/receitas/:id" element={<RecipeDetailPage />} />
        <Route path="/favoritos" element={<FavoritesPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas Protegidas (Área Administrativa) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/nova-receita"
          element={
            <ProtectedRoute>
              <NewRecipePage />
            </ProtectedRoute>
          }
        />

        {/* Rota 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
