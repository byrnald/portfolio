export interface LabNode { id: string; name: string; category: string; detail: string; icon: "server" | "layers" | "cpu" | "network"; }
export const profile = { name: "Byron Aldas", initials: "BA", email: "byrnald@gmail.com", location: "New Brunswick, NJ", github: "https://github.com/byrnald", linkedin: "https://www.linkedin.com/in/byron-aldas-86b718385/", resume: `${import.meta.env.BASE_URL}resume.pdf`, project: "https://github.com/byrnald/smart-pantry", intro: "Rutgers ITI student. IT support specialist. Exploring cloud engineering, one project and one broken homelab at a time." } as const;
export const labNodes: LabNode[] = [
  { id: "elitedesk", name: "EliteDesk", category: "Hardware", detail: "An EliteDesk is part of my homelab hardware. A place to experiment, reconfigure, and learn by doing.", icon: "server" },
  { id: "proxmox", name: "Proxmox", category: "Virtualization", detail: "Proxmox is part of my homelab stack, alongside the EliteDesk, Raspberry Pi 5, and Netgear switching.", icon: "layers" },
  { id: "pi", name: "Raspberry Pi 5", category: "Hardware", detail: "A Raspberry Pi 5 is part of my lab. I use the homelab as a space to explore systems and keep learning.", icon: "cpu" },
  { id: "netgear", name: "Netgear", category: "Switching", detail: "Netgear switching is part of my homelab equipment. Networking is one of the areas I explore outside the classroom.", icon: "network" },
];
export interface Experience { organization: string; role: string; status: string; details: readonly string[]; }
export interface SkillGroup { name: string; items: readonly string[]; }
export interface PantryCapability { id: string; label: string; note: string; detail: string; icon: "package" | "calendar" | "checklist"; }
export const pantryCapabilities: PantryCapability[] = [
  { id: "stock", label: "Stock levels", note: "Know what's on hand", detail: "Track stock levels as part of the pantry inventory, keeping what's on hand in one application.", icon: "package" },
  { id: "expiration", label: "Expirations", note: "Keep track of dates", detail: "Track expiration dates alongside pantry inventory so date information stays with the items being tracked.", icon: "calendar" },
  { id: "restock", label: "Restock needs", note: "See what's running low", detail: "Keep track of restock needs together with stock levels and expiration dates.", icon: "checklist" },
];
export const skillGroups: SkillGroup[] = [
  { name: "Languages", items: ["Java", "Python", "SQL", "Bash"] },
  { name: "Frameworks", items: ["Spring Boot", "Spring Data JPA", "FastAPI", "Flask"] },
  { name: "Systems & infrastructure", items: ["Linux", "Proxmox", "Homelab", "Networking", "Git", "GitHub"] },
];
export const experience: Experience[] = [
  { organization: "Rutgers Digital Classroom Services", role: "IT Support Specialist", status: "Current role", details: [
    "Manage instructional technology and resolve live issues for 320 classrooms across four Rutgers campuses through a centralized Help Desk dashboard.",
    "Provide Tier 1 phone helpdesk support and remote troubleshooting for classroom AV, display, and audio systems, supporting faculty and staff during live sessions.",
    "Directly maintain and troubleshoot AV/IT equipment for 87 classrooms across the Livingston campus.",
  ] },
  { organization: "Amazon", role: "Operational Strategy & People Analytics Extern", status: "Externship", details: [
    "Analyzed workforce and employee review data using Python, Pandas, scraping, and sentiment analysis as part of an operational strategy and people analytics extern cohort.",
    "Applied people analytics and root cause frameworks to identify themes in associate experience and operational pain points, including turnover, burnout, and communication gaps in fulfillment center operations.",
    "Produced an insight memo and presentation summary, practicing data storytelling, prioritization, and business recommendations for nontechnical stakeholders.",
  ] },
];
export const education = [
  { organization: "Rutgers University New Brunswick", degree: "B.A. Information Technology & Informatics", detail: "Minor in Digital Communication, Information, and Media", status: "In progress" },
  { organization: "Union College", degree: "Associate Degree, Computer Science", detail: "", status: "Completed" },
];
export const motionTokens = { spring: { type: "spring" as const, stiffness: 240, damping: 25 }, reveal: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } };
