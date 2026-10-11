import { createTheme } from '@mantine/core';

export const culinaryTheme = createTheme({
  primaryColor: 'orange',
  defaultRadius: 'md',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'Outfit, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: '700',
  },
  cursorType: 'pointer',
  shadows: {
    md: '0 4px 16px rgba(0, 0, 0, 0.08)',
    xl: '0 8px 30px rgba(0, 0, 0, 0.12)',
  },
});
