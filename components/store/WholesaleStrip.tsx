'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Award, Scale, Shield, Sparkles, ArrowRight } from 'lucide-react';

const ASSAY_SPECS = {
  92: {
    carat: 92,
    code: 'BIS 916 / 92.0% AU',
    title: '92 Carat Sovereign Melt',
    fineGold: 92.0,
    silverCopper: 8.0,
    luster: 'Deep Warm Sovereign Yellow',
    tensile: 'Heirloom Malleability — Ideal for Jadtar, Kundan & Heavy Filigree',
    idealFor: ['Bridal Sets', 'Necklaces', 'Temple Jewellery', 'Kundan', 'Kada', 'Bangles'],
    summary:
      'Engineered for high-value bridal trousseaus and ceremonial investment pieces where rich 22K color saturation and hand-burnished kundan seating are paramount.',
  },
  84: {
    carat: 84,
    code: 'BIS 833 / 84.0% AU',
    title: '84 Carat Structural Melt',
    fineGold: 84.0,
    silverCopper: 16.0,
    luster: 'Bright Champagne Gold',
    tensile: 'High Clasp & Link Strength — Ideal for Daily Wear & Intricate Chains',
    idealFor: ['Chains', 'Mangalsutra', 'Earrings', 'Rings', 'Bracelets', 'Nose Pins'],
    summary:
      'Formulated for fast-moving retail inventory requiring superior structural rigidity on delicate clasps, hollow rope links, and micro-stone settings.',
  },
} as const;

