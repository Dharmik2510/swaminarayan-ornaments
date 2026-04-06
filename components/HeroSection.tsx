'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import TilakSymbol from './TilakSymbol';
import dynamic from 'next/dynamic';

const TilakBackground = dynamic(() => import('./TilakBackground'), { ssr: false });

// A small functional component for floating interactive pins
const FloatingPin = ({ x, y, label, delay = 0 }: { x: string, y: string, label: string, delay?: number }) => (
  <motion.div
    className="absolute z-20"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: delay + 1.5 }}
  >
    <div className="relative group cursor-pointer inline-flex items-center justify-center">
      {/* Pulse effect */}
      <div className="absolute inset-0 bg-[#F4E8DB]/40 rounded-full animate-ping pointer-events-none" />
      {/* Main button */}
      <div className="w-8 h-8 rounded-full border border-[#D4AF37]/50 bg-[#2B0C10]/80 backdrop-blur-md flex items-center justify-center text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#2B0C10]">
        <Plus size={16} />
      </div>
      {/* Tooltip */}
      <div className="absolute top-1/2 left-full ml-3 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        <div className="bg-[#2B0C10] border border-[#D4AF37]/30 text-[#F4E8DB] text-xs px-3 py-1.5 rounded-sm flex items-center gap-2 shadow-gold whitespace-nowrap" style={{ fontFamily: 'var(--font-body)' }}>
          <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
          {label}
        </div>
      </div>
    </div>
  </motion.div>
);

// Animated word component for staggered text reveals
const AnimatedWord = ({ children, delay = 0 }: { children: string, delay?: number }) => (
  <motion.span
    className="inline-block"
    initial={{ y: 80, opacity: 0, rotateX: -40 }}
    animate={{ y: 0, opacity: 1, rotateX: 0 }}
    transition={{
      duration: 1,
      delay,
      ease: [0.16, 1, 0.3, 1],
    }}
  >
    {children}
  </motion.span>
);

