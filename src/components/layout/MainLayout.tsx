import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mantine/core';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';

export const MainLayout: React.FC = () => {
  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppHeader />

      <Box component="main" style={{ flex: 1 }}>
        <Outlet />
      </Box>

      <AppFooter />
    </Box>
  );
};
