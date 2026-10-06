import { Server } from "lucide-react";
import { ExpandableRow } from "@/components/ui/expandable-row";
import { HomelabOverview } from "@/components/ui/homelab-overview";
import { Reveal } from "@/components/ui/portfolio-motion";
import { SectionHeading } from "@/components/ui/section-heading";
export function HomelabSection() {
  return <section id="homelab" className="section container"><Reveal><SectionHeading index="04" label="LEARN. BREAK. REBUILD." title="Homelab" /><ExpandableRow title="My learning lab" subtitle="EliteDesk · Proxmox · Raspberry Pi 5 · Netgear" icon={<Server size={22} />} badge="OVERVIEW" className="homelab-row"><p className="lab-intro">A space to explore systems, virtualization, and networking. Select a component to learn about the documented equipment.</p><HomelabOverview /></ExpandableRow></Reveal></section>;
}
