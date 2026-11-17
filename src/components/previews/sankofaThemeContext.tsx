"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { sankofaThemes, type SankofaTheme } from "@/components/previews/sankofaTheme";

const STORAGE_KEY = "gcao-theme";

type ThemeContextValue = {
  theme: SankofaTheme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function storedTheme(): SankofaTheme | null {
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "light" || value === "dark" ? value : null;
}

export function SankofaThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<SankofaTheme>("light");
  const [override, setOverride] = useState<SankofaTheme | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = storedTheme();
    setOverride(saved);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (override) {
      setTheme(override);
      return;
    }
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => setTheme(query.matches ? "dark" : "light");
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [override, ready]);

  const toggleTheme = () => {
    const next: SankofaTheme = theme === "light" ? "dark" : "light";
    window.localStorage.setItem(STORAGE_KEY, next);
    setOverride(next);
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useSankofaTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useSankofaTheme must be used within SankofaThemeProvider");
  }
  return value;
}

export function useSankofaAppearance() {
  const { theme, toggleTheme } = useSankofaTheme();
  return {
    theme,
    toggleTheme,
    t: sankofaThemes[theme],
    isLight: theme === "light",
    basePath: "",
  };
}
