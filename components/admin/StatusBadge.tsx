'use client';

import type { ProductStatus } from '@/lib/data';

const MAP: Record<ProductStatus, string> = {
  active:   'text-emerald-400/90 bg-emerald-500/[0.08] border-emerald-500/15',
  draft:    'text-sky-400/80 bg-sky-500/[0.08] border-sky-500/15',
  archived: 'text-black/90 bg-black/[0.03] border-black/10',
};

export default function StatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span className={`text-[9px] px-2 py-0.5 rounded-full border tracking-[0.12em] uppercase ${MAP[status]}`}>
      {status}
    </span>
  );
}
