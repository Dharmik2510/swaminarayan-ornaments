'use client';

import Link from 'next/link';
import { ArrowUpRight, MapPin, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import TilakSymbol from '@/components/TilakSymbol';
import type { CategoryWithStats } from '@/lib/catalog';
import { useTradeDossier } from './TradeDossierContext';

interface StoreFooterProps {
  categories?: CategoryWithStats[];
}

export default function StoreFooter({ categories = [] }: StoreFooterProps) {
  const topCats = categories.slice(0, 12);
  const { shortlist, purityPref, selectedCategories, buildWhatsAppUrl } = useTradeDossier();

  return (
    <footer id="contact" className="border-t border-[var(--store-border)]">
      {/* ACT VII: Pinned Sovereign Finale (with greet-and-hold cue "0 1 0 0" per devices.md §2) */}
      <section
        data-sc-act="pin"
        data-sc-span="1.45"
        data-sc-drift="#080607"
        className="relative"
      >
        <div
          data-sc-stage
          data-sc-spotlight
          className="sc-stage relative flex items-center justify-center overflow-hidden"
        >
          {/* Ambient radial gold vault ground so stage is never empty */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(212,175,55,0.13) 0%, rgba(138,28,41,0.10) 45%, transparent 75%)',
            }}
            aria-hidden="true"
          />

          <div
            data-sc-cue="0 1 0 0"
            className="sc-wrap relative z-20 text-center max-w-3xl mx-auto py-12"
          >
            <div className="mx-auto w-12 h-16 mb-6">
              <TilakSymbol className="w-full h-full" glow />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[var(--store-gold)]/30 bg-[var(--store-gold)]/[0.08] mb-5">
              <Sparkles size={12} className="text-[var(--store-gold)]" />
              <span className="sc-label text-[10px] text-[var(--store-gold-soft)]">
                Act VII · Private Trade Desk · Ahmedabad
              </span>
            </div>

            <h2 className="sc-display sc-display--lg text-[var(--sc-ink)] mb-5">
              Ready to stock sovereign 92 &amp; 84 carat gold?
            </h2>

            <p className="sc-lede text-[var(--sc-ink-soft)] mx-auto mb-8">
              Your trade brief is pre-configured for{' '}
              <span className="text-[var(--store-gold-soft)]">
                {purityPref === 'both' ? '92K & 84K Hallmarked Gold' : `${purityPref}K Hallmarked Gold`}
              </span>
              {shortlist.length > 0
                ? ` with ${shortlist.length} shortlisted ${shortlist.length === 1 ? 'piece' : 'pieces'}`
                : selectedCategories.length > 0
                  ? ` across ${selectedCategories.slice(0, 3).join(', ')}`
                  : ''}
              . Connect directly with our Ahmedabad bullion &amp; jewellery desk.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                data-sc-magnet="0.28"
                data-sc-rise="0"
                className="store-btn-primary text-xs px-8 py-4"
              >
                Dispatch WhatsApp Trade Brief
                <ArrowUpRight size={15} />
              </a>

              <Link
                href="/collection"
                className="store-btn-ghost text-xs px-7 py-4"
              >
                Browse Complete Vault
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Architectural Colophon Plate */}
      <div className="bg-[#060405] border-t border-[var(--store-border)] pt-16 pb-24">
        <div className="sc-wrap">
          <div className="grid md:grid-cols-12 gap-10 pb-12 border-b border-[var(--store-border)]">
            <div className="md:col-span-4">
              <div className="flex items-center gap-3 mb-4">
                <TilakSymbol className="w-5 h-7 text-[var(--store-gold)]" />
                <span className="font-display text-xl tracking-[0.12em] uppercase text-[var(--sc-ink)]">
                  Swaminarayan Ornaments
                </span>
              </div>
              <p className="text-sm text-[var(--store-muted)] leading-relaxed max-w-sm mb-5">
                Premier wholesale manufacturer &amp; distributor of 92 and 84 carat gold ornaments.
                Serving retail showrooms with certified purity and heritage craftsmanship.
              </p>
              <div className="space-y-2 text-xs text-[var(--store-muted)]">
                <p className="flex items-center gap-2">
                  <MapPin size={14} className="text-[var(--store-gold)] shrink-0" />
                  <span>Maneckchowk &amp; CG Road Bullion Corridor, Ahmedabad, Gujarat</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={14} className="text-[var(--store-gold)] shrink-0" />
                  <span>Mon – Sat · 11:00 AM – 8:00 PM IST (B2B Showroom)</span>
                </p>
                <p className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[var(--store-gold)] shrink-0" />
                  <span>BIS 916 (92K) &amp; 833 (84K) XRF Verified Lots</span>
                </p>
              </div>
            </div>

            <div className="md:col-span-3">
              <p className="sc-label text-[10px] text-[var(--store-gold)] mb-4">
                Scroll Acts &amp; Navigation
              </p>
              <ul className="space-y-2.5 text-sm text-[var(--store-muted)]">
                {[
                  { label: 'Act I · Sovereign Hero', href: '/#hero' },
                  { label: 'Act II · Metallurgical Assay', href: '/#assay' },
                  { label: 'Act III · Goldsmith’s Crucible', href: '/#crucible' },
                  { label: 'Act IV · Exhibition Rail', href: '/#exhibition' },
                  { label: 'Act V · 18-Category Vault', href: '/#categories' },
                  { label: 'Act VI · Trade Dossier Desk', href: '/#about' },
                  { label: 'Full Wholesale Catalog', href: '/collection' },
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="hover:text-[var(--store-gold-soft)] transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-5">
              <p className="sc-label text-[10px] text-[var(--store-gold)] mb-4">
                Wholesale Departments
              </p>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5 text-sm text-[var(--store-muted)]">
                {topCats.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/collection?category=${encodeURIComponent(c.name)}`}
                      className="hover:text-[var(--store-gold-soft)] transition-colors truncate block"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--store-muted)]/75">
            <p>© {new Date().getFullYear()} Swaminarayan Ornaments. All rights reserved.</p>
            <p className="font-mono text-[11px] text-[var(--store-gold)]/80">
              92K &amp; 84K WHOLESALE GOLD · AHMEDABAD, INDIA
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
