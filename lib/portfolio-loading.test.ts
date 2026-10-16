import { test } from "node:test";
import assert from "node:assert/strict";
import { isFirstSessionVisit, loaderTextAt, markSessionReady, startPortfolioLoading, waitForPortfolioReady, type LoadingPhase } from "./portfolio-loading.ts";

test("typing writes, erases, and replaces the loading message", () => {
  assert.equal(loaderTextAt(479, true), "");
  assert.equal(loaderTextAt(480, true), "l");
  assert.equal(loaderTextAt(508, true), "lo");
  assert.equal(loaderTextAt(1000, true), "loading portfolio");
  assert.equal(loaderTextAt(1400, true), "loading portfoli");
  assert.equal(loaderTextAt(1600, true), "");
  assert.equal(loaderTextAt(1640, true), "r");
  assert.equal(loaderTextAt(2100, true), "ready to explore.");
});

test("typing never claims readiness while resources are still loading", () => {
  assert.equal(loaderTextAt(1600, false), "loading portfolio");
  assert.equal(loaderTextAt(5000, false), "loading portfolio");
});

function fixture(firstVisit: boolean, reducedMotion = false, initiallyVisible = false) {
  let now = 0, nextId = 0, marked = 0;
  const timers = new Map<number, { at: number; callback: () => void }>();
  const phases: LoadingPhase[] = [];
  let resolve!: () => void, reject!: () => void;
  const ready = new Promise<void>((yes, no) => { resolve = yes; reject = no; });
  const cancel = startPortfolioLoading({ firstVisit, reducedMotion, initiallyVisible, ready,
    onChange: phase => phases.push(phase), onReady: () => marked++,
    clock: {
      setTimeout: (callback, delay) => { const id = ++nextId; timers.set(id, { at: now + delay, callback }); return id as unknown as ReturnType<typeof setTimeout>; },
      clearTimeout: id => { timers.delete(id as unknown as number); },
    },
  });
  const advance = (ms: number) => {
    const end = now + ms;
    while (true) {
      const entry = [...timers].filter(([, timer]) => timer.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
      if (!entry) break;
      now = entry[1].at; timers.delete(entry[0]); entry[1].callback();
    }
    now = end;
  };
  return { phases, advance, cancel, marked: () => marked, ready: async () => { resolve(); await ready; }, fail: async () => { reject(); await Promise.resolve(); } };
}

test("first session visit takes 3.5 seconds including the smooth exit", async () => {
  const f = fixture(true);
  assert.deepEqual(f.phases, ["loading"]);
  await f.ready();
  assert.deepEqual(f.phases, ["loading"]);
  f.advance(2849);
  assert.equal(f.phases.at(-1), "loading");
  f.advance(1);
  assert.deepEqual(f.phases, ["loading", "leaving"]);
  assert.equal(f.marked(), 1);
  f.advance(649);
  assert.equal(f.phases.at(-1), "leaving");
  f.advance(1);
  assert.equal(f.phases.at(-1), "ready");
});

test("fast repeat visit never flashes a loader", async () => {
  const f = fixture(false);
  f.advance(399);
  await f.ready();
  f.advance(1000);
  assert.deepEqual(f.phases, ["pending", "ready"]);
});

test("slow repeat visit shows loader until resources are ready", async () => {
  const f = fixture(false);
  f.advance(400);
  assert.equal(f.phases.at(-1), "loading");
  f.advance(5000);
  assert.equal(f.phases.at(-1), "loading");
  await f.ready();
  f.advance(650);
  assert.deepEqual(f.phases, ["pending", "loading", "leaving", "ready"]);
});

test("a loader already displayed before JavaScript keeps its smooth exit", async () => {
  const f = fixture(false, false, true);
  await f.ready(); f.advance(650);
  assert.deepEqual(f.phases, ["loading", "leaving", "ready"]);
});

test("reduced motion skips the exit animation", async () => {
  const f = fixture(true, true);
  await f.ready();
  assert.deepEqual(f.phases, ["loading", "ready"]);
});

test("a resource failure releases the screen", async () => {
  const f = fixture(true);
  await f.fail(); f.advance(3500);
  assert.equal(f.phases.at(-1), "ready");
});

test("unmount cancels a pending slow-load indicator", async () => {
  const f = fixture(false);
  f.cancel(); f.advance(1000); await f.ready();
  assert.deepEqual(f.phases, ["pending"]);
  assert.equal(f.marked(), 0);
});

test("unmount cancels the exit timer", async () => {
  const f = fixture(true);
  await f.ready(); f.advance(2850); f.cancel(); f.advance(1000);
  assert.deepEqual(f.phases, ["loading", "leaving"]);
});

test("a slow first visit waits for readiness even after the minimum duration", async () => {
  const f = fixture(true);
  f.advance(5000);
  assert.deepEqual(f.phases, ["loading"]);
  await f.ready(); f.advance(650);
  assert.deepEqual(f.phases, ["loading", "leaving", "ready"]);
});

test("unmount cancels the first-visit minimum timer", async () => {
  const f = fixture(true);
  await f.ready(); f.cancel(); f.advance(5000);
  assert.deepEqual(f.phases, ["loading"]);
  assert.equal(f.marked(), 0);
});

test("session storage remembers a completed visit and a fresh session starts over", t => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "sessionStorage");
  t.after(() => { if (original) Object.defineProperty(globalThis, "sessionStorage", original); else Reflect.deleteProperty(globalThis, "sessionStorage"); });
  const data = new Map<string, string>();
  Object.defineProperty(globalThis, "sessionStorage", { configurable: true, value: { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => data.set(key, value) } });
  assert.equal(isFirstSessionVisit(), true);
  markSessionReady();
  assert.equal(isFirstSessionVisit(), false);
  data.clear();
  assert.equal(isFirstSessionVisit(), true);
});

test("blocked storage cannot stop the portfolio loading", t => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "sessionStorage");
  t.after(() => { if (original) Object.defineProperty(globalThis, "sessionStorage", original); else Reflect.deleteProperty(globalThis, "sessionStorage"); });
  Object.defineProperty(globalThis, "sessionStorage", { configurable: true, get: () => { throw new Error("Storage disabled"); } });
  assert.equal(isFirstSessionVisit(), true);
  assert.doesNotThrow(markSessionReady);
});

test("readiness waits for page resources and then the registered fonts", async t => {
  const doc = Object.getOwnPropertyDescriptor(globalThis, "document");
  const win = Object.getOwnPropertyDescriptor(globalThis, "window");
  t.after(() => {
    if (doc) Object.defineProperty(globalThis, "document", doc); else Reflect.deleteProperty(globalThis, "document");
    if (win) Object.defineProperty(globalThis, "window", win); else Reflect.deleteProperty(globalThis, "window");
  });
  const events = new EventTarget();
  let fontsRequested = false, resolved = false, resolveFonts!: () => void;
  const fonts = new Promise<void>(resolve => { resolveFonts = resolve; });
  Object.defineProperty(globalThis, "window", { configurable: true, value: events });
  Object.defineProperty(globalThis, "document", { configurable: true, value: { readyState: "loading", get fonts() { fontsRequested = true; return { ready: fonts }; } } });
  const ready = waitForPortfolioReady(new AbortController().signal).then(() => { resolved = true; });
  await Promise.resolve();
  assert.equal(fontsRequested, false);
  assert.equal(resolved, false);
  events.dispatchEvent(new Event("load"));
  await Promise.resolve();
  assert.equal(fontsRequested, true);
  assert.equal(resolved, false);
  resolveFonts(); await ready;
  assert.equal(resolved, true);
});
