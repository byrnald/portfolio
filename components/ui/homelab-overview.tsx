"use client";
import { useEffect, useState } from "react";
import { Server, Layers, Cpu, Network, Terminal, MousePointer2 } from "lucide-react";
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { labNodes, motionTokens } from "@/lib/portfolio-data";
import { usePageVisible } from "@/components/ui/portfolio-motion";
import { cn } from "@/lib/utils";
const icons = { server: Server, layers: Layers, cpu: Cpu, network: Network };
export function HomelabOverview() {
  const [selected, setSelected] = useState(labNodes[1]); const reduced = useReducedMotion(); const visible = usePageVisible();
  const orbitControls = useAnimationControls();
  useEffect(() => {
    if (reduced) { orbitControls.stop(); orbitControls.set({ rotate: 0 }); }
    else if (visible) { void orbitControls.start({ rotate: 360, transition: { duration: 80, ease: "linear", repeat: Infinity } }); }
    else { orbitControls.stop(); }
    return () => orbitControls.stop();
  }, [visible, reduced, orbitControls]);
  return <div className="lab-panel"><div className="lab-header"><span><Terminal size={15} aria-hidden="true" /> THE LEARNING LAB</span><span className="lab-overview-label">OVERVIEW</span></div>
    <div className="lab-canvas"><div className="lab-cross cross-one" aria-hidden="true">+</div><div className="lab-cross cross-two" aria-hidden="true">+</div>
    <motion.div className="lab-orbit orbit-outer" aria-hidden="true" animate={orbitControls} /><div className="lab-orbit orbit-inner" aria-hidden="true" />
    <div className="lab-center" aria-hidden="true"><Terminal size={28} /><span>~/homelab</span></div>
    {labNodes.map((node, i) => { const Icon = icons[node.icon]; return <motion.button key={node.id} type="button" className={cn("lab-node", `lab-node-${i}`, selected.id === node.id && "selected")} aria-pressed={selected.id === node.id} aria-controls="lab-node-detail" onClick={() => setSelected(node)} whileHover={reduced ? undefined : { y: -4 }} whileTap={reduced ? undefined : { scale: 0.97 }} transition={motionTokens.spring}><Icon size={20} aria-hidden="true" /><span>{node.name}</span><small>{node.category}</small></motion.button>; })}
    </div><div id="lab-node-detail" className="lab-detail" aria-live="polite" aria-atomic="true"><AnimatePresence mode="wait"><motion.div key={selected.id} initial={reduced ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}><div className="lab-detail-title"><span className="tiny-line" />{selected.name}<span>{selected.category}</span></div><p>{selected.detail}</p></motion.div></AnimatePresence></div>
    <div className="lab-foot"><MousePointer2 size={12} aria-hidden="true" />Select a component to explore<span>Equipment overview · no live telemetry</span></div></div>;
}
