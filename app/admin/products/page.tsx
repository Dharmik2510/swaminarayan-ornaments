'use client';

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Trash2, Edit2, Copy, Package,
  ChevronDown, ChevronUp, ChevronsUpDown, Check,
  LayoutGrid, List, Sparkles, SlidersHorizontal, Bookmark, X as XIcon,
} from 'lucide-react';
import StatusBadge from '@/components/admin/StatusBadge';
import AdminBulkEditDrawer from '@/components/admin/AdminBulkEditDrawer';
import {
  getProducts,
  deleteProductsBulk,
  updateProductsBulkCategory,
  updateProductsBulkStatus,
  duplicateProduct,
  deleteProduct,
} from '@/lib/firebase';
import { getCategories } from '@/lib/firebase';
import type { Product, ProductStatus } from '@/lib/data';
import { useAdmin } from '@/components/admin/AdminContext';

const PAGE_SIZE = 20;

const STATUS_OPTIONS: Array<{ value: ProductStatus | 'all'; label: string }> = [
  { value: 'all',      label: 'All Status' },
  { value: 'active',   label: 'Active'     },
  { value: 'draft',    label: 'Draft'      },
  { value: 'archived', label: 'Archived'   },
];

type SortField = 'name' | 'createdAt' | 'category' | 'status';
type SortDir   = 'asc' | 'desc';

type AdvancedFilters = {
  featured: 'all' | 'yes' | 'no';
  missingImage: boolean;
  missingDescription: boolean;
  missingSeo: boolean;
  createdAfter: string; // ISO date (yyyy-mm-dd) or ''
};

const DEFAULT_ADVANCED: AdvancedFilters = {
  featured: 'all',
  missingImage: false,
  missingDescription: false,
  missingSeo: false,
  createdAfter: '',
};

type SavedView = {
  id: string;
  name: string;
  search: string;
  statusFilter: ProductStatus | 'all';
  categoryFilter: string;
  advanced: AdvancedFilters;
};

const SAVED_VIEWS_KEY = 'admin:savedViews';

