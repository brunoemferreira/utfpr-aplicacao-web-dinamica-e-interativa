import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { culinaryTheme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <MantineProvider theme={culinaryTheme} defaultColorScheme="light">
      <AuthProvider>
        <FavoritesProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <AppRoutes />
          </BrowserRouter>
        </FavoritesProvider>
      </AuthProvider>
    </MantineProvider>
  );
};

export default App;
