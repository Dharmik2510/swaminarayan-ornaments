'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import TilakSymbol from './TilakSymbol';

// Magnetic Button Component for magical interactions
const MagneticButton = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  
  // Spotlight tracking state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const navContainerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50);
  });

  const pathname = usePathname();

  const navLinks = [
    { label: 'Home', href: '/', isRoute: true },
    { label: 'About', href: '/#about', isRoute: false },
    { label: 'Collection', href: '/collection', isRoute: true },
    { label: 'Contact', href: '/#contact', isRoute: false },
  ];

  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const hash = href.replace('/', '');
    if (pathname === '/') {
      // Already on home page — smooth scroll to section
      e.preventDefault();
      if (hash === '' || hash === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // If on another page, let the Link navigate to /#section naturally
  };

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
      const sections = ['#', '#about', '#collection', '#contact'];
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
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-[90] transition-colors duration-500 overflow-hidden"
        style={{
          background: isScrolled
            ? 'rgba(43, 12, 16, 0.85)'
            : 'transparent',
          backdropFilter: isScrolled ? 'blur(24px) saturate(1.2)' : 'none',
          borderBottom: isScrolled
            ? '1px solid rgba(212, 175, 55, 0.15)'
            : '1px solid transparent',
        }}
      >
        {/* Magical Spotlight Effect */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
          animate={{ opacity: isHovered ? 1 : 0 }}
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(212, 175, 55, 0.08), transparent 40%)`,
          }}
        />

        {/* Shimmering Top Border line when scrolled */}
        <AnimatePresence>
          {isScrolled && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-30 origin-center"
            />
          )}
        </AnimatePresence>

        <div className="max-w-[1400px] w-full mx-auto px-6 py-4 flex items-center justify-between relative z-10">
          {/* Logo (Left) */}
          <Link href="/" data-hoverable className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -5, 5, 0], scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <TilakSymbol className="w-5 h-7 shrink-0 drop-shadow-lg drop-shadow-gold" />
            </motion.div>
            <motion.div
              className="text-sm md:text-base tracking-[0.12em] gold-gradient-text uppercase relative overflow-hidden"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
            >
              SWAMINARAYAN ORNAMENTS
              <motion.div 
                className="absolute inset-0 bg-white/20 -skew-x-12 -translate-x-full"
                whileHover={{ translateX: '200%' }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
              />
            </motion.div>
          </Link>

          {/* Desktop Nav Links (Center) — with liquid gold indicator */}
          <motion.div 
            ref={navContainerRef} 
            className="hidden md:flex flex-1 justify-center items-center gap-8 lg:gap-10 relative"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {navLinks.map((link, index) => (
              <Link
                key={link.label}
                ref={(el) => { linkRefs.current[index] = el; }}
                href={link.href}
                data-hoverable
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="text-xs tracking-[0.1em] capitalize transition-all duration-300 relative py-1 group"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: activeLink === index ? 500 : 400,
                  color: activeLink === index ? '#D4AF37' : 'rgba(255, 255, 255, 0.65)',
                }}
                onMouseEnter={() => updateIndicator(index)}
                onMouseLeave={() => updateIndicator(activeLink)}
                onClick={(e) => {
                  setActiveLink(index);
                  updateIndicator(index);
                  if (!link.isRoute) handleHashClick(e, link.href);
                }}
              >
                {link.label}
              </Link>
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
                boxShadow: '0 0 8px rgba(212, 175, 55, 0.6), 0 0 20px rgba(212, 175, 55, 0.3)',
                borderRadius: '1px',
              }}
            />
          </motion.div>

          {/* Icons (Right) */}
          <div className="hidden md:flex items-center justify-end gap-6 w-48">
            <button data-hoverable className="text-white hover:text-gold transition-colors">
              <Search size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* Mobile menu button */}
          <motion.button
            data-hoverable
            className="md:hidden p-2 relative z-10 block"
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
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: isMobileMenuOpen ? 1 : 0,
                y: isMobileMenuOpen ? 0 : 30,
              }}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
            >
              <Link
                href={link.href}
                data-hoverable
                className="text-2xl tracking-[0.2em] uppercase block"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'rgba(245, 240, 232, 0.7)',
                }}
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  if (!link.isRoute) handleHashClick(e, link.href);
                }}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
