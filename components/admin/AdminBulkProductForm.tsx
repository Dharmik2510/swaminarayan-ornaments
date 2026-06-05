'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, Plus, Sparkles, Trash2, Upload, X } from 'lucide-react';
import { useAdmin } from './AdminContext';
import { addProduct, getCategories } from '@/lib/firebase';
import { compressImageToBlob, uploadImageToStorage } from '@/lib/firebase-upload';
import type { Product, ProductStatus } from '@/lib/data';

const MAX_PRODUCTS = 10;
const MAX_IMAGES_PER_PRODUCT = 4;
const AI_CONCURRENCY = 3;

type Draft = {
  id: string;
  images: string[];
  name: string;
  description: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  aiStatus: 'idle' | 'loading' | 'done' | 'error';
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
};

const emptyDraft = (): Draft => ({
  id: crypto.randomUUID(),
  images: [],
  name: '',
  description: '',
  tags: [],
  seoTitle: '',
  seoDescription: '',
  aiStatus: 'idle',
  saveStatus: 'idle',
});

const inputCls =
  'w-full bg-black/[0.03] border rounded-xl px-3 py-2 text-black/85 text-sm placeholder:text-black/25 outline-none focus:border-[rgba(212,175,55,0.3)] transition-colors [border-color:var(--a-border)]';

async function runPool<T, R>(items: T[], limit: number, worker: (item: T) => Promise<R>) {
  const results: R[] = [];
  let i = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await worker(items[idx]);
    }
  });
  await Promise.all(runners);
  return results;
}

