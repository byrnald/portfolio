"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => { setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light"); }, []);
  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.style.colorScheme = next;
    setTheme(next);
    try { localStorage.setItem("portfolio-theme", next); } catch { /* If storage isn't available, my theme toggle still works. */ }
  }
  return <Button variant="ghost" size="icon" className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>{theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}</Button>;
}
