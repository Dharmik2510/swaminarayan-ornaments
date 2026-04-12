'use client';

import { motion } from 'framer-motion';
import { Package, Tag, Image as ImageIcon, LayoutDashboard, Info, ShieldCheck } from 'lucide-react';

export default function AdminGuide() {
  const sections = [
    {
      title: 'Dashboard Overview',
      icon: LayoutDashboard,
      description: 'Your central command center for Swaminarayan Ornaments.',
      tasks: [
        'View top-level metrics: Total products, Active listings, Drafts, and Featured items.',
        'Monitor recent product additions and status changes.',
        'Review the Activity Log to see a history of administrative actions (creates, updates, deletes).',
      ]
    },
    {
      title: 'Products Management',
      icon: Package,
      description: 'Control your inventory and digital showroom displays.',
      tasks: [
        'Add new products with detailed specifications (Metal, Weight, Dimensions, Price).',
        'Upload and reorder high-quality imagery for each product.',
        'Toggle product status between "Active" (visible to public) and "Draft" (hidden).',
        'Mark items as "Featured" to display them prominently on the storefront hero sections.',
        'Edit or delete existing products as inventory changes.'
      ]
    },
    {
      title: 'Categories',
      icon: Tag,
      description: 'Organize your collections for seamless customer navigation.',
      tasks: [
        'Create new product categories (e.g., Necklaces, Rings, Bracelets).',
        'Edit category names and descriptions.',
        'Remove obsolete categories to keep the showroom structure clean.'
      ]
    },
    {
      title: 'Media Library',
      icon: ImageIcon,
      description: 'Manage all visual assets stored securely in the cloud.',
      tasks: [
        'Upload raw images directly to Firebase Storage.',
        'Preview existing imagery used across the application.',
        'Delete redundant or outdated images to save storage space.',
        'Copy image URLs for direct linking or references.'
      ]
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] text-black/90 font-medium tracking-wide flex items-center gap-3"
            style={{ fontFamily: 'var(--font-accent)' }}>
            <Info className="w-6 h-6 text-[#D4AF37]" />
            Administrator Guide
          </h1>
          <p className="text-[11px] tracking-[0.15em] uppercase mt-1" style={{ color: 'var(--a-muted)' }}>
            System Documentation & Usage
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
        <p className="text-sm text-black/95 leading-relaxed max-w-2xl relative z-10">
          This secure portal empowers you to manage the complete Swaminarayan Ornaments digital showroom.
          Changes made here are synchronized in real-time with the live storefront, ensuring your
          customers always see the most accurate catalog and luxurious imagery.
        </p>
      </motion.div>

      {/* Guide Sections */}
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
                  <p className="text-black/90 text-xs mt-0.5">{section.description}</p>
                </div>
              </div>
              <div className="p-5 flex-1 bg-black/[0.01]">
                <ul className="space-y-3">
                  {section.tasks.map((task, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/50 shrink-0 mt-1.5" />
                      <span className="text-black/90 leading-relaxed">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Security note */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="mt-8 text-center"
      >
        <p className="text-[11px] uppercase tracking-widest text-black/95">
          Confidential & Proprietary • Swaminarayan Ornaments
        </p>
      </motion.div>
    </div>
  );
}
