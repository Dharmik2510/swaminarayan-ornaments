'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { Search, User } from 'lucide-react';
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

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

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
          <motion.a
            href="#"
            data-hoverable
            className="flex items-center gap-3 group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
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
          </motion.a>

          {/* Desktop Nav Links (Center) — with liquid gold indicator */}
          <motion.div 
            ref={navContainerRef} 
            className="hidden md:flex flex-1 justify-center items-center gap-8 lg:gap-10 relative"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {navLinks.map((link, index) => (
              <motion.a
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
                onClick={() => { setActiveLink(index); updateIndicator(index); }}
              >
                {link.label}
                {/* Micro-interaction dot on hover */}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-gold)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>
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
          <motion.div 
            className="hidden md:flex items-center justify-end gap-6 w-48"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <MagneticButton className="text-white hover:text-gold transition-colors block p-2 relative group" data-hoverable>
              <div className="absolute inset-0 bg-gold/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" />
              <Search size={18} strokeWidth={1.5} className="relative z-10" />
            </MagneticButton>
            <MagneticButton className="text-white hover:text-gold transition-colors block p-2 relative group" data-hoverable>
              <div className="absolute inset-0 bg-gold/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" />
              <User size={18} strokeWidth={1.5} className="relative z-10" />
            </MagneticButton>
          </motion.div>

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
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[89] md:hidden flex"
            style={{
              background: 'rgba(26, 7, 9, 0.98)',
              backdropFilter: 'blur(20px)',
            }}
            initial={{ opacity: 0, clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Animated background particles for mobile menu */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
               <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-gold/5 rounded-full blur-[80px]" />
               <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-garnet/10 rounded-full blur-[60px]" />
            </div>

            <div className="flex flex-col items-center justify-center h-full w-full gap-8 relative z-10">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  data-hoverable
                  className="text-3xl tracking-[0.2em] uppercase relative group"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'rgba(245, 240, 232, 0.8)',
                  }}
                  initial={{ opacity: 0, y: 30, rotateX: 40 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                  <motion.div 
                    className="h-[1px] w-0 bg-gold mt-2 mx-auto group-hover:w-full transition-all duration-300"
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
