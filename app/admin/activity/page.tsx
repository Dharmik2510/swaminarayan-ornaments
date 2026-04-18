'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Search } from 'lucide-react';
import { getActivityLogs } from '@/lib/firebase';
import type { ActivityLog } from '@/lib/data';
import { timeAgo } from '@/lib/utils';

type ActionFilter = ActivityLog['action'] | 'all';
type EntityFilter = ActivityLog['entityType'] | 'all';

const ACTION_LABELS: Record<ActivityLog['action'], string> = {
  created: 'Created', updated: 'Updated', deleted: 'Deleted', duplicated: 'Duplicated',
};
const ACTION_COLORS: Record<ActivityLog['action'], string> = {
  created: 'text-emerald-500 bg-emerald-500/10',
  updated: 'text-blue-500 bg-blue-500/10',
  deleted: 'text-red-500 bg-red-500/10',
  duplicated: 'text-violet-500 bg-violet-500/10',
};

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<ActionFilter>('all');
  const [entityFilter, setEntityFilter] = useState<EntityFilter>('all');
  const [actor, setActor] = useState<string>('all');
  const [fromDate, setFromDate] = useState('');

  useEffect(() => {
    getActivityLogs(500)
      .then(setLogs)
      .finally(() => setLoading(false));
  }, []);

  const actors = useMemo(() => {
    const set = new Set(logs.map(l => l.user));
    return ['all', ...Array.from(set)];
  }, [logs]);

  const filtered = useMemo(() => {
    return logs.filter(l => {
      if (actionFilter !== 'all' && l.action !== actionFilter) return false;
      if (entityFilter !== 'all' && l.entityType !== entityFilter) return false;
      if (actor !== 'all' && l.user !== actor) return false;
      if (fromDate) {
        const cutoff = new Date(fromDate).getTime();
        if (new Date(l.timestamp).getTime() < cutoff) return false;
      }
      if (query) {
        const q = query.toLowerCase();
        if (!l.entityName.toLowerCase().includes(q) && !l.user.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [logs, actionFilter, entityFilter, actor, fromDate, query]);

  const grouped = useMemo(() => {
    const out: Record<string, ActivityLog[]> = {};
    filtered.forEach(l => {
      const d = new Date(l.timestamp);
      const key = d.toISOString().slice(0, 10);
      (out[key] ||= []).push(l);
    });
    return Object.entries(out).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  const resetFilters = () => {
    setQuery(''); setActionFilter('all'); setEntityFilter('all'); setActor('all'); setFromDate('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="p-2 rounded-xl border shadow-sm border-black/[0.08] text-black/95 hover:border-black/20 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-[26px] text-black/90 font-medium tracking-wide" style={{ fontFamily: 'var(--font-accent)' }}>
            Activity
          </h1>
          <p className="text-[11px] tracking-[0.15em] uppercase mt-1" style={{ color: 'var(--a-muted)' }}>
            {filtered.length} of {logs.length} entries
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 rounded-xl p-4 border" style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' }}>
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name or actor…"
            className="w-full bg-black/[0.03] border rounded-lg pl-9 pr-3 py-2 text-sm text-black/85 placeholder:text-black/25 outline-none focus:border-[rgba(212,175,55,0.3)] [border-color:var(--a-border)]"
          />
        </div>
        <select
          value={actionFilter}
          onChange={e => setActionFilter(e.target.value as ActionFilter)}
          className="bg-black/[0.03] border rounded-lg px-3 py-2 text-sm outline-none [border-color:var(--a-border)]"
        >
          <option value="all">All actions</option>
          <option value="created">Created</option>
          <option value="updated">Updated</option>
          <option value="deleted">Deleted</option>
          <option value="duplicated">Duplicated</option>
        </select>
        <select
          value={entityFilter}
          onChange={e => setEntityFilter(e.target.value as EntityFilter)}
          className="bg-black/[0.03] border rounded-lg px-3 py-2 text-sm outline-none [border-color:var(--a-border)]"
        >
          <option value="all">All entities</option>
          <option value="product">Products</option>
          <option value="category">Categories</option>
        </select>
        <select
          value={actor}
          onChange={e => setActor(e.target.value)}
          className="bg-black/[0.03] border rounded-lg px-3 py-2 text-sm outline-none [border-color:var(--a-border)]"
        >
          {actors.map(a => <option key={a} value={a}>{a === 'all' ? 'Any actor' : a}</option>)}
        </select>
        <div className="flex items-center gap-2 md:col-span-2">
          <label className="text-[11px] tracking-[0.15em] uppercase text-black/50 shrink-0">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            className="flex-1 bg-black/[0.03] border rounded-lg px-2 py-1.5 text-sm outline-none [border-color:var(--a-border)]"
          />
        </div>
        <button
          onClick={resetFilters}
          className="text-xs text-black/55 hover:text-black underline md:col-span-3 justify-self-start md:justify-self-end"
        >
          Reset filters
        </button>
      </div>

      {/* Timeline */}
      {loading ? (
        <p className="text-center py-16 text-black/40 text-sm">Loading…</p>
      ) : grouped.length === 0 ? (
        <p className="text-center py-16 text-black/55 text-sm">No activity matches the current filters.</p>
      ) : (
        <div className="space-y-6">
          {grouped.map(([date, entries]) => (
            <motion.div key={date} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-[10px] tracking-[0.22em] uppercase text-black/40 font-semibold mb-2">
                {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' }}>
                {entries.map((log, idx) => (
                  <div
                    key={log.id}
                    className={`flex items-start gap-3 px-4 py-3 ${
                      idx !== entries.length - 1 ? 'border-b border-black/[0.04]' : ''
                    } hover:bg-black/[0.02] transition-colors`}
                  >
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${ACTION_COLORS[log.action]}`}>
                      {ACTION_LABELS[log.action]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-black/85">
                        {log.entityType === 'product' ? (
                          <Link href={`/admin/products/${log.entityId}`} className="hover:text-[#D4AF37] transition-colors">
                            {log.entityName}
                          </Link>
                        ) : log.entityName}
                        <span className="text-black/45"> · {log.entityType}</span>
                      </p>
                      <p className="text-[11px] text-black/45">{log.user} · {timeAgo(log.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
