'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Loader2, X, Sparkles, Eye, Edit3 } from 'lucide-react';
import AdminImageUpload from './AdminImageUpload';
import { useAdmin } from './AdminContext';
import { addProduct, updateProduct } from '@/lib/firebase';
import { getCategories } from '@/lib/firebase';
import type { Product, ProductStatus } from '@/lib/data';

// ─── Types ────────────────────────────────────────────────────────────────────
type FormData = {
  name: string;
  description: string;
  carat: 92 | 84;
  category: string;
  tags: string[];
  images: string[];
  featured: boolean;
  status: ProductStatus;
  seoTitle: string;
  seoDescription: string;
};

interface Props {
  product?: Product;
}

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({
  label,
  children,
  hint,
  required,
  counter,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
  counter?: { value: number; max: number; ideal?: [number, number] };
}) {
  let counterColor = 'text-black/40';
  if (counter) {
    const { value, max, ideal } = counter;
    if (value > max) counterColor = 'text-red-500';
    else if (ideal && value >= ideal[0] && value <= ideal[1]) counterColor = 'text-emerald-500';
    else if (value > max * 0.9) counterColor = 'text-amber-500';
  }
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label className="block text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--a-muted)' }}>
          {label}
          {required && <span className="ml-1 text-red-500/80">*</span>}
        </label>
        {counter && (
          <span className={`text-[10px] tabular-nums font-medium ${counterColor}`}>
            {counter.value}/{counter.max}
          </span>
        )}
      </div>
      {children}
      {hint && <p className="text-[11px] leading-relaxed text-black/50">{hint}</p>}
    </div>
  );
}

