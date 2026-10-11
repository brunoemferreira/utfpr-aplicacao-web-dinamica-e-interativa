import { describe, it, expect } from 'vitest';
import { loginFormSchema, validateUserAuth } from './auth.schema';

describe('Auth Zod Schemas', () => {
  it('valida credenciais preenchidas corretamente', () => {
    const valid = {
      username: 'emilys',
      password: 'emilyspass',
    };
    const result = loginFormSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejeita nome de usuário com menos de 3 caracteres', () => {
    const invalid = {
      username: 'em',
      password: 'emilyspass',
    };
    const result = loginFormSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('no mínimo 3 caracteres');
    }
  });

  it('rejeita senha vazia ou muito curta', () => {
    const invalid = {
      username: 'emilys',
      password: '12',
    };
    const result = loginFormSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('validateUserAuth processa o payload de retorno da API DummyJSON', () => {
    const apiResponse = {
      id: 1,
      username: 'emilys',
      email: 'emilys@example.com',
      firstName: 'Emily',
      lastName: 'Smith',
      accessToken: 'jwt_mock_token_123',
    };
    const user = validateUserAuth(apiResponse);
    expect(user).not.toBeNull();
    expect(user?.username).toBe('emilys');
    expect(user?.accessToken).toBe('jwt_mock_token_123');
  });
});
