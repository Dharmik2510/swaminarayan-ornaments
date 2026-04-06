'use client';

import { motion } from 'framer-motion';

export default function AboutSection() {
  const stats = [
    { value: '50+', label: 'Years of Heritage' },
    { value: '10K+', label: 'Designs Created' },
    { value: '500+', label: 'Wholesale Partners' },
    { value: '99.9%', label: 'Gold Purity' },
  ];

  return (
    <section id="about" className="py-24 px-6 relative overflow-hidden">
      {/* Background element */}
      <div
        className="absolute right-0 top-0 w-1/2 h-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 100% 50%, rgba(212, 175, 55, 0.03), transparent 60%)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left side: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <p
              className="text-xs tracking-[0.4em] uppercase text-gold/50 mb-4"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Our Legacy
            </p>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Crafting <span className="gold-gradient-text">Golden Dreams</span> Since Generations
            </h2>
            
            <div className="w-16 h-[1px] mb-8" style={{ background: 'linear-gradient(90deg, #D4AF37, transparent)' }} />

            <p
              className="text-text-secondary mb-6 leading-relaxed"
              style={{
                fontFamily: 'var(--font-accent)',
                fontSize: '1.05rem',
                lineHeight: 1.9,
                fontWeight: 300,
              }}
            >
              At Swaminarayan Ornaments, every piece tells a story. Our master artisans blend 
              centuries-old techniques with contemporary designs, creating jewellery that 
              transcends time. With unwavering commitment to purity and craftsmanship, 
              we have been the trusted wholesale partner for jewellers across the nation.
            </p>
            <p
              className="text-text-secondary leading-relaxed"
              style={{
                fontFamily: 'var(--font-accent)',
                fontSize: '1.05rem',
                lineHeight: 1.9,
                fontWeight: 300,
              }}
            >
              Our collection spans across traditional, contemporary, and fusion designs, 
              all crafted in 92 and 84 carat gold with certified purity.
            </p>
          </motion.div>

          {/* Right side: Stats + decorative */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Decorative element */}
            <div className="relative mb-12">
              <div
                className="w-full aspect-square rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.03), rgba(184, 134, 11, 0.05), rgba(212, 175, 55, 0.02))',
                  border: '1px solid rgba(212, 175, 55, 0.08)',
                }}
              >
                <motion.div
                  className="text-center"
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span className="text-8xl block mb-4" style={{ filter: 'drop-shadow(0 0 30px rgba(212, 175, 55, 0.3))' }}>🏛️</span>
                  <p
                    className="text-lg tracking-[0.2em] uppercase text-gold/40"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}
                  >
                    Heritage of Excellence
                  </p>
                </motion.div>

                {/* Rotating border accent */}
                <motion.div
                  className="absolute inset-4 rounded-lg pointer-events-none"
                  style={{
                    border: '1px solid rgba(212, 175, 55, 0.06)',
                  }}
                  animate={{ rotate: [0, 1, 0, -1, 0] }}
                  transition={{ duration: 10, repeat: Infinity }}
                />
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="p-5 rounded-lg text-center"
                  style={{
                    background: 'rgba(212, 175, 55, 0.03)',
                    border: '1px solid rgba(212, 175, 55, 0.08)',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{
                    borderColor: 'rgba(212, 175, 55, 0.25)',
                    background: 'rgba(212, 175, 55, 0.05)',
                  }}
                >
                  <p
                    className="text-2xl md:text-3xl font-bold gold-gradient-text mb-1"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-[10px] tracking-[0.15em] uppercase text-text-tertiary"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
