import { createRoot } from "react-dom/client";
import { Portfolio } from "@/components/ui/portfolio";
import { PortfolioLoadingPreview } from "@/components/ui/portfolio-loading-preview";
import "./app/globals.css";

createRoot(document.getElementById("root")!).render(
  <PortfolioLoadingPreview><Portfolio /></PortfolioLoadingPreview>
);
