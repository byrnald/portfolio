"use client";
import { useEffect, useState, type CSSProperties } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { usePageVisible } from "@/components/ui/portfolio-motion";

type Point = readonly [number, number];
interface Cluster { path: string; stars: Point[]; }
const initialCluster: Cluster = { path: "M18 75 L65 27 M65 27 L117 53", stars: [[18, 75], [65, 27], [117, 53]] };
function createCluster(): Cluster {
  const count = 3 + Math.floor(Math.random() * 3);
  const stars: Point[] = [];
  for (let attempt = 0; attempt < 100 && stars.length < count; attempt++) {
    const point: Point = [Math.round(12 + Math.random() * 116), Math.round(12 + Math.random() * 76)];
    if (stars.every(other => Math.hypot(point[0] - other[0], point[1] - other[1]) >= 25)) stars.push(point);
  }
  if (stars.length < 3) return initialCluster;
  const distance = (a: Point, b: Point) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const path = stars.slice(1).map((star, index) => {
    const nearest = stars.slice(0, index + 1).reduce((best, point) => distance(star, point) < distance(star, best) ? point : best);
    return `M${nearest[0]} ${nearest[1]} L${star[0]} ${star[1]}`;
  }).join(" ");
  return { stars, path };
}
const timing = { duration: 12, stagger: 3 };
interface Position { x: number; y: number; side: "left" | "right"; }
function nextPosition(previous: Position): Position {
  for (let attempt = 0; attempt < 8; attempt++) {
    const candidate: Position = { x: .04 + Math.random() * .92, y: .04 + Math.random() * .92, side: Math.random() < .5 ? "left" : "right" };
    if (candidate.side !== previous.side || Math.abs(candidate.y - previous.y) > .25) return candidate;
  }
  return { x: previous.x > .5 ? .1 : .9, y: previous.y > .5 ? .1 : .9, side: previous.side === "left" ? "right" : "left" };
}

function Constellation({ index, visible, reduced }: { index: number; visible: boolean; reduced: boolean }) {
  const [cluster, setCluster] = useState<Cluster>(initialCluster);
  const controls = useAnimationControls();
  const [position, setPosition] = useState<Position>({ x: .1 + index * .22, y: .12 + index * .22, side: index % 2 === 0 ? "left" : "right" });
  useEffect(() => {
    if (reduced) { controls.set("hidden"); return; }
    if (!visible) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const play = async () => {
      if (cancelled) return;
      // I swap the shape and position once the stars fade out, so nothing jumps.
      controls.set("hidden");
      setPosition(previous => nextPosition(previous));
      setCluster(createCluster());
      await controls.start("twinkle");
      if (!cancelled) timer = setTimeout(play, 0);
    };
    timer = setTimeout(play, index * timing.stagger * 1000);
    return () => { cancelled = true; clearTimeout(timer); controls.stop(); };
  }, [controls, index, reduced, visible]);
  return <div className={`constellation-lane constellation-lane-${position.side}`} style={{ "--cluster-x": position.x, "--cluster-y": position.y } as CSSProperties}><motion.svg className={`constellation constellation-${index}`} viewBox="0 0 140 100" initial="hidden" animate={controls} variants={{ hidden: { opacity: 0 }, twinkle: { opacity: [0, .78, .78, 0, 0], transition: { duration: timing.duration, times: [0, .12, .45, .62, 1] } } }}>
    <motion.path className="constellation-line" d={cluster.path} fill="none" stroke="currentColor" strokeWidth=".8" animate={controls} initial="hidden" variants={{ hidden: { pathLength: 0, opacity: 0 }, twinkle: { pathLength: [0, 0, 1, 1, 0, 0], opacity: [0, 0, .42, .42, 0, 0], transition: { duration: timing.duration, times: [0, .12, .28, .45, .62, 1] } } }} />
    {cluster.stars.map(([x, y], j) => <g key={j}><circle cx={x} cy={y} r="5" fill="currentColor" opacity=".045" /><circle cx={x} cy={y} r={j === 1 ? 1.8 : 1.2} fill="currentColor" /></g>)}
  </motion.svg></div>;
}
export function ConstellationBackground() {
  const reduced = useReducedMotion();
  const visible = usePageVisible();
  return <div className="constellation-background" aria-hidden="true">{[0, 1, 2, 3].map(index => <Constellation key={index} index={index} visible={visible} reduced={Boolean(reduced)} />)}</div>;
}
