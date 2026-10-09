"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import "./portfolio-cursor.css";

// I keep this original cursor separate so I can remove the experiment easily.
export function PortfolioCursor() {
  const [mounted, setMounted] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useMotionValue(0);
  const scaleTarget = useMotionValue(1);
  const scale = useSpring(scaleTarget, { stiffness: 380, damping: 32, mass: 0.6 });

  useEffect(() => {
    setMounted(true);
    const enabled = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px) and (prefers-reduced-motion: no-preference)");
    let hasPointer = false;
    let pressed = false;
    const hide = () => {
      hasPointer = false;
      pressed = false;
      opacity.set(0);
      document.documentElement.classList.remove("portfolio-cursor-active");
    };
    const update = () => {
      if (!enabled.matches || !hasPointer || document.hidden) { hide(); return; }
      const target = document.elementFromPoint(x.get(), y.get());
      const native = !target || target.closest("input, textarea, select, iframe, [contenteditable]:not([contenteditable='false']), [data-native-cursor]") || ["text", "wait", "progress", "not-allowed", "grab", "grabbing", "col-resize", "row-resize"].includes(getComputedStyle(target).cursor);
      opacity.set(native ? 0 : 1);
      document.documentElement.classList.toggle("portfolio-cursor-active", !native);
      const interactive = target?.closest("a, button, [role='button'], summary");
      scaleTarget.set(pressed ? 0.9 : interactive ? 1.15 : 1);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") { hide(); return; }
      x.set(event.clientX);
      y.set(event.clientY);
      hasPointer = true;
      update();
    };
    const down = () => { pressed = true; update(); };
    const up = () => { pressed = false; update(); };
    const leave = (event: PointerEvent) => { if (!event.relatedTarget) hide(); };
    const key = () => hide();
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerdown", down);
    document.addEventListener("pointerup", up);
    document.addEventListener("pointerout", leave);
    document.addEventListener("pointercancel", hide);
    document.addEventListener("keydown", key);
    document.addEventListener("visibilitychange", hide);
    document.addEventListener("scroll", update, true);
    window.addEventListener("blur", hide);
    enabled.addEventListener("change", update);
    return () => {
      hide();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("pointercancel", hide);
      document.removeEventListener("keydown", key);
      document.removeEventListener("visibilitychange", hide);
      document.removeEventListener("scroll", update, true);
      window.removeEventListener("blur", hide);
      enabled.removeEventListener("change", update);
    };
  }, [opacity, scaleTarget, x, y]);

  if (!mounted) return null;
  return createPortal(
    <motion.div className="portfolio-cursor" aria-hidden="true" style={{ x, y, opacity }}>
      <motion.svg width="25" height="30" viewBox="0 0 25 30" style={{ scale, transformOrigin: "0px 0px" }}>
        <path d="M1 1L23 18L13 19L9 28Z" fill="var(--foreground)" stroke="var(--background)" strokeWidth="1.5" strokeLinejoin="round" />
      </motion.svg>
    </motion.div>, document.body,
  );
}
