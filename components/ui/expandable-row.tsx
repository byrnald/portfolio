"use client";
import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
export interface ExpandableRowProps { title: string; subtitle: string; icon: ReactNode; badge?: string; children: ReactNode; className?: string; }
export function ExpandableRow({ title, subtitle, icon, badge, children, className }: ExpandableRowProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const reduced = useReducedMotion();
  return <article className={cn("expandable-row", className)}>
    <button type="button" className="row-trigger" id={`${id}-trigger`} aria-expanded={open} aria-controls={`${id}-content`} onClick={() => setOpen(!open)}>
      <span className="row-icon" aria-hidden="true">{icon}</span><span className="row-heading"><span className="row-title">{title}</span><span className="row-subtitle">{subtitle}</span></span>{badge && <span className="row-badge mono">{badge}</span>}<ChevronDown size={17} className={cn("row-chevron", open && "is-open")} aria-hidden="true" />
    </button>
    <AnimatePresence initial={false}>{open && <motion.div id={`${id}-content`} role="region" aria-labelledby={`${id}-trigger`} initial={reduced ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : .22 }} className="row-content"><div className="row-content-inner">{children}</div></motion.div>}</AnimatePresence>
  </article>;
}