export default function AdminBulkProductForm() {
  const router = useRouter();
  const { toast } = useAdmin();

  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [carat, setCarat] = useState<92 | 84>(92);
  const [status, setStatus] = useState<ProductStatus>('active');
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [aiRunning, setAiRunning] = useState(false);
  const [aiProgress, setAiProgress] = useState<{ done: number; total: number } | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [draggingOver, setDraggingOver] = useState(false);
  const [summary, setSummary] = useState<{ ok: number; failed: string[] } | null>(null);

  useEffect(() => {
    getCategories().then(cats => {
      const names = cats.map(c => c.name);
      setCategoryNames(names);
      if (names.length > 0) setCategory(names[0]);
    });
  }, []);

  const update = (id: string, patch: Partial<Draft>) =>
    setDrafts(prev => prev.map(d => (d.id === id ? { ...d, ...patch } : d)));

  const bulkUploadAsProducts = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const room = MAX_PRODUCTS - drafts.length;
    if (room <= 0) {
      toast(`Batch limit reached (${MAX_PRODUCTS} products).`, 'error');
      return;
    }
    const images = Array.from(files).filter(f => f.type.startsWith('image/'));
    const toProcess = images.slice(0, room);
    const skipped = images.length - toProcess.length;

    setBulkUploading(true);
    const newDrafts: Draft[] = [];
    for (const file of toProcess) {
      try {
        const blob = await compressImageToBlob(file);
        const url = await uploadImageToStorage(blob, file.name);
        newDrafts.push({ ...emptyDraft(), images: [url] });
      } catch (err) {
        console.error('Upload failed', err);
      }
    }
    setDrafts(prev => [...prev, ...newDrafts]);
    setBulkUploading(false);
    if (skipped > 0) {
      toast(`Added ${newDrafts.length}. Skipped ${skipped} — batch limit is ${MAX_PRODUCTS}.`, 'success');
    }
  };

  const addSlot = () => {
    if (drafts.length >= MAX_PRODUCTS) return;
    setDrafts(prev => [...prev, emptyDraft()]);
  };

  const removeSlot = (id: string) =>
    setDrafts(prev => (prev.length === 1 ? prev : prev.filter(d => d.id !== id)));

  const uploadFiles = async (id: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const draft = drafts.find(d => d.id === id);
    if (!draft) return;
    const room = MAX_IMAGES_PER_PRODUCT - draft.images.length;
    const toUpload = Array.from(files).slice(0, room).filter(f => f.type.startsWith('image/'));
    if (toUpload.length === 0) return;

    const urls: string[] = [];
    for (const file of toUpload) {
      try {
        const blob = await compressImageToBlob(file);
        urls.push(await uploadImageToStorage(blob, file.name));
      } catch (err) {
        console.error('Upload failed', err);
      }
    }
    setDrafts(prev =>
      prev.map(d => (d.id === id ? { ...d, images: [...d.images, ...urls] } : d)),
    );
  };

  const removeImage = (id: string, idx: number) => {
    setDrafts(prev =>
      prev.map(d => (d.id === id ? { ...d, images: d.images.filter((_, i) => i !== idx) } : d)),
    );
  };

  const generateOne = async (draft: Draft) => {
    if (!draft.images[0]) return;
    update(draft.id, { aiStatus: 'loading' });
    try {
      const res = await fetch('/api/ai/generate-product', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          imageUrl: draft.images[0],
          categories: category ? [category] : categoryNames,
          carat,
        }),
      });
      if (!res.ok) throw new Error('AI failed');
      const g = await res.json();
      update(draft.id, {
        aiStatus: 'done',
        name: draft.name || g.name || '',
        description: draft.description || g.description || '',
        tags: draft.tags.length ? draft.tags : g.tags ?? [],
        seoTitle: draft.seoTitle || g.seoTitle || '',
        seoDescription: draft.seoDescription || g.seoDescription || '',
      });
    } catch {
      update(draft.id, { aiStatus: 'error' });
    }
  };

  const generateAll = async () => {
    const targets = drafts.filter(d => d.images[0] && d.aiStatus !== 'loading');
    if (targets.length === 0) {
      toast('Upload at least one image first.', 'error');
      return;
    }
    setAiRunning(true);
    setAiProgress({ done: 0, total: targets.length });
    let done = 0;
    await runPool(targets, AI_CONCURRENCY, async (d) => {
      await generateOne(d);
      done += 1;
      setAiProgress({ done, total: targets.length });
    });
    setAiRunning(false);
    setTimeout(() => setAiProgress(null), 1500);
    toast('AI drafts ready. Review before publishing.', 'success');
  };

  const publishAll = async () => {
    const ready = drafts.filter(d => d.images.length > 0);
    if (ready.length === 0) {
      toast('Add at least one image to a product before publishing.', 'error');
      return;
    }
    if (!category) {
      toast('Select a category.', 'error');
      return;
    }
    setPublishing(true);
    let ok = 0;
    const failed: string[] = [];
    for (let i = 0; i < ready.length; i++) {
      const d = ready[i];
      update(d.id, { saveStatus: 'saving' });
      const fallbackName = `${category} #${Date.now().toString(36).slice(-4)}-${i + 1}`;
      const finalName = d.name.trim() || fallbackName;
      try {
        await addProduct({
          name: finalName,
          description: d.description.trim() || '',
          carat,
          category,
          tags: d.tags,
          images: d.images,
          featured: false,
          status,
          seoTitle: d.seoTitle,
          seoDescription: d.seoDescription,
        } as Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'order'>);
        update(d.id, { saveStatus: 'saved' });
        ok++;
      } catch {
        update(d.id, { saveStatus: 'error' });
        failed.push(finalName);
      }
    }
    setPublishing(false);
    setSummary({ ok, failed });
  };

  const readyCount = drafts.filter(d => d.images.length > 0).length;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="p-2 rounded-xl border shadow-sm border-black/[0.08] text-black/95 hover:border-black/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-[26px] text-black/90 font-medium tracking-wide" style={{ fontFamily: 'var(--font-accent)' }}>
              Bulk Add Products
            </h1>
            <p className="text-[11px] tracking-[0.15em] uppercase mt-1" style={{ color: 'var(--a-muted)' }}>
              {drafts.length} / {MAX_PRODUCTS} slots · {readyCount} ready
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={generateAll}
            disabled={aiRunning || publishing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-black/90 hover:bg-[#D4AF37]/20 text-sm disabled:opacity-50 transition-colors"
          >
            {aiRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {aiRunning ? 'Generating…' : 'Generate all with AI'}
          </button>
          <button
            type="button"
            onClick={publishAll}
            disabled={publishing || readyCount === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#FFD700] disabled:opacity-50 transition-colors"
          >
            {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Publish {readyCount > 0 ? `(${readyCount})` : ''}
          </button>
        </div>
      </div>

      {/* AI progress */}
      <AnimatePresence>
        {aiProgress && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border px-4 py-3 flex items-center gap-3"
            style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <div className="flex-1">
              <div className="flex items-center justify-between text-[11px] text-black/60 mb-1.5">
                <span>Generating AI drafts</span>
                <span className="tabular-nums">{aiProgress.done} / {aiProgress.total}</span>
              </div>
              <div className="h-1.5 rounded-full bg-black/[0.06] overflow-hidden">
                <motion.div
                  className="h-full bg-[#D4AF37]"
                  animate={{ width: `${(aiProgress.done / aiProgress.total) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 140, damping: 24 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post-publish summary */}
      <AnimatePresence>
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-xl border px-4 py-3 ${
              summary.failed.length === 0
                ? 'border-emerald-500/30 bg-emerald-500/5'
                : 'border-amber-500/30 bg-amber-500/5'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm text-black/90 font-medium">
                  {summary.failed.length === 0
                    ? `Published ${summary.ok} product${summary.ok > 1 ? 's' : ''} successfully.`
                    : `Published ${summary.ok} of ${summary.ok + summary.failed.length}. ${summary.failed.length} failed.`}
                </p>
                {summary.failed.length > 0 && (
                  <ul className="mt-1.5 text-[11px] text-amber-700 list-disc pl-4 space-y-0.5">
                    {summary.failed.map(n => <li key={n}>{n}</li>)}
                  </ul>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => router.push('/admin/products')}
                  className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-medium hover:bg-[#FFD700] transition-colors"
                >
                  Go to products
                </button>
                <button
                  type="button"
                  onClick={() => setSummary(null)}
                  className="px-3 py-1.5 rounded-lg border border-black/10 text-black/70 text-xs hover:text-black transition-colors"
                >
                  Keep editing
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shared settings */}
      <div className="rounded-2xl p-5 border grid grid-cols-1 md:grid-cols-3 gap-4" style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' }}>
        <div>
          <label className="block text-[10px] tracking-[0.18em] uppercase mb-1.5" style={{ color: 'var(--a-muted)' }}>Category (applied to all)</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className={inputCls}>
            <option value="">Select category…</option>
            {categoryNames.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.18em] uppercase mb-1.5" style={{ color: 'var(--a-muted)' }}>Carat (applied to all)</label>
          <select value={carat} onChange={e => setCarat(Number(e.target.value) as 92 | 84)} className={inputCls}>
            <option value={92}>92 Carat (22K)</option>
            <option value={84}>84 Carat (18K)</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] tracking-[0.18em] uppercase mb-1.5" style={{ color: 'var(--a-muted)' }}>Publish status</label>
          <select value={status} onChange={e => setStatus(e.target.value as ProductStatus)} className={inputCls}>
            <option value="active">Active — visible in store</option>
            <option value="draft">Draft — hidden from store</option>
          </select>
        </div>
        <p className="md:col-span-3 text-xs text-black/55">
          Max {MAX_PRODUCTS} products per batch, up to {MAX_IMAGES_PER_PRODUCT} images each. AI uses the first image to draft name, description, tags &amp; SEO.
        </p>
      </div>

      {/* Master drop zone — each image becomes one product */}
      {drafts.length < MAX_PRODUCTS && (
        <div
          onDragOver={e => { e.preventDefault(); setDraggingOver(true); }}
          onDragLeave={() => setDraggingOver(false)}
          onDrop={e => { e.preventDefault(); setDraggingOver(false); bulkUploadAsProducts(e.dataTransfer.files); }}
          className={`rounded-2xl border border-dashed p-8 text-center transition-colors ${
            draggingOver || bulkUploading
              ? 'border-[#D4AF37]/50 bg-[#D4AF37]/5'
              : 'border-black/15 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/[0.03]'
          }`}
        >
          <label className="cursor-pointer flex flex-col items-center gap-2">
            <div className="w-11 h-11 rounded-xl bg-black/5 flex items-center justify-center">
              {bulkUploading ? <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" /> : <Upload className="w-5 h-5 text-black/60" />}
            </div>
            <p className="text-black/90 text-sm">
              {bulkUploading ? 'Uploading…' : 'Drop multiple images — one product per image'}
            </p>
            <p className="text-black/55 text-xs">
              Or click to select. {MAX_PRODUCTS - drafts.length} slot{MAX_PRODUCTS - drafts.length === 1 ? '' : 's'} remaining.
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={e => { bulkUploadAsProducts(e.target.files); e.target.value = ''; }}
            />
          </label>
        </div>
      )}

      {/* Product slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {drafts.map((d, idx) => (
            <motion.div
              key={d.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-2xl p-4 border space-y-3"
              style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-black/55">Product #{idx + 1}</span>
                  {d.aiStatus === 'loading' && <Loader2 className="w-3 h-3 animate-spin text-[#D4AF37]" />}
                  {d.aiStatus === 'done' && <span className="text-[10px] uppercase text-[#D4AF37]">AI draft</span>}
                  {d.aiStatus === 'error' && <span className="text-[10px] uppercase text-red-500">AI failed</span>}
                  {d.saveStatus === 'saved' && <span className="text-[10px] uppercase text-green-600">Saved</span>}
                  {d.saveStatus === 'error' && <span className="text-[10px] uppercase text-red-500">Save failed</span>}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => generateOne(d)}
                    disabled={!d.images[0] || d.aiStatus === 'loading'}
                    title="Generate AI metadata for this product"
                    className="p-1.5 rounded-lg text-black/55 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 disabled:opacity-30 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSlot(d.id)}
                    disabled={drafts.length === 0}
                    className="p-1.5 rounded-lg text-black/55 hover:text-red-500 hover:bg-red-500/10 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Images */}
              <div className="flex flex-wrap gap-2">
                {d.images.map((src, i) => (
                  <div key={src} className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 ${i === 0 ? 'border-[#D4AF37]/70' : 'border-black/10'}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(d.id, i)}
                      className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 rounded hover:bg-red-500/70 transition-colors"
                    >
                      <X className="w-2.5 h-2.5 text-white" />
                    </button>
                  </div>
                ))}
                {d.images.length < MAX_IMAGES_PER_PRODUCT && (
                  <label className="w-16 h-16 rounded-lg border border-dashed border-black/15 flex items-center justify-center cursor-pointer hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-colors">
                    <Upload className="w-4 h-4 text-black/40" />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={e => uploadFiles(d.id, e.target.files)}
                    />
                  </label>
                )}
              </div>

              <input
                type="text"
                value={d.name}
                onChange={e => update(d.id, { name: e.target.value })}
                placeholder="Product name (optional — auto-filled if blank)"
                className={inputCls}
              />
              <textarea
                rows={3}
                value={d.description}
                onChange={e => update(d.id, { description: e.target.value })}
                placeholder="Description (optional)…"
                className={`${inputCls} resize-none`}
              />
              {d.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {d.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 bg-black/5 border border-black/10 rounded-full text-[10px] text-black/75">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {drafts.length > 0 && drafts.length < MAX_PRODUCTS && (
          <button
            type="button"
            onClick={addSlot}
            className="rounded-2xl border border-dashed border-black/15 p-6 flex items-center justify-center gap-2 text-black/55 hover:text-black hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add empty slot ({drafts.length}/{MAX_PRODUCTS})
          </button>
        )}
      </div>
    </div>
  );
}
