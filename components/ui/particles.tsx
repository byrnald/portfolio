"use client";
// I adapted Magic UI's particles for my side margins, themes, and motion preferences.
// https://magicui.design/docs/components/particles — MIT, see vendor/magicui.LICENSE.md.
import { useEffect, useRef } from "react";

type Particle = {
  x: number; y: number; translateX: number; translateY: number;
  size: number; alpha: number; targetAlpha: number;
  dx: number; dy: number; magnetism: number;
};

export function Particles({ quantity = 100, mobileQuantity = 35, ease = 80 }: {
  quantity?: number; mobileQuantity?: number; ease?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 699px)");
    const root = document.documentElement;
    let dark = root.classList.contains("dark");
    let width = 0, height = 0, dpr = 1, raf = 0, lastTime = 0;
    let particles: Particle[] = [];
    const mouse = { x: 0, y: 0 };
    const createParticle = (): Particle => ({
      x: Math.random() * width, y: Math.random() * height,
      translateX: 0, translateY: 0, size: Math.floor(Math.random() * 2) + 0.4,
      alpha: 0, targetAlpha: Math.random() * 0.6 + 0.1,
      dx: (Math.random() - 0.5) * 0.1, dy: (Math.random() - 0.5) * 0.1,
      magnetism: 0.1 + Math.random() * 4,
    });
    const draw = (step = 0) => {
      context.clearRect(0, 0, width, height);
      const rgb = dark ? "255,255,255" : "0,0,0";
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        if (step) {
          p.x += p.dx * step;
          p.y += p.dy * step;
          const smoothing = 1 - Math.pow(1 - 1 / ease, step);
          p.translateX += (mouse.x / (50 / p.magnetism) - p.translateX) * smoothing;
          p.translateY += (mouse.y / (50 / p.magnetism) - p.translateY) * smoothing;
          if (p.x < -p.size || p.x > width + p.size || p.y < -p.size || p.y > height + p.size) {
            p = particles[i] = createParticle();
          }
        }
        const edge = Math.min(p.x + p.translateX - p.size, width - p.x - p.translateX - p.size,
          p.y + p.translateY - p.size, height - p.y - p.translateY - p.size);
        p.alpha = reduced.matches ? p.targetAlpha : Math.min(p.targetAlpha, p.alpha + 0.02 * step);
        const alpha = p.alpha * Math.max(0, Math.min(1, edge / 20));
        context.beginPath();
        context.arc(p.x + p.translateX, p.y + p.translateY, p.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(${rgb},${alpha})`;
        context.fill();
      }
    };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; lastTime = 0; };
    const animate = (time: number) => {
      if (reduced.matches || document.hidden || !width || !height) { stop(); draw(); return; }
      const step = lastTime ? Math.min((time - lastTime) / (1000 / 60), 3) : 1;
      lastTime = time;
      draw(step);
      raf = requestAnimationFrame(animate);
    };
    const syncMotion = () => {
      stop();
      if (reduced.matches) { mouse.x = 0; mouse.y = 0; }
      draw();
      if (!reduced.matches && !document.hidden && width && height) raf = requestAnimationFrame(animate);
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width; height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: mobile.matches ? mobileQuantity : quantity }, createParticle);
      mouse.x = 0; mouse.y = 0;
      syncMotion();
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || reduced.matches) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left - width / 2;
      mouse.y = event.clientY - rect.top - height / 2;
    };
    const resetMouse = () => { mouse.x = 0; mouse.y = 0; };
    const leave = (event: PointerEvent) => { if (!event.relatedTarget) resetMouse(); };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const themeObserver = new MutationObserver(() => {
      const next = root.classList.contains("dark");
      if (next !== dark) { dark = next; draw(); }
    });
    themeObserver.observe(root, { attributes: true, attributeFilter: ["class"] });
    reduced.addEventListener("change", syncMotion);
    mobile.addEventListener("change", resize);
    document.addEventListener("visibilitychange", syncMotion);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", leave);
    window.addEventListener("blur", resetMouse);
    resize();
    return () => {
      stop(); observer.disconnect(); themeObserver.disconnect();
      reduced.removeEventListener("change", syncMotion);
      mobile.removeEventListener("change", resize);
      document.removeEventListener("visibilitychange", syncMotion);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
      window.removeEventListener("blur", resetMouse);
    };
  }, [quantity, mobileQuantity, ease]);
  return <div className="particles-background" aria-hidden="true"><canvas ref={canvasRef} /></div>;
}
