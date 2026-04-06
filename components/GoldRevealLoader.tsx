'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GoldRevealLoader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'liquid' | 'reveal' | 'exit'>('liquid');
  const hasCompleted = useRef(false);

  const handleComplete = useCallback(() => {
    if (hasCompleted.current) return;
    hasCompleted.current = true;
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('reveal'), 1500);
    const timer2 = setTimeout(() => setPhase('exit'), 3200);
    const timer3 = setTimeout(handleComplete, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [handleComplete]);

  return (
    <AnimatePresence>
      {phase !== 'exit' ? (
        <motion.div
          className="loader-overlay"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Gold particles floating background */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: `radial-gradient(circle, rgba(212, 175, 55, ${0.3 + Math.random() * 0.5}), transparent)`,
                  width: `${2 + Math.random() * 4}px`,
                  height: `${2 + Math.random() * 4}px`,
                }}
                animate={{
                  y: [0, -100 - Math.random() * 200],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.5],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>

          {/* Molten gold pool effect at bottom */}
          <motion.div
            className="absolute bottom-0 left-0 right-0"
            initial={{ height: '0%' }}
            animate={{ height: phase === 'liquid' ? '30%' : '0%' }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'linear-gradient(180deg, transparent, rgba(212, 175, 55, 0.05), rgba(184, 134, 11, 0.1), rgba(212, 175, 55, 0.15))',
            }}
          />

          {/* Main logo container */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Rotating glow ring behind logo */}
            <motion.div
              className="absolute -inset-20"
              style={{
                background: 'conic-gradient(from 0deg, transparent, rgba(212, 175, 55, 0.15), transparent, rgba(255, 215, 0, 0.1), transparent)',
                borderRadius: '50%',
                filter: 'blur(40px)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />

            {/* Logo text with liquid gold fill */}
            <div className="relative">
              {/* Background text (dark) */}
              <h1
                className="text-5xl md:text-7xl font-bold tracking-wider"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'rgba(212, 175, 55, 0.1)',
                }}
              >
                SO
              </h1>

              {/* Foreground text (gold fill animation) */}
              <motion.h1
                className="absolute inset-0 text-5xl md:text-7xl font-bold tracking-wider"
                style={{
                  fontFamily: 'var(--font-display)',
                  background: 'linear-gradient(180deg, #FFD700 0%, #D4AF37 40%, #B8860B 80%, #D4AF37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                initial={{ clipPath: 'inset(100% 0 0 0)' }}
                animate={{ clipPath: 'inset(0% 0 0 0)' }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              >
                SO
              </motion.h1>
            </div>

            {/* Brand name reveal */}
            <motion.div
              className="overflow-hidden mt-6"
              initial={{ width: 0 }}
              animate={{ width: 'auto' }}
              transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.h2
                className="text-lg md:text-xl tracking-[0.4em] uppercase whitespace-nowrap"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'rgba(212, 175, 55, 0.7)',
                  fontWeight: 300,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.5 }}
              >
                Swaminarayan Ornaments
              </motion.h2>
            </motion.div>

            {/* Decorative line */}
            <motion.div
              className="mt-4 h-[1px]"
              style={{
                background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
              }}
              initial={{ width: 0 }}
              animate={{ width: '200px' }}
              transition={{ duration: 1, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Tagline */}
            <motion.p
              className="mt-4 text-sm tracking-[0.2em] uppercase"
              style={{
                fontFamily: 'var(--font-accent)',
                color: 'rgba(245, 240, 232, 0.4)',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.2 }}
            >
              Wholesale Gold Excellence
            </motion.p>
          </div>

          {/* Progress bar at bottom */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-surface-elevated rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #B8860B, #D4AF37, #FFD700)',
              }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
