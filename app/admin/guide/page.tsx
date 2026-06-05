'use client';

import { motion } from 'framer-motion';
import {
  Package, Tag, Image as ImageIcon, LayoutDashboard, Info, ShieldCheck,
  Keyboard, Command, Trash2, History, Sparkles, Search, Filter, Bookmark,
  Eye, Edit3, Zap, AlertTriangle,
} from 'lucide-react';

type Section = {
  title: string;
  icon: typeof Package;
  description: string;
  tasks: Array<string | { label: string; detail: string }>;
};

export default function AdminGuide() {
  const sections: Section[] = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Your daily starting point — stats, alerts, and recent activity.',
      tasks: [
        { label: 'Stat cards', detail: 'Total / Active / Drafts / Featured counts at a glance.' },
        { label: 'Action needed', detail: 'Clickable cards surface products missing images, descriptions, or SEO — each link opens Products pre-filtered to what needs fixing.' },
        { label: 'Recent activity', detail: 'The last 15 admin actions (created, updated, deleted, duplicated). Click through to the full audit trail.' },
        { label: 'Recently added products', detail: 'Jump straight into editing the 5 newest products.' },
      ],
    },
    {
      title: 'Products — Browse & filter',
      icon: Package,
      description: 'Find anything in the catalog, fast.',
      tasks: [
        { label: 'Search', detail: 'Matches product name, description, and tags. Debounced — type freely.' },
        { label: 'Quick filters', detail: 'Category and status dropdowns. Use alongside search.' },
        { label: 'Advanced filters', detail: 'Featured only / not, missing image, missing description, missing SEO, created after a date. A badge shows how many advanced filters are active.' },
        { label: 'Saved views', detail: 'Combine filters you use often, hit “+ Save view”, and reapply in one click. Up to 10 are kept locally.' },
        { label: 'Table vs. grid', detail: 'Toggle in the toolbar. Table is better for scanning metadata; grid is better for visual QA of imagery.' },
        { label: 'Sorting', detail: 'Click any table header (Product, Category, Status, Added) to toggle sort direction.' },
      ],
    },
    {
      title: 'Products — Create & edit',
      icon: Edit3,
      description: 'Single-product creation with AI assist and live preview.',
      tasks: [
        { label: 'Add Product', detail: 'Fill name, description, carat (92K/84K), category, tags, images, SEO. Required fields are marked.' },
        { label: 'AI autofill', detail: 'After uploading an image, click the Sparkles button to generate a draft name, description, tags, and SEO from the photo. Review before saving.' },
        { label: 'Image reorder', detail: 'Drag image thumbnails to change order — the first image is the hero shown on the storefront.' },
        { label: 'Storefront preview', detail: 'Toggle the Eye icon to see how the product will appear to customers in its card and detail views.' },
        { label: 'Status', detail: '“Active” = visible on the storefront. “Draft” = hidden, still editable. “Archived” = hidden and parked.' },
        { label: 'Featured', detail: 'Pins the item into hero rotations on the storefront. Use sparingly.' },
        { label: 'Duplicate', detail: 'Copies a product as a new draft — faster than retyping specs for similar items.' },
      ],
    },
    {
      title: 'Bulk workflows',
      icon: Sparkles,
      description: 'Work on many products at once instead of one-by-one.',
      tasks: [
        { label: 'Bulk Add', detail: 'Drop up to 10 images at once. Each becomes a draft; AI autofill runs 3-at-a-time to generate metadata. Review, tweak, and publish them all together.' },
        { label: 'Bulk Select', detail: 'Tick the checkbox on any product row or card. Use the header checkbox to select the whole page.' },
        { label: 'Bulk Actions menu', detail: 'Once selected: set status (active / draft / archived), assign a category, or delete. Deletions > 5 items ask for confirmation.' },
        { label: 'More edits… drawer', detail: 'Add/remove tags, flip Featured on or off, switch carat, or append to descriptions with {{name}} and {{carat}} variables.' },
        { label: 'Undo delete', detail: 'A toast with “Undo” appears for ~6 seconds after any delete. Click it to revert before the delete finalizes.' },
      ],
    },
    {
      title: 'Categories',
      icon: Tag,
      description: 'The top-level navigation customers use to browse.',
      tasks: [
        { label: 'Create', detail: 'Add a new category with a name and slug (the URL-safe ID).' },
        { label: 'Edit', detail: 'Rename a category — products reassign automatically.' },
        { label: 'Delete', detail: 'Only safe when no products point to it. The Dashboard flags empty categories for cleanup.' },
      ],
    },
    {
      title: 'Media library',
      icon: ImageIcon,
      description: 'Every image used on the storefront, in one place.',
      tasks: [
        { label: 'Upload', detail: 'Drop files anywhere on the grid or click Upload. Images are auto-compressed before going to Firebase Storage.' },
        { label: 'Tags', detail: 'Tag images so you can find them later (e.g. “bridal”, “gold-chain”).' },
        { label: 'Usage awareness', detail: 'Deleting an image that’s used by a product prompts a confirmation showing which products reference it.' },
        { label: 'Copy URL', detail: 'The copy icon grabs the image URL for direct linking or pasting into a product.' },
      ],
    },
    {
      title: 'Trash',
      icon: Trash2,
      description: 'Deleted products live here for 30 days before auto-purge.',
      tasks: [
        { label: 'Restore', detail: 'One-click restore puts a product back into the catalog in its original status.' },
        { label: 'Bulk restore or purge', detail: 'Select multiple items and act on them at once.' },
        { label: 'Stale warning', detail: 'An amber banner appears when items are close to auto-purge — restore anything still needed.' },
        { label: 'Delete forever', detail: 'Permanent. Use when you’re certain — there is no second Trash.' },
      ],
    },
    {
      title: 'Activity log',
      icon: History,
      description: 'A complete audit trail of admin actions.',
      tasks: [
        { label: 'What’s tracked', detail: 'Creates, updates, deletes, and duplicates on products and categories — with actor and timestamp.' },
        { label: 'Filter', detail: 'By action type, entity type (product/category), actor, date range, or free-text search on name and actor.' },
        { label: 'Deep links', detail: 'Clicking a product entry opens its edit page — handy for “who changed this, and when?”' },
      ],
    },
  ];

  const hotkeys: Array<{ combo: string; action: string }> = [
    { combo: '⌘K  /  Ctrl+K  /  /', action: 'Open the command palette (search & jump)' },
    { combo: 'n', action: 'New product' },
    { combo: 'g then d', action: 'Go to Dashboard' },
    { combo: 'g then p', action: 'Go to Products' },
    { combo: 'g then c', action: 'Go to Categories' },
    { combo: 'g then m', action: 'Go to Media' },
    { combo: 'g then t', action: 'Go to Trash' },
    { combo: 'g then a', action: 'Go to Activity log' },
    { combo: '↑ / ↓', action: 'Navigate palette results' },
    { combo: '↵', action: 'Open highlighted result' },
    { combo: 'Esc', action: 'Close palette / drawer' },
  ];

  const tips: Array<{ title: string; detail: string; icon: typeof Zap; tone: 'tip' | 'warn' }> = [
    {
      icon: Zap,
      tone: 'tip',
      title: 'Start on the Dashboard',
      detail: 'The “Action needed” cards are your triage queue — clear those before adding new products.',
    },
    {
      icon: Search,
      tone: 'tip',
      title: 'Live with ⌘K',
      detail: 'It searches navigation, actions, and every product and category. Faster than the sidebar once you know the names.',
    },
    {
      icon: Bookmark,
      tone: 'tip',
      title: 'Save the views you keep re-typing',
      detail: 'E.g. “Drafts missing SEO” or “Featured rings” — one click recalls them.',
    },
    {
      icon: Eye,
      tone: 'tip',
      title: 'Always peek the storefront preview',
      detail: 'What looks right in the form can still look off in the card — the preview catches it before publish.',
    },
    {
      icon: AlertTriangle,
      tone: 'warn',
      title: 'Undo only lasts ~6 seconds',
      detail: 'After the toast disappears, the delete goes through. The product will still be in Trash for 30 days, but restore is slower than Undo.',
    },
    {
      icon: Filter,
      tone: 'warn',
      title: 'Clear stale filters before new work',
      detail: 'If Products looks empty, check for an active saved view or advanced filter — the “Reset” button in the filter strip clears everything.',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] text-black/90 font-medium tracking-wide flex items-center gap-3"
            style={{ fontFamily: 'var(--font-accent)' }}>
            <Info className="w-6 h-6 text-[#D4AF37]" />
            Administrator Guide
          </h1>
          <p className="text-[11px] tracking-[0.15em] uppercase mt-1" style={{ color: 'var(--a-muted)' }}>
            How to run the Swaminarayan Ornaments admin
          </p>
        </div>
      </div>

      {/* Intro card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl p-6 border relative overflow-hidden"
        style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' } as React.CSSProperties}
      >
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <ShieldCheck className="w-48 h-48" />
        </div>
        <h2 className="text-lg text-black/95 font-medium mb-2 relative z-10">Welcome to your Admin Panel</h2>
        <p className="text-sm text-black/90 leading-relaxed max-w-2xl relative z-10">
          This portal manages the live Swaminarayan Ornaments catalog end-to-end. Everything you
          change here syncs to the storefront in real time. The sections below walk through each
          area — start with the Dashboard, keep the command palette in reach, and skim the tips
          before your first bulk run.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 relative z-10">
          <kbd className="text-[10px] tracking-wider text-black/60 border border-black/10 bg-black/[0.03] rounded px-2 py-1">⌘K to search</kbd>
          <kbd className="text-[10px] tracking-wider text-black/60 border border-black/10 bg-black/[0.03] rounded px-2 py-1">n for new product</kbd>
          <kbd className="text-[10px] tracking-wider text-black/60 border border-black/10 bg-black/[0.03] rounded px-2 py-1">g then p for products</kbd>
        </div>
      </motion.div>

      {/* Quickstart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="rounded-2xl border p-6"
        style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
      >
        <h3 className="text-black/95 font-medium mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#D4AF37]" />
          60-second quickstart
        </h3>
        <ol className="space-y-2.5 text-sm text-black/85">
          {[
            'Open the Dashboard and clear anything in the “Action needed” panel.',
            'Press ⌘K and type the product name — or press n to start a new one.',
            'Upload the image first, then click the Sparkles icon to AI-draft the copy.',
            'Eyeball the Storefront preview, then Save. Status “Active” publishes it; “Draft” keeps it hidden.',
            'Need many at once? Products → Bulk Add handles up to 10 images with AI autofill in parallel.',
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 w-5 h-5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] text-[11px] font-semibold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </motion.div>

      {/* Feature sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + (idx * 0.05) }}
              className="rounded-2xl border shadow-sm flex flex-col"
              style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' } as React.CSSProperties}
            >
              <div className="px-5 py-5 border-b border-black/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-black/95 font-medium">{section.title}</h3>
                  <p className="text-black/70 text-xs mt-0.5">{section.description}</p>
                </div>
              </div>
              <div className="p-5 flex-1 bg-black/[0.01]">
                <ul className="space-y-3">
                  {section.tasks.map((task, i) => {
                    if (typeof task === 'string') {
                      return (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/50 shrink-0 mt-1.5" />
                          <span className="text-black/85 leading-relaxed">{task}</span>
                        </li>
                      );
                    }
                    return (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/50 shrink-0 mt-1.5" />
                        <div className="leading-relaxed">
                          <span className="text-black/95 font-medium">{task.label}</span>
                          <span className="text-black/70"> — {task.detail}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Keyboard shortcuts */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-2xl border overflow-hidden"
        style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
      >
        <div className="px-5 py-5 border-b border-black/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center shrink-0">
            <Keyboard className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="text-black/95 font-medium">Keyboard shortcuts</h3>
            <p className="text-black/70 text-xs mt-0.5">
              Work anywhere on the admin, except while typing in an input.
            </p>
          </div>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 bg-black/[0.01]">
          {hotkeys.map(h => (
            <div key={h.combo} className="flex items-center justify-between gap-4 text-sm">
              <span className="text-black/75">{h.action}</span>
              <kbd className="text-[11px] tracking-wider text-black/70 border border-black/10 bg-black/[0.03] rounded px-2 py-0.5 shrink-0">
                {h.combo}
              </kbd>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Command palette */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="rounded-2xl border p-6"
        style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
      >
        <h3 className="text-black/95 font-medium mb-3 flex items-center gap-2">
          <Command className="w-4 h-4 text-[#D4AF37]" />
          The command palette
        </h3>
        <p className="text-sm text-black/80 leading-relaxed mb-3">
          Press <kbd className="text-[10px] border border-black/10 bg-black/[0.03] rounded px-1.5 py-0.5">⌘K</kbd> from
          anywhere. It searches three kinds of things at once:
        </p>
        <ul className="space-y-2 text-sm text-black/80">
          <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/50 shrink-0 mt-1.5" /><span><strong className="text-black/95">Navigate</strong> — Dashboard, Products, Categories, Media, Trash, Activity, Guide.</span></li>
          <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/50 shrink-0 mt-1.5" /><span><strong className="text-black/95">Create</strong> — “New product”, “Bulk add products”.</span></li>
          <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/50 shrink-0 mt-1.5" /><span><strong className="text-black/95">Jump to item</strong> — type a product or category name to open it directly.</span></li>
        </ul>
      </motion.div>

      {/* Tips & gotchas */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h3 className="text-black/95 font-medium mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#D4AF37]" />
          Tips & gotchas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip, i) => {
            const TipIcon = tip.icon;
            const isWarn = tip.tone === 'warn';
            return (
              <div
                key={i}
                className={`rounded-xl border p-4 flex gap-3 ${
                  isWarn ? 'border-amber-500/25 bg-amber-500/[0.04]' : ''
                }`}
                style={isWarn ? undefined : { background: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isWarn ? 'bg-amber-500/15 text-amber-600' : 'bg-[rgba(212,175,55,0.12)] text-[#D4AF37]'
                }`}>
                  <TipIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm text-black/95 font-medium">{tip.title}</p>
                  <p className="text-[13px] text-black/70 mt-0.5 leading-relaxed">{tip.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Security note */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="mt-8 text-center"
      >
        <p className="text-[11px] uppercase tracking-widest text-black/55">
          Confidential & Proprietary • Swaminarayan Ornaments
        </p>
      </motion.div>
    </div>
  );
}
