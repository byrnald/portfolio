import { ArrowUpRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpandableRow } from "@/components/ui/expandable-row";
import { PantryOverview } from "@/components/ui/pantry-overview";
import { Reveal } from "@/components/ui/portfolio-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { profile } from "@/lib/portfolio-data";

const deskDuelStack = ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Railway"];

export function ProjectShowcase() {
  return (
    <section id="projects" className="section container">
      <Reveal>
        <SectionHeading index="03" label="LEARNING BY BUILDING" title="Projects" />
        <article className="featured-project" aria-labelledby="deskduel-title">
          <div className="featured-project-copy">
            <p className="eyebrow">IT HELP DESK SIMULATOR</p>
            <h3 id="deskduel-title">DeskDuel</h3>
            <p>
              I built a browser-based simulator for diagnosing account lockouts, DNS failures,
              and file access issues using simulated Active Directory, remote desktop, and
              command-line tools. You can practice solo or troubleshoot the same incident
              as another player in a timed duel.
            </p>
            <p>
              I built the backend to keep each player’s environment isolated, save ticket
              history, and score whether the fix restored service, avoided unsafe changes,
              and was documented clearly.
            </p>
            <div className="tech-tags">
              {deskDuelStack.map((technology) => <span key={technology}>{technology}</span>)}
            </div>
            <Button asChild className="action-button">
              <a href="https://deskduel.online/" target="_blank" rel="noopener noreferrer">
                Visit DeskDuel <ArrowUpRight aria-hidden="true" />
              </a>
            </Button>
          </div>
          <figure className="featured-project-preview">
            <img
              src={`${import.meta.env.BASE_URL}deskduel-active-ticket.webp`}
              width={1440}
              height={1614}
              loading="lazy"
              decoding="async"
              alt="DeskDuel workspace with an assigned sign-in incident and the simulated Active Directory console open."
            />
            <figcaption>An active account lockout ticket in solo practice</figcaption>
          </figure>
        </article>
        <ExpandableRow
          title="Smart Pantry"
          subtitle="Pantry inventory tracking with a relational backend"
          icon={<Package size={22} />}
          badge="BACKEND"
        >
          <div className="project-details">
            <p>A pantry and inventory-tracking application for stock levels, expiration dates, and restock needs.</p>
            <PantryOverview />
            <h3>The stack</h3>
            <p>Built with Java and Spring Boot, using Spring Data JPA and a relational backend.</p>
            <div className="tech-tags">
              <span>Java</span><span>Spring Boot</span><span>Spring Data JPA</span>
            </div>
            <a className="text-link" href={profile.project} target="_blank" rel="noopener noreferrer">
              View on GitHub<ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </ExpandableRow>
        <p className="section-note">Practical problems. Small experiments. Something new to learn.</p>
      </Reveal>
    </section>
  );
}
