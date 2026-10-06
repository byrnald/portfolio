import { BookOpen } from "lucide-react";
import { Reveal } from "@/components/ui/portfolio-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { skillGroups } from "@/lib/portfolio-data";
export function SkillsSection() {
  return <section id="skills" className="section container"><Reveal><SectionHeading index="02" label="TOOLS I WORK WITH" title="Skills & stack" /><div className="skill-groups">{skillGroups.map((group, i) => <div className="skill-group" key={group.name}><div className="skill-category"><span className="mono">0{i + 1}</span><h3>{group.name}</h3></div><div className="tech-tags">{group.items.map(item => <span key={item}>{item}</span>)}</div></div>)}</div><div className="learning-note"><BookOpen size={19} aria-hidden="true" /><div><h3>Learning next: cloud engineering</h3><p>AWS Cloud Practitioner preparation <span>· Studying, not yet certified</span></p></div></div></Reveal></section>;
}
