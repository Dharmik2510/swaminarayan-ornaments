'use client';

import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { AdminProvider, useAdmin } from './AdminContext';
import AdminSidebar from './AdminSidebar';
import AdminToast from './AdminToast';
import AdminConfirmModal from './AdminConfirmModal';
import TilakSymbol from '../TilakSymbol';

// ─── Login screen ─────────────────────────────────────────────────────────────
function LoginScreen() {
  const { login } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(email, password);
    if (!ok) {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen admin-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[360px]"
      >
        {/* Wordmark */}
        <div className="text-center mb-10 flex flex-col items-center">
          <TilakSymbol className="w-8 h-10 mb-5" lightMode={true} />
          <p
            className="text-[22px] tracking-[0.22em] text-black/85 font-medium uppercase"
            style={{ fontFamily: 'var(--font-accent)' }}
          >
            Swaminarayan
          </p>
          <p
            className="text-[13px] tracking-[0.32em] text-[#D4AF37] font-medium uppercase mt-1"
            style={{ fontFamily: 'var(--font-accent)' }}
          >
            Ornaments
          </p>
          <div className="flex items-center gap-3 mt-5">
            <span className="flex-1 h-px bg-black/[0.07]" />
            <span className="text-[9px] tracking-[0.3em] text-black/90 uppercase">Administration</span>
            <span className="flex-1 h-px bg-black/[0.07]" />
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-xl border shadow-sm p-7"
          style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase mb-2.5"
                style={{ color: 'var(--a-muted)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(false); }}
                placeholder="Enter admin email"
                autoFocus
                className={`
                  w-full rounded-lg px-3.5 py-2.5 text-sm text-black/85 outline-none
                  transition-all duration-200 placeholder:text-black/20
                  ${error
                    ? 'border border-red-500/40 bg-red-950/20 focus:border-red-500/60'
                    : 'border bg-black/[0.03] focus:bg-black/5 focus:border-[rgba(212,175,55,0.35)]'}
                `}
                style={error ? {} : { borderColor: 'var(--a-border)' }}
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase mb-2.5"
                style={{ color: 'var(--a-muted)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder="Enter password"
                className={`
                  w-full rounded-lg px-3.5 py-2.5 text-sm text-black/85 outline-none
                  transition-all duration-200 placeholder:text-black/20
                  ${error
                    ? 'border border-red-500/40 bg-red-950/20 focus:border-red-500/60'
                    : 'border bg-black/[0.03] focus:bg-black/5 focus:border-[rgba(212,175,55,0.35)]'}
                `}
                style={error ? {} : { borderColor: 'var(--a-border)' }}
              />
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400/80 text-xs mt-2 tracking-wide"
                  >
                    Incorrect credentials.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={loading || !password || !email}
              className="
                w-full py-2.5 rounded-lg text-sm font-medium tracking-wider transition-all duration-200
                bg-[#D4AF37] text-black hover:bg-[#E6C24A]
                disabled:opacity-40 disabled:cursor-not-allowed
                mt-2
              "
            >
              {loading ? 'Signing in…' : 'Enter'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Inner shell (requires auth context) ──────────────────────────────────────
function InnerShell({ children }: { children: ReactNode }) {
  const { isAuthenticated, loadingAuth } = useAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loadingAuth) {
    return <div className="min-h-screen admin-bg flex items-center justify-center p-6 text-black text-sm">Loading admin panel...</div>;
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="flex min-h-screen admin-bg">
      <AdminSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header
          className="lg:hidden flex items-center gap-4 px-4 py-3 border-b"
          style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--a-muted)' }}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <TilakSymbol className="w-4 h-6" lightMode={true} />
            <span
              className="text-[#D4AF37] text-sm tracking-[0.15em] uppercase font-medium"
              style={{ fontFamily: 'var(--font-accent)' }}
            >
              Swaminarayan
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Global overlays */}
      <AdminToast />
      <AdminConfirmModal />
    </div>
  );
}

// ─── Public export (wraps with provider) ─────────────────────────────────────
export default function AdminShell({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <InnerShell>{children}</InnerShell>
    </AdminProvider>
  );
}
