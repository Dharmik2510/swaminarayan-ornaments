'use client';

import { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Tag, X, Image as ImageIcon, Copy, Check } from 'lucide-react';
import { getMediaItems, addMediaItem, deleteMediaItem, updateMediaItemTags, getProducts } from '@/lib/firebase';
import type { Product } from '@/lib/data';
import { compressImageToBlob } from '@/lib/firebase-upload';
import { uploadImageToStorage } from '@/lib/firebase-upload';
import type { MediaItem } from '@/lib/firebase';
import { useAdmin } from '@/components/admin/AdminContext';
import { formatBytes } from '@/lib/utils';

export default function AdminMediaPage() {
  const { toast, confirm } = useAdmin();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [tagInput, setTagInput] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const pendingDeletes = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { getMediaItems().then(setItems).catch(err => console.error('[AdminMedia] Failed to load:', err.message)); }, []);
  useEffect(() => { getProducts().then(setProducts).catch(() => {}); }, []);

  const usageByUrl = useMemo(() => {
    const map = new Map<string, Product[]>();
    for (const product of products) {
      for (const url of product.images ?? []) {
        if (!url) continue;
        const list = map.get(url) ?? [];
        list.push(product);
        map.set(url, list);
      }
    }
    return map;
  }, [products]);

  const processFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setProcessing(true);
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    await Promise.all(imageFiles.map(async (file) => {
      try {
        const compressedBlob = await compressImageToBlob(file);
        const url = await uploadImageToStorage(compressedBlob, file.name);
        await addMediaItem({ name: file.name, url, size: file.size, type: file.type, tags: [] });
      } catch {
        toast(`Failed to upload ${file.name}.`, 'error');
      }
    }));
    getMediaItems().then(setItems);
    setProcessing(false);
    if (imageFiles.length > 0) toast('Images uploaded successfully.', 'success');
  }, [toast]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleDelete = async (item: MediaItem) => {
    const usedBy = usageByUrl.get(item.url) ?? [];
    if (usedBy.length > 0) {
      const ok = await confirm({
        title: 'Image is in use',
        message: `"${item.name}" is used by ${usedBy.length} product${usedBy.length > 1 ? 's' : ''} (${usedBy.slice(0, 3).map(p => p.name).join(', ')}${usedBy.length > 3 ? '…' : ''}). Delete anyway?`,
        confirmLabel: 'Delete anyway',
        variant: 'danger',
      });
      if (!ok) return;
    }

    setHiddenIds(prev => new Set(prev).add(item.id));
    if (selected === item.id) setSelected(null);

    const timer = setTimeout(async () => {
      delete pendingDeletes.current[item.id];
      await deleteMediaItem(item.id);
      getMediaItems().then(setItems);
    }, 6500);
    pendingDeletes.current[item.id] = timer;

    toast(`"${item.name}" deleted.`, {
      variant: 'success',
      duration: 6500,
      action: {
        label: 'Undo',
        onClick: () => {
          clearTimeout(timer);
          delete pendingDeletes.current[item.id];
          setHiddenIds(prev => { const s = new Set(prev); s.delete(item.id); return s; });
        },
      },
    });
  };

  const handleCopyUrl = async (item: MediaItem) => {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(cur => (cur === item.id ? null : cur)), 1500);
    } catch {
      toast('Could not copy URL.', 'error');
    }
  };

  const handleAddTag = async (id: string) => {
    const t = tagInput[id]?.trim().toLowerCase();
    if (!t) return;
    const item = items.find(i => i.id === id);
    if (!item || item.tags.includes(t)) return;
    await updateMediaItemTags(id, [...item.tags, t]);
    getMediaItems().then(setItems);
    setTagInput(prev => ({ ...prev, [id]: '' }));
  };

  const handleRemoveTag = async (id: string, tag: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    await updateMediaItemTags(id, item.tags.filter((t: string) => t !== tag));
    getMediaItems().then(setItems);
  };

  const selectedItem = items.find(i => i.id === selected);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] text-black/90 font-medium tracking-wide"
            style={{ fontFamily: 'var(--font-accent)' }}>
            Media Library
          </h1>
          <p className="text-[11px] tracking-[0.15em] uppercase mt-1" style={{ color: 'var(--a-muted)' }}>
            {items.length} files
          </p>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={processing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#FFD700] disabled:opacity-50 transition-colors"
        >
          <Upload className="w-4 h-4" />
          {processing ? 'Uploading…' : 'Upload'}
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only" onChange={e => processFiles(e.target.files)} />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl transition-all duration-200 ${
          dragging ? 'border-[#D4AF37] bg-[rgba(212,175,55,0.04)]' : 'border-black/10 hover:border-black/[0.1]'
        }`}
      >
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <ImageIcon className="w-10 h-10 text-black/10" />
            <p className="text-black/95 text-sm">Drop images here or click Upload</p>
            <p className="text-black/20 text-xs">JPEG, PNG, WebP — auto-compressed</p>
          </div>
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              <AnimatePresence mode="popLayout">
                {items.filter(item => !hiddenIds.has(item.id)).map(item => {
                  const justCopied = copiedId === item.id;
                  const usage = usageByUrl.get(item.url)?.length ?? 0;
                  return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => setSelected(item.id === selected ? null : item.id)}
                    className={`relative group aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-colors ${
                      selected === item.id ? 'border-[#D4AF37]' : 'border-transparent hover:border-black/20'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                    {/* Usage badge */}
                    <div className="absolute top-1.5 left-1.5 z-10">
                      {usage > 0 ? (
                        <span className="px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-semibold text-[#D4AF37] tabular-nums">
                          ×{usage}
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-500/80 text-[10px] font-semibold text-black uppercase tracking-wider">
                          Unused
                        </span>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      <button
                        onClick={e => { e.stopPropagation(); handleCopyUrl(item); }}
                        title={justCopied ? 'Copied!' : 'Copy URL'}
                        className={`p-1.5 rounded-lg transition-colors ${
                          justCopied
                            ? 'bg-emerald-500/90'
                            : 'bg-white/85 hover:bg-white'
                        }`}
                      >
                        {justCopied
                          ? <Check className="w-3 h-3 text-black" />
                          : <Copy className="w-3 h-3 text-black" />}
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(item); }}
                        title="Delete"
                        className="p-1.5 bg-red-500/85 rounded-lg hover:bg-red-500 transition-colors"
                      >
                        <Trash2 className="w-3 h-3 text-black" />
                      </button>
                    </div>
                  </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Selected item details */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="rounded-2xl p-5 border"
          style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
          >
            <div className="flex items-start gap-5">
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-black/[0.08]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedItem.url} alt={selectedItem.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-black/95 text-sm font-medium truncate">{selectedItem.name}</p>
                    <p className="text-black/55 text-xs mt-0.5">{formatBytes(selectedItem.size)} · {selectedItem.type}</p>
                    <p className="text-black/20 text-xs">{new Date(selectedItem.uploadedAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyUrl(selectedItem)}
                      title={copiedId === selectedItem.id ? 'Copied!' : 'Copy URL'}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-black/[0.08] text-black/80 hover:text-black hover:border-black/20 text-[11px] transition-colors"
                    >
                      {copiedId === selectedItem.id
                        ? <><Check className="w-3 h-3 text-emerald-500" /> Copied</>
                        : <><Copy className="w-3 h-3" /> Copy URL</>}
                    </button>
                    <button onClick={() => setSelected(null)} className="text-black/55 hover:text-black transition-colors p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.tags.map((t: string) => (
                      <span key={t} className="flex items-center gap-1 px-2 py-0.5 bg-black/[0.06] rounded-full text-black/95 text-xs">
                        {t}
                        <button onClick={() => handleRemoveTag(selectedItem.id, t)} className="text-black/55 hover:text-black">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput[selectedItem.id] ?? ''}
                      onChange={e => setTagInput(prev => ({ ...prev, [selectedItem.id]: e.target.value }))}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(selectedItem.id); } }}
                      placeholder="Add tag…"
                      className="bg-black/5 border border-black/[0.08] rounded-lg px-3 py-1.5 text-black text-xs placeholder:text-black/20 outline-none focus:border-[rgba(212,175,55,0.3)] transition-colors flex-1"
                    />
                    <button
                      onClick={() => handleAddTag(selectedItem.id)}
                      className="px-3 py-1.5 rounded-lg border border-black/[0.1] text-black/90 hover:text-black text-xs transition-colors"
                    >
                      <Tag className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Usage */}
                {(() => {
                  const usedBy = usageByUrl.get(selectedItem.url) ?? [];
                  return (
                    <div className="space-y-2 pt-2 border-t border-black/[0.04]">
                      <p className="text-[10px] tracking-[0.18em] uppercase text-black/45">
                        {usedBy.length === 0 ? 'Not used anywhere' : `Used in ${usedBy.length} product${usedBy.length > 1 ? 's' : ''}`}
                      </p>
                      {usedBy.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {usedBy.slice(0, 8).map(p => (
                            <Link
                              key={p.id}
                              href={`/admin/products/${p.id}`}
                              className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 text-[11px] text-black/80 hover:bg-[#D4AF37]/20 transition-colors"
                            >
                              {p.name}
                            </Link>
                          ))}
                          {usedBy.length > 8 && <span className="text-[11px] text-black/40">+{usedBy.length - 8} more</span>}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
