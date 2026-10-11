import type { ZodType } from 'zod';

/**
 * Converte um schema Zod em uma função de validação para o Mantine Form (@mantine/form)
 * utilizando o método nativo safeParse() do Zod.
 */
export function zodResolver<T>(schema: ZodType<T>) {
  return (values: unknown): Record<string, string> => {
    const parsed = schema.safeParse(values);
    if (parsed.success) {
      return {};
    }

    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path.join('.');
      if (field && !errors[field]) {
        errors[field] = issue.message;
      }
    }
    return errors;
  };
}
