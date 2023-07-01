/* eslint-disable react-hooks/exhaustive-deps */

'use client'

import { useState, useEffect, createContext, useContext } from 'react';
import { updateUserTheme } from '../firebase/utils';
import { useAuth } from './auth-context';
import type { ReactNode, ChangeEvent } from 'react';
import type { Theme } from '../types/theme';

type ThemeContext = {
  theme: Theme;
  changeTheme: (value: string) => void;
};

export const ThemeContext = createContext<ThemeContext | null>(null);

type ThemeContextProviderProps = {
  children: ReactNode;
};

function setInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';

  const savedTheme = localStorage.getItem('theme') as Theme | null;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  return savedTheme ?? (prefersDark ? 'dark' : 'light');
}

export function ThemeContextProvider({
  children
}: ThemeContextProviderProps): JSX.Element {
  const [theme, setTheme] = useState<Theme>(setInitialTheme);

  const { user } = useAuth();
  const { id: userId, theme: userTheme } = user ?? {};

  useEffect(() => {
    if (user && userTheme) setTheme(userTheme);
  }, [userId, userTheme]);

  useEffect(() => {
    const flipTheme = (theme: Theme): NodeJS.Timeout | undefined => {
      const root = document.documentElement;
      const targetTheme = theme;

      if (targetTheme === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');

      root.style.setProperty('--main-background', `var(--${theme}-background)`);

      root.style.setProperty(
        '--main-search-background',
        `var(--${theme}-search-background)`
      );

      root.style.setProperty(
        '--main-sidebar-background',
        `var(--${theme}-sidebar-background)`
      );

      if (user) {
        localStorage.setItem('theme', theme);
        return setTimeout(() => void updateUserTheme(user.id, { theme }), 500);
      }

      return undefined;
    };

    const timeoutId = flipTheme(theme);
    return () => clearTimeout(timeoutId);
  }, [userId, theme]);

  const changeTheme = (value: string): void => setTheme(value as Theme);

  const value: ThemeContext = {
    theme,
    changeTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContext {
  const context = useContext(ThemeContext);

  if (!context)
    throw new Error('useTheme must be used within an ThemeContextProvider');

  return context;
}