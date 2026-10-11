import { useState, useEffect } from 'react';

/**
 * Hook customizado para atrasar a atualização de um valor (debounce),
 * otimizando buscas e evitando disparos excessivos de requisições à API.
 *
 * @template T Tipo do valor a ser atrasado.
 * @param value Valor que sofrerá o atraso.
 * @param delay Tempo de espera em milissegundos (padrão: 400ms).
 * @returns O valor atualizado somente após o término do período de espera.
 */
export function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura o timer para atualizar o valor atrasado
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Função de limpeza (cleanup) que cancela o timer anterior caso o valor mude antes do delay
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
