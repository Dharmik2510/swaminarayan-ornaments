'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Search, User } from 'lucide-react';
import TilakSymbol from './TilakSymbol';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50);
  });

  const navLinks = [
    { label: 'Home', href: '#' },
    { label: 'About', href: '#about' },
    { label: 'Collection', href: '#collection' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-[90] transition-all duration-500"
        style={{
          background: isScrolled
            ? 'rgba(6, 26, 20, 0.95)'
            : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          borderBottom: isScrolled
            ? '1px solid rgba(255, 255, 255, 0.05)'
            : '1px solid transparent',
        }}
      >
        <div className="max-w-[1400px] w-full mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo (Left) */}
          <a href="#" data-hoverable className="flex items-center gap-3">
            <TilakSymbol className="w-5 h-7 shrink-0" />
            <motion.div
              className="text-sm md:text-base tracking-[0.12em] gold-gradient-text uppercase"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
              whileHover={{ scale: 1.03 }}
            >
              SWAMINARAYAN ORNAMENTS
            </motion.div>
          </a>

          {/* Desktop Nav Links (Center) */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-8 lg:gap-10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-hoverable
                className="text-xs tracking-[0.1em] capitalize transition-colors duration-300 hover:text-gold"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 400,
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Icons (Right) */}
          <div className="hidden md:flex items-center justify-end gap-6 w-48">
            <button data-hoverable className="text-white hover:text-gold transition-colors">
              <Search size={18} strokeWidth={1.5} />
            </button>
            <button data-hoverable className="text-white hover:text-gold transition-colors">
              <User size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* Mobile menu button */}
          <motion.button
            data-hoverable
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex flex-col gap-1.5">
              <motion.div
                className="w-6 h-[1px] bg-gold"
                animate={{
                  rotate: isMobileMenuOpen ? 45 : 0,
                  y: isMobileMenuOpen ? 4 : 0,
                }}
              />
              <motion.div
                className="w-4 h-[1px] bg-gold/60"
                animate={{
                  opacity: isMobileMenuOpen ? 0 : 1,
                  x: isMobileMenuOpen ? -10 : 0,
                }}
              />
              <motion.div
                className="w-6 h-[1px] bg-gold"
                animate={{
                  rotate: isMobileMenuOpen ? -45 : 0,
                  y: isMobileMenuOpen ? -4 : 0,
                }}
              />
            </div>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <motion.div
        className="fixed inset-0 z-[89] md:hidden flex"
        style={{
          background: 'rgba(6, 26, 20, 0.98)',
          pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isMobileMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, index) => (
            <motion.a
              key={link.label}
              href={link.href}
              data-hoverable
              className="text-2xl tracking-[0.2em] uppercase"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'rgba(245, 240, 232, 0.7)',
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: isMobileMenuOpen ? 1 : 0,
                y: isMobileMenuOpen ? 0 : 30,
              }}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </motion.a>
          ))}
        </div>
      </motion.div>
    </>
  );
}
