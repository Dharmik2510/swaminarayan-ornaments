'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

// Animated counter hook
function useCounter(end: number, duration: number = 2000, startCounting: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;
    let startTime: number;
    let animFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        animFrame = requestAnimationFrame(animate);
      }
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [end, duration, startCounting]);

  return count;
}

// Single animated stat component
function AnimatedStat({ value, suffix, label, index, isInView }: {
  value: number;
  suffix: string;
  label: string;
  index: number;
  isInView: boolean;
}) {
  const count = useCounter(value, 2000, isInView);

  return (
    <motion.div
      className="p-6 md:p-8 rounded-xl text-center relative group"
      style={{
        background: 'linear-gradient(145deg, rgba(212, 175, 55, 0.04), rgba(43, 12, 16, 0.6))',
        border: '1px solid rgba(212, 175, 55, 0.1)',
      }}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 + index * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        borderColor: 'rgba(212, 175, 55, 0.3)',
        background: 'linear-gradient(145deg, rgba(212, 175, 55, 0.08), rgba(43, 12, 16, 0.8))',
        y: -4,
      }}
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ boxShadow: '0 8px 40px rgba(212, 175, 55, 0.08)' }}
      />
      
      <p
        className="text-3xl md:text-4xl font-bold gold-gradient-text mb-2"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {count}{suffix}
      </p>
      <p
        className="text-[10px] tracking-[0.2em] uppercase text-text-tertiary"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {label}
      </p>
    </motion.div>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const decorY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const textY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  const stats = [
    { value: 50, suffix: '+', label: 'Years of Heritage' },
    { value: 10, suffix: 'K+', label: 'Designs Created' },
    { value: 500, suffix: '+', label: 'Wholesale Partners' },
    { value: 99, suffix: '.9%', label: 'Gold Purity' },
  ];

  return (
    <section id="about" ref={sectionRef} className="py-28 px-6 relative overflow-hidden">
      {/* Background ambient glow */}
      <div
        className="absolute right-0 top-0 w-1/2 h-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 100% 50%, rgba(212, 175, 55, 0.04), transparent 60%)',
        }}
      />
      <div
        className="absolute left-0 bottom-0 w-1/3 h-1/2 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 0% 100%, rgba(138, 28, 41, 0.06), transparent 60%)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left side: Content — with parallax offset */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ y: textY }}
          >
            <motion.p
              className="text-xs tracking-[0.4em] uppercase text-gold/50 mb-4 flex items-center gap-3"
              style={{ fontFamily: 'var(--font-body)' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <span className="w-8 h-[1px] bg-gold/30" />
              Our Legacy
            </motion.p>

            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Crafting{' '}
              <span className="gold-gradient-text">Golden Dreams</span>
              <br />
              Since Generations
            </h2>
            
            <motion.div
              className="w-20 h-[1px] mb-8"
              style={{ background: 'linear-gradient(90deg, #D4AF37, transparent)' }}
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />

            <p
              className="text-text-secondary mb-6 leading-relaxed"
              style={{
                fontFamily: 'var(--font-accent)',
                fontSize: '1.1rem',
                lineHeight: 2,
                fontWeight: 300,
              }}
            >
              At Swaminarayan Ornaments, every piece tells a story. Our master artisans blend 
              centuries-old techniques with contemporary designs, creating jewellery that 
              transcends time. With unwavering commitment to purity and craftsmanship, 
              we have been the trusted wholesale partner for jewellers across the nation.
            </p>
            <p
              className="text-text-secondary leading-relaxed mb-10"
              style={{
                fontFamily: 'var(--font-accent)',
                fontSize: '1.1rem',
                lineHeight: 2,
                fontWeight: 300,
              }}
            >
              Our collection spans across traditional, contemporary, and fusion designs, 
              all crafted in 92 and 84 carat gold with certified purity.
            </p>

            {/* CTA */}
            <motion.a
              href="#collection"
              data-hoverable
              className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-gold/70 hover:text-gold transition-colors duration-300 group"
              style={{ fontFamily: 'var(--font-body)', fontWeight: 500 }}
              whileHover={{ x: 4 }}
            >
              <span className="w-8 h-[1px] bg-gold/30 group-hover:w-12 group-hover:bg-gold/60 transition-all duration-300" />
              Explore Our Collection
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.a>
          </motion.div>

          {/* Right side: Decorative + Stats */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ y: decorY }}
          >
            {/* Heritage decorative block */}
            <div className="relative mb-10">
              <div
                className="w-full aspect-[4/3] rounded-xl flex items-center justify-center relative overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, rgba(212, 175, 55, 0.03), rgba(43, 12, 16, 0.4), rgba(212, 175, 55, 0.02))',
                  border: '1px solid rgba(212, 175, 55, 0.08)',
                }}
              >
                {/* Ornate SVG corners */}
                <svg className="absolute top-3 left-3 w-8 h-8 text-gold/20" viewBox="0 0 32 32" fill="none">
                  <path d="M0 0L32 0M0 0L0 32" stroke="currentColor" strokeWidth="1" />
                </svg>
                <svg className="absolute bottom-3 right-3 w-8 h-8 text-gold/20 rotate-180" viewBox="0 0 32 32" fill="none">
                  <path d="M0 0L32 0M0 0L0 32" stroke="currentColor" strokeWidth="1" />
                </svg>

                <motion.div
                  className="text-center relative z-10"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span className="text-7xl block mb-5" style={{ filter: 'drop-shadow(0 0 30px rgba(212, 175, 55, 0.3))' }}>🏛️</span>
                  <p
                    className="text-base tracking-[0.25em] uppercase gold-gradient-text mb-2"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
                  >
                    Heritage of Excellence
                  </p>
                  <p
                    className="text-xs text-white/30 tracking-widest"
                    style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic' }}
                  >
                    Established in Ahmedabad
                  </p>
                </motion.div>

                {/* Rotating ornamental ring */}
                <motion.div
                  className="absolute inset-8 rounded-xl pointer-events-none"
                  style={{ border: '1px dashed rgba(212, 175, 55, 0.06)' }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 120, ease: 'linear', repeat: Infinity }}
                />
              </div>
            </div>

            {/* Stats grid — with animated counters */}
            <div ref={statsRef} className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <AnimatedStat
                  key={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  index={index}
                  isInView={isStatsInView}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
