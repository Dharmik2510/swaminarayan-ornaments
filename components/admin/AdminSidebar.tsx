'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Tag, Image as ImageIcon,
  LogOut, ExternalLink, X,
} from 'lucide-react';
import { useAdmin } from './AdminContext';
import TilakSymbol from '../TilakSymbol';

const NAV_ITEMS = [
  { href: '/admin',            label: 'Dashboard',  icon: LayoutDashboard, exact: true },
  { href: '/admin/products',   label: 'Products',   icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/media',      label: 'Media',      icon: ImageIcon },
  { href: '/admin/guide',      label: 'Guide',      icon: ExternalLink },
];

function NavLink({ item, onClick, delay = 0 }: { item: typeof NAV_ITEMS[0]; onClick?: () => void; delay?: number }) {
  const pathname = usePathname();
  const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
  const Icon = item.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      <Link
        href={item.href}
        onClick={onClick}
        className={`
          relative flex items-center gap-3 px-4 py-2.5 text-[13px] rounded-lg
          transition-colors duration-200 group z-10
          ${isActive
            ? 'text-[#D4AF37]'
            : 'text-black/80 hover:text-black/95'}
        `}
      >
        {/* Animated Active Background pill */}
        {isActive && (
          <motion.div
            layoutId="sidebarActiveBackground"
            className="absolute inset-0 bg-[#D4AF37]/10 rounded-lg z-[-1]"
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          />
        )}
        
        {isActive && (
          <motion.span 
            layoutId="sidebarActiveIndicator"
            className="absolute left-0 inset-y-2 w-[2px] rounded-r-full bg-[#D4AF37]" 
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          />
        )}
        
        <div className="relative">
          <Icon className={`w-3.5 h-3.5 shrink-0 transition-transform duration-300 ${isActive ? 'text-[#D4AF37] scale-110' : 'text-black/80 group-hover:text-black group-hover:scale-110'}`} />
          {/* Sparkle on hover (inactive state only) */}
          {!isActive && (
             <span className="absolute -inset-1 rounded-full bg-black/5 scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
          )}
        </div>
        <span className="tracking-[0.03em] font-medium">{item.label}</span>
      </Link>
    </motion.div>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { logout } = useAdmin();
  return (
    <div className="flex flex-col h-full bg-[var(--a-surface)]">
      {/* Wordmark */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-5 pt-7 pb-6 relative flex items-start gap-4 group"
      >
        <TilakSymbol className="w-6 h-8 shrink-0 mt-1 transition-transform duration-500 group-hover:rotate-[5deg]" lightMode={true} />
        <div>
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-black/90 hover:text-black/95 hover:bg-black/5 transition-colors lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <p
            className="text-[14px] tracking-[0.2em] text-black/90 font-bold uppercase leading-none overflow-hidden relative"
            style={{ fontFamily: 'var(--font-accent)' }}
          >
            Swaminarayan
            {/* Shimmer sweep */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
          </p>
          <p
            className="text-[10px] tracking-[0.28em] font-medium uppercase mt-1"
            style={{ fontFamily: 'var(--font-accent)', color: 'var(--a-gold)' }}
          >
            Ornaments
          </p>
        </div>
      </motion.div>
      <div className="mx-5 mb-5 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent opacity-50" />

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="px-4 pb-2 text-[9px] tracking-[0.25em] uppercase text-black/40 font-bold"
        >
          Menu
        </motion.p>
        <div className="space-y-0.5 relative">
           {NAV_ITEMS.map((item, i) => (
             <NavLink key={item.href} item={item} onClick={onClose} delay={0.2 + (i * 0.05)} />
           ))}
        </div>
      </nav>

      {/* Footer links */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="px-3 pb-5 pt-4" style={{ borderTop: '1px solid var(--a-border)' }}
      >
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 text-[13px] rounded-lg text-black/55 hover:text-black hover:bg-black/[0.03] transition-all duration-200 group"
        >
           <div className="p-1 rounded bg-black/5 group-hover:bg-black/10 transition-colors">
              <ExternalLink className="w-3.5 h-3.5 shrink-0 group-hover:text-black/90 group-hover:scale-110 transition-transform" />
           </div>
          <span className="font-medium">View Storefront</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] rounded-lg text-black/55 hover:text-red-500 hover:bg-red-50 transition-all duration-200 group mt-1"
        >
          <div className="p-1 rounded bg-black/5 group-hover:bg-red-100 transition-colors">
            <LogOut className="w-3.5 h-3.5 shrink-0 group-hover:text-red-500 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span className="font-medium">Sign Out</span>
        </button>
      </motion.div>
    </div>
  );
}

interface Props { mobileOpen: boolean; onMobileClose: () => void; }

export default function AdminSidebar({ mobileOpen, onMobileClose }: Props) {
  return (
    <>
      {/* Desktop */}
      <aside
        className="hidden lg:flex flex-col w-[260px] shrink-0 min-h-screen border-r relative z-20"
        style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              key="drawer"
              initial={{ x: '-100%', opacity: 0.5 }} 
              animate={{ x: 0, opacity: 1 }} 
              exit={{ x: '-100%', opacity: 0.5 }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r shadow-2xl lg:hidden flex flex-col relative"
              style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
            >
              <SidebarContent onClose={onMobileClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