// ─── Storefront preview ──────────────────────────────────────────────────────
function StorefrontPreview({ data }: { data: FormData }) {
  const categoryEmoji: Record<string, string> = {
    'Necklaces': '📿', 'Bangles': '⭕', 'Earrings': '💎', 'Rings': '💍',
    'Chains': '🔗', 'Bracelets': '⌚', 'Pendants': '🔱', 'Mangalsutra': '📿',
  };
  const emoji = categoryEmoji[data.category] ?? '✨';
  const img = data.images[0];
  const name = data.name || 'Untitled product';
  const description = data.description || 'A placeholder description — what customers will read here.';

  return (
    <div className="rounded-2xl border p-6 md:p-10 bg-[#0a0a0a]" style={{ borderColor: 'var(--a-border)' }}>
      <div className="flex items-center justify-between mb-6">
        <p className="text-[11px] tracking-[0.22em] uppercase text-white/40">Storefront preview</p>
        <p className="text-[11px] text-white/30">Representative — real page has richer motion.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[320px,1fr] gap-6 md:gap-10 items-start">
        {/* Card mockup */}
        <div className="relative rounded-lg overflow-hidden aspect-[3/4] bg-gradient-to-br from-[#1a1400] via-[#D4AF37]/30 to-[#1a1400]">
          {img ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={img} alt={name} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-40">{emoji}</div>
          )}
          {data.featured && (
            <div className="absolute top-3 right-3 px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase font-semibold bg-[#D4AF37] text-black">
              ✦ Featured
            </div>
          )}
          <div className="absolute top-3 left-3 px-2.5 py-1.5 text-[10px] tracking-[0.15em] bg-black/60 backdrop-blur-sm text-[#D4AF37]">
            {data.carat}K
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black via-black/70 to-transparent">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#D4AF37]/70 mb-1.5">
              {data.category || 'Category'}
            </p>
            <h3 className="text-white text-lg font-semibold leading-snug">{name}</h3>
          </div>
        </div>

        {/* Detail pane */}
        <div className="text-white/80 space-y-4">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#D4AF37]/70">{data.category || 'Category'}</p>
          <h2 className="text-white text-2xl md:text-3xl font-semibold tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
            {name}
          </h2>
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">{data.carat}K gold</span>
            {data.featured && <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37]">Featured</span>}
            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 capitalize">{data.status}</span>
          </div>
          <p className="text-sm leading-relaxed text-white/70 whitespace-pre-wrap">{description}</p>
          {data.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {data.tags.map(t => (
                <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Google SERP preview ──────────────────────────────────────────────────────
function SerpPreview({ title, description, productName, productDescription }: {
  title: string;
  description: string;
  productName: string;
  productDescription: string;
}) {
  const effectiveTitle = title || productName || 'Product name';
  const effectiveDesc = description || productDescription?.slice(0, 160) || 'Meta description will appear here…';
  return (
    <div className="rounded-xl border bg-white/60 p-4" style={{ borderColor: 'var(--a-border)' }}>
      <p className="text-[10px] tracking-[0.18em] uppercase mb-2" style={{ color: 'var(--a-muted)' }}>
        Search preview
      </p>
      <div className="space-y-1">
        <p className="text-[11px] text-emerald-700 truncate">
          swaminarayan-ornaments.com › products › {(productName || 'product').toLowerCase().replace(/\s+/g, '-')}
        </p>
        <p className="text-[17px] leading-snug text-[#1a0dab] hover:underline cursor-default truncate">
          {effectiveTitle}
        </p>
        <p className="text-[13px] leading-snug text-black/70 line-clamp-2">
          {effectiveDesc}
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-6 space-y-5 border" style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' }}>
      <h3 className="text-[10px] tracking-[0.22em] uppercase pb-3 border-b"
        style={{ color: 'var(--a-muted)', borderColor: 'var(--a-border)' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

// ─── Input styles ─────────────────────────────────────────────────────────────
const inputCls = `
  w-full bg-black/[0.03] border rounded-xl px-4 py-2.5 text-black/85 text-sm
  placeholder:text-black/18 outline-none focus:border-[rgba(212,175,55,0.3)]
  focus:bg-black/[0.045] transition-all duration-200
  [border-color:var(--a-border)]
`;
const selectCls = `
  w-full border rounded-xl px-4 py-2.5 text-black/65 text-sm
  outline-none focus:border-[rgba(212,175,55,0.3)] transition-all duration-200
  [background:var(--a-surface)] [border-color:var(--a-border)]
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminProductForm({ product }: Props) {
  const router = useRouter();
  const { toast } = useAdmin();
  const isEditing = Boolean(product);

  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [autoSaveMsg, setAutoSaveMsg] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [aiTone, setAiTone] = useState<'traditional' | 'modern' | 'minimal'>('traditional');
  const [aiHistory, setAiHistory] = useState<Array<{
    id: string;
    tone: string;
    at: number;
    snapshot: Pick<FormData, 'name' | 'description' | 'tags' | 'seoTitle' | 'seoDescription' | 'category'>;
  }>>([]);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // After first autosave in create mode we keep the id here so subsequent saves update in place.
  const draftIdRef = useRef<string | null>(product?.id ?? null);
  const creatingDraftRef = useRef(false);

  const [form, setForm] = useState<FormData>({
    name:           product?.name           ?? '',
    description:    product?.description    ?? '',
    carat:          product?.carat          ?? 92,
    category:       product?.category       ?? '',
    tags:           product?.tags           ?? [],
    images:         product?.images         ?? [],
    featured:       product?.featured       ?? false,
    status:         product?.status         ?? 'active',
    seoTitle:       product?.seoTitle       ?? '',
    seoDescription: product?.seoDescription ?? '',
  });

  useEffect(() => {
    getCategories().then(cats => {
      const names = cats.map(c => c.name);
      setCategoryNames(names);
      if (!form.category && names.length > 0) {
        setForm(f => ({ ...f, category: names[0] }));
      }
    });
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, []);

  const triggerAutoSave = useCallback(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      // Don't auto-persist an empty new product — wait for something meaningful.
      const hasContent =
        form.name.trim().length > 1 ||
        form.description.trim().length > 1 ||
        form.images.length > 0;
      if (!hasContent && !draftIdRef.current) return;

      if (draftIdRef.current) {
        await updateProduct(draftIdRef.current, form as Partial<Product>);
        setAutoSaveMsg('Draft saved');
      } else if (!creatingDraftRef.current) {
        creatingDraftRef.current = true;
        try {
          const created = await addProduct({ ...form, status: 'draft' } as Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'order'>);
          draftIdRef.current = created.id;
          setAutoSaveMsg('Draft created');
          // Move URL to the edit route so a refresh restores the draft.
          router.replace(`/admin/products/${created.id}`);
        } finally {
          creatingDraftRef.current = false;
        }
      }
    }, 2000);
  }, [form, router]);

  useEffect(() => {
    if (!autoSaveMsg) return;
    const id = setTimeout(() => setAutoSaveMsg(''), 2000);
    return () => clearTimeout(id);
  }, [autoSaveMsg]);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(f => ({ ...f, [key]: value }));
    triggerAutoSave();
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (!t || form.tags.includes(t)) { setTagInput(''); return; }
    set('tags', [...form.tags, t]);
    setTagInput('');
  };

  const removeTag = (tag: string) => set('tags', form.tags.filter(t => t !== tag));

  const generateWithAI = async ({ overwrite = false }: { overwrite?: boolean } = {}) => {
    if (!form.images[0]) {
      toast('Upload an image first.', 'error');
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/generate-product', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          imageUrl: form.images[0],
          categories: categoryNames,
          carat: form.carat,
          tone: aiTone,
        }),
      });
      if (!res.ok) throw new Error('AI request failed');
      const g = await res.json();
      setForm(f => ({
        ...f,
        name: overwrite ? (g.name ?? f.name) : (f.name || g.name || ''),
        description: overwrite ? (g.description ?? f.description) : (f.description || g.description || ''),
        category: overwrite ? (g.category ?? f.category) : (f.category || g.category || ''),
        tags: overwrite ? (g.tags ?? f.tags) : (f.tags.length ? f.tags : (g.tags ?? [])),
        seoTitle: overwrite ? (g.seoTitle ?? f.seoTitle) : (f.seoTitle || g.seoTitle || ''),
        seoDescription: overwrite ? (g.seoDescription ?? f.seoDescription) : (f.seoDescription || g.seoDescription || ''),
      }));
      setAiHistory(h => [
        {
          id: `${Date.now()}`,
          tone: aiTone,
          at: Date.now(),
          snapshot: {
            name: g.name ?? '',
            description: g.description ?? '',
            category: g.category ?? '',
            tags: g.tags ?? [],
            seoTitle: g.seoTitle ?? '',
            seoDescription: g.seoDescription ?? '',
          },
        },
        ...h,
      ].slice(0, 3));
      toast(overwrite ? 'Regenerated with AI. Review before saving.' : 'AI draft ready. Review before saving.', 'success');
    } catch {
      toast('AI generation failed.', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const applyAiSnapshot = (snap: (typeof aiHistory)[number]['snapshot']) => {
    setForm(f => ({
      ...f,
      name: snap.name,
      description: snap.description,
      category: snap.category || f.category,
      tags: snap.tags,
      seoTitle: snap.seoTitle,
      seoDescription: snap.seoDescription,
    }));
    triggerAutoSave();
  };

  const missingFields = useMemo(() => {
    const missing: string[] = [];
    if (!form.name.trim()) missing.push('name');
    if (!form.description.trim()) missing.push('description');
    if (!form.category) missing.push('category');
    if (form.images.length === 0) missing.push('image');
    return missing;
  }, [form.name, form.description, form.category, form.images]);

  const canPublish = missingFields.length === 0;
  const publishBlockedTitle = canPublish
    ? (isEditing ? 'Update product' : 'Publish product')
    : `Add ${missingFields.join(', ')} to publish`;

  const handleSubmit = async (e: React.FormEvent, status?: ProductStatus) => {
    e.preventDefault();
    // Cancel any pending autosave — we're persisting explicitly now.
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    setSaving(true);
    const data = { ...form };
    if (status) data.status = status;

    try {
      // If we already autosaved a draft, update that record instead of creating a duplicate.
      const existingId = isEditing && product ? product.id : draftIdRef.current;
      if (existingId) {
        await updateProduct(existingId, data as Partial<Product>);
        toast(isEditing ? 'Product updated successfully.' : 'Product saved successfully.', 'success');
      } else {
        await addProduct(data as Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'order'>);
        toast('Product created successfully.', 'success');
      }
      router.push('/admin/products');
    } catch {
      toast('Failed to save product. Please try again.', 'error');
      setSaving(false);
    }
  };



  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-6 max-w-5xl">
      {/* Page header (sticky so Publish is always reachable) */}
      <div
        className="flex items-center justify-between sticky top-0 z-20 -mx-5 md:-mx-8 px-5 md:px-8 py-3 backdrop-blur-md border-b"
        style={{ background: 'color-mix(in srgb, var(--a-bg) 80%, transparent)', borderColor: 'var(--a-border)' }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="p-2 rounded-xl border shadow-sm border-black/[0.08] text-black/95 hover:text-black hover:border-black/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-[26px] text-black/90 font-medium tracking-wide"
              style={{ fontFamily: 'var(--font-accent)' }}>
              {isEditing ? 'Edit Product' : 'New Product'}
            </h1>
            {autoSaveMsg && (
              <motion.p
                key={autoSaveMsg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[#D4AF37]/60 text-xs mt-0.5"
              >
                {autoSaveMsg}
              </motion.p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!canPublish && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-[11px]"
              title="These fields are required to publish"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Needs {missingFields.join(', ')}
            </motion.div>
          )}
          {/* Tone selector */}
          <div className="hidden md:inline-flex p-0.5 rounded-xl border border-black/[0.08] bg-black/[0.02]">
            {(['traditional', 'modern', 'minimal'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setAiTone(t)}
                title={`AI tone: ${t}`}
                className={`px-2.5 py-1.5 text-[11px] capitalize rounded-lg transition-colors ${
                  aiTone === t ? 'bg-[#D4AF37]/15 text-black' : 'text-black/50 hover:text-black/80'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => generateWithAI({ overwrite: aiHistory.length > 0 })}
            disabled={aiLoading || form.images.length === 0}
            title={form.images.length === 0
              ? 'Upload an image to enable'
              : aiHistory.length > 0
                ? `Regenerate with "${aiTone}" tone (overwrites fields)`
                : 'Generate name, description, tags & SEO from the first image'}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-black/90 hover:bg-[#D4AF37]/20 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {aiLoading
              ? (aiHistory.length > 0 ? 'Regenerating…' : 'Generating…')
              : (aiHistory.length > 0 ? 'Regenerate' : 'Generate with AI')}
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e as unknown as React.FormEvent, 'draft')}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl border shadow-sm border-black/[0.1] text-black/95 hover:text-black text-sm transition-colors"
          >
            Save Draft
          </button>
          <button
            type="submit"
            disabled={saving || !canPublish}
            title={publishBlockedTitle}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#FFD700] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEditing ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Edit / Preview tabs */}
      <div className="inline-flex p-1 rounded-xl border" style={{ borderColor: 'var(--a-border)', background: 'var(--a-surface)' }}>
        {([['edit', 'Edit', Edit3], ['preview', 'Preview', Eye]] as const).map(([key, label, Icon]) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs transition-colors ${
              mode === key ? 'bg-[#D4AF37]/15 text-black' : 'text-black/55 hover:text-black/80'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {aiHistory.length > 0 && mode === 'edit' && (
        <div className="rounded-xl border p-3 space-y-2" style={{ borderColor: 'var(--a-border)', background: 'var(--a-surface)' }}>
          <p className="text-[10px] tracking-[0.2em] uppercase text-black/50">AI drafts (most recent first)</p>
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
            {aiHistory.map(h => (
              <button
                key={h.id}
                type="button"
                onClick={() => applyAiSnapshot(h.snapshot)}
                className="shrink-0 max-w-[240px] text-left p-2.5 rounded-lg border border-black/[0.08] hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-colors"
                title="Apply this draft"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[9px] tracking-widest uppercase text-[#D4AF37]">{h.tone}</span>
                  <span className="text-[9px] text-black/40">{new Date(h.at).toLocaleTimeString()}</span>
                </div>
                <p className="text-[12px] text-black/90 truncate">{h.snapshot.name || '—'}</p>
                <p className="text-[11px] text-black/55 line-clamp-2">{h.snapshot.description || '—'}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === 'preview' && <StorefrontPreview data={form} />}

      {/* Two-column layout */}
      {mode === 'edit' && <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — main fields */}
        <div className="lg:col-span-2 space-y-6">
          <Section title="Basic Info">
            <Field label="Product Name" required counter={{ value: form.name.length, max: 70, ideal: [20, 60] }}>
              <input
                required
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="e.g. Royal Kundan Haar"
                className={inputCls}
              />
            </Field>

            <Field
              label="Description"
              required
              hint="Highlight craftsmanship, materials, and occasion."
              counter={{ value: form.description.length, max: 800, ideal: [120, 500] }}
            >
              <textarea
                required
                rows={5}
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Describe the product in detail…"
                className={`${inputCls} resize-none leading-relaxed`}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Category" required>
                <select
                  required
                  value={form.category}
                  onChange={e => set('category', e.target.value)}
                  className={selectCls}
                >
                  <option value="">Select category…</option>
                  {categoryNames.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>

              <Field label="Carat Purity">
                <select
                  value={form.carat}
                  onChange={e => set('carat', Number(e.target.value) as 92 | 84)}
                  className={selectCls}
                >
                  <option value={92}>92 Carat (22K)</option>
                  <option value={84}>84 Carat (18K)</option>
                </select>
              </Field>
            </div>

            <Field label="Tags" hint="Press Enter or comma to add a tag.">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); }
                    }}
                    placeholder="Add tag…"
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    disabled={!tagInput.trim()}
                    className="px-4 py-2.5 rounded-xl border shadow-sm border-black/[0.1] text-black/95 hover:text-black text-sm disabled:opacity-40 transition-colors whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-black/[0.06] border border-black/[0.08] rounded-full text-black/90 text-xs">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-black/55 hover:text-black transition-colors">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Field>
          </Section>

          <Section title="Images">
            <AdminImageUpload
              images={form.images}
              onChange={imgs => set('images', imgs)}
            />
          </Section>

          <Section title="SEO">
            <Field
              label="Meta Title"
              hint="Aim for 50–60 characters. Defaults to product name if empty."
              counter={{ value: form.seoTitle.length, max: 60, ideal: [50, 60] }}
            >
              <input
                type="text"
                value={form.seoTitle}
                onChange={e => set('seoTitle', e.target.value)}
                placeholder={form.name || 'Product name'}
                className={inputCls}
                maxLength={60}
              />
            </Field>
            <Field
              label="Meta Description"
              hint="Ideal length: 140–160 characters."
              counter={{ value: form.seoDescription.length, max: 160, ideal: [140, 160] }}
            >
              <textarea
                rows={3}
                value={form.seoDescription}
                onChange={e => set('seoDescription', e.target.value)}
                placeholder={form.description?.slice(0, 160) || 'Short description for search engines…'}
                className={`${inputCls} resize-none`}
                maxLength={160}
              />
            </Field>
            <SerpPreview
              title={form.seoTitle}
              description={form.seoDescription}
              productName={form.name}
              productDescription={form.description}
            />
          </Section>
        </div>

        {/* Right — status & options */}
        <div className="space-y-6">
          <Section title="Status">
            <Field label="Product Status">
              <select
                value={form.status}
                onChange={e => set('status', e.target.value as ProductStatus)}
                className={selectCls}
              >
                <option value="active">Active — visible in store</option>
                <option value="draft">Draft — hidden from store</option>
                <option value="archived">Archived — not visible</option>
              </select>
            </Field>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => set('featured', !form.featured)}
                className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                  form.featured ? 'bg-[#D4AF37]' : 'bg-black/[0.1]'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-black transition-transform duration-200 ${
                    form.featured ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
              <div>
                <p className="text-black/90 text-sm">Featured Product</p>
                <p className="text-black/55 text-xs">Shown in featured collection</p>
              </div>
            </label>
          </Section>

          <Section title="Product Info">
            <div className="space-y-2 text-sm">
              {product?.id && (
                <div className="flex justify-between">
                  <span className="text-black/55">ID</span>
                  <span className="text-black/90 font-mono text-xs">{product.id}</span>
                </div>
              )}
              {product?.createdAt && (
                <div className="flex justify-between">
                  <span className="text-black/55">Created</span>
                  <span className="text-black/90">{product.createdAt}</span>
                </div>
              )}
              {product?.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-black/55">Updated</span>
                  <span className="text-black/90">{product.updatedAt}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-black/55">Images</span>
                <span className="text-black/90">{form.images.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/55">Tags</span>
                <span className="text-black/90">{form.tags.length}</span>
              </div>
            </div>
          </Section>
        </div>
      </div>}
    </form>
  );
}
