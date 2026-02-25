import { createContext, useContext, useState, useEffect } from 'react';
import { LIGHT_THEME, DARK_THEME } from '@shared/config';
import type { AppTheme } from '@shared/config';

interface ThemeContextValue {
  isDark: boolean;
  t: AppTheme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const t = isDark ? DARK_THEME : LIGHT_THEME;
  const toggle = () => setIsDark(d => !d);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, t, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