// Ornate SVG frame for the hero image
const OrnateFrame = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none z-20"
    viewBox="0 0 500 600"
    fill="none"
    preserveAspectRatio="none"
  >
    <motion.rect
      x="8" y="8" width="484" height="584" rx="4"
      stroke="url(#frameGrad)"
      strokeWidth="1"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.6 }}
      transition={{ duration: 2, delay: 0.8, ease: 'easeInOut' }}
    />
    <motion.rect
      x="16" y="16" width="468" height="568" rx="2"
      stroke="url(#frameGrad)"
      strokeWidth="0.5"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.3 }}
      transition={{ duration: 2.5, delay: 1.2, ease: 'easeInOut' }}
    />
    {/* Corner ornaments */}
    {[
      { cx: 20, cy: 20 },
      { cx: 480, cy: 20 },
      { cx: 20, cy: 580 },
      { cx: 480, cy: 580 },
    ].map((pos, i) => (
      <motion.circle
        key={i}
        cx={pos.cx} cy={pos.cy} r="3"
        fill="#D4AF37"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.7 }}
        transition={{ delay: 1.5 + i * 0.1, duration: 0.4 }}
      />
    ))}
    <defs>
      <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4AF37" />
        <stop offset="50%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>
    </defs>
  </svg>
);

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isRevealed, setIsRevealed] = useState(false);
  const totalSlides = 3;
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  useEffect(() => {
    const timer = setTimeout(() => setIsRevealed(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const images = [
    '/images/emerald_necklace.png',
    '/images/emerald_necklace.png',
    '/images/emerald_necklace.png',
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev === totalSlides ? 1 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 1 ? totalSlides : prev - 1));

  return (
    <section
      ref={containerRef}
      style={{ position: 'relative' }}
      className="min-h-[100vh] pt-24 pb-12 flex items-center overflow-hidden bg-[var(--color-background)]"
    >
      {/* Architectural SVG Trace Animation */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <TilakBackground />
      </div>

      {/* Ambient glow */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.04), transparent 60%)',
          filter: 'blur(80px)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container mx-auto px-6 lg:px-8 xl:px-12 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-10 items-center min-h-[70vh]">
          
          {/* Left Column: Text & CTA — with staggered word animation */}
          <motion.div 
            className="flex flex-col justify-center h-full py-10 min-w-0"
            style={{ opacity, y }}
          >
            {/* Subtitle with line draw */}
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div
                className="h-[1px] bg-[var(--color-gold)] opacity-60"
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
              <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-[var(--color-gold)] font-medium" style={{ fontFamily: 'var(--font-body)' }}>
                Jewelry Design With Love
              </span>
            </motion.div>

            {/* Headline with staggered word reveal */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-[1.1] mb-6 text-white" style={{ fontFamily: 'var(--font-display)' }}>
              <div className="overflow-hidden">
                <AnimatedWord delay={0.3}>The</AnimatedWord>{' '}
                <AnimatedWord delay={0.4}>Perfect</AnimatedWord>
              </div>
              <div className="overflow-hidden mt-2">
                <motion.span
                  className="text-[var(--color-card-cream)] gold-gradient-text inline-block"
                  initial={{ y: 80, opacity: 0, rotateX: -40 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0 }}
                  transition={{ duration: 1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  Jewels
                </motion.span>
              </div>
              <div className="overflow-hidden">
                <AnimatedWord delay={0.7}>For</AnimatedWord>{' '}
                <AnimatedWord delay={0.8}>You</AnimatedWord>
              </div>
            </h1>

            {/* Description with fade up */}
            <motion.p
              className="text-base md:text-lg lg:text-base xl:text-lg text-white/70 mb-10 max-w-md leading-relaxed font-light"
              style={{ fontFamily: 'var(--font-body)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              Explore our Spring Collection featuring hand-crafted Emerald and Diamond masterpieces, designed to bring out your inner radiance.
            </motion.p>

            {/* CTA with elegant border animation */}
            <motion.div
              className="flex flex-wrap items-center gap-6 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <a href="#collection" data-hoverable className="group relative px-8 py-4 bg-[var(--color-card-cream)] text-[var(--color-background)] font-medium text-xs md:text-sm tracking-[0.2em] uppercase overflow-hidden transition-colors duration-300">
                <span className="relative z-10">View Collection</span>
                {/* Shine sweep on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </a>

              {/* Secondary CTA - new */}
              <motion.a
                href="#about"
                data-hoverable
                className="text-xs tracking-[0.2em] uppercase text-gold/60 hover:text-gold transition-colors duration-300 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-body)', fontWeight: 400 }}
                whileHover={{ x: 5 }}
              >
                Our Story
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.a>
            </motion.div>

            {/* Slider Indicator */}
            <motion.div
              className="flex items-center gap-6 text-white/50 text-sm tracking-widest mt-auto border-t border-white/10 pt-6 w-max"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <button onClick={prevSlide} className="hover:text-[var(--color-gold)] transition-colors p-2 -ml-2" data-hoverable>
                <ChevronLeft size={18} />
              </button>
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                <span className="text-white font-medium">0{currentSlide}</span> / 0{totalSlides}
              </span>
              <button onClick={nextSlide} className="hover:text-[var(--color-gold)] transition-colors p-2 -mr-2" data-hoverable>
                <ChevronRight size={18} />
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column: Image with Cinematic Frame Reveal */}
          <motion.div 
            className="relative h-[450px] sm:h-[550px] lg:h-[600px] xl:h-[680px] w-full flex items-center justify-center lg:justify-end min-w-0"
            style={{ opacity, y }}
          >
            {/* Ornate gold frame */}
            <div className="relative w-full h-full max-w-sm sm:max-w-md lg:max-w-none mx-auto lg:mx-0 z-10">
              
              {/* The image with cinematic reveal */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  className={isRevealed ? 'hero-frame-reveal' : ''}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                  }}
                >
                  <motion.div style={{ scale: imageScale }} className="absolute inset-0">
                    <Image 
                      src={images[currentSlide - 1]} 
                      alt={`Luxury Emerald Necklace Slide ${currentSlide}`} 
                      fill
                      priority
                      className="object-contain drop-shadow-2xl"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </motion.div>
                  
                  {/* Floating Pins */}
                  {currentSlide === 1 && (
                    <>
                      <FloatingPin x="65%" y="35%" label="18k White Gold" delay={0.2} />
                      <FloatingPin x="40%" y="65%" label="Zambian Emerald" delay={0.4} />
                      <FloatingPin x="60%" y="85%" label="VVS Diamonds" delay={0.6} />
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Ornate SVG Frame overlay */}
              <OrnateFrame />
            </div>
            
            {/* Backglow for the images */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-[var(--color-garnet)]/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-[var(--color-gold)]/5 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />
          </motion.div>
        
        </div>
      </div>
    </section>
  );
}
