'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, Tag, Star, Clock, Plus, ArrowRight, TrendingUp } from 'lucide-react';
import { getProducts } from '@/lib/firebase';
import { getCategories, getActivityLogs } from '@/lib/firebase';
import type { Product, ActivityLog, CategoryItem } from '@/lib/data';
import AdminStatsCard from '@/components/admin/AdminStatsCard';
import StatusBadge from '@/components/admin/StatusBadge';
import { timeAgo } from '@/lib/utils';

const ACTION_LABELS: Record<ActivityLog['action'], string> = {
  created: 'Created', updated: 'Updated', deleted: 'Deleted', duplicated: 'Duplicated',
};
const ACTION_COLORS: Record<ActivityLog['action'], string> = {
  created: 'text-emerald-400', updated: 'text-blue-400', deleted: 'text-red-400', duplicated: 'text-violet-400',
};

export default function AdminDashboard() {
  const [products,   setProducts]   = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [logs,       setLogs]       = useState<ActivityLog[]>([]);

  useEffect(() => {
    Promise.all([
      getProducts().then(setProducts),
      getCategories().then(setCategories),
      getActivityLogs(15).then(setLogs)
    ]);
  }, []);

  const active   = products.filter(p => p.status === 'active').length;
  const draft    = products.filter(p => p.status === 'draft').length;
  const featured = products.filter(p => p.featured).length;

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] text-white/90 font-light tracking-wide"
            style={{ fontFamily: 'var(--font-accent)' }}>
            Dashboard
          </h1>
          <p className="text-[11px] tracking-[0.15em] uppercase mt-1" style={{ color: 'var(--a-muted)' }}>
            Overview
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#FFD700] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatsCard label="Total Products"  value={products.length}   icon={Package}    color="gold"   delay={0}    />
        <AdminStatsCard label="Active"           value={active}            icon={TrendingUp}  color="green"  delay={0.05} />
        <AdminStatsCard label="Drafts"           value={draft}             icon={Clock}       color="blue"   delay={0.10} />
        <AdminStatsCard label="Featured"         value={featured}          icon={Star}        color="purple" delay={0.15} />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent products */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-3 rounded-2xl overflow-hidden border"
          style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' } as React.CSSProperties}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.055]">
            <h2 className="text-white/80 text-sm font-medium">Recent Products</h2>
            <Link href="/admin/products" className="text-[#D4AF37] text-xs hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {recentProducts.length === 0 ? (
              <div className="px-5 py-10 text-center text-white/30 text-sm">
                No products yet.{' '}
                <Link href="/admin/products/new" className="text-[#D4AF37] hover:underline">
                  Add your first product
                </Link>
              </div>
            ) : (
              recentProducts.map(p => (
                <Link
                  key={p.id}
                  href={`/admin/products/${p.id}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Thumbnail */}
                  <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/[0.06] overflow-hidden shrink-0">
                    {p.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-4 h-4 text-white/20 m-auto mt-3" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-sm truncate group-hover:text-white transition-colors">
                      {p.name}
                    </p>
                    <p className="text-white/30 text-xs">{p.category}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={p.status} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </motion.div>

        {/* Activity log */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="lg:col-span-2 rounded-2xl overflow-hidden border"
          style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' } as React.CSSProperties}
        >
          <div className="px-5 py-4 border-b border-white/[0.055]">
            <h2 className="text-white/80 text-sm font-medium">Activity Log</h2>
          </div>

          <div className="px-5 py-3 space-y-3 max-h-[360px] overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-white/30 text-sm py-6 text-center">No activity yet.</p>
            ) : (
              logs.map(log => (
                <div key={log.id} className="flex gap-2.5">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white/60 text-xs leading-snug">
                      <span className={`font-medium ${ACTION_COLORS[log.action]}`}>
                        {ACTION_LABELS[log.action]}
                      </span>
                      {' '}
                      <span className="text-white/80">{log.entityName}</span>
                    </p>
                    <p className="text-white/25 text-[10px] mt-0.5">{timeAgo(log.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Categories overview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="rounded-2xl overflow-hidden border"
        style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' } as React.CSSProperties}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.055]">
          <h2 className="text-white/80 text-sm font-medium">Categories</h2>
          <Link href="/admin/categories" className="text-[#D4AF37] text-xs hover:underline flex items-center gap-1">
            Manage <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="px-5 py-4 flex flex-wrap gap-2">
          {categories.map(cat => {
            const count = products.filter(p => p.category === cat.name).length;
            return (
              <div
                key={cat.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-sm"
              >
                <Tag className="w-3 h-3 text-[#D4AF37]" />
                <span className="text-white/70">{cat.name}</span>
                <span className="text-white/30 text-xs">{count}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
