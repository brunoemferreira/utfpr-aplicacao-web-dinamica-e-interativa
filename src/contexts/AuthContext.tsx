import React, { useState } from 'react';
import type { LoginFormData, UserAuthResponse } from '../schemas/auth.schema';
import { authService, AUTH_TOKEN_KEY, AUTH_USER_KEY } from '../services/api';
import { AuthContext, type AuthContextType } from './auth.context';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Componente Provider que gerencia o estado e ciclo de vida da autenticação.
 * Inicializa a sessão sincronamente a partir do localStorage para evitar telas brancas
 * e re-renderizações desnecessárias em cascata.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<UserAuthResponse | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      return stored ? (JSON.parse(stored) as UserAuthResponse) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (credentials: LoginFormData): Promise<void> => {
    setIsLoading(true);
    try {
      const data = await authService.login(credentials);
      const jwtToken = data.accessToken || data.token || '';

      setUser(data);
      setToken(jwtToken);

      localStorage.setItem(AUTH_TOKEN_KEY, jwtToken);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