export default function AdminProductsPage() {
  const { toast, confirm } = useAdmin();
  const searchParams = useSearchParams();

  const [products,       setProducts]      = useState<Product[]>([]);
  const [productsLoaded, setProductsLoaded]= useState(false);
  const [categoryNames,  setCategoryNames] = useState<string[]>([]);
  const [search,         setSearch]        = useState('');
  const deferredSearch = useDeferredValue(search);
  const [statusFilter,   setStatusFilter]  = useState<ProductStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter]= useState('all');
  const [selected,       setSelected]      = useState<Set<string>>(new Set());
  const [page,           setPage]          = useState(1);
  const [sortField,      setSortField]     = useState<SortField>('createdAt');
  const [sortDir,        setSortDir]       = useState<SortDir>('desc');
  const [view,           setView]          = useState<'table' | 'grid'>('table');
  const [bulkAction,     setBulkAction]    = useState('');
  const [hiddenIds,      setHiddenIds]     = useState<Set<string>>(new Set());
  const [bulkDrawerOpen, setBulkDrawerOpen]= useState(false);
  const [advanced,       setAdvanced]      = useState<AdvancedFilters>(DEFAULT_ADVANCED);
  const [showAdvanced,   setShowAdvanced]  = useState(false);
  const [savedViews,     setSavedViews]    = useState<SavedView[]>([]);
  const [activeViewId,   setActiveViewId]  = useState<string | null>(null);

  // Load saved views once.
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(SAVED_VIEWS_KEY) : null;
      if (raw) setSavedViews(JSON.parse(raw) as SavedView[]);
    } catch { /* ignore parse errors */ }
  }, []);

  // Apply filters from URL query params on mount (dashboard deep-links).
  useEffect(() => {
    const next: Partial<AdvancedFilters> = {};
    let touched = false;
    let statusTouched: ProductStatus | 'all' | null = null;
    if (searchParams.get('missingImage') === '1')       { next.missingImage = true; touched = true; }
    if (searchParams.get('missingDescription') === '1') { next.missingDescription = true; touched = true; }
    if (searchParams.get('missingSeo') === '1')         { next.missingSeo = true; touched = true; }
    if (searchParams.get('featured') === 'yes')         { next.featured = 'yes'; touched = true; }
    if (searchParams.get('featured') === 'no')          { next.featured = 'no'; touched = true; }
    const statusQ = searchParams.get('status');
    if (statusQ && ['active', 'draft', 'archived'].includes(statusQ)) {
      statusTouched = statusQ as ProductStatus;
    }
    if (touched) {
      setAdvanced(a => ({ ...a, ...next }));
      setShowAdvanced(true);
    }
    if (statusTouched) setStatusFilter(statusTouched);
  }, [searchParams]);

  const persistViews = (views: SavedView[]) => {
    setSavedViews(views);
    try { localStorage.setItem(SAVED_VIEWS_KEY, JSON.stringify(views)); } catch {}
  };

  const saveCurrentAsView = () => {
    const name = window.prompt('Name this view', 'My filter');
    if (!name) return;
    const view: SavedView = {
      id: `view-${Date.now()}`,
      name,
      search, statusFilter, categoryFilter, advanced,
    };
    persistViews([view, ...savedViews].slice(0, 10));
    setActiveViewId(view.id);
  };

  const applyView = (v: SavedView) => {
    setSearch(v.search);
    setStatusFilter(v.statusFilter);
    setCategoryFilter(v.categoryFilter);
    setAdvanced(v.advanced);
    setActiveViewId(v.id);
    setPage(1);
  };

  const deleteView = (id: string) => {
    persistViews(savedViews.filter(v => v.id !== id));
    if (activeViewId === id) setActiveViewId(null);
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setAdvanced(DEFAULT_ADVANCED);
    setActiveViewId(null);
    setPage(1);
  };

  const advancedActiveCount =
    (advanced.featured !== 'all' ? 1 : 0) +
    (advanced.missingImage ? 1 : 0) +
    (advanced.missingDescription ? 1 : 0) +
    (advanced.missingSeo ? 1 : 0) +
    (advanced.createdAfter ? 1 : 0);

  const handleSearch = (val: string) => { setSearch(val); setPage(1); };

  const refresh = useCallback(async () => {
    try {
      const data = await getProducts();
      setProducts(data);
      setSelected(new Set());
    } catch (err) {
      console.error('[AdminProducts] Failed to load:', (err as Error).message);
    }
  }, []);

  useEffect(() => {
    refresh();
    getCategories().then(cats => setCategoryNames(cats.map(c => c.name))).catch(() => {});
  }, [refresh]);

  // ── Filtering & sorting ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = products.filter(p => !hiddenIds.has(p.id));

    if (deferredSearch) {
      const q = deferredSearch.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'all')   list = list.filter(p => p.status === statusFilter);
    if (categoryFilter !== 'all') list = list.filter(p => p.category === categoryFilter);

    if (advanced.featured === 'yes') list = list.filter(p => p.featured);
    else if (advanced.featured === 'no') list = list.filter(p => !p.featured);
    if (advanced.missingImage) list = list.filter(p => !p.images || p.images.length === 0);
    if (advanced.missingDescription) list = list.filter(p => !p.description?.trim());
    if (advanced.missingSeo) list = list.filter(p => !p.seoTitle?.trim() || !p.seoDescription?.trim());
    if (advanced.createdAfter) {
      const cutoff = new Date(advanced.createdAfter).getTime();
      list = list.filter(p => new Date(p.createdAt).getTime() >= cutoff);
    }

    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name')      cmp = a.name.localeCompare(b.name);
      if (sortField === 'category')  cmp = a.category.localeCompare(b.category);
      if (sortField === 'status')    cmp = a.status.localeCompare(b.status);
      if (sortField === 'createdAt') cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [products, hiddenIds, deferredSearch, statusFilter, categoryFilter, advanced, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ── Selection ────────────────────────────────────────────────────────────
  const allPageSelected = paginated.length > 0 && paginated.every(p => selected.has(p.id));
  const someSelected    = selected.size > 0;

  const toggleSelectAll = () => {
    if (allPageSelected) {
      setSelected(prev => { const s = new Set(prev); paginated.forEach(p => s.delete(p.id)); return s; });
    } else {
      setSelected(prev => { const s = new Set(prev); paginated.forEach(p => s.add(p.id)); return s; });
    }
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  // ── Sort toggling ─────────────────────────────────────────────────────────
  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown className="w-3 h-3 text-black/20" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-[#D4AF37]" />
      : <ChevronDown className="w-3 h-3 text-[#D4AF37]" />;
  };

  // ── Pending deletes (optimistic undo) ─────────────────────────────────────
  const pendingDeletes = useRef<Record<string, { product: Product; timer: ReturnType<typeof setTimeout> }>>({});

  useEffect(() => () => {
    Object.values(pendingDeletes.current).forEach(p => clearTimeout(p.timer));
  }, []);

  const scheduleDelete = useCallback((items: Product[]) => {
    if (!items.length) return;
    const ids = items.map(p => p.id);
    setHiddenIds(prev => { const s = new Set(prev); ids.forEach(i => s.add(i)); return s; });
    setSelected(new Set());

    const timer = setTimeout(async () => {
      ids.forEach(id => { delete pendingDeletes.current[id]; });
      try {
        if (ids.length === 1) await deleteProduct(ids[0]);
        else await deleteProductsBulk(ids);
      } catch {
        toast('Delete failed. Reloading.', 'error');
      }
      refresh();
    }, 6500);

    items.forEach(p => { pendingDeletes.current[p.id] = { product: p, timer }; });

    const label = items.length === 1 ? `"${items[0].name}" deleted.` : `${items.length} products deleted.`;
    toast(label, {
      variant: 'success',
      duration: 6500,
      action: {
        label: 'Undo',
        onClick: () => {
          clearTimeout(timer);
          ids.forEach(id => { delete pendingDeletes.current[id]; });
          setHiddenIds(prev => { const s = new Set(prev); ids.forEach(i => s.delete(i)); return s; });
        },
      },
    });
  }, [refresh, toast]);

  // ── Bulk actions ──────────────────────────────────────────────────────────
  const applyBulkAction = async () => {
    const ids = [...selected];
    if (!ids.length) return;

    if (bulkAction === 'delete') {
      // For larger bulk deletes keep the confirm as a safety rail.
      if (ids.length > 5) {
        const ok = await confirm({
          title: 'Delete products?',
          message: `This will delete ${ids.length} products.`,
          confirmLabel: `Delete ${ids.length}`,
          variant: 'danger',
        });
        if (!ok) return;
      }
      const toDelete = products.filter(p => ids.includes(p.id));
      scheduleDelete(toDelete);
      return;
    }

    if (bulkAction.startsWith('status:')) {
      const status = bulkAction.replace('status:', '') as ProductStatus;
      updateProductsBulkStatus(ids, status);
      toast(`Updated ${ids.length} product${ids.length > 1 ? 's' : ''} to "${status}".`, 'success');
      refresh();
      return;
    }

    if (bulkAction.startsWith('cat:')) {
      const cat = bulkAction.replace('cat:', '');
      updateProductsBulkCategory(ids, cat);
      toast(`Assigned category "${cat}" to ${ids.length} product${ids.length > 1 ? 's' : ''}.`, 'success');
      refresh();
      return;
    }
  };

  // ── Single actions ────────────────────────────────────────────────────────
  const handleDuplicate = (id: string, name: string) => {
    duplicateProduct(id);
    toast(`"${name}" duplicated as draft.`, 'success');
    refresh();
  };

  const handleDelete = (id: string) => {
    const p = products.find(x => x.id === id);
    if (p) scheduleDelete([p]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] text-black/90 font-medium tracking-wide"
            style={{ fontFamily: 'var(--font-accent)' }}>
            Products
          </h1>
          <p className="text-[11px] tracking-[0.15em] uppercase mt-1" style={{ color: 'var(--a-muted)' }}>
            {filtered.length} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/bulk"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-black/90 hover:bg-[#D4AF37]/20 text-sm transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Bulk Add
          </Link>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#FFD700] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/55" />
          <input
            type="text"
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-black/[0.03] border rounded-xl pl-9 pr-4 py-2.5 text-black/85 text-sm placeholder:text-black/22 outline-none focus:border-[rgba(212,175,55,0.3)] transition-colors [border-color:var(--a-border)]"
          />
        </div>

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
          className="bg-black/[0.03] border rounded-xl px-3 py-2.5 text-black/95 text-sm outline-none focus:border-[rgba(212,175,55,0.3)] transition-colors [border-color:var(--a-border)]"
        >
          <option value="all">All Categories</option>
          {categoryNames.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value as ProductStatus | 'all'); setPage(1); }}
          className="bg-black/[0.03] border rounded-xl px-3 py-2.5 text-black/95 text-sm outline-none focus:border-[rgba(212,175,55,0.3)] transition-colors [border-color:var(--a-border)]"
        >
          {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* Advanced filters toggle */}
        <button
          onClick={() => setShowAdvanced(s => !s)}
          className={`relative flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-colors ${
            showAdvanced || advancedActiveCount > 0
              ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40 text-black'
              : 'border-black/[0.08] text-black/70 hover:text-black'
          }`}
          title="Advanced filters"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {advancedActiveCount > 0 && (
            <span className="ml-1 text-[10px] font-semibold bg-[#D4AF37] text-black rounded-full px-1.5 py-0.5 leading-none">
              {advancedActiveCount}
            </span>
          )}
        </button>

        {/* View toggle */}
        <div className="flex rounded-xl border shadow-sm border-black/[0.08] overflow-hidden">
          <button
            onClick={() => setView('table')}
            className={`px-3 py-2.5 transition-colors ${view === 'table' ? 'bg-black/[0.08] text-black' : 'text-black/55 hover:text-black/95'}`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('grid')}
            className={`px-3 py-2.5 transition-colors ${view === 'grid' ? 'bg-black/[0.08] text-black' : 'text-black/55 hover:text-black/95'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Saved views strip */}
      <div className="flex flex-wrap items-center gap-2">
        {savedViews.map(v => (
          <div key={v.id} className={`flex items-center gap-1 rounded-full border text-xs transition-colors ${
            activeViewId === v.id
              ? 'bg-[#D4AF37]/15 border-[#D4AF37]/40 text-black'
              : 'border-black/[0.08] text-black/70 hover:text-black'
          }`}>
            <button onClick={() => applyView(v)} className="pl-3 py-1 flex items-center gap-1.5">
              <Bookmark className="w-3 h-3" />
              {v.name}
            </button>
            <button onClick={() => deleteView(v.id)} title="Delete view" className="pr-2 pl-0.5 py-1 text-black/40 hover:text-red-500">
              <XIcon className="w-2.5 h-2.5" />
            </button>
          </div>
        ))}
        <button
          onClick={saveCurrentAsView}
          className="text-xs text-black/55 hover:text-black border border-dashed border-black/15 rounded-full px-3 py-1 hover:border-[#D4AF37]/40"
          title="Save current filter combination"
        >
          + Save view
        </button>
        {(advancedActiveCount > 0 || statusFilter !== 'all' || categoryFilter !== 'all' || search) && (
          <button onClick={resetFilters} className="text-xs text-black/55 hover:text-black underline">
            Reset
          </button>
        )}
      </div>

      {/* Advanced filter panel */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="rounded-xl border p-4 grid grid-cols-2 md:grid-cols-5 gap-4"
            style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
          >
            <div className="space-y-1">
              <label className="block text-[10px] tracking-[0.18em] uppercase text-black/55">Featured</label>
              <select
                value={advanced.featured}
                onChange={e => { setAdvanced(a => ({ ...a, featured: e.target.value as AdvancedFilters['featured'] })); setActiveViewId(null); setPage(1); }}
                className="w-full bg-black/[0.03] border rounded-lg px-2 py-1.5 text-sm outline-none [border-color:var(--a-border)]"
              >
                <option value="all">All</option>
                <option value="yes">Featured only</option>
                <option value="no">Not featured</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] tracking-[0.18em] uppercase text-black/55">Created after</label>
              <input
                type="date"
                value={advanced.createdAfter}
                onChange={e => { setAdvanced(a => ({ ...a, createdAfter: e.target.value })); setActiveViewId(null); setPage(1); }}
                className="w-full bg-black/[0.03] border rounded-lg px-2 py-1.5 text-sm outline-none [border-color:var(--a-border)]"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-black/80 cursor-pointer">
              <input
                type="checkbox"
                checked={advanced.missingImage}
                onChange={e => { setAdvanced(a => ({ ...a, missingImage: e.target.checked })); setActiveViewId(null); setPage(1); }}
                className="accent-[#D4AF37]"
              />
              Missing images
            </label>
            <label className="flex items-center gap-2 text-sm text-black/80 cursor-pointer">
              <input
                type="checkbox"
                checked={advanced.missingDescription}
                onChange={e => { setAdvanced(a => ({ ...a, missingDescription: e.target.checked })); setActiveViewId(null); setPage(1); }}
                className="accent-[#D4AF37]"
              />
              Missing description
            </label>
            <label className="flex items-center gap-2 text-sm text-black/80 cursor-pointer">
              <input
                type="checkbox"
                checked={advanced.missingSeo}
                onChange={e => { setAdvanced(a => ({ ...a, missingSeo: e.target.checked })); setActiveViewId(null); setPage(1); }}
                className="accent-[#D4AF37]"
              />
              Missing SEO fields
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk action bar */}
      <AnimatePresence>
        {someSelected && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-wrap items-center gap-3 px-4 py-3 bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.2)] rounded-xl"
          >
            <span className="text-[#D4AF37] text-sm font-medium">
              {selected.size} selected
            </span>
            <div className="flex-1 flex flex-wrap gap-2">
              <select
                value={bulkAction}
                onChange={e => setBulkAction(e.target.value)}
                className="bg-black/[0.06] border border-black/[0.1] rounded-lg px-3 py-1.5 text-black/90 text-sm outline-none"
              >
                <option value="">Choose action…</option>
                <optgroup label="Status">
                  <option value="status:active">Set Active</option>
                  <option value="status:draft">Set Draft</option>
                  <option value="status:archived">Set Archived</option>
                </optgroup>
                <optgroup label="Category">
                  {categoryNames.map(c => (
                    <option key={c} value={`cat:${c}`}>Category: {c}</option>
                  ))}
                </optgroup>
                <optgroup label="Destructive">
                  <option value="delete">Delete selected</option>
                </optgroup>
              </select>
              <button
                onClick={applyBulkAction}
                disabled={!bulkAction}
                className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-sm font-medium disabled:opacity-40 hover:bg-[#FFD700] transition-colors"
              >
                Apply
              </button>
              <button
                onClick={() => setBulkDrawerOpen(true)}
                className="px-3 py-1.5 rounded-lg border border-black/[0.1] text-black/90 hover:text-black text-sm transition-colors"
                title="Edit tags, featured, carat, description for all selected"
              >
                More edits…
              </button>
            </div>
            <button
              onClick={() => setSelected(new Set())}
              className="text-black/95 hover:text-black text-sm transition-colors"
            >
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table view */}
      {view === 'table' && (
        <div className="rounded-2xl overflow-hidden border shadow-sm" style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b text-black/35 text-[10px] uppercase tracking-[0.12em]" style={{ borderColor: 'var(--a-border)' }}>
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={allPageSelected}
                      onChange={toggleSelectAll}
                      className="accent-[#D4AF37] w-4 h-4"
                    />
                  </th>
                  <th className="px-4 py-3 font-medium">
                    <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-black transition-colors">
                      Product <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium">
                    <button onClick={() => handleSort('category')} className="flex items-center gap-1 hover:text-black transition-colors">
                      Category <SortIcon field="category" />
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium">Carat</th>
                  <th className="px-4 py-3 font-medium">
                    <button onClick={() => handleSort('status')} className="flex items-center gap-1 hover:text-black transition-colors">
                      Status <SortIcon field="status" />
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium">
                    <button onClick={() => handleSort('createdAt')} className="flex items-center gap-1 hover:text-black transition-colors">
                      Added <SortIcon field="createdAt" />
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {!productsLoaded && paginated.length === 0 ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={`skel-${i}`} className="border-b border-black/[0.03] animate-pulse">
                        <td className="px-4 py-3"><div className="w-4 h-4 rounded bg-black/[0.06]" /></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-black/[0.06]" />
                            <div className="h-3 w-40 bg-black/[0.06] rounded" />
                          </div>
                        </td>
                        <td className="px-4 py-3"><div className="h-3 w-20 bg-black/[0.06] rounded" /></td>
                        <td className="px-4 py-3"><div className="h-3 w-10 bg-black/[0.06] rounded" /></td>
                        <td className="px-4 py-3"><div className="h-4 w-14 bg-black/[0.06] rounded-full" /></td>
                        <td className="px-4 py-3"><div className="h-3 w-16 bg-black/[0.06] rounded" /></td>
                        <td className="px-4 py-3"><div className="h-3 w-16 bg-black/[0.06] rounded ml-auto" /></td>
                      </tr>
                    ))
                  ) : paginated.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-16 text-center text-black/55">
                        {search || statusFilter !== 'all' || categoryFilter !== 'all'
                          ? 'No products match your filters.'
                          : 'No products yet.'}
                      </td>
                    </tr>
                  ) : (
                    paginated.map(p => (
                      <motion.tr
                        key={p.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`border-b border-black/[0.03] hover:bg-black/5 transition-colors ${
                          selected.has(p.id) ? 'bg-[rgba(212,175,55,0.04)]' : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selected.has(p.id)}
                            onChange={() => toggleSelect(p.id)}
                            className="accent-[#D4AF37] w-4 h-4"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 group">
                            <div className="w-9 h-9 rounded-lg bg-black/5 border border-black/10 overflow-hidden shrink-0">
                              {p.images?.[0]
                                ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                                : <Package className="w-4 h-4 text-black/20 m-auto mt-2.5" />
                              }
                            </div>
                            <div className="min-w-0">
                              <p className="text-black/95 group-hover:text-black transition-colors truncate font-medium">{p.name}</p>
                              {p.featured && (
                                <span className="text-[#D4AF37] text-[9px] uppercase tracking-wider">Featured</span>
                              )}
                            </div>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-black/90">{p.category}</td>
                        <td className="px-4 py-3 text-black/90">{p.carat}K</td>
                        <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                        <td className="px-4 py-3 text-black/55 text-xs">{p.createdAt}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/admin/products/${p.id}`}
                              className="p-1.5 rounded-lg text-black/95 hover:text-black hover:bg-black/[0.08] transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => handleDuplicate(p.id, p.name)}
                              className="p-1.5 rounded-lg text-black/95 hover:text-[#D4AF37] hover:bg-[rgba(212,175,55,0.08)] transition-colors"
                              title="Duplicate"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="p-1.5 rounded-lg text-black/95 hover:text-red-400 hover:bg-red-400/[0.08] transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid view */}
      {view === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <AnimatePresence mode="popLayout">
            {paginated.length === 0 ? (
              <motion.div className="col-span-full py-16 text-center text-black/55">
                No products match your filters.
              </motion.div>
            ) : (
              paginated.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03 }}
                  className={`relative group rounded-xl overflow-hidden transition-colors border ${
                    selected.has(p.id) ? 'border-[#D4AF37]/40' : 'hover:border-black/[0.1]'
                  }`}
                  style={selected.has(p.id) ? { background: 'var(--a-elevated)' } : { background: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
                >
                  {/* Checkbox overlay */}
                  <div
                    className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => toggleSelect(p.id)}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${
                      selected.has(p.id)
                        ? 'bg-[#D4AF37] border-[#D4AF37]'
                        : 'bg-black/50 border-black/30'
                    }`}>
                      {selected.has(p.id) && <Check className="w-3 h-3 text-black" />}
                    </div>
                  </div>

                  {/* Image */}
                  <div className="aspect-square bg-black/[0.03] overflow-hidden">
                    {p.images?.[0]
                      ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-black/10" />
                        </div>
                      )
                    }
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-black/95 text-xs font-medium truncate">{p.name}</p>
                    <p className="text-black/55 text-[10px] mt-0.5">{p.category}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <StatusBadge status={p.status} />
                      <div className="flex gap-1">
                        <Link href={`/admin/products/${p.id}`} className="p-1 text-black/55 hover:text-black transition-colors">
                          <Edit2 className="w-3 h-3" />
                        </Link>
                        <button onClick={() => handleDelete(p.id)} className="p-1 text-black/55 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Bulk edit drawer */}
      <AdminBulkEditDrawer
        open={bulkDrawerOpen}
        count={selected.size}
        ids={[...selected]}
        onClose={() => setBulkDrawerOpen(false)}
        onApplied={refresh}
        toast={toast}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg text-sm text-black/90 border border-black/[0.08] hover:text-black hover:border-black/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-9 h-9 rounded-lg text-sm transition-colors ${
                n === page
                  ? 'bg-[#D4AF37] text-black font-medium'
                  : 'text-black/90 border border-black/[0.08] hover:text-black hover:border-black/20'
              }`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg text-sm text-black/90 border border-black/[0.08] hover:text-black hover:border-black/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
