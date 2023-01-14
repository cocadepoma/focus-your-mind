import React, { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";

interface Props {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const themeStorage = localStorage.getItem('theme');

    if (themeStorage === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      setTheme('dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
      localStorage.setItem('theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  )
};