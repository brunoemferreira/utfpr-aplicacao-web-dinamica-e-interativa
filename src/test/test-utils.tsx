/* oxlint-disable react/only-export-components */
import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { culinaryTheme } from '../theme';
import { AuthProvider } from '../contexts/AuthContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  routerInitialEntries?: MemoryRouterProps['initialEntries'];
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: CustomRenderOptions
) {
  const { routerInitialEntries = ['/'], ...renderOptions } = options || {};

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <MantineProvider theme={culinaryTheme} defaultColorScheme="light">
      <AuthProvider>
        <FavoritesProvider>
          <MemoryRouter initialEntries={routerInitialEntries}>
            {children}
          </MemoryRouter>
        </FavoritesProvider>
      </AuthProvider>
    </MantineProvider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from '@testing-library/react';
