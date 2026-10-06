"use client";
import { useEffect, type CSSProperties } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { usePageVisible } from "@/components/ui/portfolio-motion";
import { cn } from "@/lib/utils";

// I adapted Magic UI's beam to match the black, white, and grey theme.
export interface BorderBeamProps { duration?: number; size?: number; delay?: number; borderWidth?: number; tone?: "primary" | "muted"; className?: string; }
export function BorderBeam({ duration = 12, size = 400, delay = 0, borderWidth = 2, tone = "primary", className }: BorderBeamProps) {
  const controls = useAnimationControls();
  const reduced = useReducedMotion();
  const visible = usePageVisible();
  useEffect(() => {
    if (reduced || !visible) return;
    const offset = (delay / duration) * 100;
    controls.set({ offsetDistance: `${offset}%` });
    void controls.start({ offsetDistance: [`${offset}%`, `${offset + 100}%`], transition: { duration, ease: "linear", repeat: Infinity } });
    return () => controls.stop();
  }, [controls, delay, duration, reduced, visible]);
  return <div className={cn("border-beam", className)} aria-hidden="true" style={{ "--beam-width": `${borderWidth}px` } as CSSProperties}>
    <motion.div className={`border-beam-gradient border-beam-${tone}`} style={{ width: size, height: size, offsetPath: "rect(0 auto auto 0 round 80px)", offsetRotate: "0deg" }} initial={{ offsetDistance: `${(delay / duration) * 100}%` }} animate={controls} />
  </div>;
}