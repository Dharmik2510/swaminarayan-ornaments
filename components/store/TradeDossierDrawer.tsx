'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Trash2, Send, Sparkles, ArrowRight } from 'lucide-react';
import { useTradeDossier, type PurityPreference, type InquiryMode } from './TradeDossierContext';

export default function TradeDossierDrawer() {
  const {
    shortlist,
    removeFromShortlist,
    clearShortlist,
    purityPref,
    setPurityPref,
    inquiryMode,
    setInquiryMode,
    businessName,
    setBusinessName,
    city,
    setCity,
    drawerOpen,
    setDrawerOpen,
    buildWhatsAppUrl,
  } = useTradeDossier();

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-md"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            aria-label="Wholesale Trade Dossier"
            className="fixed top-0 right-0 bottom-0 z-[81] w-full max-w-md bg-[#0e090b] border-l border-[var(--store-gold)]/25 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--store-border)] flex items-center justify-between gap-4">
              <div>
                <p className="sc-label text-[10px] text-[var(--store-gold)] flex items-center gap-1.5">
                  <Sparkles size={11} />
                  Swaminarayan B2B Desk
                </p>
                <h2 className="font-display text-2xl text-[var(--sc-ink)] mt-0.5">
                  Wholesale Trade Dossier
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-full border border-[var(--store-border)] text-[var(--store-muted)] hover:text-[var(--sc-ink)]"
                aria-label="Close Trade Dossier"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 store-scrollbar">
              {/* Purity & Mode Quick Controls */}
              <div className="space-y-4">
                <div>
                  <label className="block sc-label text-[10px] text-[var(--store-muted)] mb-2">
                    Purity Requirement
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { id: 'both', label: '92K & 84K' },
                        { id: '92', label: '92K Only' },
                        { id: '84', label: '84K Only' },
                      ] as { id: PurityPreference; label: string }[]
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPurityPref(opt.id)}
                        className={`py-2 px-2.5 rounded-xl text-[11px] font-mono uppercase border transition-all ${
                          purityPref === opt.id
                            ? 'bg-[var(--store-gold)] text-[#080607] border-[var(--store-gold)] font-semibold'
                            : 'border-[var(--store-border)] text-[var(--store-muted)]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block sc-label text-[10px] text-[var(--store-muted)] mb-2">
                    Inquiry Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        { id: 'showroom', label: 'Showroom' },
                        { id: 'catalog', label: 'Rate Sheet' },
                        { id: 'custom', label: 'Custom Order' },
                      ] as { id: InquiryMode; label: string }[]
                    ).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setInquiryMode(m.id)}
                        className={`py-2 px-2.5 rounded-xl text-[11px] font-mono uppercase border transition-all ${
                          inquiryMode === m.id
                            ? 'border-[var(--store-gold)] bg-[var(--store-gold)]/15 text-[var(--store-gold-soft)]'
                            : 'border-[var(--store-border)] text-[var(--store-muted)]'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Firm / Showroom name"
                    className="store-input w-full text-xs"
                  />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="store-input w-full text-xs"
                  />
                </div>
              </div>

              {/* Shortlisted Pieces */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="sc-label text-[10px] text-[var(--store-gold)]">
                    Shortlisted Lots ({shortlist.length})
                  </span>
                  {shortlist.length > 0 && (
                    <button
                      type="button"
                      onClick={clearShortlist}
                      className="text-[10px] font-mono uppercase text-[var(--store-muted)] hover:text-red-400"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {shortlist.length === 0 ? (
                  <div className="rounded-2xl border border-[var(--store-border)] bg-white/[0.02] p-6 text-center">
                    <p className="font-display text-lg text-[var(--sc-ink)] mb-1">
                      No pieces shortlisted yet
                    </p>
                    <p className="text-xs text-[var(--store-muted)] mb-4">
                      Add pieces from the exhibition rail or catalog to include them in your
                      WhatsApp trade inquiry.
                    </p>
                    <Link
                      href="/collection"
                      onClick={() => setDrawerOpen(false)}
                      className="store-btn-ghost py-2 px-4 text-[10px]"
                    >
                      Browse Catalog
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {shortlist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-[var(--store-border)] bg-white/[0.03]"
                      >
                        <div className="relative w-14 h-14 rounded-lg bg-[#1a1215] overflow-hidden shrink-0">
                          {item.images?.[0] && (
                            <Image
                              src={item.images[0]}
                              alt={item.name}
                              fill
                              sizes="56px"
                              className="object-contain p-1.5"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-[10px] text-[var(--store-gold)]">
                            {item.carat}K · {item.category}
                          </p>
                          <p className="font-display text-base text-[var(--sc-ink)] truncate">
                            {item.name}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromShortlist(item.id)}
                          className="p-1.5 text-[var(--store-muted)] hover:text-red-400"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer CTA */}
            <div className="p-6 border-t border-[var(--store-border)] bg-[#090607]">
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="store-btn-primary w-full justify-center py-3.5"
              >
                <Send size={14} />
                Send Trade Brief on WhatsApp
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
