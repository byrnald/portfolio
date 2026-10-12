"use client";
import { MotionConfig } from "framer-motion";
import { PortfolioNav } from "@/components/ui/portfolio-nav";
import { PortfolioHero } from "@/components/ui/portfolio-hero";
import { ProjectShowcase } from "@/components/ui/project-showcase";
import { AboutSection } from "@/components/ui/about-section";
import { ExperienceSection } from "@/components/ui/experience-section";
import { ContactSection } from "@/components/ui/contact-section";
import { SkillsSection } from "@/components/ui/skills-section";
import { HomelabSection } from "@/components/ui/homelab-section";
import { ConstellationBackground } from "@/components/ui/constellation-background";
import { BorderBeam } from "@/components/ui/border-beam";
import { PortfolioCursor } from "@/components/ui/portfolio-cursor";
import { Particles } from "@/components/ui/particles";
import { SmoothScroll } from "@/components/ui/smooth-scroll";

const cursorEnabled = true;
const particlesEnabled = true;
const smoothScrollEnabled = true;

export function Portfolio() { return <MotionConfig reducedMotion="user">{smoothScrollEnabled && <SmoothScroll />}{cursorEnabled && <PortfolioCursor />}<div className="portfolio-shell">{particlesEnabled ? <Particles /> : <ConstellationBackground />}<a href="#main-content" className="skip-link">Skip to content</a><PortfolioNav /><main id="main-content" tabIndex={-1}><div className="page-border-beams"><BorderBeam duration={12} size={400} /><BorderBeam duration={12} delay={6} size={400} tone="muted" /></div><PortfolioHero /><AboutSection /><SkillsSection /><ProjectShowcase /><HomelabSection /><ExperienceSection /><ContactSection /></main></div></MotionConfig>; }
