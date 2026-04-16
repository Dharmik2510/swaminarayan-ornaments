'use client';

import { motion } from 'framer-motion';

export default function TilakBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* 
        Desktop: Subtle watermark centered in the viewport.
        Sized modestly so it never interferes with text or image columns.
      */}
      <svg
        viewBox="0 0 400 500"
        className="
          hidden lg:block
          absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
          h-[50%] max-h-[420px] w-auto
          opacity-[0.12] mix-blend-screen
        "
        style={{ filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.15))' }}
      >
        <defs>
          <linearGradient id="bg-gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
          <linearGradient id="bg-red-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8A1C29" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
        </defs>

        {/* U shape (Urdhva Pundra) */}
        <motion.path
          d="M 120 50 L 120 200 C 120 320, 160 350, 200 350 C 240 350, 280 320, 280 200 L 280 50"
          fill="none"
          stroke="url(#bg-gold-gradient)"
          strokeWidth="1"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{ duration: 10, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
        />
        
        {/* Inner parallel line for a luxury double-line look */}
        <motion.path
          d="M 140 50 L 140 200 C 140 290, 170 320, 200 320 C 230 320, 260 290, 260 200 L 260 50"
          fill="none"
          stroke="url(#bg-gold-gradient)"
          strokeWidth="0.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 12, ease: "easeInOut", delay: 1, repeat: Infinity, repeatType: "mirror" }}
        />

        {/* Central Dot (Chandlo) */}
        <motion.circle
          cx="200"
          cy="220"
          r="16"
          fill="none"
          stroke="url(#bg-red-gradient)"
          strokeWidth="1"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 5, delay: 2, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}
        />
        
        {/* Outer glowing aura ring rotating slowly */}
        <motion.circle
          cx="200"
          cy="250"
          r="150"
          fill="none"
          stroke="url(#bg-gold-gradient)"
          strokeWidth="0.5"
          strokeDasharray="4 12"
          initial={{ rotate: 0, opacity: 0 }}
          animate={{ rotate: 360, opacity: 0.4 }}
          transition={{ duration: 80, ease: "linear", repeat: Infinity }}
          style={{ transformOrigin: "200px 250px" }}
        />

        {/* Second reverse-rotating delicate ring */}
        <motion.circle
          cx="200"
          cy="250"
          r="170"
          fill="none"
          stroke="url(#bg-gold-gradient)"
          strokeWidth="0.25"
          strokeDasharray="1 6"
          initial={{ rotate: 360, opacity: 0 }}
          animate={{ rotate: 0, opacity: 0.2 }}
          transition={{ duration: 100, ease: "linear", repeat: Infinity }}
          style={{ transformOrigin: "200px 250px" }}
        />
      </svg>

      {/* Mobile: show a subtle, smaller version centered */}
      <svg
        viewBox="0 0 400 500"
        className="
          block lg:hidden
          absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2
          h-[45%] max-h-[350px] w-auto
          opacity-[0.08] mix-blend-screen
        "
        style={{ filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.1))' }}
      >
        <defs>
          <linearGradient id="bg-gold-gradient-m" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
          <linearGradient id="bg-red-gradient-m" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8A1C29" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
        </defs>

        <motion.path
          d="M 120 50 L 120 200 C 120 320, 160 350, 200 350 C 240 350, 280 320, 280 200 L 280 50"
          fill="none"
          stroke="url(#bg-gold-gradient-m)"
          strokeWidth="1"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 10, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
        />

        <motion.circle
          cx="200"
          cy="220"
          r="16"
          fill="none"
          stroke="url(#bg-red-gradient-m)"
          strokeWidth="1"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.8 }}
          transition={{ duration: 5, delay: 2, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}
        />
      </svg>
    </div>
  );
}
