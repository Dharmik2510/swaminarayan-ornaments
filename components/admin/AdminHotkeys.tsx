'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Global hotkeys for the admin panel. Skips when the user is typing in an input. */
export default function AdminHotkeys() {
  const router = useRouter();

  useEffect(() => {
    const isTypingTarget = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
      if (el.isContentEditable) return true;
      return false;
    };

    const onKey = (e: KeyboardEvent) => {
      // Never intercept modified keys — those are for system shortcuts / command palette.
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;

      if (e.key === 'n') {
        e.preventDefault();
        router.push('/admin/products/new');
      } else if (e.key === '/') {
        e.preventDefault();
        // Reuse command palette — fire the ⌘K shortcut it listens for.
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
      } else if (e.key === 'g') {
        // Prefix for "go to" — wait for second key within 1s.
        const handler = (next: KeyboardEvent) => {
          window.removeEventListener('keydown', handler, true);
          if (isTypingTarget(next.target)) return;
          if (next.key === 'p') router.push('/admin/products');
          else if (next.key === 'c') router.push('/admin/categories');
          else if (next.key === 'm') router.push('/admin/media');
          else if (next.key === 't') router.push('/admin/trash');
          else if (next.key === 'a') router.push('/admin/activity');
          else if (next.key === 'd') router.push('/admin');
        };
        window.addEventListener('keydown', handler, true);
        setTimeout(() => window.removeEventListener('keydown', handler, true), 1000);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [router]);

  return null;
}
