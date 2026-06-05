'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, X, Tag, ChevronUp, ChevronDown, Package } from 'lucide-react';
import { getCategories, addCategory, updateCategory, deleteCategory, reorderCategories } from '@/lib/firebase';
import { getProducts } from '@/lib/firebase';
import type { CategoryItem } from '@/lib/data';
import { useAdmin } from '@/components/admin/AdminContext';
import { slugify } from '@/lib/utils';

type EditState = Partial<Omit<CategoryItem, 'id' | 'createdAt' | 'order'>>;

export default function AdminCategoriesPage() {
  const { toast, confirm } = useAdmin();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditState>({});
  const [newForm, setNewForm] = useState<EditState>({ name: '', slug: '', description: '' });
  const [showNew, setShowNew] = useState(false);

  const refresh = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
      const products = await getProducts();
      const counts: Record<string, number> = {};
      cats.forEach(c => {
        counts[c.id] = products.filter(p => p.category === c.name).length;
      });
      setProductCounts(counts);
    } catch (err) {
      console.error('[AdminCategories] Failed to load:', (err as Error).message);
    }
  };

  useEffect(() => { refresh(); }, []);

  // ── New category ──────────────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!newForm.name?.trim()) { toast('Category name is required.', 'error'); return; }
    try {
      await addCategory({
        name: newForm.name.trim(),
        slug: newForm.slug?.trim() || slugify(newForm.name.trim()),
        description: newForm.description?.trim(),
      });
      toast(`Category "${newForm.name}" created.`, 'success');
      setNewForm({ name: '', slug: '', description: '' });
      setShowNew(false);
      await refresh();
    } catch (err) {
      console.error('Failed to add category:', err);
      toast(`Failed to create category: ${(err as Error).message}`, 'error');
    }
  };

  // ── Inline edit ───────────────────────────────────────────────────────────
  const startEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setEditForm({ name: cat.name, slug: cat.slug, description: cat.description });
  };

  const saveEdit = async () => {
    if (!editingId || !editForm.name?.trim()) { toast('Name required.', 'error'); return; }
    try {
      await updateCategory(editingId, {
        name: editForm.name.trim(),
        slug: editForm.slug?.trim() || slugify(editForm.name.trim()),
        description: editForm.description?.trim(),
      });
      toast('Category updated.', 'success');
      setEditingId(null);
      await refresh();
    } catch (err) {
      console.error('Failed to update category:', err);
      toast(`Failed to update: ${(err as Error).message}`, 'error');
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (cat: CategoryItem) => {
    const count = productCounts[cat.id] ?? 0;
    const ok = await confirm({
      title: 'Delete category?',
      message: count > 0
        ? `"${cat.name}" has ${count} product${count > 1 ? 's' : ''}. Products will not be deleted but will have no category. Continue?`
        : `"${cat.name}" will be permanently deleted.`,
      confirmLabel: 'Delete',
      variant: 'danger',
    });
    if (!ok) return;
    try {
      await deleteCategory(cat.id);
      toast(`"${cat.name}" deleted.`, 'success');
      await refresh();
    } catch (err) {
      console.error('Failed to delete category:', err);
      toast(`Failed to delete: ${(err as Error).message}`, 'error');
    }
  };

  // ── Reorder ───────────────────────────────────────────────────────────────
  const moveCategory = (index: number, dir: 'up' | 'down') => {
    const swap = dir === 'up' ? index - 1 : index + 1;
    if (swap < 0 || swap >= categories.length) return;
    const copy = [...categories];
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
    reorderCategories(copy.map(c => c.id));
    setCategories(copy.map((c, i) => ({ ...c, order: i + 1 })));
  };

  const inputCls = `
    bg-black/[0.03] border rounded-lg px-3 py-2 text-black/85 text-sm
    placeholder:text-black/18 outline-none focus:border-[rgba(212,175,55,0.3)] transition-colors w-full
    [border-color:var(--a-border)]
  `;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] text-black/90 font-medium tracking-wide"
            style={{ fontFamily: 'var(--font-accent)' }}>
            Categories
          </h1>
          <p className="text-[11px] tracking-[0.15em] uppercase mt-1" style={{ color: 'var(--a-muted)' }}>
            {categories.length} total
          </p>
        </div>
        <button
          onClick={() => setShowNew(v => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#FFD700] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Category
        </button>
      </div>

      {/* New category form */}
      <AnimatePresence>
        {showNew && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl p-5 space-y-4 border border-[rgba(212,175,55,0.12)]" style={{ background: 'var(--a-surface)' }}>
              <h3 className="text-[#D4AF37] text-sm font-medium">New Category</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-black/95 text-xs mb-1 uppercase tracking-wider">Name *</label>
                  <input
                    type="text"
                    value={newForm.name ?? ''}
                    onChange={e => {
                      const name = e.target.value;
                      setNewForm(f => ({ ...f, name, slug: slugify(name) }));
                    }}
                    placeholder="e.g. Anklets"
                    className={inputCls}
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-black/95 text-xs mb-1 uppercase tracking-wider">Slug</label>
                  <input
                    type="text"
                    value={newForm.slug ?? ''}
                    onChange={e => setNewForm(f => ({ ...f, slug: e.target.value }))}
                    placeholder="auto-generated"
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className="block text-black/95 text-xs mb-1 uppercase tracking-wider">Description</label>
                <input
                  type="text"
                  value={newForm.description ?? ''}
                  onChange={e => setNewForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Optional short description"
                  className={inputCls}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!newForm.name?.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#FFD700] disabled:opacity-40 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowNew(false)}
                  className="px-4 py-2 rounded-xl border shadow-sm border-black/[0.1] text-black/90 text-sm hover:text-black transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category list */}
      <div className="rounded-2xl overflow-hidden border shadow-sm" style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' }}>
        {categories.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Tag className="w-8 h-8 text-black/10 mx-auto mb-3" />
            <p className="text-black/55 text-sm">No categories yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-black/[0.04]">
            <AnimatePresence mode="popLayout">
              {categories.map((cat, idx) => (
                <motion.div
                  key={cat.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {editingId === cat.id ? (
                    /* Inline edit row */
                    <div className="p-4 space-y-3 bg-[rgba(212,175,55,0.03)]">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-black/55 text-[10px] mb-1 uppercase tracking-wider">Name</label>
                          <input
                            type="text"
                            value={editForm.name ?? ''}
                            onChange={e => {
                              const name = e.target.value;
                              setEditForm(f => ({ ...f, name, slug: slugify(name) }));
                            }}
                            className={inputCls}
                            autoFocus
                          />
                        </div>
                        <div>
                          <label className="block text-black/55 text-[10px] mb-1 uppercase tracking-wider">Slug</label>
                          <input
                            type="text"
                            value={editForm.slug ?? ''}
                            onChange={e => setEditForm(f => ({ ...f, slug: e.target.value }))}
                            className={inputCls}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-black/55 text-[10px] mb-1 uppercase tracking-wider">Description</label>
                        <input
                          type="text"
                          value={editForm.description ?? ''}
                          onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                          placeholder="Optional"
                          className={inputCls}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={saveEdit}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-semibold hover:bg-[#FFD700] transition-colors"
                        >
                          <Save className="w-3 h-3" /> Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 rounded-lg border border-black/[0.1] text-black/95 text-xs hover:text-black transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Normal row */
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-black/5 transition-colors group">
                      {/* Reorder */}
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button
                          onClick={() => moveCategory(idx, 'up')}
                          disabled={idx === 0}
                          className="text-black/20 hover:text-black/90 disabled:opacity-20 transition-colors"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveCategory(idx, 'down')}
                          disabled={idx === categories.length - 1}
                          className="text-black/20 hover:text-black/90 disabled:opacity-20 transition-colors"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Icon */}
                      <div className="w-8 h-8 rounded-lg bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.1)] flex items-center justify-center shrink-0">
                        <Tag className="w-3.5 h-3.5 text-[#D4AF37]/60" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-black/95 text-sm font-medium">{cat.name}</p>
                        <p className="text-black/55 text-xs font-mono">/{cat.slug}</p>
                        {cat.description && (
                          <p className="text-black/55 text-xs mt-0.5 truncate">{cat.description}</p>
                        )}
                      </div>

                      {/* Product count */}
                      <div className="flex items-center gap-1 text-black/55 text-xs shrink-0">
                        <Package className="w-3 h-3" />
                        {productCounts[cat.id] ?? 0}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          onClick={() => startEdit(cat)}
                          className="p-1.5 rounded-lg text-black/55 hover:text-black hover:bg-black/[0.08] transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          className="p-1.5 rounded-lg text-black/55 hover:text-red-400 hover:bg-red-400/[0.08] transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
