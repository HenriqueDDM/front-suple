import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { InterfaceRadius } from "@/types";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  brandColor: string;
  interfaceRadius: InterfaceRadius;
  setBranding: (color: string, radius: InterfaceRadius) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "supl-theme";
const DEFAULT_BRAND_COLOR = "#6d5dfc";

function readableForeground(hex: string) {
  const red = Number.parseInt(hex.slice(1, 3), 16);
  const green = Number.parseInt(hex.slice(3, 5), 16);
  const blue = Number.parseInt(hex.slice(5, 7), 16);
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000;
  return luminance > 155 ? "#172033" : "#ffffff";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [brandColor, setBrandColor] = useState(DEFAULT_BRAND_COLOR);
  const [interfaceRadius, setInterfaceRadius] = useState<InterfaceRadius>("rounded");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored ?? (prefersDark ? "dark" : "light");
    setThemeState(initial);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    const radius = {
      compact: "0.375rem",
      rounded: "0.75rem",
      soft: "1.125rem",
    }[interfaceRadius];
    root.style.setProperty("--brand", brandColor);
    root.style.setProperty("--primary", brandColor);
    root.style.setProperty("--primary-foreground", readableForeground(brandColor));
    root.style.setProperty("--ring", brandColor);
    root.style.setProperty("--chart-1", brandColor);
    root.style.setProperty("--sidebar-primary", brandColor);
    root.style.setProperty("--radius", radius);
  }, [brandColor, interfaceRadius]);

  const setTheme = (next: Theme) => setThemeState(next);
  const toggleTheme = () => setThemeState((t) => (t === "dark" ? "light" : "dark"));
  const setBranding = useCallback((color: string, radius: InterfaceRadius) => {
    if (/^#[0-9a-f]{6}$/i.test(color)) setBrandColor(color);
    setInterfaceRadius(radius);
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, setTheme, brandColor, interfaceRadius, setBranding }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
