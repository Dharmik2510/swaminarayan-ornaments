'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GoldCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile/touch devices
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window);
    };
    checkMobile();
    
    if (isMobile) return;

    const moveCursor = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      if (trailRef.current) {
        // Trail follows with slight delay via CSS transition
        trailRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-hoverable]') ||
        target.style.cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, isMobile]);

  if (isMobile) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Main cursor - gold ring */}
          <div
            ref={cursorRef}
            className="fixed pointer-events-none z-[10000] -ml-[16px] -mt-[16px]"
            style={{ willChange: 'transform' }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: isHovering ? 1.5 : 1,
                opacity: 1,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                border: `2px solid ${isHovering ? '#FFD700' : 'rgba(212, 175, 55, 0.7)'}`,
                boxShadow: isHovering 
                  ? '0 0 20px rgba(255, 215, 0, 0.4), inset 0 0 10px rgba(255, 215, 0, 0.1)' 
                  : '0 0 10px rgba(212, 175, 55, 0.2)',
                background: isHovering ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
              }}
            >
              {/* Center dot */}
              <motion.div
                animate={{
                  scale: isHovering ? 0 : 1,
                }}
                className="w-1.5 h-1.5 rounded-full bg-gold"
              />
            </motion.div>
          </div>

          {/* Trail cursor */}
          <div
            ref={trailRef}
            className="fixed pointer-events-none z-[9999] -ml-[24px] -mt-[24px]"
            style={{
              willChange: 'transform',
              transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: isHovering ? 1.8 : 1,
                opacity: isHovering ? 0.15 : 0.08,
              }}
              exit={{ scale: 0, opacity: 0 }}
              className="w-12 h-12 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3), transparent)',
              }}
            />
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
