"use client";
import { useEffect, useRef, useState } from "react";
import { Mail, Copy, Check, GitBranch, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/portfolio-motion";
import { profile } from "@/lib/portfolio-data";
export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle"); const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  async function copyEmail() { if (timer.current) clearTimeout(timer.current); try { await navigator.clipboard.writeText(profile.email); setStatus("copied"); timer.current = setTimeout(() => setStatus("idle"), 3500); } catch { setStatus("failed"); } }
  return <><section id="contact" className="contact-section container"><Reveal><div className="contact-top"><p className="eyebrow"><span className="section-index">06</span>LET'S CONNECT</p></div><h2>Have something in mind?</h2><p className="contact-intro">Have an internship opportunity, a project idea, or a good homelab story? I'd love to hear from you.</p><div className="contact-actions"><Button className="action-button" asChild><a href={`mailto:${profile.email}`}><Mail aria-hidden="true" />Get in touch</a></Button><Button variant="outline" className="action-button secondary-action" onClick={copyEmail}>{status === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{status === "copied" ? "Email copied" : "Copy email"}</Button></div><div className="copy-status" role="status" aria-live="polite">{status === "failed" ? "Copy unavailable. Select the email address below, or use Get in touch." : status === "copied" ? "Email address copied to clipboard." : ""}</div><a className="email-address" href={`mailto:${profile.email}`}>{profile.email}</a></Reveal></section><footer className="site-footer container"><div className="footer-inner"><a href="#home" className="footer-brand">Byron Aldas</a><nav aria-label="Social links"><a href={profile.github} target="_blank" rel="noopener noreferrer"><GitBranch size={15} aria-hidden="true" />GitHub</a><a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><Link2 size={15} aria-hidden="true" />LinkedIn</a></nav><span className="copyright">© {new Date().getFullYear()}</span></div></footer></>;
}
