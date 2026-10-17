'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Sparkles, Compass, Layers } from 'lucide-react';
import { useTradeDossier } from './TradeDossierContext';

const HERO_SPECIMENS = [
  {
    id: 'Royal Kundan Haar',
    title: 'Royal Kundan & Emerald Haar',
    code: 'LOT #SO-92K-014',
    carat: 92,
    weight: '148.5g Net Gold',
    craft: 'Uncut Polki & 24K Foil Jadtar',
    image: '/images/emerald_necklace.png',
  },
  {
    id: 'Heritage Gold Bangles',
    title: 'Rajasthani Filigree Kada Pair',
    code: 'LOT #SO-92K-088',
    carat: 92,
    weight: '86.2g Net Gold',
    craft: 'Hand-pierced Chilai & Rava Work',
    image: '/images/emerald_bangle.png',
  },
  {
    id: 'Celestial Jhumka',
    title: 'Temple Sanctuary Jhumka',
    code: 'LOT #SO-84K-039',
    carat: 84,
    weight: '42.8g Net Gold',
    craft: ' dome Granulation & Pearl Drops',
    image: '/images/emerald_earrings.png',
  },
];

export default function StoreHero() {
  const [activeIdx, setActiveIdx] = useState(0);
  const specimen = HERO_SPECIMENS[activeIdx];
  const { setDrawerOpen, shortlist } = useTradeDossier();

  return (
    <section
      id="hero"
      data-sc-act="pin"
      data-sc-span="2.35"
      data-sc-dwell="0.28"
      data-sc-drift="#080607"
      className="relative"
    >
      <div
        data-sc-stage
        data-sc-spotlight
        className="sc-stage relative flex items-center overflow-hidden"
      >
        {/* PLANE 1: Far Environment — Architectural Temple Jali & Astronomical Vault (-1.4) */}
        <div
          data-sc-parallax="-1.4"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="store-hero-glow absolute inset-0" />
          <svg
            viewBox="0 0 1200 1200"
            className="w-[115vmax] max-w-none h-[115vmax] opacity-[0.14] text-[var(--store-gold)]"
            fill="none"
          >
            <circle
              cx="600"
              cy="600"
              r="520"
              stroke="currentColor"
              strokeWidth="0.75"
              strokeDasharray="4 10"
              className="sc-blueprint-ring"
            />
            <circle
              cx="600"
              cy="600"
              r="410"
              stroke="currentColor"
              strokeWidth="0.6"
            />
            <circle
              cx="600"
              cy="600"
              r="300"
              stroke="currentColor"
              strokeWidth="0.75"
              strokeDasharray="16 8"
            />
            {/* Sacred 8-point geometric star */}
            <rect
              x="310"
              y="310"
              width="580"
              height="580"
              stroke="currentColor"
              strokeWidth="0.5"
              transform="rotate(45 600 600)"
            />
            <rect
              x="310"
              y="310"
              width="580"
              height="580"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <line x1="600" y1="40" x2="600" y2="1160" stroke="currentColor" strokeWidth="0.4" />
            <line x1="40" y1="600" x2="1160" y2="600" stroke="currentColor" strokeWidth="0.4" />
          </svg>
        </div>

        {/* PLANE 2: Midground Monumental Typography & Satellite Jewels (-0.65) */}
        <div
          data-sc-parallax="-0.65"
          className="pointer-events-none absolute inset-0 flex items-center justify-between px-6 lg:px-16"
          aria-hidden="true"
        >
          <div className="select-none font-display text-[17vw] leading-none tracking-[-0.04em] text-[var(--store-gold)]/[0.045] whitespace-nowrap">
            SWAMINARAYAN
          </div>

          {/* Floating satellite ornament — upper right */}
          <div className="hidden xl:flex flex-col items-center justify-center w-44 h-52 rounded-2xl border border-[var(--store-gold)]/15 bg-[#120d0f]/75 backdrop-blur-md p-4 shadow-2xl translate-y-[-18vh] translate-x-[-2vw]">
            <div className="relative w-28 h-28">
              <Image
                src="/images/emerald_bangle.png"
                alt=""
                fill
                sizes="120px"
                className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.75)]"
              />
            </div>
            <span className="sc-label mt-2 text-[10px] text-[var(--store-gold-soft)]">
              92K Filigree Kada
            </span>
          </div>
        </div>

        {/* MAIN STAGE GRID */}
        <div className="sc-wrap relative z-20 w-full pt-16 md:pt-20 pb-10 grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* LEFT COLUMN: Plane 5 Typography & Two-Beat Scroll Narrative */}
          <div className="lg:col-span-6 xl:col-span-6 relative min-h-[370px] sm:min-h-[410px] flex items-center">
            {/* BEAT 1: Opening Greet Cue (0 -> 0.60, rIn = 0 so immediately 1.0 on first paint) */}
            <div
              data-sc-cue="0 0.60 0"
              className="w-full"
            >
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[var(--store-gold)]/25 bg-[var(--store-gold)]/[0.06] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--store-gold)] animate-pulse" />
                <span className="sc-label text-[10px] tracking-[0.22em] text-[var(--store-gold-soft)]">
                  Ahmedabad Wholesale Gold House · Est. 1999
                </span>
              </div>

              <h1
                data-sc-kinetic="lines"
                className="sc-display sc-display--xl sc-hero-headline text-[var(--sc-ink)] mb-6"
              >
                Sovereign gold, forged for the trade.
              </h1>

              <p className="sc-lede text-[var(--sc-ink-soft)] mb-8 max-w-[48ch]">
                Hallmarked <strong className="text-[var(--sc-ink)] font-medium">92 &amp; 84 carat</strong> bridal haars,
                temple kadas, and filigree ornaments — engineered for jewelers who demand
                certified melt purity and unmistakable presence.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/collection"
                  data-sc-magnet="0.26"
                  data-sc-rise="0"
                  className="store-btn-primary"
                >
                  Enter Wholesale Vault
                  <ArrowUpRight size={15} />
                </Link>
                <a
                  href="#crucible"
                  className="store-btn-ghost"
                >
                  Inspect Craft Blueprint
                </a>
              </div>

              <dl className="mt-10 pt-6 border-t border-[var(--store-border)] grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <dt className="sc-label text-[10px] text-[var(--store-muted)]">Melt Standard</dt>
                  <dd className="font-display text-2xl md:text-3xl text-[var(--store-gold-soft)] mt-1 sc-nums">
                    92K &amp; 84K
                  </dd>
                </div>
                <div>
                  <dt className="sc-label text-[10px] text-[var(--store-muted)]">Trade Lines</dt>
                  <dd className="font-display text-2xl md:text-3xl text-[var(--sc-ink)] mt-1 sc-nums">
                    18 Categories
                  </dd>
                </div>
                <div>
                  <dt className="sc-label text-[10px] text-[var(--store-muted)]">Dispatch</dt>
                  <dd className="font-display text-2xl md:text-3xl text-[var(--sc-ink)] mt-1">
                    B2B Direct
                  </dd>
                </div>
              </dl>
            </div>

            {/* BEAT 2: Mid-Pin Narrative Hand-Off (0.50 -> 0.98) */}
            <div
              data-sc-cue="0.50 0.98"
              className="w-full absolute inset-0 flex flex-col justify-center pointer-events-none"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--store-gold)]/30 bg-[#171013]/90 w-fit mb-5">
                <ShieldCheck size={13} className="text-[var(--store-gold)]" />
                <span className="sc-label text-[10px] tracking-[0.2em] text-[var(--store-gold)]">
                  Verified Metallurgical Provenance
                </span>
              </div>

              <h2 className="sc-display sc-display--lg text-[var(--sc-ink)] mb-5">
                Every gram assayed.
                <br />
                <span className="italic font-normal text-[var(--store-gold-soft)]">
                  Every setting hand-locked.
                </span>
              </h2>

              <p className="sc-body text-base md:text-lg mb-7 max-w-[46ch]">
                Unlike mass-cast catalog houses, each Swaminarayan lot passes through three
                stages in our Ahmedabad atelier: XRF光谱 melt verification, hand-chiseled
                <em> chilai</em> faceting, and 24K foil-seated Kundan setting.
              </p>

              <div className="grid sm:grid-cols-2 gap-3.5 max-w-lg mb-7">
                <div className="sc-vault-card rounded-xl p-4">
                  <p className="sc-label text-[10px] text-[var(--store-gold)]">92 Carat Line</p>
                  <p className="font-display text-xl text-[var(--sc-ink)] mt-1">
                    91.6% – 92.0% Fine Au
                  </p>
                  <p className="text-xs text-[var(--store-muted)] mt-1">
                    Heirloom bridal sets, kundan haars &amp; heavy temple kadas.
                  </p>
                </div>
                <div className="sc-vault-card rounded-xl p-4">
                  <p className="sc-label text-[10px] text-[var(--store-gold-soft)]">84 Carat Line</p>
                  <p className="font-display text-xl text-[var(--sc-ink)] mt-1">
                    83.3% – 84.0% Fine Au
                  </p>
                  <p className="text-xs text-[var(--store-muted)] mt-1">
                    High-tensile daily chains, jhumkas, rings &amp; mangalsutras.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="store-btn-primary"
                >
                  Configure Trade Dossier ({shortlist.length})
                </button>
                <Link href="/collection?carat=92" className="store-btn-ghost">
                  Explore 92K Lots
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Plane 3 Focal Subject (-0.20) + 3D Pointer Tilt + Plane 4 Near Frame (+0.45) */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center">
            {/* PLANE 3: Focal Jewel Pedestal */}
            <div
              data-sc-parallax="-0.2"
              className="relative w-full max-w-[500px] mx-auto"
            >
              <div
                data-sc-tilt="7"
                className="sc-vault-card relative aspect-[4/4.6] rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between overflow-hidden group"
              >
                {/* Inner architectural arch & radial gold halo */}
                <div
                  className="pointer-events-none absolute inset-3 rounded-[1.5rem] border border-[var(--store-gold)]/20"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 42%, rgba(212,175,55,0.20) 0%, rgba(138,28,41,0.12) 45%, transparent 72%)',
                  }}
                  aria-hidden="true"
                />

                {/* Top Vitrine Telemetry Bar */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-[var(--store-gold)] text-[#080607] font-semibold">
                      {specimen.carat}K HALLMARK
                    </span>
                    <span className="sc-label text-[10px] text-[var(--store-muted)] hidden sm:inline">
                      {specimen.code}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[var(--store-gold-soft)]">
                    <Sparkles size={12} />
                    {specimen.weight}
                  </span>
                </div>

                {/* Centerpiece High-Resolution Cutout Image */}
                <div className="relative z-10 my-auto aspect-square w-full max-h-[310px] sm:max-h-[350px] mx-auto flex items-center justify-center">
                  <Image
                    key={specimen.image}
                    src={specimen.image}
                    alt={specimen.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 85vw, 460px"
                    className="object-contain p-2 sm:p-4 drop-shadow-[0_28px_42px_rgba(0,0,0,0.85)] transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>

                {/* Bottom Specimen Caption & Interactive Specimen Switcher */}
                <div className="relative z-10 pt-4 border-t border-[var(--store-border)] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <p className="sc-label text-[10px] text-[var(--store-gold)]">
                      {specimen.craft}
                    </p>
                    <h3 className="font-display text-xl sm:text-2xl text-[var(--sc-ink)] mt-0.5">
                      {specimen.title}
                    </h3>
                  </div>

                  {/* Specimen switcher pills */}
                  <div className="flex items-center gap-1.5" role="tablist" aria-label="Hero showcase pieces">
                    {HERO_SPECIMENS.map((item, idx) => (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={activeIdx === idx}
                        onClick={() => setActiveIdx(idx)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all ${
                          activeIdx === idx
                            ? 'bg-[var(--store-gold)] text-[#080607] font-semibold'
                            : 'bg-white/[0.04] text-[var(--store-muted)] hover:text-[var(--sc-ink)] border border-[var(--store-border)]'
                        }`}
                      >
                        0{idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* PLANE 4: Near Foreground Overlapping Callout Badge (+0.45) */}
            <div
              data-sc-parallax="0.45"
              className="hidden sm:flex items-center gap-3.5 absolute -bottom-5 -left-4 xl:-left-8 z-30 rounded-2xl border border-[var(--store-gold)]/30 bg-[#0d090b]/95 backdrop-blur-xl px-4 py-3.5 shadow-2xl"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--store-gold)]/15 border border-[var(--store-gold)]/30 flex items-center justify-center text-[var(--store-gold)]">
                <Compass size={18} />
              </div>
              <div>
                <p className="sc-label text-[9px] text-[var(--store-gold)]">
                  Spatial Depth Plane · 04
                </p>
                <p className="font-display text-sm text-[var(--sc-ink)]">
                  XRF Tested · 916 &amp; 833 Purity
                </p>
              </div>
            </div>

            <div
              data-sc-parallax="0.35"
              className="hidden md:flex items-center gap-3 absolute -top-4 -right-2 xl:-right-6 z-30 rounded-2xl border border-[var(--store-border)] bg-[#0d090b]/90 backdrop-blur-xl px-4 py-2.5 shadow-2xl"
            >
              <Layers size={14} className="text-[var(--store-gold-soft)]" />
              <span className="sc-label text-[10px] text-[var(--sc-ink)]">
                Direct Showroom &amp; Pan-India B2B
              </span>
            </div>
          </div>
        </div>

        {/* Section Floor Gradient (devices.md §6: hides plane clip lines at bottom edge) */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--sc-canvas)] via-[var(--sc-canvas)]/60 to-transparent z-20"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
