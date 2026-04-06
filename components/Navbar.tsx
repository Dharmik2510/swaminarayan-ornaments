'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Search, User } from 'lucide-react';
import TilakSymbol from './TilakSymbol';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navContainerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
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

  // Update the liquid indicator position
  const updateIndicator = useCallback((index: number) => {
    const link = linkRefs.current[index];
    const container = navContainerRef.current;
    if (link && container) {
      const linkRect = link.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setIndicatorStyle({
        left: linkRect.left - containerRect.left,
        width: linkRect.width,
      });
    }
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['#', '#about', '#collection', '#blog', '#contact'];
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] === '#') {
          if (scrollPos < 400) {
            setActiveLink(0);
            updateIndicator(0);
            break;
          }
          continue;
        }
        const el = document.querySelector(sections[i]);
        if (el && (el as HTMLElement).offsetTop <= scrollPos) {
          setActiveLink(i);
          updateIndicator(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initialize
    setTimeout(() => updateIndicator(0), 100);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateIndicator]);

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-[90] transition-all duration-500"
        style={{
          background: isScrolled
            ? 'rgba(43, 12, 16, 0.92)'
            : 'transparent',
          backdropFilter: isScrolled ? 'blur(24px) saturate(1.2)' : 'none',
          borderBottom: isScrolled
            ? '1px solid rgba(212, 175, 55, 0.08)'
            : '1px solid transparent',
        }}
      >
        <div className="max-w-[1400px] w-full mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo (Left) */}
          <a href="#" data-hoverable className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <TilakSymbol className="w-5 h-7 shrink-0" />
            </motion.div>
            <motion.div
              className="text-sm md:text-base tracking-[0.12em] gold-gradient-text uppercase"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
            >
              SWAMINARAYAN ORNAMENTS
            </motion.div>
          </a>

          {/* Desktop Nav Links (Center) — with liquid gold indicator */}
          <div ref={navContainerRef} className="hidden md:flex flex-1 justify-center items-center gap-8 lg:gap-10 relative">
            {navLinks.map((link, index) => (
              <a
                key={link.label}
                ref={(el) => { linkRefs.current[index] = el; }}
                href={link.href}
                data-hoverable
                className="text-xs tracking-[0.1em] capitalize transition-all duration-300 relative py-1"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: activeLink === index ? 500 : 400,
                  color: activeLink === index ? '#D4AF37' : 'rgba(255, 255, 255, 0.65)',
                }}
                onMouseEnter={() => updateIndicator(index)}
                onMouseLeave={() => updateIndicator(activeLink)}
                onClick={() => { setActiveLink(index); updateIndicator(index); }}
              >
                {link.label}
              </a>
            ))}
            
            {/* Liquid Gold Indicator */}
            <motion.div
              className="absolute bottom-0 h-[2px] pointer-events-none"
              animate={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
              }}
              transition={{
                type: 'spring',
                stiffness: 350,
                damping: 30,
              }}
              style={{
                background: 'linear-gradient(90deg, transparent, #D4AF37, #FFD700, #D4AF37, transparent)',
                boxShadow: '0 0 8px rgba(212, 175, 55, 0.5), 0 0 20px rgba(212, 175, 55, 0.2)',
                borderRadius: '1px',
              }}
            />
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
