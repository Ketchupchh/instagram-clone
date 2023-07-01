'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type WindowSize = {
  width: number;
  height: number;
};

type WindowContext = WindowSize & {
  isMobile: boolean;
};

export const WindowContext = createContext<WindowContext | null>(null);

type WindowContextProviderProps = {
  children: ReactNode;
};

export function WindowContextProvider({
  children
}: WindowContextProviderProps): JSX.Element {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });

      const handleResize = (): void =>
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        });

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const value: WindowContext = {
    ...windowSize,
    isMobile: windowSize.width < 500
  };

  return (
    <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
  );
}

export function useWindow(): WindowContext {
  const context = useContext(WindowContext);

  if (!context)
    throw new Error('useWindow must be used within an WindowContextProvider');

  return context;
}
