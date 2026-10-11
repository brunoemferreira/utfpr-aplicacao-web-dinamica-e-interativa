import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../../test/test-utils';
import { ProtectedRoute } from './ProtectedRoute';
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../../services/api';

describe('ProtectedRoute Guard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('bloqueia usuário não autenticado e redireciona para a tela de login', async () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <div>Conteúdo Secreto da Administração</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Página de Login de Destino</div>} />
      </Routes>,
      { routerInitialEntries: ['/admin'] }
    );

    expect(screen.queryByText('Conteúdo Secreto da Administração')).not.toBeInTheDocument();
    expect(await screen.findByText('Página de Login de Destino')).toBeInTheDocument();
  });

  it('renderiza os componentes filhos quando o usuário está autenticado com token', () => {
    localStorage.setItem(AUTH_TOKEN_KEY, 'valid_jwt_token');
    localStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify({ id: 1, username: 'emilys', firstName: 'Emily' })
    );

    renderWithProviders(
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <div>Conteúdo Secreto da Administração</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Página de Login de Destino</div>} />
      </Routes>,
      { routerInitialEntries: ['/admin'] }
    );

    expect(screen.getByText('Conteúdo Secreto da Administração')).toBeInTheDocument();
    expect(screen.queryByText('Página de Login de Destino')).not.toBeInTheDocument();
  });
});
