'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { categories, type Category } from '@/lib/data';

interface SmartFilterProps {
  selectedCarat: 'all' | 92 | 84;
  selectedCategory: Category;
  onCaratChange: (carat: 'all' | 92 | 84) => void;
  onCategoryChange: (category: Category) => void;
  productCount: number;
}

export default function SmartFilter({
  selectedCarat,
  selectedCategory,
  onCaratChange,
  onCategoryChange,
  productCount,
}: SmartFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const caratOptions: { label: string; value: 'all' | 92 | 84 }[] = [
    { label: 'All Carats', value: 'all' },
    { label: '92 Carat', value: 92 },
    { label: '84 Carat', value: 84 },
  ];

  return (
    <div className="mb-12">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="gold-gradient-text">The Collection</span>
          </motion.h2>
          <motion.p
            className="text-text-secondary text-sm"
            style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {productCount} exquisite pieces
          </motion.p>
        </div>

        {/* View toggle (mobile) */}
        <motion.button
          data-hoverable
          className="md:hidden p-3 rounded-lg"
          style={{
            border: '1px solid rgba(212, 175, 55, 0.15)',
            background: 'rgba(212, 175, 55, 0.05)',
          }}
          onClick={() => setIsExpanded(!isExpanded)}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
            <path d="M3 4h18M3 12h12M3 20h6" strokeLinecap="round" />
          </svg>
        </motion.button>
      </div>

      {/* Filters */}
      <motion.div
        className={`${isExpanded ? 'block' : 'hidden'} md:block`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Carat filter */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span
            className="text-[10px] tracking-[0.3em] uppercase mr-2 text-text-tertiary"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Purity
          </span>
          {caratOptions.map((option) => (
            <motion.button
              key={option.value}
              data-hoverable
              onClick={() => onCaratChange(option.value)}
              className="relative px-5 py-2 text-xs tracking-[0.15em] uppercase transition-all duration-300"
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: selectedCarat === option.value ? 500 : 300,
                color: selectedCarat === option.value ? '#050505' : 'rgba(245, 240, 232, 0.5)',
                border: selectedCarat === option.value ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {selectedCarat === option.value && (
                <motion.div
                  className="absolute inset-0 rounded-sm"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #D4AF37)',
                  }}
                  layoutId="carat-indicator"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-10">{option.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="text-[10px] tracking-[0.3em] uppercase mr-2 text-text-tertiary"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Category
          </span>
          {categories.map((category) => (
            <motion.button
              key={category}
              data-hoverable
              onClick={() => onCategoryChange(category)}
              className="relative px-4 py-1.5 text-xs tracking-[0.1em] transition-all duration-300"
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: selectedCategory === category ? 500 : 300,
                color: selectedCategory === category ? '#D4AF37' : 'rgba(245, 240, 232, 0.4)',
                borderBottom: selectedCategory === category ? '1px solid #D4AF37' : '1px solid transparent',
              }}
              whileHover={{ color: '#D4AF37' }}
              whileTap={{ scale: 0.98 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Active filter indicator */}
      {(selectedCarat !== 'all' || selectedCategory !== 'All') && (
        <motion.div
          className="flex items-center gap-2 mt-6"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-xs text-text-tertiary" style={{ fontFamily: 'var(--font-body)' }}>
            Filters active:
          </span>
          {selectedCarat !== 'all' && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 text-[10px] tracking-wider uppercase rounded-full flex items-center gap-1"
              style={{
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                color: '#D4AF37',
                fontFamily: 'var(--font-body)',
              }}
            >
              {selectedCarat}K
              <button onClick={() => onCaratChange('all')} data-hoverable className="ml-1 opacity-50 hover:opacity-100">×</button>
            </motion.span>
          )}
          {selectedCategory !== 'All' && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 text-[10px] tracking-wider uppercase rounded-full flex items-center gap-1"
              style={{
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                color: '#D4AF37',
                fontFamily: 'var(--font-body)',
              }}
            >
              {selectedCategory}
              <button onClick={() => onCategoryChange('All')} data-hoverable className="ml-1 opacity-50 hover:opacity-100">×</button>
            </motion.span>
          )}
          <motion.button
            data-hoverable
            className="text-[10px] tracking-wider uppercase text-text-tertiary hover:text-gold transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
            onClick={() => {
              onCaratChange('all');
              onCategoryChange('All');
            }}
          >
            Clear all
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
