'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer id="contact" className="relative pt-24 pb-8 px-6">
      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent)' }} />

      <div className="max-w-6xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3
              className="text-3xl font-bold gold-gradient-text mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Swaminarayan<br />Ornaments
            </h3>
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
              {['Home', 'Collection', 'About', 'Contact Us'].map((link) => (
                <a
                  key={link}
                  href="#"
                  data-hoverable
                  className="text-sm text-text-secondary hover:text-gold transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}
                >
                  {link}
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

        {/* Bottom bar */}
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
          <div className="flex items-center gap-1">
            <span className="text-xs text-text-tertiary" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
              Crafted with
            </span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨
            </motion.span>
            <span className="text-xs text-text-tertiary" style={{ fontFamily: 'var(--font-body)', fontWeight: 300 }}>
              in India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