export default function WholesaleStrip() {
  const [selectedAssay, setSelectedAssay] = useState<92 | 84>(92);
  const spec = ASSAY_SPECS[selectedAssay];

  return (
    <section
      id="assay"
      data-sc-act="flow"
      data-sc-drift="#11090B"
      className="pt-10 pb-20 md:pt-14 md:pb-28 border-y border-[var(--store-border)] relative overflow-hidden"
    >
      <div className="sc-wrap">
        {/* Top Stat Ledger — Entry Counters driven by ScrollCraft data-sc-count */}
        <div
          data-sc-in
          data-sc-stagger="70"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16"
        >
          <div className="sc-vault-card rounded-2xl p-6 md:p-7">
            <p className="sc-label text-[10px] text-[var(--store-gold)] mb-2">
              01 · Heritage Lineage
            </p>
            <div className="font-display text-4xl md:text-5xl text-[var(--sc-ink)] sc-nums">
              <span data-sc-count="0 25">25</span>+
            </div>
            <p className="text-xs text-[var(--store-muted)] mt-2 leading-relaxed">
              Years of master goldsmithing in Ahmedabad&apos;s historic bullion district.
            </p>
          </div>

          <div className="sc-vault-card rounded-2xl p-6 md:p-7">
            <p className="sc-label text-[10px] text-[var(--store-gold)] mb-2">
              02 · Primary Melt Standard
            </p>
            <div className="font-display text-4xl md:text-5xl text-[var(--store-gold-soft)] sc-nums">
              <span data-sc-count="0 92">92</span>K
            </div>
            <p className="text-xs text-[var(--store-muted)] mt-2 leading-relaxed">
              Paired with 84K precision lines — XRF spectrometer verified on every batch.
            </p>
          </div>

          <div className="sc-vault-card rounded-2xl p-6 md:gap-7">
            <p className="sc-label text-[10px] text-[var(--store-gold)] mb-2">
              03 · Catalog Breadth
            </p>
            <div className="font-display text-4xl md:text-5xl text-[var(--sc-ink)] sc-nums">
              <span data-sc-count="0 18">18</span>
            </div>
            <p className="text-xs text-[var(--store-muted)] mt-2 leading-relaxed">
              Distinct wholesale departments from heavy bridal haars to daily chains.
            </p>
          </div>

          <div className="sc-vault-card rounded-2xl p-6 md:p-7">
            <p className="sc-label text-[10px] text-[var(--store-gold)] mb-2">
              04 · Retail Network
            </p>
            <div className="font-display text-4xl md:text-5xl text-[var(--sc-ink)] sc-nums">
              <span data-sc-count="0 500">500</span>+
            </div>
            <p className="text-xs text-[var(--store-muted)] mt-2 leading-relaxed">
              Partner showrooms and bullion distributors supplied across India.
            </p>
          </div>
        </div>

        {/* Interactive Metallurgical Assay Comparator */}
        <div
          data-sc-in
          data-sc-spotlight
          className="sc-vault-card rounded-3xl p-6 sm:p-8 lg:p-12 relative overflow-hidden"
        >
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5">
              <p className="sc-label text-[10px] text-[var(--store-gold)] mb-3">
                Act II · Interactive Metallurgical Bench
              </p>
              <h2 className="sc-display sc-display--md text-[var(--sc-ink)] mb-4">
                Two purities. Zero compromise on touch.
              </h2>
              <p className="sc-body text-sm md:text-base mb-6">
                Select a purity grade to inspect the exact alloy ratio, mechanical strength,
                and category allocation used across our wholesale production lines.
              </p>

              {/* Purity Toggle Switch */}
              <div
                className="inline-flex p-1.5 rounded-2xl bg-black/40 border border-[var(--store-border)] mb-6"
                role="tablist"
                aria-label="Select gold purity specification"
              >
                {([92, 84] as const).map((carat) => (
                  <button
                    key={carat}
                    type="button"
                    role="tab"
                    aria-selected={selectedAssay === carat}
                    onClick={() => setSelectedAssay(carat)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-widest transition-all ${
                      selectedAssay === carat
                        ? 'bg-[var(--store-gold)] text-[#080607] font-semibold shadow-lg'
                        : 'text-[var(--store-muted)] hover:text-[var(--sc-ink)]'
                    }`}
                  >
                    {carat} Carat ({carat === 92 ? '92.0%' : '84.0%'})
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--store-border)]">
                <div className="flex items-center gap-2 text-xs text-[var(--store-muted)]">
                  <Shield size={14} className="text-[var(--store-gold)] shrink-0" />
                  <span>XRF Assayed</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--store-muted)]">
                  <Scale size={14} className="text-[var(--store-gold)] shrink-0" />
                  <span>Zero Under-Karating</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--store-muted)]">
                  <Award size={14} className="text-[var(--store-gold)] shrink-0" />
                  <span>Trade Ready</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Metallurgical Dossier Readout */}
            <div className="lg:col-span-7 rounded-2xl border border-[var(--store-gold)]/20 bg-[#0b0809]/90 p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[var(--store-border)]">
                <div>
                  <span className="sc-label text-[10px] text-[var(--store-gold)]">
                    {spec.code}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl text-[var(--sc-ink)] mt-1">
                    {spec.title}
                  </h3>
                </div>
                <Link
                  href={`/collection?carat=${spec.carat}`}
                  className="store-btn-ghost py-2 px-4 text-[10px]"
                >
                  Filter {spec.carat}K Catalog
                  <ArrowRight size={13} />
                </Link>
              </div>

              {/* Alloy Composition Bar */}
              <div className="my-6">
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-[var(--store-gold-soft)]">
                    Fine Gold (Au): {spec.fineGold.toFixed(1)}%
                  </span>
                  <span className="text-[var(--store-muted)]">
                    Structural Silver/Copper Alloy: {spec.silverCopper.toFixed(1)}%
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-white/[0.06] overflow-hidden flex p-0.5 border border-[var(--store-border)]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${spec.fineGold}%`,
                      background: 'linear-gradient(90deg, #B8860B, #D4AF37, #FFD700)',
                    }}
                  />
                </div>
              </div>

              <p className="text-sm text-[var(--store-muted)] leading-relaxed mb-6">
                {spec.summary}
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl bg-white/[0.02] border border-[var(--store-border)] p-3.5">
                  <p className="sc-label text-[9px] text-[var(--store-muted)]">Optical Finish</p>
                  <p className="text-xs text-[var(--sc-ink)] font-medium mt-1">{spec.luster}</p>
                </div>
                <div className="rounded-xl bg-white/[0.02] border border-[var(--store-border)] p-3.5">
                  <p className="sc-label text-[9px] text-[var(--store-muted)]">
                    Mechanical Profile
                  </p>
                  <p className="text-xs text-[var(--sc-ink)] font-medium mt-1">{spec.tensile}</p>
                </div>
              </div>

              <div>
                <p className="sc-label text-[10px] text-[var(--store-muted)] mb-2.5 flex items-center gap-1.5">
                  <Sparkles size={11} className="text-[var(--store-gold)]" />
                  Primary {spec.carat}K Category Lines
                </p>
                <div className="flex flex-wrap gap-2">
                  {spec.idealFor.map((catName) => (
                    <Link
                      key={catName}
                      href={`/collection?category=${encodeURIComponent(catName)}&carat=${spec.carat}`}
                      className="px-3 py-1 rounded-full text-xs border border-[var(--store-gold)]/25 bg-[var(--store-gold)]/[0.06] text-[var(--store-gold-soft)] hover:bg-[var(--store-gold)] hover:text-[#080607] transition-colors"
                    >
                      {catName}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
