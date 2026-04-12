'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Loader2, X, Sparkles } from 'lucide-react';
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
function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--a-muted)' }}>{label}</label>
      {children}
      {hint && <p className="text-[11px] leading-relaxed text-black/50">{hint}</p>}
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
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    if (!isEditing || !product) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      updateProduct(product.id, form as Partial<Product>);
      setAutoSaveMsg('Draft saved');
    }, 2000);
  }, [isEditing, product, form]);

  useEffect(() => {
    if (!autoSaveMsg) return;
    const id = setTimeout(() => setAutoSaveMsg(''), 2000);
    return () => clearTimeout(id);
  }, [autoSaveMsg]);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(f => ({ ...f, [key]: value }));
    if (isEditing) triggerAutoSave();
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (!t || form.tags.includes(t)) { setTagInput(''); return; }
    set('tags', [...form.tags, t]);
    setTagInput('');
  };

  const removeTag = (tag: string) => set('tags', form.tags.filter(t => t !== tag));

  const generateWithAI = async () => {
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
        }),
      });
      if (!res.ok) throw new Error('AI request failed');
      const g = await res.json();
      setForm(f => ({
        ...f,
        name: f.name || g.name || '',
        description: f.description || g.description || '',
        category: f.category || g.category || '',
        tags: f.tags.length ? f.tags : (g.tags ?? []),
        seoTitle: f.seoTitle || g.seoTitle || '',
        seoDescription: f.seoDescription || g.seoDescription || '',
      }));
      toast('AI draft ready. Review before saving.', 'success');
    } catch {
      toast('AI generation failed.', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, status?: ProductStatus) => {
    e.preventDefault();
    setSaving(true);
    const data = { ...form };
    if (status) data.status = status;

    try {
      if (isEditing && product) {
        updateProduct(product.id, data as Partial<Product>);
        toast('Product updated successfully.', 'success');
      } else {
        addProduct(data as Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'order'>);
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
      {/* Page header */}
      <div className="flex items-center justify-between">
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
          <button
            type="button"
            onClick={generateWithAI}
            disabled={aiLoading || form.images.length === 0}
            title={form.images.length === 0 ? 'Upload an image to enable' : 'Generate name, description, tags & SEO from the first image'}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-black/90 hover:bg-[#D4AF37]/20 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {aiLoading ? 'Generating…' : 'Generate with AI'}
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
            disabled={saving || !form.name || !form.category}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#FFD700] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEditing ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — main fields */}
        <div className="lg:col-span-2 space-y-6">
          <Section title="Basic Info">
            <Field label="Product Name">
              <input
                required
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="e.g. Royal Kundan Haar"
                className={inputCls}
              />
            </Field>

            <Field label="Description" hint="Use rich text to highlight key features.">
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
              <Field label="Category">
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
            <Field label="Meta Title" hint="Defaults to product name if left empty.">
              <input
                type="text"
                value={form.seoTitle}
                onChange={e => set('seoTitle', e.target.value)}
                placeholder={form.name || 'Product name'}
                className={inputCls}
                maxLength={60}
              />
            </Field>
            <Field label="Meta Description" hint="Ideal length: 120–160 characters.">
              <textarea
                rows={3}
                value={form.seoDescription}
                onChange={e => set('seoDescription', e.target.value)}
                placeholder={form.description?.slice(0, 160) || 'Short description for search engines…'}
                className={`${inputCls} resize-none`}
                maxLength={160}
              />
            </Field>
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
      </div>
    </form>
  );
}
