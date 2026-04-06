'use client';

import { motion } from 'framer-motion';

import Image from 'next/image';

export default function TilakSymbol({ className = "", glow = false }: { className?: string, glow?: boolean }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {glow && (
        <div 
          className="absolute inset-0 blur-xl opacity-60 rounded-full" 
          style={{ background: 'radial-gradient(circle, rgba(220, 38, 38, 0.25) 0%, rgba(212,175,55,0.15) 40%, transparent 70%)' }} 
        />
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full h-full relative z-10 overflow-hidden flex items-center justify-center mix-blend-screen"
        style={{ filter: 'drop-shadow(0px 4px 12px rgba(212,175,55,0.3))' }}
      >
        <Image 
          src="/logo.jpg" 
          alt="Swaminarayan Tilak Symbol" 
          fill
          className="object-contain"
          unoptimized
        />
      </motion.div>
    </div>
  );
}
