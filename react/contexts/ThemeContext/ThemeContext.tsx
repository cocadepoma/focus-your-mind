import { createContext } from "react";

export interface ThemeContextProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ThemeContext = createContext({} as ThemeContextProps);