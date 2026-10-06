"use client";
import { useEffect } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { usePageVisible } from "@/components/ui/portfolio-motion";

export function AvailabilityDot() {
  const controls = useAnimationControls();
  const reduced = useReducedMotion();
  const visible = usePageVisible();
  useEffect(() => {
    if (reduced) { controls.stop(); controls.set({ opacity: 0, scale: 1 }); }
    else if (visible) { void controls.start({ opacity: [.6, 0], scale: [1, 3.8], transition: { duration: 2.5, ease: "easeOut", repeat: Infinity, repeatDelay: .6 } }); }
    else { controls.stop(); }
    return () => controls.stop();
  }, [controls, reduced, visible]);
  return <span className="availability-dot" aria-hidden="true"><motion.span className="availability-halo" initial={{ opacity: 0 }} animate={controls} /></span>;
}
