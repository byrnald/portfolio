"use client";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
// I adapted the circle reveal from Magic UI and kept my saved theme preference.
// https://magicui.design/docs/components/animated-theme-toggler — MIT, see vendor/magicui.LICENSE.md.
const themeAnimationEnabled = true;

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const busy = useRef(false);
  const active = useRef<ViewTransition | null>(null);
  useEffect(() => { setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light"); }, []);
  useEffect(() => () => {
    active.current?.skipTransition();
    document.documentElement.removeAttribute("data-theme-reveal");
    document.documentElement.style.removeProperty("--theme-reveal-start");
    document.documentElement.style.removeProperty("--theme-reveal-end");
  }, []);
  async function toggleTheme(event: React.MouseEvent<HTMLButtonElement>) {
    if (busy.current) return;
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";
    let applied = false;
    const apply = () => {
      if (applied) return;
      applied = true;
      root.classList.toggle("dark", next === "dark");
      root.style.colorScheme = next;
      setTheme(next);
      try { localStorage.setItem("portfolio-theme", next); } catch { /* My toggle still works without storage. */ }
    };
    if (!themeAnimationEnabled || !document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(); return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
    const width = window.innerWidth, height = window.innerHeight;
    const radius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y));
    // I use percentages so the reveal stays centered at fractional display scales.
    const origin = `${x / width * 100}% ${y / height * 100}%`;
    const from = `circle(0% at ${origin})`;
    const to = `circle(${radius / (Math.hypot(width, height) / Math.SQRT2) * 100}% at ${origin})`;
    busy.current = true;
    root.dataset.themeReveal = "active";
    root.style.setProperty("--theme-reveal-start", from);
    root.style.setProperty("--theme-reveal-end", to);
    try {
      const transition = document.startViewTransition(() => flushSync(apply));
      active.current = transition;
      // I let CSS start the reveal with the snapshots, without a second JS animation setup.
      void transition.ready.catch(() => {});
      await transition.finished;
    } catch {
      apply();
      active.current?.skipTransition();
    } finally {
      active.current = null; busy.current = false;
      root.removeAttribute("data-theme-reveal");
      root.style.removeProperty("--theme-reveal-start");
      root.style.removeProperty("--theme-reveal-end");
    }
  }
  return <Button variant="ghost" size="icon" className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>{theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}</Button>;
}
