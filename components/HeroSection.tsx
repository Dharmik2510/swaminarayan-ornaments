'use client';

import { useRef, useState } from 'react';
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
      <div className="w-8 h-8 rounded-full border border-[#D4AF37]/50 bg-[#061A14]/80 backdrop-blur-md flex items-center justify-center text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#061A14]">
        <Plus size={16} />
      </div>
      {/* Tooltip */}
      <div className="absolute top-1/2 left-full ml-3 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        <div className="bg-[#0A241C] border border-[#D4AF37]/30 text-[#F4E8DB] text-xs px-3 py-1.5 rounded-sm flex items-center gap-2 shadow-gold whitespace-nowrap" style={{ fontFamily: 'var(--font-body)' }}>
          <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
          {label}
        </div>
      </div>
    </div>
  </motion.div>
);

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 3;
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  const images = [
    '/images/emerald_necklace.png',
    '/images/emerald_necklace.png', // Duplicates for now
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

      <div className="container mx-auto px-6 lg:px-12 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[70vh]">
          
          {/* Left Column: Text & CTA */}
          <motion.div 
            className="flex flex-col justify-center max-w-2xl h-full py-10"
            style={{ opacity, y }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-[1px] bg-[var(--color-gold)] opacity-60" />
              <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-[var(--color-gold)] font-medium" style={{ fontFamily: 'var(--font-body)' }}>
                Jewelry Design With Love
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.1] mb-6 text-white" style={{ fontFamily: 'var(--font-display)' }}>
              The Perfect
              <br />
              <span className="text-[var(--color-card-cream)] gold-gradient-text block mt-2">Jewels</span> For You
            </h1>

            <p className="text-lg md:text-xl text-white/70 mb-12 max-w-md leading-relaxed font-light" style={{ fontFamily: 'var(--font-body)' }}>
              Explore our Spring Collection featuring hand-crafted Emerald and Diamond masterpieces, designed to bring out your inner radiance.
            </p>

            <div className="flex flex-wrap items-center gap-6 mb-16">
              <a href="#collection" data-hoverable className="group relative px-10 py-5 bg-[var(--color-card-cream)] text-[var(--color-background)] font-medium text-xs md:text-sm tracking-[0.2em] uppercase hover:bg-white transition-colors duration-300">
                View Collection
              </a>
            </div>

            {/* Slider Indicator */}
            <div className="flex items-center gap-6 text-white/50 text-sm tracking-widest mt-auto border-t border-white/10 pt-8 w-max">
              <button onClick={prevSlide} className="hover:text-[var(--color-gold)] transition-colors p-2 -ml-2" data-hoverable>
                <ChevronLeft size={18} />
              </button>
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                <span className="text-white font-medium">0{currentSlide}</span> / 0{totalSlides}
              </span>
              <button onClick={nextSlide} className="hover:text-[var(--color-gold)] transition-colors p-2 -mr-2" data-hoverable>
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>

          {/* Right Column: Image & Interactive elements */}
          <motion.div 
            className="relative h-[500px] sm:h-[600px] lg:h-[750px] w-full flex items-center justify-center lg:justify-end"
            style={{ opacity, y }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
          >
            {/* The main jewelry image - Using AnimatePresence for slide changes */}
            <div className="relative w-full h-full max-w-lg lg:max-w-xl mx-auto lg:mr-0 z-10 pl-6 lg:pl-0">
               <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0"
                >
                  <Image 
                    src={images[currentSlide - 1]} 
                    alt={`Luxury Emerald Necklace Slide ${currentSlide}`} 
                    fill
                    priority
                    className="object-contain lg:object-right drop-shadow-2xl"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  
                  {/* Floating Pins - specific to slide 1 for demo purposes */}
                  {currentSlide === 1 && (
                    <>
                      <FloatingPin x="65%" y="35%" label="18k White Gold" delay={0.2} />
                      <FloatingPin x="40%" y="65%" label="Zambian Emerald" delay={0.4} />
                      <FloatingPin x="60%" y="85%" label="VVS Diamonds" delay={0.6} />
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Backglow for the images */}
            <div className="absolute top-1/2 left-1/2 lg:left-[70%] -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[var(--color-garnet)]/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="absolute top-1/2 left-1/2 lg:left-[70%] -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-[var(--color-gold)]/5 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />
          </motion.div>
        
        </div>
      </div>
    </section>
  );
}
