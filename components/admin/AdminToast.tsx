'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useAdmin, type ToastVariant } from './AdminContext';

const CONFIG: Record<ToastVariant, { icon: typeof CheckCircle2; accent: string; bar: string }> = {
  success: { icon: CheckCircle2,  accent: 'text-emerald-400', bar: 'bg-emerald-500' },
  error:   { icon: AlertCircle,   accent: 'text-red-400',     bar: 'bg-red-500'     },
  warning: { icon: AlertTriangle, accent: 'text-amber-400',   bar: 'bg-amber-500'   },
  info:    { icon: Info,          accent: 'text-blue-400',    bar: 'bg-blue-500'    },
};

export default function AdminToast() {
  const { toasts, dismissToast } = useAdmin();

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => {
          const { icon: Icon, accent, bar } = CONFIG[t.variant];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 24, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              className="pointer-events-auto flex items-start gap-3 pl-4 pr-3 py-3 rounded-xl shadow-2xl min-w-[280px] max-w-sm overflow-hidden relative border"
              style={{ background: 'var(--a-elevated)', borderColor: 'var(--a-border)' }}
            >
              {/* Colored left bar */}
              <span className={`absolute left-0 inset-y-0 w-[3px] rounded-r-full ${bar}`} />
              {/* Countdown progress */}
              <motion.span
                key={`${t.id}-progress`}
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: t.duration / 1000, ease: 'linear' }}
                className={`absolute left-0 bottom-0 h-[2px] ${bar} origin-left w-full opacity-60`}
              />
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${accent}`} />
              <p className="text-black/95 text-sm flex-1 leading-snug">{t.message}</p>
              {t.action && (
                <button
                  onClick={() => { t.action!.onClick(); dismissToast(t.id); }}
                  className={`shrink-0 text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-md hover:bg-black/5 transition-colors ${accent}`}
                >
                  {t.action.label}
                </button>
              )}
              <button
                onClick={() => dismissToast(t.id)}
                className="text-black/20 hover:text-black/95 transition-colors shrink-0 mt-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
