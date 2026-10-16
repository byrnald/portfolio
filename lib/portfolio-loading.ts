export const LOADING_SESSION_KEY = "portfolio-ready-this-session";
export const SLOW_LOAD_DELAY_MS = 400;
export const LOADER_FADE_MS = 650;
export const FIRST_VISIT_DURATION_MS = 3500;
export type LoadingPhase = "pending" | "loading" | "leaving" | "ready";

export function loaderTextAt(elapsed: number, resourcesReady: boolean) {
  const loading = "loading portfolio", ready = "ready to explore.";
  if (elapsed < 480) return "";
  if (elapsed < 1400) return loading.slice(0, Math.floor((elapsed - 480) / 28) + 1);
  if (!resourcesReady) return loading;
  if (elapsed < 1640) return loading.slice(0, Math.max(0, loading.length - Math.floor((elapsed - 1400) / 12) - 1));
  return ready.slice(0, Math.floor((elapsed - 1640) / 24) + 1);
}

type Clock = {
  setTimeout: (callback: () => void, delay: number) => ReturnType<typeof setTimeout>;
  clearTimeout: (id: ReturnType<typeof setTimeout>) => void;
};

export function startPortfolioLoading({ firstVisit, initiallyVisible = false, firstVisitDelayMs = FIRST_VISIT_DURATION_MS - LOADER_FADE_MS, reducedMotion, ready, onChange, onReady, clock = globalThis }: {
  firstVisit: boolean;
  initiallyVisible?: boolean;
  firstVisitDelayMs?: number;
  reducedMotion: boolean;
  ready: Promise<unknown>;
  onChange: (phase: LoadingPhase) => void;
  onReady: () => void;
  clock?: Clock;
}) {
  let cancelled = false;
  let phase: LoadingPhase = firstVisit || initiallyVisible ? "loading" : "pending";
  let timer: ReturnType<typeof setTimeout> | undefined;
  let firstVisitTimer: ReturnType<typeof setTimeout> | undefined;
  let resourcesReady = false;
  let minimumElapsed = !firstVisit || reducedMotion || firstVisitDelayMs <= 0;
  const change = (next: LoadingPhase) => { phase = next; onChange(next); };
  change(phase);
  if (phase === "pending") timer = clock.setTimeout(() => change("loading"), SLOW_LOAD_DELAY_MS);
  const finish = () => {
    if (cancelled || !resourcesReady || !minimumElapsed) return;
    if (timer !== undefined) clock.clearTimeout(timer);
    onReady();
    if (phase === "loading" && !reducedMotion) {
      change("leaving");
      timer = clock.setTimeout(() => change("ready"), LOADER_FADE_MS);
    } else change("ready");
  };
  if (!minimumElapsed) firstVisitTimer = clock.setTimeout(() => { minimumElapsed = true; finish(); }, firstVisitDelayMs);
  // A failed optional resource should leave the portfolio usable, too.
  const settled = () => { resourcesReady = true; finish(); };
  void ready.then(settled, settled);
  return () => { cancelled = true; if (timer !== undefined) clock.clearTimeout(timer); if (firstVisitTimer !== undefined) clock.clearTimeout(firstVisitTimer); };
}

export function isFirstSessionVisit() {
  try { return sessionStorage.getItem(LOADING_SESSION_KEY) !== "1"; }
  catch { return true; }
}

export function markSessionReady() {
  try { sessionStorage.setItem(LOADING_SESSION_KEY, "1"); }
  catch { /* I still show the site when browser storage is unavailable. */ }
}

export function waitForPortfolioReady(signal: AbortSignal) {
  const pageReady = document.readyState === "complete" ? Promise.resolve() : new Promise<void>(resolve => {
    window.addEventListener("load", () => resolve(), { once: true, signal });
  });
  return pageReady.then(() => document.fonts?.ready.catch(() => undefined));
}
