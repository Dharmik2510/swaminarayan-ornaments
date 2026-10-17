'use client';

import { Building2, Calendar, FileSpreadsheet, Gem, Send, Trash2, Sparkles } from 'lucide-react';
import { useTradeDossier, type InquiryMode, type PurityPreference } from './TradeDossierContext';

const INQUIRY_MODES: { id: InquiryMode; label: string; sub: string; icon: typeof Building2 }[] = [
  {
    id: 'showroom',
    label: 'Showroom Visit',
    sub: 'Private viewing in Ahmedabad',
    icon: Calendar,
  },
  {
    id: 'catalog',
    label: 'Rate & Lot Sheet',
    sub: 'Wholesale pricing & stock list',
    icon: FileSpreadsheet,
  },
  {
    id: 'custom',
    label: 'Custom Make',
    sub: 'Bespoke bridal or temple order',
    icon: Gem,
  },
];

const PURITY_OPTIONS: { id: PurityPreference; label: string }[] = [
  { id: 'both', label: '92K & 84K Both' },
  { id: '92', label: '92 Carat (916)' },
  { id: '84', label: '84 Carat (833)' },
];

export default function StoreAbout() {
  const {
    shortlist,
    removeFromShortlist,
    purityPref,
    setPurityPref,
    inquiryMode,
    setInquiryMode,
    selectedCategories,
    businessName,
    setBusinessName,
    city,
    setCity,
    buildWhatsAppUrl,
  } = useTradeDossier();

  return (
    <section
      id="about"
      data-sc-act="flow"
      data-sc-drift="#0D080A"
      className="sc-section border-t border-[var(--store-border)]"
    >
      <div className="sc-wrap grid lg:grid-cols-12 gap-12 lg:gap-14 items-start">
        {/* LEFT COLUMN: Heritage Narrative & 3-Step Wholesale Protocol */}
        <div data-sc-in className="lg:col-span-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--store-gold)]/25 bg-[var(--store-gold)]/[0.06] mb-4">
            <Sparkles size={12} className="text-[var(--store-gold)]" />
            <span className="sc-label text-[10px] text-[var(--store-gold)]">
              Act VI · Heritage &amp; Trade Desk
            </span>
          </div>

          <h2 className="sc-display sc-display--lg text-[var(--sc-ink)] mb-6">
            Gold that speaks softly,
            <br />
            <span className="italic font-normal text-[var(--store-gold-soft)]">
              sells with authority.
            </span>
          </h2>

          <p className="sc-body text-base mb-6">
            Rooted in Ahmedabad&apos;s storied goldsmithing quarter, Swaminarayan Ornaments
            partners with discerning retail jewelers who refuse to choose between artisanal
            <em> karigari</em> and dependable wholesale turnarounds.
          </p>

          <div className="space-y-4 mt-8">
            {[
              {
                step: '01',
                title: 'Curate Your Trade Dossier',
                desc: 'Shortlist pieces from our 92K & 84K catalog and select your showroom category focus.',
              },
              {
                step: '02',
                title: 'XRF Assay & Lot Verification',
                desc: 'Receive net gold weight breakdowns, melt certificates, and making-charge tiers.',
              },
              {
                step: '03',
                title: 'Showroom Viewing or Insured Dispatch',
                desc: 'Inspect lots in person at our Ahmedabad showroom or schedule insured B2B logistics.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="sc-vault-card rounded-2xl p-5 flex items-start gap-4"
              >
                <span className="font-mono text-xs text-[var(--store-gold)] px-2.5 py-1 rounded-lg bg-[var(--store-gold)]/10 border border-[var(--store-gold)]/25 shrink-0">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-display text-xl text-[var(--sc-ink)]">{item.title}</h3>
                  <p className="text-xs text-[var(--store-muted)] mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive B2B Trade Allocation & Inquiry Builder */}
        <div
          data-sc-in
          data-sc-spotlight
          className="lg:col-span-7 sc-vault-card rounded-3xl p-6 sm:p-8 md:p-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[var(--store-border)]">
            <div>
              <p className="sc-label text-[10px] text-[var(--store-gold)]">
                Interactive Allocation Desk
              </p>
              <h3 className="font-display text-2xl sm:text-3xl text-[var(--sc-ink)] mt-1">
                Configure Your Wholesale Brief
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[var(--store-gold)]/15 text-[var(--store-gold-soft)] border border-[var(--store-gold)]/30">
              {shortlist.length} {shortlist.length === 1 ? 'Piece' : 'Pieces'} Shortlisted
            </span>
          </div>

          {/* 1. Inquiry Mode Selector */}
          <div className="mt-6">
            <label className="block sc-label text-[10px] text-[var(--store-muted)] mb-3">
              1. Select Trade Requirement
            </label>
            <div className="grid sm:grid-cols-3 gap-3">
              {INQUIRY_MODES.map((m) => {
                const Icon = m.icon;
                const active = inquiryMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setInquiryMode(m.id)}
                    className={`text-left p-4 rounded-2xl border transition-all ${
                      active
                        ? 'border-[var(--store-gold)] bg-[var(--store-gold)]/12 text-[var(--sc-ink)]'
                        : 'border-[var(--store-border)] bg-white/[0.02] text-[var(--store-muted)] hover:text-[var(--sc-ink)]'
                    }`}
                  >
                    <Icon
                      size={16}
                      className={active ? 'text-[var(--store-gold)] mb-2' : 'text-[var(--store-muted)] mb-2'}
                    />
                    <p className="font-display text-base text-[var(--sc-ink)]">{m.label}</p>
                    <p className="text-[11px] text-[var(--store-muted)] mt-0.5">{m.sub}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Target Purity */}
          <div className="mt-6">
            <label className="block sc-label text-[10px] text-[var(--store-muted)] mb-3">
              2. Target Melt Purity
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {PURITY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPurityPref(opt.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-mono uppercase tracking-wider border transition-all ${
                    purityPref === opt.id
                      ? 'bg-[var(--store-gold)] text-[#080607] border-[var(--store-gold)] font-semibold'
                      : 'border-[var(--store-border)] bg-white/[0.02] text-[var(--store-muted)] hover:text-[var(--sc-ink)]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Firm Details */}
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="dossier-firm"
                className="block sc-label text-[10px] text-[var(--store-muted)] mb-2"
              >
                3. Showroom / Firm Name (Optional)
              </label>
              <input
                id="dossier-firm"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Royal Jewellers"
                className="store-input w-full"
              />
            </div>
            <div>
              <label
                htmlFor="dossier-city"
                className="block sc-label text-[10px] text-[var(--store-muted)] mb-2"
              >
                4. City / Market
              </label>
              <input
                id="dossier-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Ahmedabad, Mumbai, Surat"
                className="store-input w-full"
              />
            </div>
          </div>

          {/* 4. Shortlisted Pieces & Live Dispatch Preview */}
          <div className="mt-6 rounded-2xl border border-[var(--store-border)] bg-black/40 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="sc-label text-[10px] text-[var(--store-gold)]">
                Live Trade Dossier Summary
              </span>
              <span className="text-[11px] font-mono text-[var(--store-muted)]">
                Focus: {selectedCategories.slice(0, 4).join(', ') || 'All Categories'}
              </span>
            </div>

            {shortlist.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-3">
                {shortlist.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-[var(--store-gold)]/12 border border-[var(--store-gold)]/30 text-[var(--sc-ink)]"
                  >
                    <span>
                      {item.name} ({item.carat}K)
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromShortlist(item.id)}
                      className="text-[var(--store-muted)] hover:text-red-400"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={11} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--store-muted)] mt-1">
                Tip: Click <strong className="text-[var(--store-gold-soft)]">+ Shortlist</strong> on
                any piece across the page to attach specific ornaments to your inquiry.
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="store-btn-primary w-full sm:w-auto justify-center"
            >
              <Send size={14} />
              Dispatch Trade Dossier via WhatsApp
            </a>
            <span className="text-xs text-[var(--store-muted)]">
              Carries directly into the closing vault below ↓
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
