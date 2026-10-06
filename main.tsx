import { createRoot } from "react-dom/client";
import { Portfolio } from "@/components/ui/portfolio";
import "./app/globals.css";

createRoot(document.getElementById("root")!).render(<Portfolio />);
