'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, HelpCircle } from 'lucide-react';
import { useAdmin } from './AdminContext';

export default function AdminConfirmModal() {
  const { confirmState, resolveConfirm } = useAdmin();
  const { open, title, message, confirmLabel, variant } = confirmState;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[300] bg-black/75 backdrop-blur-[2px]"
            onClick={() => resolveConfirm(false)}
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="fixed inset-0 z-[301] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="rounded-2xl p-7 w-full max-w-[340px] shadow-2xl pointer-events-auto border"
              style={{ background: 'var(--a-elevated)', borderColor: 'var(--a-border)' }}
            >
              {/* Icon */}
              <div className="flex justify-center mb-5">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                    variant === 'danger'
                      ? 'bg-red-500/10 border-red-500/20'
                      : 'bg-[rgba(212,175,55,0.08)] border-[rgba(212,175,55,0.18)]'
                  }`}
                >
                  {variant === 'danger'
                    ? <AlertTriangle className="w-5 h-5 text-red-400" />
                    : <HelpCircle className="w-5 h-5 text-[#D4AF37]" />
                  }
                </div>
              </div>

              <h3
                className="text-[18px] text-black/90 text-center mb-2 font-medium"
                style={{ fontFamily: 'var(--font-accent)' }}
              >
                {title}
              </h3>
              <p className="text-sm text-center mb-7 leading-relaxed"
                style={{ color: 'var(--a-muted)' }}>
                {message}
              </p>

              <div className="flex gap-2.5">
                <button
                  onClick={() => resolveConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border shadow-sm text-sm transition-all duration-200 hover:bg-black/5"
                  style={{ borderColor: 'var(--a-border)', color: 'var(--a-muted)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => resolveConfirm(true)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    variant === 'danger'
                      ? 'bg-red-500/90 hover:bg-red-500 text-black'
                      : 'bg-[#D4AF37] hover:bg-[#E6C24A] text-black'
                  }`}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
