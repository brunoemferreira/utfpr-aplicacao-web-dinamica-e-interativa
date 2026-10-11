import { z } from 'zod';

export const loginFormSchema = z.object({
  username: z.string().min(3, 'Nome de usuário deve conter no mínimo 3 caracteres'),
  password: z.string().min(4, 'A senha deve conter no mínimo 4 caracteres'),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

export const userAuthResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  gender: z.string().optional(),
  image: z.string().optional(),
  accessToken: z.string().optional(),
  token: z.string().optional(),
});

export type UserAuthResponse = z.infer<typeof userAuthResponseSchema>;

export function validateUserAuth(data: unknown): UserAuthResponse | null {
  const result = userAuthResponseSchema.safeParse(data);
  if (!result.success) {
    console.warn('Falha na validação Zod de UserAuth:', result.error);
    return null;
  }
  return result.data;
}
