'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Eye, Sparkles, Check, Plus, Crosshair } from 'lucide-react';
import type { Product } from '@/lib/data';
import { useTradeDossier } from './TradeDossierContext';

interface CraftCrucibleActProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

const BLUEPRINT_SPECIMENS = [
  {
    key: 'haar',
    title: 'Royal Kundan & Emerald Haar',
    subtitle: 'Bridal Collar · 92 Carat Gold',
    carat: 92 as const,
    category: 'Necklaces',
    image: '/images/emerald_necklace.png',
    dimensions: 'Inner Ø 142mm · Drop 68mm · 48 Hand-Set Polki Units',
    tolerance: '±0.02mm Bezel Wall · 24K Kundan Foil',
    focalNote: 'Emerald Cabochon & Uncut Polki Jadtar Cluster',
  },
  {
    key: 'kada',
    title: 'Heritage Rajasthani Filigree Kada',
    subtitle: 'Artisan Bangle Set · 92 Carat Gold',
    carat: 92 as const,
    category: 'Bangles',
    image: '/images/emerald_bangle.png',
    dimensions: 'Bangle Size 2.4–2.8 · Wall 3.8mm · Screw-Lock Hinge',
    tolerance: 'Micro-Rava Granulation · 0.4mm Gold Wire',
    focalNote: 'Hand-Pierced Jali Lattice & Meenakari Inner Rim',
  },
  {
    key: 'jhumka',
    title: 'Celestial Temple Sanctuary Jhumka',
    subtitle: 'Cascading Bell Drop · 84 Carat Gold',
    carat: 84 as const,
    category: 'Earrings',
    image: '/images/emerald_earrings.png',
    dimensions: 'Height 64mm · Bell Ø 28mm · Reinforced Ear Post',
    tolerance: '84K High-Tensile Stem · Cultured Pearl Fringe',
    focalNote: 'Repoussé Temple Dome & Acoustic Gold Ghungroo Drops',
  },
];

