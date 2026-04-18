'use client';

import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { AdminProvider, useAdmin } from './AdminContext';
import AdminSidebar from './AdminSidebar';
import AdminToast from './AdminToast';
import AdminConfirmModal from './AdminConfirmModal';
import AdminCommandPalette from './AdminCommandPalette';
import AdminHotkeys from './AdminHotkeys';
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
    <div className="min-h-screen admin-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Magical Background Orbs */}
      <motion.div 
        className="absolute -top-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full bg-[#D4AF37]/[0.03] blur-[100px] pointer-events-none" 
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }} 
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} 
      />
      <motion.div 
        className="absolute -bottom-1/4 -right-1/4 w-[70vw] h-[70vw] rounded-full bg-[#8A1C29]/[0.03] blur-[120px] pointer-events-none" 
        animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.7, 0.4] }} 
        transition={{ duration: 15, repeat: Infinity, delay: 2, ease: 'easeInOut' }} 
      />
      
      {/* Shimmering glass grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDAsMCwwLDAuMDMpeSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik02MCAwaC02MHY2MGg2MHYtNjB6Ii8+PC9nPjwvc3ZnPg==')] opacity-50 pointer-events-none mask-image-gradient" style={{ maskImage: 'radial-gradient(ellipse at center, transparent 30%, black 100%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[380px] relative z-10"
      >
        {/* Wordmark */}
        <div className="text-center mb-10 flex flex-col items-center">
          <motion.div 
             initial={{ rotateY: 90 }} 
             animate={{ rotateY: 0 }} 
             transition={{ duration: 1, delay: 0.2, type: 'spring' }}
          >
            <TilakSymbol className="w-8 h-10 mb-5 drop-shadow-gold" lightMode={true} />
          </motion.div>
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
          <div className="flex items-center gap-3 mt-6 w-full opacity-60">
            <span className="flex-1 h-px bg-gradient-to-r from-transparent to-black/20" />
            <span className="text-[9px] tracking-[0.3em] text-black/80 uppercase">Administration</span>
            <span className="flex-1 h-px bg-gradient-to-l from-transparent to-black/20" />
          </div>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border shadow-xl p-8 relative overflow-hidden backdrop-blur-md"
          style={{ background: 'rgba(255, 255, 255, 0.7)', borderColor: 'var(--a-border)' }}
        >
          {/* Card subtle shine */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/40 pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase mb-2.5 font-medium"
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
                  w-full rounded-xl px-4 py-3 text-sm text-black/85 outline-none
                  transition-all duration-300 placeholder:text-black/20
                  ${error
                    ? 'border border-red-500/40 bg-red-50/50 focus:border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                    : 'border bg-black/[0.02] focus:bg-white focus:shadow-[0_0_20px_rgba(212,175,55,0.1)] focus:border-[#D4AF37]/50'}
                `}
                style={error ? {} : { borderColor: 'var(--a-border)' }}
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase mb-2.5 font-medium"
                style={{ color: 'var(--a-muted)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder="Enter password"
                className={`
                  w-full rounded-xl px-4 py-3 text-sm text-black/85 outline-none
                  transition-all duration-300 placeholder:text-black/20
                  ${error
                    ? 'border border-red-500/40 bg-red-50/50 focus:border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                    : 'border bg-black/[0.02] focus:bg-white focus:shadow-[0_0_20px_rgba(212,175,55,0.1)] focus:border-[#D4AF37]/50'}
                `}
                style={error ? {} : { borderColor: 'var(--a-border)' }}
              />
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-500/90 text-xs mt-2 tracking-wide font-medium flex items-center gap-1"
                  >
                    <span>⚠️</span> Incorrect credentials.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              type="submit"
              disabled={loading || !password || !email}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="
                w-full py-3.5 rounded-xl text-sm font-semibold tracking-wider transition-all duration-300
                bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black shadow-lg shadow-[#D4AF37]/20
                disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                mt-4 relative overflow-hidden group
              "
            >
              <span className="relative z-10">{loading ? 'Authenticating…' : 'Enter Portal'}</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </motion.button>
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
    return (
       <div className="min-h-screen admin-bg flex items-center justify-center p-6 bg-[var(--a-bg)]">
         <motion.div 
           initial={{ opacity: 0, scale: 0.8 }} 
           animate={{ opacity: 1, scale: 1 }} 
           className="w-12 h-16 opacity-50 relative"
         >
           <div className="absolute inset-0 animate-pulse bg-[#D4AF37]/20 blur-xl rounded-full" />
           <TilakSymbol lightMode={true} className="w-full h-full" />
         </motion.div>
       </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="flex min-h-screen admin-bg">
      <AdminSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 bg-[var(--a-bg)] relative z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
        {/* Mobile top bar */}
        <header
          className="lg:hidden flex items-center gap-4 px-4 py-3 border-b sticky top-0 z-30 backdrop-blur-md bg-[var(--a-surface)]/80"
          style={{ borderColor: 'var(--a-border)' }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg transition-colors hover:bg-black/5"
            style={{ color: 'var(--a-muted)' }}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <TilakSymbol className="w-4 h-6" lightMode={true} />
            <span
              className="text-[#D4AF37] text-sm tracking-[0.15em] uppercase font-bold"
              style={{ fontFamily: 'var(--font-accent)' }}
            >
              Swaminarayan
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 md:p-8 overflow-y-auto custom-scrollbar">
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, ease: 'easeOut' }}
             className="max-w-[1400px] w-full mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Global overlays */}
      <AdminToast />
      <AdminConfirmModal />
      <AdminCommandPalette />
      <AdminHotkeys />
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
