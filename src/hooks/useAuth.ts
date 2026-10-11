import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '../contexts/auth.context';

/**
 * Custom Hook para consumo seguro do contexto de autenticação.
 * Lança um erro explícito caso seja invocado fora da árvore do <AuthProvider>.
 *
 * @throws {Error} Quando utilizado fora de um AuthProvider.
 * @returns {AuthContextType} Objeto contendo os dados e funções de controle de sessão.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um <AuthProvider>');
  }
  return context;
}

export type { AuthContextType };
