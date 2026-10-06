"use client";
import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { motionTokens } from "@/lib/portfolio-data";
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div data-reveal className={cn(className)} initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ ...motionTokens.reveal, delay: reduced ? 0 : delay }}>{children}</motion.div>;
}
export function usePageVisible() {
  const [visible, setVisible] = useState(true);
  useEffect(() => { const update = () => setVisible(!document.hidden); update(); document.addEventListener("visibilitychange", update); return () => document.removeEventListener("visibilitychange", update); }, []);
  return visible;
}
