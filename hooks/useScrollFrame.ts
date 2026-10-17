'use client';

import { useEffect, useRef } from 'react';

/**
 * Runs `frame` once per animation frame while the page scrolls or resizes,
 * and once on mount. Bespoke choreography reads scroll position here instead
 * of re-rendering React on every scroll tick.
 */
export function useScrollFrame(frame: () => void, deps: unknown[] = []) {
  const fn = useRef(frame);
  useEffect(() => {
    fn.current = frame;
  });
  useEffect(() => {
    let raf = 0;
    const run = () => {
      raf = 0;
      fn.current();
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    schedule();
    const settle = setTimeout(schedule, 400);
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule, { passive: true });
    return () => {
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      clearTimeout(settle);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** True when the visitor has asked for reduced motion. Safe during SSR. */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Progress of a pinned act, computed from geometry with the same formula the
 * engine uses for --sc-p. Reading the engine's value instead would lag a frame,
 * because this listener can run before the engine's own.
 */
export function pinProgress(el: HTMLElement | null): number {
  if (!el) return 0;
  const r = el.getBoundingClientRect();
  const travel = Math.max(r.height - innerHeight, 1);
  return clamp01(-r.top / travel);
}

export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const smooth = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};
