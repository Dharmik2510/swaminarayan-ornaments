'use client';

import Link from 'next/link';
import ScrollReveal from './ScrollReveal';
import type { CategoryWithStats } from '@/lib/catalog';

interface StoreFooterProps {
  categories?: CategoryWithStats[];
}

export default function StoreFooter({ categories = [] }: StoreFooterProps) {
  const topCats = categories.slice(0, 10);

  return (
    <footer id="contact" className="pt-20 pb-10 border-t border-[var(--store-border)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--store-gold)] mb-4">
            Partner with us
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-[var(--store-text)] mb-4">
            Ready to stock premium gold?
          </h2>
          <p className="text-[var(--store-muted)] text-sm md:text-base mb-8">
            Reach out for wholesale enquiries, custom orders, and showroom visits in Ahmedabad.
          </p>
          <a
            href="https://wa.me/"
            className="store-btn-primary inline-block"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact on WhatsApp
          </a>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-12 pb-12 border-b border-[var(--store-border)]">
          <div>
            <p className="font-display text-lg text-[var(--store-text)] mb-3">
              Swaminarayan Ornaments
            </p>
            <p className="text-sm text-[var(--store-muted)] leading-relaxed">
              Wholesale gold jewellery · 92 & 84 carat · Ahmedabad, India
            </p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--store-muted)] mb-4">
              Navigate
            </p>
            <ul className="space-y-2 text-sm text-[var(--store-muted)]">
              {[
                { label: 'Home', href: '/' },
                { label: 'Categories', href: '/#categories' },
                { label: 'Collection', href: '/collection' },
                { label: 'About', href: '/#about' },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-[var(--store-gold)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--store-muted)] mb-4">
              Categories
            </p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-[var(--store-muted)]">
              {topCats.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/collection?category=${encodeURIComponent(c.name)}`}
                    className="hover:text-[var(--store-gold)] transition-colors truncate block"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="pt-8 text-center text-xs text-[var(--store-muted)]/70">
          © {new Date().getFullYear()} Swaminarayan Ornaments. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
