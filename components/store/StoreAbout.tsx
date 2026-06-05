'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <span ref={ref} className="font-display text-3xl md:text-4xl text-[var(--store-gold-soft)]">
      {inView ? end : 0}
      {suffix}
    </span>
  );
}

export default function StoreAbout() {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-16 items-center">
        <ScrollReveal>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[var(--store-gold)] mb-4">
            Our story
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-[var(--store-text)] leading-tight mb-6">
            Gold that speaks softly,
            <br />
            <span className="italic text-[var(--store-gold-soft)]">sells confidently.</span>
          </h2>
          <p className="text-[var(--store-muted)] leading-relaxed mb-6">
            Swaminarayan Ornaments serves wholesale partners with refined designs, reliable
            purity, and a catalog built to grow — from classic mangalsutra to temple bridal sets.
          </p>
          <p className="text-[var(--store-muted)] leading-relaxed text-sm">
            Visit our showroom in Ahmedabad or browse the digital catalog to shortlist pieces
            for your next season.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-4">
          {[
            { value: 25, suffix: '+', label: 'Years craft' },
            { value: 18, suffix: '+', label: 'Categories' },
            { value: 92, suffix: 'K', label: 'Primary purity' },
            { value: 500, suffix: '+', label: 'Trade partners' },
          ].map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.08}>
              <motion.div
                className="rounded-2xl border border-[var(--store-border)] p-6 md:p-8 bg-[var(--store-surface)]"
                whileHover={{ borderColor: 'var(--store-gold-dim)' }}
              >
                <Counter end={stat.value} suffix={stat.suffix} />
                <p className="mt-2 text-xs tracking-[0.15em] uppercase text-[var(--store-muted)]">
                  {stat.label}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
