import { useEffect, useState, type ReactNode } from "react";
import { FIRST_VISIT_DURATION_MS, LOADER_FADE_MS, isFirstSessionVisit, loaderTextAt, markSessionReady, startPortfolioLoading, waitForPortfolioReady, type LoadingPhase } from "@/lib/portfolio-loading";
import "./portfolio-loading-preview.css";

declare global {
  interface Window {
    portfolioLoaderBoot?: { firstVisit: boolean; shown: boolean; timer?: number; animationTimer?: number; startedAt?: number };
  }
}

export function PortfolioLoadingPreview({ children }: { children: ReactNode }) {
  const [initial] = useState(() => {
    const boot = window.portfolioLoaderBoot;
    return { firstVisit: boot?.firstVisit ?? isFirstSessionVisit(), initiallyVisible: boot?.shown ?? false };
  });
  const [phase, setPhase] = useState<LoadingPhase>(initial.firstVisit || initial.initiallyVisible ? "loading" : "pending");
  const [elapsed, setElapsed] = useState(() => Math.max(0, Date.now() - (window.portfolioLoaderBoot?.startedAt ?? Date.now())));
  const [resourcesReady, setResourcesReady] = useState(false);
  const showing = phase === "loading" || phase === "leaving";
  const stage = initial.firstVisit ? (elapsed >= 450 ? 4 : elapsed >= 320 ? 3 : elapsed >= 220 ? 2 : elapsed >= 80 ? 1 : 0) : 4;
  const text = loaderTextAt(elapsed, resourcesReady);

  useEffect(() => {
    const boot = window.portfolioLoaderBoot;
    if (boot?.timer !== undefined) window.clearTimeout(boot.timer);
    if (boot?.animationTimer !== undefined) window.clearTimeout(boot.animationTimer);
    document.getElementById("portfolio-boot-loader")?.remove();
    const controller = new AbortController();
    const frames = new Set<number>();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ready = waitForPortfolioReady(controller.signal).then(() => reducedMotion || controller.signal.aborted ? undefined : new Promise<void>(resolve => {
      // I give the visible loader a paint before starting its fade, even on a cached visit.
      frames.add(requestAnimationFrame(() => frames.add(requestAnimationFrame(() => resolve()))));
    })).then(() => { if (!controller.signal.aborted) setResourcesReady(true); });
    const cancel = startPortfolioLoading({ ...initial,
      firstVisitDelayMs: Math.max(0, FIRST_VISIT_DURATION_MS - LOADER_FADE_MS - (Date.now() - (boot?.startedAt ?? Date.now()))),
      reducedMotion,
      ready,
      onChange: setPhase,
      onReady: markSessionReady,
    });
    return () => { cancel(); controller.abort(); frames.forEach(cancelAnimationFrame); };
  }, [initial]);

  useEffect(() => {
    if (!showing) return;
    const origin = initial.firstVisit ? window.portfolioLoaderBoot?.startedAt ?? Date.now() : Date.now();
    let timer: ReturnType<typeof setTimeout>;
    const update = () => {
      const next = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 2100 : Math.max(0, Date.now() - origin);
      setElapsed(next);
      if (next < 2100) timer = setTimeout(update, 28);
    };
    update();
    return () => clearTimeout(timer);
  }, [showing, initial]);

  useEffect(() => {
    if (!showing) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [showing]);

  return <>
    <div className={showing ? `portfolio-preview-page${phase === "leaving" ? " is-entering" : ""}` : undefined} inert={showing}>{children}</div>
    {showing && <div className={`portfolio-loading-preview${phase === "leaving" ? " is-leaving" : ""}`} role="status" aria-label="Loading portfolio">
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
