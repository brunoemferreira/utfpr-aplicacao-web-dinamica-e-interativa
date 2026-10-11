import { createContext } from 'react';
import type { LoginFormData, UserAuthResponse } from '../schemas/auth.schema';

/**
 * Contrato de tipos do contexto de autenticação global.
 */
export interface AuthContextType {
  /** Dados do usuário logado ou null se não autenticado */
  readonly user: UserAuthResponse | null;
  /** Token JWT retornado pela API DummyJSON */
  readonly token: string | null;
  /** Flag derivada indicando se o usuário está autenticado */
  readonly isAuthenticated: boolean;
  /** Estado de carregamento durante autenticação */
  readonly isLoading: boolean;
  /** Ação de login com credenciais */
  login: (credentials: LoginFormData) => Promise<void>;
  /** Ação de logout e limpeza de sessão */
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
