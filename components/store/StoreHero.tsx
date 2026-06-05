'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

export default function StoreHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.35]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex items-center pt-20 pb-16 overflow-hidden"
    >
      <div className="store-hero-glow absolute inset-0 pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div style={{ y: textY, opacity }} className="order-2 lg:order-1">
          <ScrollReveal>
            <p className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-[var(--store-gold)] mb-6">
              Wholesale gold jewellery · Ahmedabad
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.08}>
            <h1 className="font-display text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[3.75rem] leading-[1.08] text-[var(--store-text)] mb-6">
              Crafted in gold.
              <br />
              <span className="text-[var(--store-gold-soft)] italic font-normal">
                Curated for trade.
              </span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.16}>
            <p className="text-base md:text-lg text-[var(--store-muted)] max-w-md leading-relaxed mb-10">
              Explore 92 & 84 carat collections across necklaces, bangles, bridal sets, and
              more — designed for retailers who value purity, consistency, and quiet luxury.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.24}>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/collection" className="store-btn-primary">
                View wholesale catalog
              </Link>
              <Link
                href="/#categories"
                className="store-btn-ghost"
              >
                Browse categories
              </Link>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.32}>
            <dl className="mt-14 grid grid-cols-3 gap-6 max-w-md border-t border-[var(--store-border)] pt-8">
              {[
                { label: 'Purity', value: '92 & 84K' },
                { label: 'Categories', value: '18+' },
                { label: 'Trade', value: 'B2B' },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="text-[10px] tracking-[0.2em] uppercase text-[var(--store-muted)]">
                    {item.label}
                  </dt>
                  <dd className="font-display text-lg text-[var(--store-text)] mt-1">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </ScrollReveal>
        </motion.div>

        <motion.div
          style={{ y: imageY }}
          className="order-1 lg:order-2 relative aspect-[4/5] max-h-[min(72vh,640px)] mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="absolute inset-4 md:inset-6 border border-[var(--store-gold)]/15 rounded-[2rem]" />
          <motion.div
            className="relative h-full w-full rounded-[1.75rem] overflow-hidden bg-[var(--store-surface)]"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src="/images/emerald_necklace.png"
              alt="Gold necklace showcase"
              fill
              priority
              className="object-contain p-8 md:p-12"
              sizes="(max-width: 1024px) 90vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--store-bg)]/40 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--store-muted)]"
        style={{ opacity }}
        aria-hidden
      >
        <span className="text-[9px] tracking-[0.3em] uppercase">Scroll</span>
        <motion.span
          className="w-px h-10 bg-gradient-to-b from-[var(--store-gold)]/50 to-transparent"
          animate={{ scaleY: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
