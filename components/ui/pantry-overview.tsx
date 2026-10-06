"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Check, Database, ListChecks, Package } from "lucide-react";
import { pantryCapabilities, motionTokens } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

const icons = { package: Package, calendar: CalendarDays, checklist: ListChecks };
export function PantryOverview() {
  const [selected, setSelected] = useState(pantryCapabilities[0]);
  const reduced = useReducedMotion();
  return <div className="pantry-overview">
    <div className="pantry-topline mono"><span>SMART PANTRY / PROJECT OVERVIEW</span><Package size={17} aria-hidden="true" /></div>
    <div className="pantry-symbol" aria-hidden="true"><Package size={45} strokeWidth={1.2} /></div>
    <div className="pantry-capabilities" aria-label="Explore Smart Pantry capabilities">{pantryCapabilities.map(item => {
      const Icon = icons[item.icon];
      return <motion.button key={item.id} type="button" className={cn("pantry-capability", selected.id === item.id && "selected")} aria-pressed={selected.id === item.id} aria-controls="pantry-capability-detail" onClick={() => setSelected(item)} whileHover={reduced ? undefined : { y: -2 }} whileTap={reduced ? undefined : { scale: .99 }} transition={motionTokens.spring}>
        <span className="pantry-capability-icon"><Icon size={19} aria-hidden="true" /></span><span className="pantry-capability-copy"><strong>{item.label}</strong><span>{item.note}</span></span><span className="pantry-capability-mark" aria-hidden="true">{selected.id === item.id ? <Check size={16} /> : "+"}</span>
      </motion.button>;
    })}</div>
    <div id="pantry-capability-detail" className="pantry-detail" aria-live="polite" aria-atomic="true"><AnimatePresence mode="wait" initial={false}><motion.div key={selected.id} initial={reduced ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .15 }}><h3>{selected.label}</h3><p>{selected.detail}</p></motion.div></AnimatePresence></div>
    <div className="pantry-backend"><Database size={15} aria-hidden="true" /><span>Relational backend</span><span className="mono">JAVA</span></div>
    <p className="pantry-footnote">Select a capability to explore the project.</p>
  </div>;
}
