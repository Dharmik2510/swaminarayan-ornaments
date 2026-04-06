'use client';

import { motion } from 'framer-motion';

const footerLinks = [
  { label: 'Home', href: '#' },
  { label: 'Collection', href: '#collection' },
  { label: 'About', href: '#about' },
  { label: 'Contact Us', href: '#contact' },
];

export default function Footer() {
  return (
    <footer id="contact" className="relative pt-28 pb-8 px-6 overflow-hidden">
      {/* Top ornate divider */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-center">
        <div className="flex items-center w-full max-w-6xl">
          <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.15))' }} />
          <motion.div
            className="mx-4 w-2 h-2 rotate-45"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)', boxShadow: '0 0 8px rgba(212, 175, 55, 0.3)' }}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
          />
          <div className="flex-1 h-[1px]" style={{ background: 'linear-gradient(270deg, transparent, rgba(212, 175, 55, 0.15))' }} />
        </div>
      </div>

      {/* Background ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(212, 175, 55, 0.03), transparent 70%)' }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Large brand statement */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p
            className="text-xs tracking-[0.4em] uppercase text-gold/40 mb-6"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Swaminarayan Ornaments
          </p>
          <h3
            className="text-4xl md:text-6xl lg:text-7xl font-bold gold-gradient-text mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Where Heritage
            <br />
            Meets Elegance
          </h3>
          <p
            className="text-text-secondary text-base md:text-lg max-w-lg mx-auto leading-relaxed"
            style={{ fontFamily: 'var(--font-accent)', fontWeight: 300, fontStyle: 'italic' }}
          >
            Wholesale gold jewellery of unmatched purity and timeless design,
            crafted with devotion in Ahmedabad, India.
          </p>
        </motion.div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h4
              className="text-xs tracking-[0.3em] uppercase text-gold/50 mb-6"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              About Us
            </h4>
            <p
              className="text-text-secondary text-sm leading-relaxed"
              style={{ fontFamily: 'var(--font-accent)', fontWeight: 300, fontStyle: 'italic' }}
            >
              Where centuries of goldsmithing heritage meets contemporary elegance. 
              Your trusted wholesale partner in premium gold jewellery.
            </p>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4
              className="text-xs tracking-[0.3em] uppercase text-gold/50 mb-6"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Quick Links
            </h4>
            <div className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  data-hoverable
                  className="text-sm text-text-secondary hover:text-gold transition-all duration-300 hover:translate-x-1 flex items-center gap-2 group"
                  style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}
                >
                  <span className="w-0 group-hover:w-3 h-[1px] bg-gold/50 transition-all duration-300" />
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4
              className="text-xs tracking-[0.3em] uppercase text-gold/50 mb-6"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Get In Touch
            </h4>
            <div className="flex flex-col gap-4">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                data-hoverable
                className="flex items-center gap-3 text-sm text-text-secondary hover:text-gold transition-colors duration-300 group"
                style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}
              >
                <span className="text-lg group-hover:scale-110 transition-transform">💬</span>
                WhatsApp Enquiry
              </a>
              <p className="flex items-center gap-3 text-sm text-text-secondary" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                <span className="text-lg">📍</span>
                Ahmedabad, Gujarat, India
              </p>
              <p className="flex items-center gap-3 text-sm text-text-secondary" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
                <span className="text-lg">🕐</span>
                Mon - Sat, 10:00 AM - 7:00 PM
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar — with ornate styling */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(212, 175, 55, 0.08)' }}
        >
          <p
            className="text-xs text-text-tertiary"
            style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}
          >
            © {new Date().getFullYear()} Swaminarayan Ornaments. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-tertiary" style={{ fontFamily: 'var(--font-accent)', fontWeight: 300, fontStyle: 'italic' }}>
              Crafted with
            </span>
            <motion.span
              className="text-gold/60"
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              ✦
            </motion.span>
            <span className="text-xs text-text-tertiary" style={{ fontFamily: 'var(--font-accent)', fontWeight: 300, fontStyle: 'italic' }}>
              in India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
