"use client";
// I adapted Magic UI's terminal presentation with a paused, accessible transcript.
// https://magicui.design/docs/components/terminal — MIT, see vendor/magicui.LICENSE.md.
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { usePageVisible } from "@/components/ui/portfolio-motion";

export function Terminal({ command, lines, title = "~/HomeLab" }: {
  command: string; lines: readonly string[]; title?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const reduced = useReducedMotion();
  const visible = usePageVisible();
  const [progress, setProgress] = useState(0);
  const total = command.length + lines.length;
  const shown = reduced ? total : progress;
  const done = shown >= total;
  useEffect(() => {
    if (reduced) { setProgress(total); return; }
    if (!inView || !visible || progress >= total) return;
    const timer = setTimeout(() => setProgress(current => Math.min(total, current + 1)), progress < command.length ? 45 : 240);
    return () => clearTimeout(timer);
  }, [inView, visible, reduced, progress, total, command.length]);

  return <div className="lab-terminal" ref={ref} role="group" aria-label="Homelab README preview">
    <div className="terminal-toolbar"><div className="terminal-window-dots" aria-hidden="true"><i /><i /><i /></div><span>{title}</span>
      {!reduced && <button className="terminal-replay" type="button" onClick={() => setProgress(0)} aria-label="Replay terminal preview"><RotateCcw size={13} aria-hidden="true" /><span>Replay</span></button>}
    </div>
    <pre className="sr-only">{`$ ${command}\n${lines.join("\n")}`}</pre>
    <div className="terminal-transcript" aria-hidden="true">
      <div className="terminal-command"><span className="terminal-command-reserve">$ {command}</span><span><b>$</b> {command.slice(0, Math.min(shown, command.length))}<i className={`terminal-caret${done ? " complete" : ""}`} /></span></div>
      {lines.map((line, index) => <div key={index} className={`terminal-output${shown > command.length + index ? " revealed" : ""}`}>{line || "\u00a0"}</div>)}
    </div>
    <div className="terminal-caption">Equipment notes from my homelab README.</div>
  </div>;
}
