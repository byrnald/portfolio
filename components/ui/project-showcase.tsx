import { ArrowUpRight, Package } from "lucide-react";
import { ExpandableRow } from "@/components/ui/expandable-row";
import { Reveal } from "@/components/ui/portfolio-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { profile } from "@/lib/portfolio-data";
import { PantryOverview } from "@/components/ui/pantry-overview";
export function ProjectShowcase() {
  return <section id="projects" className="section container"><Reveal><SectionHeading index="03" label="LEARNING BY BUILDING" title="Projects" /><ExpandableRow title="Smart Pantry" subtitle="Pantry inventory tracking with a relational backend" icon={<Package size={22} />} badge="BACKEND"><div className="project-details"><p>A pantry and inventory-tracking application for stock levels, expiration dates, and restock needs.</p><PantryOverview /><h3>The stack</h3><p>Built with Java and Spring Boot, using Spring Data JPA and a relational backend.</p><div className="tech-tags"><span>Java</span><span>Spring Boot</span><span>Spring Data JPA</span></div><a className="text-link" href={profile.project} target="_blank" rel="noopener noreferrer">View on GitHub<ArrowUpRight size={16} aria-hidden="true" /></a></div></ExpandableRow><p className="section-note">Practical problems. Small experiments. Something new to learn.</p></Reveal></section>;
}
