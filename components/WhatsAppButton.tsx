'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '@/lib/data';

interface WhatsAppButtonProps {
  product: Product;
  phoneNumber?: string;
}

export default function WhatsAppButton({ product, phoneNumber = '919876543210' }: WhatsAppButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);

    const message = encodeURIComponent(
      `Hello! I'm interested in:\n\n` +
      `*${product.name}*\n` +
      `Carat: ${product.carat}K\n` +
      `Category: ${product.category}\n\n` +
      `Please share more details and availability.`
    );

    setTimeout(() => {
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
      setIsAnimating(false);
    }, 800);
  };

  return (
    <motion.button
      data-hoverable
      onClick={handleClick}
      className="relative px-6 py-3 overflow-hidden rounded-sm group"
      style={{
        background: isAnimating
          ? '#25D366'
          : 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(184, 134, 11, 0.15))',
        border: isAnimating
          ? '1px solid #25D366'
          : '1px solid rgba(212, 175, 55, 0.3)',
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={{
        boxShadow: isAnimating
          ? '0 0 30px rgba(37, 211, 102, 0.3)'
          : '0 0 20px rgba(212, 175, 55, 0.1)',
      }}
    >
      {/* Gold pulse ripple effect */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            className="absolute inset-0"
            style={{ background: '#25D366' }}
            initial={{ scale: 0, borderRadius: '50%' }}
            animate={{ scale: 3, borderRadius: '0%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">
        <AnimatePresence mode="wait">
          {isAnimating ? (
            <motion.span
              key="whatsapp"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {/* WhatsApp icon */}
              <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </motion.span>
          ) : (
            <motion.span
              key="gold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, rotate: 180 }}
              className="text-gold"
            >
              {/* Chat icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>

        <span
          className="text-sm tracking-[0.15em] uppercase"
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            color: isAnimating ? 'white' : '#D4AF37',
          }}
        >
          {isAnimating ? 'Opening WhatsApp...' : 'Enquire Now'}
        </span>
      </span>
    </motion.button>
  );
}
