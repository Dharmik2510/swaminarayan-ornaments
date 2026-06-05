'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Plus, Loader2 } from 'lucide-react';
import { applyBulkEdit, type BulkEditOps } from '@/lib/firebase';

type Props = {
  open: boolean;
  count: number;
  ids: string[];
  onClose: () => void;
  onApplied: () => void;
  toast: (message: string, v?: 'success' | 'error' | 'info' | 'warning') => void;
};

type FeaturedOp = 'keep' | 'on' | 'off';
type CaratOp    = 'keep' | '92' | '84';

export default function AdminBulkEditDrawer({ open, count, ids, onClose, onApplied, toast }: Props) {
  const [addTags, setAddTags] = useState<string[]>([]);
  const [addInput, setAddInput] = useState('');
  const [removeTags, setRemoveTags] = useState<string[]>([]);
  const [removeInput, setRemoveInput] = useState('');
  const [featured, setFeatured] = useState<FeaturedOp>('keep');
  const [carat, setCarat] = useState<CaratOp>('keep');
  const [appendDescription, setAppendDescription] = useState('');
  const [applying, setApplying] = useState(false);

  const reset = () => {
    setAddTags([]); setAddInput('');
    setRemoveTags([]); setRemoveInput('');
    setFeatured('keep'); setCarat('keep');
    setAppendDescription('');
  };

  const pushTag = (raw: string, set: React.Dispatch<React.SetStateAction<string[]>>, clear: () => void) => {
    const t = raw.trim().toLowerCase();
    if (!t) return;
    set(prev => prev.includes(t) ? prev : [...prev, t]);
    clear();
  };

  const hasChanges =
    addTags.length > 0 ||
    removeTags.length > 0 ||
    featured !== 'keep' ||
    carat !== 'keep' ||
    appendDescription.trim().length > 0;

  const apply = async () => {
    if (!hasChanges || ids.length === 0) return;
    setApplying(true);
    const ops: BulkEditOps = {};
    if (addTags.length) ops.addTags = addTags;
    if (removeTags.length) ops.removeTags = removeTags;
    if (featured !== 'keep') ops.featured = featured === 'on';
    if (carat !== 'keep') ops.carat = (carat === '92' ? 92 : 84);
    if (appendDescription.trim()) ops.appendDescription = appendDescription.trim();

    try {
      await applyBulkEdit(ids, ops);
      toast(`Updated ${count} product${count > 1 ? 's' : ''}.`, 'success');
      reset();
      onApplied();
      onClose();
    } catch {
      toast('Bulk edit failed.', 'error');
    } finally {
      setApplying(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="bulk-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-black/30 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.aside
            key="bulk-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="fixed top-0 right-0 bottom-0 z-[160] w-full sm:w-[440px] border-l shadow-2xl flex flex-col"
            style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--a-border)' }}>
              <div>
                <h2 className="text-sm font-medium text-black/90">Bulk edit</h2>
                <p className="text-[11px] text-black/55 mt-0.5">{count} product{count > 1 ? 's' : ''} selected</p>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-black/5 text-black/55 hover:text-black transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 custom-scrollbar">

              {/* Tags */}
              <div className="space-y-2">
                <label className="block text-[10px] tracking-[0.18em] uppercase text-black/55">Add tags</label>
                <div className="flex gap-2">
                  <input
                    value={addInput}
                    onChange={e => setAddInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); pushTag(addInput, setAddTags, () => setAddInput('')); }
                    }}
                    placeholder="e.g. bridal"
                    className="flex-1 bg-black/[0.03] border rounded-lg px-3 py-2 text-sm text-black/85 placeholder:text-black/25 outline-none focus:border-[rgba(212,175,55,0.3)] [border-color:var(--a-border)]"
                  />
                  <button
                    type="button"
                    onClick={() => pushTag(addInput, setAddTags, () => setAddInput(''))}
                    className="px-3 rounded-lg border border-black/[0.1] text-black/70 hover:text-black text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                {addTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {addTags.map(t => (
                      <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-[11px]">
                        +{t}
                        <button onClick={() => setAddTags(prev => prev.filter(x => x !== t))} className="hover:text-emerald-900">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] tracking-[0.18em] uppercase text-black/55">Remove tags</label>
                <div className="flex gap-2">
                  <input
                    value={removeInput}
                    onChange={e => setRemoveInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); pushTag(removeInput, setRemoveTags, () => setRemoveInput('')); }
                    }}
                    placeholder="Tag to strip"
                    className="flex-1 bg-black/[0.03] border rounded-lg px-3 py-2 text-sm text-black/85 placeholder:text-black/25 outline-none focus:border-[rgba(212,175,55,0.3)] [border-color:var(--a-border)]"
                  />
                  <button
                    type="button"
                    onClick={() => pushTag(removeInput, setRemoveTags, () => setRemoveInput(''))}
                    className="px-3 rounded-lg border border-black/[0.1] text-black/70 hover:text-black text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                {removeTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {removeTags.map(t => (
                      <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-700 text-[11px]">
                        −{t}
                        <button onClick={() => setRemoveTags(prev => prev.filter(x => x !== t))} className="hover:text-red-900">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Featured */}
              <div className="space-y-2">
                <label className="block text-[10px] tracking-[0.18em] uppercase text-black/55">Featured</label>
                <div className="grid grid-cols-3 gap-1 p-1 rounded-lg border border-black/[0.08]">
                  {(['keep', 'on', 'off'] as FeaturedOp[]).map(o => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => setFeatured(o)}
                      className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                        featured === o ? 'bg-[#D4AF37]/20 text-black' : 'text-black/55 hover:text-black/80'
                      }`}
                    >
                      {o === 'keep' ? 'Keep' : o === 'on' ? 'Set featured' : 'Unfeature'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Carat */}
              <div className="space-y-2">
                <label className="block text-[10px] tracking-[0.18em] uppercase text-black/55">Carat</label>
                <div className="grid grid-cols-3 gap-1 p-1 rounded-lg border border-black/[0.08]">
                  {(['keep', '92', '84'] as CaratOp[]).map(o => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => setCarat(o)}
                      className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                        carat === o ? 'bg-[#D4AF37]/20 text-black' : 'text-black/55 hover:text-black/80'
                      }`}
                    >
                      {o === 'keep' ? 'Keep' : o === '92' ? '92K (22K)' : '84K (18K)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description template */}
              <div className="space-y-2">
                <label className="block text-[10px] tracking-[0.18em] uppercase text-black/55">
                  Append to description
                </label>
                <textarea
                  value={appendDescription}
                  onChange={e => setAppendDescription(e.target.value)}
                  rows={3}
                  placeholder="Handcrafted {{carat}}K gold. Perfect for {{name}} lovers."
                  className="w-full bg-black/[0.03] border rounded-lg px-3 py-2 text-sm text-black/85 placeholder:text-black/25 outline-none focus:border-[rgba(212,175,55,0.3)] [border-color:var(--a-border)] resize-none"
                />
                <p className="text-[11px] text-black/45">
                  Supports <code className="text-[10px]">{'{{name}}'}</code> and <code className="text-[10px]">{'{{carat}}'}</code>. Appended — does not replace existing text.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t flex items-center gap-2" style={{ borderColor: 'var(--a-border)' }}>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-black/[0.1] text-black/70 hover:text-black text-sm"
              >
                Cancel
              </button>
              <button
                onClick={apply}
                disabled={!hasChanges || applying}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#FFD700] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Apply to {count}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
