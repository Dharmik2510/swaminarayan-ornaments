'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Tag, X, Image as ImageIcon } from 'lucide-react';
import { getMediaItems, addMediaItem, deleteMediaItem, updateMediaItemTags } from '@/lib/firebase';
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { getMediaItems().then(setItems).catch(err => console.error('[AdminMedia] Failed to load:', err.message)); }, []);

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
    const ok = await confirm({
      title: 'Delete image?',
      message: `"${item.name}" will be permanently deleted from the media library.`,
      confirmLabel: 'Delete',
      variant: 'danger',
    });
    if (!ok) return;
    await deleteMediaItem(item.id);
    getMediaItems().then(setItems);
    if (selected === item.id) setSelected(null);
    toast('Image deleted.', 'success');
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
          <h1 className="text-[26px] text-white/90 font-light tracking-wide"
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
          dragging ? 'border-[#D4AF37] bg-[rgba(212,175,55,0.04)]' : 'border-white/[0.06] hover:border-white/[0.1]'
        }`}
      >
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <ImageIcon className="w-10 h-10 text-white/10" />
            <p className="text-white/40 text-sm">Drop images here or click Upload</p>
            <p className="text-white/20 text-xs">JPEG, PNG, WebP — auto-compressed</p>
          </div>
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              <AnimatePresence mode="popLayout">
                {items.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => setSelected(item.id === selected ? null : item.id)}
                    className={`relative group aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-colors ${
                      selected === item.id ? 'border-[#D4AF37]' : 'border-transparent hover:border-white/20'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(item); }}
                        className="p-1.5 bg-red-500/80 rounded-lg hover:bg-red-500 transition-colors"
                      >
                        <Trash2 className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  </motion.div>
                ))}
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
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-white/[0.08]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedItem.url} alt={selectedItem.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium truncate">{selectedItem.name}</p>
                    <p className="text-white/30 text-xs mt-0.5">{formatBytes(selectedItem.size)} · {selectedItem.type}</p>
                    <p className="text-white/20 text-xs">{new Date(selectedItem.uploadedAt).toLocaleString()}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.tags.map((t: string) => (
                      <span key={t} className="flex items-center gap-1 px-2 py-0.5 bg-white/[0.06] rounded-full text-white/60 text-xs">
                        {t}
                        <button onClick={() => handleRemoveTag(selectedItem.id, t)} className="text-white/30 hover:text-white">
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
                      className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-white text-xs placeholder:text-white/20 outline-none focus:border-[rgba(212,175,55,0.3)] transition-colors flex-1"
                    />
                    <button
                      onClick={() => handleAddTag(selectedItem.id)}
                      className="px-3 py-1.5 rounded-lg border border-white/[0.1] text-white/50 hover:text-white text-xs transition-colors"
                    >
                      <Tag className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
