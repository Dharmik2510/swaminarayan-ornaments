'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const phrases = [
  'Heritage of Excellence',
  '◆',
  'Handcrafted with Devotion',
  '◆',
  'Since Generations',
  '◆',
  'Pure Gold Artistry',
  '◆',
  'Where Tradition Meets Elegance',
  '◆',
  'Crafted for Eternity',
  '◆',
];

export default function LuxuryMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={containerRef}
      className="relative py-10 overflow-hidden"
      style={{ opacity }}
    >
      {/* Top decorative line */}
      <div className="absolute top-0 left-0 right-0 h-[1px]" 
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.12), transparent)' }} 
      />
      
      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px]" 
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.12), transparent)' }} 
      />

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10" 
        style={{ background: 'linear-gradient(90deg, var(--color-background), transparent)' }} 
      />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10" 
        style={{ background: 'linear-gradient(270deg, var(--color-background), transparent)' }} 
      />

      {/* Marquee track */}
      <div className="luxury-marquee">
        {/* Repeat twice for seamless loop */}
        {[...phrases, ...phrases].map((phrase, i) => (
          <span
            key={i}
            className={`mx-6 whitespace-nowrap ${phrase === '◆' ? 'text-gold/30 text-xs' : ''}`}
            style={{
              fontFamily: phrase === '◆' ? 'inherit' : 'var(--font-accent)',
              fontSize: phrase === '◆' ? '0.6rem' : '1.3rem',
              fontWeight: 300,
              fontStyle: phrase === '◆' ? 'normal' : 'italic',
              color: phrase === '◆' ? 'rgba(212, 175, 55, 0.3)' : 'rgba(212, 175, 55, 0.45)',
              letterSpacing: phrase === '◆' ? '0' : '0.1em',
            }}
          >
            {phrase}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
