'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Trash2, Package } from 'lucide-react';
import { getDeletedProducts, restoreProduct, purgeProduct, purgeProductsBulk } from '@/lib/firebase';
import type { Product } from '@/lib/data';
import { useAdmin } from '@/components/admin/AdminContext';

const AUTO_PURGE_DAYS = 30;

function daysAgo(iso?: string): number {
  if (!iso) return 0;
  return Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
}

export default function AdminTrashPage() {
  const { toast, confirm } = useAdmin();
  const [items, setItems] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    getDeletedProducts()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const toggle = (id: string) => {
    setSelected(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const allSelected = items.length > 0 && items.every(p => selected.has(p.id));
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(items.map(p => p.id)));
  };

  const handleRestore = async (p: Product) => {
    await restoreProduct(p.id);
    toast(`"${p.name}" restored.`, 'success');
    refresh();
  };

  const handlePurge = async (p: Product) => {
    const ok = await confirm({
      title: 'Permanently delete?',
      message: `"${p.name}" will be removed for good. This cannot be undone.`,
      confirmLabel: 'Delete forever',
      variant: 'danger',
    });
    if (!ok) return;
    await purgeProduct(p.id);
    toast(`"${p.name}" purged.`, 'success');
    refresh();
  };

  const handleBulkRestore = async () => {
    for (const id of selected) await restoreProduct(id);
    toast(`Restored ${selected.size} product${selected.size > 1 ? 's' : ''}.`, 'success');
    setSelected(new Set());
    refresh();
  };

  const handleBulkPurge = async () => {
    const ok = await confirm({
      title: 'Purge selected?',
      message: `${selected.size} product${selected.size > 1 ? 's' : ''} will be permanently removed.`,
      confirmLabel: 'Delete forever',
      variant: 'danger',
    });
    if (!ok) return;
    await purgeProductsBulk([...selected]);
    toast(`Purged ${selected.size} product${selected.size > 1 ? 's' : ''}.`, 'success');
    setSelected(new Set());
    refresh();
  };

  const stale = useMemo(() => items.filter(p => daysAgo(p.deletedAt) >= AUTO_PURGE_DAYS), [items]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl border shadow-sm border-black/[0.08] text-black/95 hover:border-black/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-[26px] text-black/90 font-medium tracking-wide" style={{ fontFamily: 'var(--font-accent)' }}>
              Trash
            </h1>
            <p className="text-[11px] tracking-[0.15em] uppercase mt-1" style={{ color: 'var(--a-muted)' }}>
              {items.length} deleted · auto-purge after {AUTO_PURGE_DAYS} days
            </p>
          </div>
        </div>
      </div>

      {/* Stale warning */}
      {stale.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-800">
          <strong>{stale.length}</strong> product{stale.length > 1 ? 's' : ''} older than {AUTO_PURGE_DAYS} days will be auto-purged. Restore anything you still need.
        </div>
      )}

      {/* Bulk action bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-3 px-4 py-3 bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.2)] rounded-xl"
          >
            <span className="text-[#D4AF37] text-sm font-medium">{selected.size} selected</span>
            <div className="flex-1 flex gap-2">
              <button
                onClick={handleBulkRestore}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-sm font-medium hover:bg-[#FFD700] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Restore
              </button>
              <button
                onClick={handleBulkPurge}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-400/40 text-red-600 hover:bg-red-500/10 text-sm transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete forever
              </button>
            </div>
            <button onClick={() => setSelected(new Set())} className="text-black/95 hover:text-black text-sm">Clear</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden border shadow-sm" style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b text-black/35 text-[10px] uppercase tracking-[0.12em]" style={{ borderColor: 'var(--a-border)' }}>
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="accent-[#D4AF37] w-4 h-4"
                  />
                </th>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Deleted</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-16 text-center text-black/40">Loading…</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-16 text-center text-black/55">Trash is empty.</td></tr>
              ) : (
                items.map(p => {
                  const age = daysAgo(p.deletedAt);
                  const isStale = age >= AUTO_PURGE_DAYS;
                  return (
                    <tr key={p.id} className="border-b border-black/[0.03] hover:bg-black/[0.02]">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(p.id)}
                          onChange={() => toggle(p.id)}
                          className="accent-[#D4AF37] w-4 h-4"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-black/5 border border-black/10 overflow-hidden shrink-0">
                            {p.images?.[0]
                              ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover opacity-60" />
                              : <Package className="w-4 h-4 text-black/20 m-auto mt-2.5" />}
                          </div>
                          <span className="text-black/80 font-medium truncate">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-black/70">{p.category}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs ${isStale ? 'text-amber-600' : 'text-black/55'}`}>
                          {age === 0 ? 'today' : `${age}d ago`}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleRestore(p)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[#D4AF37] hover:bg-[#D4AF37]/10 text-xs transition-colors"
                            title="Restore"
                          >
                            <RotateCcw className="w-3 h-3" /> Restore
                          </button>
                          <button
                            onClick={() => handlePurge(p)}
                            className="p-1.5 rounded-lg text-black/55 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                            title="Delete forever"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
