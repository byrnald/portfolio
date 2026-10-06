"use client";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
const links = [{ id: "about", label: "About" }, { id: "skills", label: "Skills" }, { id: "projects", label: "Projects" }, { id: "homelab", label: "Homelab" }, { id: "experience", label: "Experience" }, { id: "contact", label: "Contact" }];
export function PortfolioNav() {
  const [open, setOpen] = useState(false); const [active, setActive] = useState(""); const reduced = useReducedMotion(); const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { const observer = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }); }, { rootMargin: "-20% 0px -55% 0px" }); document.querySelectorAll("main section[id]").forEach(s => observer.observe(s)); return () => observer.disconnect(); }, []);
  useEffect(() => { if (!open) return; const close = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); menuButton.current?.focus(); } }; document.addEventListener("keydown", close); return () => document.removeEventListener("keydown", close); }, [open]);
  useEffect(() => { const media = matchMedia("(min-width: 700px)"); const close = () => { if (media.matches) setOpen(false); }; media.addEventListener("change", close); return () => media.removeEventListener("change", close); }, []);
  return <header className="site-header"><div className="container header-inner"><a href="#home" className="brand mono" aria-label="Byron Aldas home">BA<span>/</span></a>
    <nav aria-label="Main navigation" className="desktop-nav">{links.map(l => <a key={l.id} href={`#${l.id}`} aria-current={active === l.id ? "location" : undefined} className={cn(active === l.id && "active")}>{l.label}</a>)}</nav>
    <div className="nav-actions"><ThemeToggle /><Button ref={menuButton} className="mobile-toggle" variant="ghost" size="icon" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button></div>
    </div><AnimatePresence>{open && <motion.nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" initial={reduced ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{duration: reduced ? 0 : .2}}>{links.map(l => <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)}>{l.label}</a>)}</motion.nav>}</AnimatePresence></header>;
}
