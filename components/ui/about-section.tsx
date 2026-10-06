import { Reveal } from "@/components/ui/portfolio-motion";
import { SectionHeading } from "@/components/ui/section-heading";
export function AboutSection() {
  return <section id="about" className="section container"><Reveal><SectionHeading index="01" label="THE PERSON BEHIND THE PROJECTS" title="About" /><div className="prose-copy"><p>I'm an Information Technology & Informatics major at Rutgers University New Brunswick, with a minor in Digital Communication, Information, and Media.</p><p>I work in IT support, explore backend development, and keep a homelab where I can experiment with Linux, virtualization, and networking. Cloud engineering and AI are where I'm focusing my learning next.</p></div></Reveal></section>;
}
