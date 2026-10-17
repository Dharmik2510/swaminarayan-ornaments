'use client';

import { useEffect, useRef, type RefObject } from 'react';

export interface ScrollCraftInstance {
  layout: () => void;
  read: () => void;
  destroy: () => void;
  acts: unknown[];
  worlds: unknown[];
  clips: unknown[];
  lerp: number;
}

declare global {
  interface Window {
    ScrollCraft?: {
      mount: (root?: HTMLElement | Document | string, opts?: { lerp?: number }) => ScrollCraftInstance;
      reduce: boolean;
      instances: ScrollCraftInstance[];
    };
  }
}

export function useScrollCraft(
  rootRef?: RefObject<HTMLElement | null>,
  deps: unknown[] = []
) {
  const instanceRef = useRef<ScrollCraftInstance | null>(null);

  useEffect(() => {
    let cancelled = false;
    let rafId = 0;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    async function init() {
      if (typeof window === 'undefined') return;
      // Under reduced motion the page is laid out statically in CSS, so there
      // is nothing for the engine to drive.
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (!window.ScrollCraft) {
        await import('@/lib/scrollcraft.js');
      }
      if (cancelled || !window.ScrollCraft) return;

      instanceRef.current?.destroy();
      const target = rootRef?.current ?? document;
      const inst = window.ScrollCraft.mount(target);
      instanceRef.current = inst;

      // Recalculate layout once images/fonts settle
      rafId = requestAnimationFrame(() => {
        if (!cancelled) inst.layout();
      });
      timerId = setTimeout(() => {
        if (!cancelled) inst.layout();
      }, 350);
    }

    init();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (timerId) clearTimeout(timerId);
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return instanceRef;
}
