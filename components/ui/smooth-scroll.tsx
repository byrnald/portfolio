"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// I keep Lenis isolated so I can compare it with native scrolling easily.
// https://lenis.dev/ — MIT, darkroom.engineering.
export function SmoothScroll() {
  useEffect(() => {
    const enabled = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let lenis: Lenis | null = null;
    const syncLock = () => {
      if (!lenis) return;
      if (document.hidden || document.body.hasAttribute("data-scroll-locked")) lenis.stop();
      else lenis.start();
    };
    const sync = () => {
      lenis?.destroy();
      lenis = enabled.matches ? new Lenis({
        autoRaf: true, content: document.body, lerp: 0.2,
        smoothWheel: true, syncTouch: false,
        prevent: node => Boolean(node.closest("[data-lenis-prevent], [role='dialog']")),
      }) : null;
      syncLock();
    };
    const anchorClick = (event: MouseEvent) => {
      if (!lenis || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const link = (event.target instanceof Element ? event.target : null)?.closest<HTMLAnchorElement>("a[href^='#']");
      if (!link || link.closest(".mobile-nav") || link.target || link.hasAttribute("download")) return;
      let target: HTMLElement | null;
      try { target = document.getElementById(decodeURIComponent(link.hash.slice(1))); } catch { return; }
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { onComplete: () => {
        if (window.location.hash !== link.hash) history.pushState(null, "", link.hash);
        const hadTabIndex = target.hasAttribute("tabindex");
        if (!hadTabIndex) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        if (!hadTabIndex) target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
      } });
    };
    const observer = new MutationObserver(syncLock);
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-scroll-locked"] });
    enabled.addEventListener("change", sync);
    document.addEventListener("visibilitychange", syncLock);
    document.addEventListener("click", anchorClick);
    sync();
    return () => {
      observer.disconnect(); enabled.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", syncLock);
      document.removeEventListener("click", anchorClick);
      lenis?.destroy();
    };
  }, []);
  return null;
}