export default function CraftCrucibleAct({
  products,
  onSelectProduct,
}: CraftCrucibleActProps) {
  const [specimenIdx, setSpecimenIdx] = useState(0);
  const [loupeActive, setLoupeActive] = useState(false);
  const [loupePos, setLoupePos] = useState({ x: 50, y: 50 });
  const stageBoxRef = useRef<HTMLDivElement>(null);
  const { toggleShortlist, isShortlisted } = useTradeDossier();

  const current = BLUEPRINT_SPECIMENS[specimenIdx];
  const matchedProduct =
    products.find((p) => p.category === current.category) ?? products[0] ?? null;
  const inShortlist = matchedProduct ? isShortlisted(matchedProduct.id) : false;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!stageBoxRef.current) return;
    const rect = stageBoxRef.current.getBoundingClientRect();
    const x = Math.max(10, Math.min(90, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(10, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));
    setLoupePos({ x, y });
  };

  return (
    <section
      id="crucible"
      data-sc-act="pin"
      data-sc-span="2.8"
      data-sc-dwell="0.28"
      data-sc-drift="#16090D"
      className="relative"
    >
      <div
        data-sc-stage
        data-sc-spotlight
        className="sc-stage relative flex items-center overflow-hidden"
      >
        {/* Subtle technical grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(212,175,55,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,175,55,0.35) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
          aria-hidden="true"
        />

        <div className="sc-wrap relative z-20 w-full pt-16 pb-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT: 4-Stage Pinned Craft Argument (ScrollCraft Cues) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="sc-label text-[10px] tracking-[0.24em] text-[var(--store-gold)]">
                Act III · The Goldsmith&apos;s Crucible (Peak)
              </span>
              <span className="sc-label text-[10px] text-[var(--store-muted)]">
                Scroll to draft &amp; reveal
              </span>
            </div>

            {/* Overlapping Cues Window */}
            <div className="relative min-h-[290px] sm:min-h-[320px] flex items-center">
              {/* Stage 01: Greet cue (0 -> 0.30, rIn=0) */}
              <div data-sc-cue="0 0.30 0" className="w-full">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--store-gold-soft)] mb-2">
                  Phase 01 / 04 · Ghaat &amp; Chassis Forging
                </p>
                <h2 className="sc-display sc-display--md text-[var(--sc-ink)] mb-4">
                  Drafted by hand before a single gram is poured.
                </h2>
                <p className="sc-body text-sm sm:text-base mb-6">
                  Every bridal collar and temple kada begins as an articulated wax-and-wire
                  blueprint. Master <em>ghaat</em> artisans calibrate link articulation so a
                  150-gram necklace sits flush against the collarbone without torque.
                </p>
                <div className="rounded-xl border border-[var(--store-gold)]/25 bg-black/35 p-3.5 text-xs font-mono text-[var(--store-gold-soft)]">
                  CAD + Hand Ghaat Tolerance: {current.tolerance}
                </div>
              </div>

              {/* Stage 02: (0.24 -> 0.56) */}
              <div
                data-sc-cue="0.24 0.56"
                className="w-full absolute inset-0 flex flex-col justify-center pointer-events-none"
              >
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--store-gold-soft)] mb-2">
                  Phase 02 / 04 · Chilai &amp; Filigree Architecture
                </p>
                <h2 className="sc-display sc-display--md text-[var(--sc-ink)] mb-4">
                  Light carved directly into 92-carat gold.
                </h2>
                <p className="sc-body text-sm sm:text-base mb-6">
                  Through diamond-tipped <em>chilai</em> engraving and sub-millimeter
                  <em> rava</em> granulation, our karigars multiply surface reflectivity —
                  delivering maximum visual volume per gram for retail display cases.
                </p>
                <div className="rounded-xl border border-[var(--store-gold)]/25 bg-black/35 p-3.5 text-xs font-mono text-[var(--store-gold-soft)]">
                  Geometry Spec: {current.dimensions}
                </div>
              </div>

              {/* Stage 03: (0.50 -> 0.80) */}
              <div
                data-sc-cue="0.50 0.80"
                className="w-full absolute inset-0 flex flex-col justify-center pointer-events-none"
              >
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--store-gold-soft)] mb-2">
                  Phase 03 / 04 · 24K Foil Jadtar &amp; Kundan Setting
                </p>
                <h2 className="sc-display sc-display--md text-[var(--sc-ink)] mb-4">
                  Pure 24-carat ribbons lock every stone in place.
                </h2>
                <p className="sc-body text-sm sm:text-base mb-6">
                  Where ordinary commercial pieces rely on adhesives, traditional Ahmedabad
                  <em> jadtar</em> seats each uncut diamond and emerald in hyper-malleable
                  24K gold foil — creating a molecular bond and warm internal glow.
                </p>
                <div className="rounded-xl border border-[var(--store-gold)]/25 bg-black/35 p-3.5 text-xs font-mono text-[var(--store-gold-soft)]">
                  Setting Focus: {current.focalNote}
                </div>
              </div>

              {/* Stage 04: (0.74 -> 0.99) — closes at 0.99 per devices.md §2 (middle acts must close) */}
              <div
                data-sc-cue="0.74 0.99"
                className="w-full absolute inset-0 flex flex-col justify-center pointer-events-none"
              >
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--store-gold-soft)] mb-2">
                  Phase 04 / 04 · XRF Assay &amp; Trade Seal
                </p>
                <h2 className="sc-display sc-display--md text-[var(--sc-ink)] mb-4">
                  Hallmarked, barcoded, and ready for your vault.
                </h2>
                <p className="sc-body text-sm sm:text-base mb-6">
                  Each finished piece undergoes final ultrasonic polishing and multi-point XRF
                  testing before receiving its 92K or 84K purity stamp for immediate B2B
                  showroom allocation.
                </p>
                {matchedProduct && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(matchedProduct)}
                      className="store-btn-primary py-2.5 px-5 text-[10px]"
                    >
                      <Eye size={13} />
                      Inspect Full Spec Sheet
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleShortlist(matchedProduct)}
                      className="store-btn-ghost py-2.5 px-5 text-[10px]"
                    >
                      {inShortlist ? <Check size={13} /> : <Plus size={13} />}
                      {inShortlist ? 'Shortlisted in Dossier' : 'Add to Trade Dossier'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Specimen Switcher */}
            <div className="mt-6 pt-5 border-t border-[var(--store-border)]">
              <p className="sc-label text-[10px] text-[var(--store-muted)] mb-3">
                Select Crucible Specimen &amp; Hover Stage for 2.2× Assay Loupe
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {BLUEPRINT_SPECIMENS.map((item, idx) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSpecimenIdx(idx)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      specimenIdx === idx
                        ? 'border-[var(--store-gold)] bg-[var(--store-gold)]/12 text-[var(--sc-ink)]'
                        : 'border-[var(--store-border)] bg-white/[0.02] text-[var(--store-muted)] hover:text-[var(--sc-ink)]'
                    }`}
                  >
                    <span className="block font-mono text-[9px] text-[var(--store-gold)]">
                      0{idx + 1} · {item.carat}K
                    </span>
                    <span className="block font-display text-sm truncate mt-0.5">
                      {item.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Signature Move — Scroll-Driven SVG Blueprint + Iris Wipe + Interactive Loupe */}
          <div className="lg:col-span-7">
            <div
              ref={stageBoxRef}
              onPointerEnter={() => setLoupeActive(true)}
              onPointerLeave={() => setLoupeActive(false)}
              onPointerMove={handlePointerMove}
              className="sc-vault-card relative aspect-[4/3.6] sm:aspect-[16/12] rounded-[2rem] overflow-hidden select-none"
            >
              {/* LAYER A: Architectural Goldsmith SVG Blueprint (Always present as ground, strokes driven by --sc-p) */}
              <div className="absolute inset-0 flex items-center justify-center p-6 bg-[#0b0709]">
                <svg
                  viewBox="0 0 800 600"
                  className="w-full h-full text-[var(--store-gold)]/55"
                  fill="none"
                >
                  {/* Outer technical frame & crosshairs */}
                  <rect
                    x="28"
                    y="28"
                    width="744"
                    height="544"
                    rx="20"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="6 6"
                  />
                  <line x1="400" y1="28" x2="400" y2="572" stroke="currentColor" strokeWidth="0.6" strokeDasharray="4 8" />
                  <line x1="28" y1="300" x2="772" y2="300" stroke="currentColor" strokeWidth="0.6" strokeDasharray="4 8" />

                  {/* Scroll-drafted concentric goldsmith caliper curves */}
                  <circle
                    cx="400"
                    cy="300"
                    r="210"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="sc-blueprint-stroke"
                  />
                  <circle
                    cx="400"
                    cy="300"
                    r="155"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    className="sc-blueprint-stroke"
                  />
                  <path
                    d="M 190 300 C 190 160, 610 160, 610 300 C 610 450, 190 450, 190 300 Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="sc-blueprint-stroke"
                  />
                  <polygon
                    points="400,75 595,300 400,525 205,300"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="sc-blueprint-stroke"
                  />

                  {/* Technical dimension callouts */}
                  <text x="48" y="62" fill="currentColor" fontSize="11" fontFamily="monospace">
                    SCHEMATIC // SWAMINARAYAN-ATELIER-{current.carat}K
                  </text>
                  <text x="48" y="550" fill="currentColor" fontSize="11" fontFamily="monospace">
                    AXIS: SYMMETRIC JADTAR · FOIL: 24K · BODY: {current.carat}.0% AU
                  </text>
                  <text x="590" y="62" fill="currentColor" fontSize="11" fontFamily="monospace">
                    SCALE 1:1 · XRF CERTIFIED
                  </text>
                </svg>

                {/* Wireframe ghost of the ornament */}
                <div className="pointer-events-none absolute inset-10 opacity-30 mix-blend-luminosity">
                  <Image
                    src={current.image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 90vw, 600px"
                    className="object-contain p-8 filter contrast-150 sepia"
                  />
                </div>
              </div>

              {/* LAYER B: ScrollCraft Iris Wipe Reveal of the Finished High-Jewellery Piece */}
              <div
                data-sc-reveal="iris"
                data-sc-reveal-at="0.08 0.65"
                className="absolute inset-0 bg-gradient-to-br from-[#1b1115] via-[#100a0c] to-[#080607] flex items-center justify-center"
              >
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 48%, rgba(212,175,55,0.22) 0%, transparent 66%)',
                  }}
                />
                <div className="relative w-full h-full p-8 sm:p-12">
                  <Image
                    src={current.image}
                    alt={current.title}
                    fill
                    sizes="(max-width: 1024px) 90vw, 640px"
                    className="object-contain p-6 sm:p-10 drop-shadow-[0_30px_50px_rgba(0,0,0,0.9)]"
                  />
                </div>
              </div>

              {/* LAYER C: Interactive 2.2x Goldsmith's Assay Loupe (Pointer-tracked on fine pointers) */}
              {loupeActive && (
                <div
                  className="pointer-events-none hidden md:block absolute z-30 w-44 h-44 rounded-full border-2 border-[var(--store-gold)] shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_0_24px_rgba(212,175,55,0.35)] overflow-hidden bg-[#140d10]"
                  style={{
                    left: `${loupePos.x}%`,
                    top: `${loupePos.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div
                    className="relative w-full h-full"
                    style={{
                      transform: `scale(2.25)`,
                      transformOrigin: `${loupePos.x}% ${loupePos.y}%`,
                    }}
                  >
                    <Image
                      src={current.image}
                      alt=""
                      fill
                      sizes="400px"
                      className="object-contain p-4"
                    />
                  </div>
                  <div className="absolute bottom-2 inset-x-0 text-center">
                    <span className="px-2 py-0.5 rounded bg-black/80 text-[8px] font-mono uppercase tracking-widest text-[var(--store-gold)]">
                      2.2× Assay Loupe
                    </span>
                  </div>
                </div>
              )}

              {/* Top & Bottom HUD Telemetry Overlays */}
              <div className="pointer-events-none absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-[var(--store-gold)]/25">
                  <Sparkles size={12} className="text-[var(--store-gold)]" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--sc-ink)]">
                    {current.title}
                  </span>
                </div>
                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-[var(--store-border)] text-[10px] font-mono text-[var(--store-gold-soft)]">
                  <Crosshair size={12} />
                  Hover to Magnify
                </div>
              </div>

              <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-[10px] font-mono text-[var(--store-muted)] bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[var(--store-border)]">
                <span>{current.subtitle}</span>
                <span className="text-[var(--store-gold)]">{current.dimensions}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
