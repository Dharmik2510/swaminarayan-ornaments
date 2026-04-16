'use client';

import { motion } from 'framer-motion';

export default function DiamondDivider() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="diamond-divider">
        <motion.div
          className="diamond"
          initial={{ scale: 0, rotate: 0 }}
          whileInView={{ scale: 1, rotate: 45 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
