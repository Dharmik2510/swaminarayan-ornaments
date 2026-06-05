'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, Tag, Star, Clock, Plus, ArrowRight, TrendingUp, Image as ImageIcon, FileText, Search as SearchIcon, AlertTriangle, CheckCircle2 } from 'lucide-react';
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
  created: 'text-emerald-500', updated: 'text-blue-500', deleted: 'text-red-500', duplicated: 'text-violet-500',
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning, Admin';
  if (hour < 18) return 'Good Afternoon, Admin';
  return 'Good Evening, Admin';
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
    ]).catch(err => {
      console.error('[AdminDashboard] Failed to load data:', err.message);
    });
  }, []);

  const active   = products.filter(p => p.status === 'active').length;
  const draft    = products.filter(p => p.status === 'draft').length;
  const featured = products.filter(p => p.featured).length;

  // Operational signals — "what needs attention".
  const sevenDaysAgoMs = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const missingImages      = products.filter(p => p.status === 'active' && (!p.images || p.images.length === 0)).length;
  const missingDescription = products.filter(p => p.status === 'active' && !p.description?.trim()).length;
  const missingSeo         = products.filter(p => p.status === 'active' && (!p.seoTitle?.trim() || !p.seoDescription?.trim())).length;
  const oldDrafts          = products.filter(p => p.status === 'draft' && new Date(p.updatedAt).getTime() < sevenDaysAgoMs).length;
  const emptyCategories    = categories.filter(c => !products.some(p => p.category === c.name)).length;
  const totalActionItems   = missingImages + missingDescription + missingSeo + oldDrafts + emptyCategories;

  const actionCards: Array<{
    key: string;
    count: number;
    label: string;
    hint: string;
    href: string;
    icon: typeof Package;
    tone: 'warn' | 'info';
  }> = [
    { key: 'img',  count: missingImages,      label: 'Active products missing images',      hint: "Customers can't see them", href: '/admin/products?status=active&missingImage=1',       icon: ImageIcon, tone: 'warn' as const },
    { key: 'desc', count: missingDescription, label: 'Active products missing description', hint: 'Hurts trust & SEO',        href: '/admin/products?status=active&missingDescription=1', icon: FileText,  tone: 'warn' as const },
    { key: 'seo',  count: missingSeo,         label: 'Missing SEO metadata',                hint: "Won't rank on Google",     href: '/admin/products?status=active&missingSeo=1',         icon: SearchIcon,tone: 'info' as const },
    { key: 'old',  count: oldDrafts,          label: 'Drafts older than 7 days',            hint: 'Publish or archive',       href: '/admin/products?status=draft',                        icon: Clock,     tone: 'info' as const },
    { key: 'cat',  count: emptyCategories,    label: 'Empty categories',                    hint: 'Nothing to display',       href: '/admin/categories',                                   icon: Tag,       tone: 'info' as const },
  ].filter(c => c.count > 0);

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-[26px] text-black/90 font-medium tracking-wide flex items-center gap-2"
            style={{ fontFamily: 'var(--font-accent)' }}>
            {getGreeting()} 
            <motion.span 
              initial={{ opacity: 0, rotate: -20 }} 
              animate={{ opacity: 1, rotate: 0 }} 
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              ✨
            </motion.span>
          </h1>
          <p className="text-[11px] tracking-[0.15em] uppercase mt-1" style={{ color: 'var(--a-muted)' }}>
            Overview & Statistics
          </p>
        </motion.div>
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#FFD700] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </motion.div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatsCard label="Total Products"  value={products.length}   icon={Package}    color="gold"   delay={0.1}    />
        <AdminStatsCard label="Active"           value={active}            icon={TrendingUp}  color="green"  delay={0.2} />
        <AdminStatsCard label="Drafts"           value={draft}             icon={Clock}       color="blue"   delay={0.3} />
        <AdminStatsCard label="Featured"         value={featured}          icon={Star}        color="purple" delay={0.4} />
      </div>

      {/* Action needed */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="rounded-2xl overflow-hidden border shadow-sm"
        style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
          <div className="flex items-center gap-2">
            <h2 className="text-black/95 text-sm font-medium">Action needed</h2>
            {totalActionItems === 0 ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <span className="text-[10px] font-semibold bg-amber-500/15 text-amber-700 rounded-full px-2 py-0.5">
                {totalActionItems}
              </span>
            )}
          </div>
          <span className="text-[11px] text-black/40 tracking-wider uppercase">What to fix next</span>
        </div>

        {actionCards.length === 0 ? (
          <div className="px-5 py-8 flex items-center gap-3 text-sm text-black/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            All caught up — catalogue is in good shape.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/[0.04]">
            {actionCards.map(card => {
              const Icon = card.icon;
              const isWarn = card.tone === 'warn';
              return (
                <Link
                  key={card.key}
                  href={card.href}
                  className="group flex items-center gap-3 px-5 py-4 bg-[var(--a-surface)] hover:bg-black/[0.02] transition-colors"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isWarn ? 'bg-amber-500/10 text-amber-600' : 'bg-[#D4AF37]/10 text-[#D4AF37]'
                  }`}>
                    {card.count > 0 ? (
                      <span className="text-[13px] font-semibold tabular-nums">{card.count}</span>
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-black/90 text-sm font-medium leading-tight">{card.label}</p>
                    <p className="text-black/50 text-[11px] mt-0.5">{card.hint}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-black/30 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent products */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="lg:col-span-3 rounded-2xl overflow-hidden border shadow-sm"
          style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' } as React.CSSProperties}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
            <h2 className="text-black/95 text-sm font-medium">Recent Products</h2>
            <Link href="/admin/products" className="text-[#D4AF37] text-xs hover:underline flex items-center gap-1 group">
              View all <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="show" 
            className="divide-y divide-black/[0.04]"
          >
            {recentProducts.length === 0 ? (
              <div className="px-5 py-10 text-center text-black/55 text-sm">
                No products yet.{' '}
                <Link href="/admin/products/new" className="text-[#D4AF37] hover:underline">
                  Add your first product
                </Link>
              </div>
            ) : (
              recentProducts.map(p => (
                <motion.div variants={itemVariants} key={p.id}>
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-black/[0.02] transition-colors group relative"
                  >
                    {/* Add a subtle indicating bar on hover */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Thumbnail */}
                    <div className="w-10 h-10 rounded-lg bg-black/5 border border-black/10 overflow-hidden shrink-0 group-hover:shadow-md transition-shadow">
                      {p.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <Package className="w-4 h-4 text-black/20 m-auto mt-3" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 ml-1">
                      <p className="text-black/95 text-sm truncate group-hover:text-black transition-colors font-medium">
                        {p.name}
                      </p>
                      <p className="text-black/55 text-xs">{p.category}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={p.status} />
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </motion.div>
        </motion.div>

        {/* Activity log */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="lg:col-span-2 rounded-2xl overflow-hidden border shadow-sm flex flex-col"
          style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)', maxHeight: '420px' } as React.CSSProperties}
        >
          <div className="px-5 py-4 border-b border-black/10 shrink-0 bg-[var(--a-surface)] z-10 flex items-center justify-between">
            <h2 className="text-black/95 text-sm font-medium">Activity Log</h2>
            <Link href="/admin/activity" className="text-[#D4AF37] text-xs hover:underline flex items-center gap-1 group">
              All <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="show"
            className="px-5 py-3 space-y-4 overflow-y-auto flex-1 relative custom-scrollbar"
          >
            {logs.length === 0 ? (
              <p className="text-black/55 text-sm py-6 text-center">No activity yet.</p>
            ) : (
              logs.map((log, index) => (
                <motion.div variants={itemVariants} key={log.id} className="flex gap-3 relative group">
                   {/* Connection Line */}
                   {index !== logs.length - 1 && (
                     <div className="absolute left-[3px] top-6 bottom-[-16px] w-[2px] bg-black/5 group-hover:bg-black/10 transition-colors" />
                   )}
                  <div className={`mt-1 w-2 h-2 rounded-full ring-4 ring-[var(--a-surface)] relative z-10 shrink-0 ${ACTION_COLORS[log.action].replace('text-', 'bg-')}`} />
                  <div className="flex-1 min-w-0 bg-black/[0.02] group-hover:bg-black/[0.04] transition-colors rounded-lg px-3 py-2 -mt-1">
                    <p className="text-black/95 text-xs leading-relaxed">
                      <span className={`font-semibold ${ACTION_COLORS[log.action]}`}>
                        {ACTION_LABELS[log.action]}
                      </span>
                      {' '}
                      <span className="text-black/80">{log.entityName}</span>
                    </p>
                    <p className="text-black/50 text-[10px] mt-1 font-medium tracking-wide">{timeAgo(log.timestamp)}</p>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Categories overview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="rounded-2xl overflow-hidden border shadow-sm group"
        style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' } as React.CSSProperties}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
          <h2 className="text-black/95 text-sm font-medium">Categories</h2>
          <Link href="/admin/categories" className="text-[#D4AF37] text-xs hover:underline flex items-center gap-1">
            Manage <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="px-5 py-4 flex flex-wrap gap-2">
          {categories.map(cat => {
            const count = products.filter(p => p.category === cat.name).length;
            return (
              <motion.div
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(212,175,55,0.1)' }}
                key={cat.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/5 border border-black/10 text-sm cursor-pointer transition-colors"
              >
                <Tag className="w-3 h-3 text-[#D4AF37]" />
                <span className="text-black/90 font-medium">{cat.name}</span>
                <span className="text-black/50 font-mono text-[10px] bg-black/5 px-1.5 py-0.5 rounded-sm">{count}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
