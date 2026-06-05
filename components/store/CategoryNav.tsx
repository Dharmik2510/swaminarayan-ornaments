'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import type { CategoryFilter } from '@/lib/catalog';
import { ALL_CATEGORY } from '@/lib/catalog';
import type { CategoryWithStats } from '@/lib/catalog';

interface CategoryNavProps {
  categories: CategoryWithStats[];
  categoryFilters: CategoryFilter[];
  categoryCounts: Record<string, number>;
  selected: CategoryFilter;
  onSelect: (category: CategoryFilter) => void;
  variant?: 'sidebar' | 'sheet' | 'inline';
  onClose?: () => void;
}

export default function CategoryNav({
  categories,
  categoryFilters,
  categoryCounts,
  selected,
  onSelect,
  variant = 'sidebar',
  onClose,
}: CategoryNavProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = categoryFilters.filter((c) => c !== ALL_CATEGORY);
    if (!q) return list;
    return list.filter((name) => name.toLowerCase().includes(q));
  }, [categoryFilters, query]);

  const containerClass =
    variant === 'sidebar'
      ? 'flex flex-col h-full'
      : variant === 'sheet'
        ? 'flex flex-col max-h-[70vh]'
        : 'flex flex-col';

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between gap-2 mb-4">
        <p className="text-[10px] tracking-[0.28em] uppercase text-[var(--store-muted)]">
          Categories
        </p>
        {variant === 'sheet' && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--store-muted)] hover:text-[var(--store-text)]"
            aria-label="Close categories"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--store-muted)]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search categories..."
          className="store-input w-full pl-9"
          aria-label="Search categories"
        />
      </div>

      <nav
        className={
          variant === 'inline'
            ? 'flex flex-wrap gap-2'
            : 'flex-1 overflow-y-auto space-y-0.5 pr-1 -mr-1 store-scrollbar'
        }
        aria-label="Product categories"
      >
        <CategoryButton
          name={ALL_CATEGORY}
          count={categoryCounts[ALL_CATEGORY] ?? 0}
          selected={selected === ALL_CATEGORY}
          onSelect={() => {
            onSelect(ALL_CATEGORY);
            onClose?.();
          }}
          variant={variant}
        />
        {filtered.map((name) => (
          <CategoryButton
            key={name}
            name={name}
            count={categoryCounts[name] ?? 0}
            selected={selected === name}
            onSelect={() => {
              onSelect(name);
              onClose?.();
            }}
            variant={variant}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-[var(--store-muted)] py-6 text-center">No categories match</p>
        )}
      </nav>
    </div>
  );
}

function CategoryButton({
  name,
  count,
  selected,
  onSelect,
  variant,
}: {
  name: string;
  count: number;
  selected: boolean;
  onSelect: () => void;
  variant: 'sidebar' | 'sheet' | 'inline';
}) {
  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={`px-4 py-2 rounded-full text-xs tracking-wide border transition-colors ${
          selected
            ? 'bg-[var(--store-gold)]/12 border-[var(--store-gold)]/35 text-[var(--store-gold)]'
            : 'border-[var(--store-border)] text-[var(--store-muted)] hover:border-[var(--store-gold-dim)]'
        }`}
      >
        {name}
        <span className="ml-1.5 opacity-50">{count}</span>
      </button>
    );
  }

  const href = name === ALL_CATEGORY ? '/collection' : `/collection?category=${encodeURIComponent(name)}`;

  return (
    <Link
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onSelect();
      }}
      className={`flex items-center justify-between gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-colors ${
        selected
          ? 'bg-[var(--store-gold)]/10 text-[var(--store-gold)]'
          : 'text-[var(--store-muted)] hover:bg-white/[0.03] hover:text-[var(--store-text)]'
      }`}
    >
      <span className="truncate">{name}</span>
      <span className="text-[10px] tabular-nums opacity-60 shrink-0">{count}</span>
    </Link>
  );
}
