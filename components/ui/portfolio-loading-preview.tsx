import { useEffect, useState, type ReactNode } from "react";
import "./portfolio-loading-preview.css";

export function PortfolioLoadingPreview({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState(0);
  const [text, setText] = useState("");
  const [leaving, setLeaving] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFinished(true);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (callback: () => void, delay: number) => timers.push(setTimeout(callback, delay));
    later(() => setStage(1), 80);
    later(() => setStage(2), 220);
    later(() => setStage(3), 320);
    later(() => setStage(4), 450);
    const first = "loading portfolio";
    [...first].forEach((_, i) => later(() => setText(first.slice(0, i + 1)), 480 + i * 28));
    [...first].forEach((_, i) => later(() => setText(first.slice(0, first.length - i - 1)), 1400 + i * 12));
    const last = "ready to explore.";
    [...last].forEach((_, i) => later(() => setText(last.slice(0, i + 1)), 1640 + i * 24));
    later(() => setLeaving(true), 2850);
    later(() => setFinished(true), 3500);
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (finished) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [finished]);

  return <>
    <div className={finished ? undefined : `portfolio-preview-page${leaving ? " is-entering" : ""}`} inert={!finished}>{children}</div>
    {!finished && <div className={`portfolio-loading-preview${leaving ? " is-leaving" : ""}`} role="status" aria-label="Loading portfolio">
      <div className="portfolio-loader-content" aria-hidden="true">
        <div className="portfolio-loader-mark">
          <span className={`loader-bracket left${stage >= 1 ? " visible" : ""}`}>[</span>
          <span><span className={`loader-letter${stage >= 2 ? " visible" : ""}`}>B</span><span className={`loader-letter${stage >= 3 ? " visible" : ""}`}>A</span></span>
          <span className={`loader-bracket right${stage >= 1 ? " visible" : ""}`}>]</span>
        </div>
        <p className={`portfolio-loader-name${stage >= 4 ? " visible" : ""}`}>Byron Aldas</p>
        <p className="portfolio-loader-command"><span className="loader-prompt">&gt;</span><span>{text}</span><span className="loader-caret" /></p>
      </div>
    </div>}
  </>;
}
