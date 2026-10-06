"use client";
import { ArrowUpRight, GitBranch, Link2, Mail, MapPin } from "lucide-react";
import { ResumeViewer } from "@/components/ui/resume-viewer";
import { Reveal } from "@/components/ui/portfolio-motion";
import { profile } from "@/lib/portfolio-data";
import { AvailabilityDot } from "@/components/ui/availability-dot";
export function PortfolioHero() {
  return <section id="home" className="profile-section container"><Reveal>
    <div className="profile-top"><div className="profile-monogram" aria-hidden="true">{profile.initials}<span /></div><div className="profile-heading"><p className="eyebrow">IT · CLOUD · AI · CURIOSITY</p><h1>{profile.name}</h1><p className="profile-role">Rutgers ITI student & IT Support Specialist @ Rutgers DCS</p><span className="availability"><AvailabilityDot />Open to internships</span></div></div>
    <p className="hero-intro">Exploring cloud engineering, coding for fun, and learning by taking systems apart and putting them back together.</p>
    <div className="profile-meta"><span><MapPin size={14} aria-hidden="true" />{profile.location}</span><span className="profile-meta-divider" aria-hidden="true">/</span><span>Rutgers University New Brunswick</span></div>
    <div className="profile-actions"><ResumeViewer /><a className="text-link" href="#projects">Explore projects<ArrowUpRight size={15} aria-hidden="true" /></a><div className="profile-socials"><a className="icon-link" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GitBranch size={18} /></a><a className="icon-link" href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Link2 size={18} /></a><a className="icon-link" href={`mailto:${profile.email}`} aria-label="Email Byron"><Mail size={18} /></a></div></div>
  </Reveal></section>;
}
