import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Center, Loader } from '@mantine/core';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Center style={{ minHeight: '50vh' }}>
        <Loader color="orange" size="lg" />
      </Center>
    );
  }

  if (!isAuthenticated) {
    // Redireciona para o login guardando a rota original de destino
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
