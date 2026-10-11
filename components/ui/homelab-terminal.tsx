import { Terminal } from "@/components/ui/terminal";

// I excerpted these notes from my HomeLab README; the preview doesn't run commands.
// https://github.com/byrnald/HomeLab/blob/main/README.md
const lines = [
  "# HomeLab",
  "",
  "Hardware Inventory",
  "pi5-gateway   Raspberry Pi 5 · 8 GB RAM",
  "             128 GB NVMe · GPIO LCD dashboard",
  "node-lab      EliteDesk · Proxmox / Sandbox",
  "             16 GB RAM · 256 GB NVMe",
  "network       8-port managed switch",
  "workstation   Main PC",
] as const;

export function HomelabTerminal() {
  return <Terminal command="cat README.md" lines={lines} />;
}
