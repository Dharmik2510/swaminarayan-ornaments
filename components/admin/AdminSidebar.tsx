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

function NavLink({ item, onClick }: { item: typeof NAV_ITEMS[0]; onClick?: () => void }) {
  const pathname = usePathname();
  const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`
        relative flex items-center gap-3 px-4 py-2.5 text-[13px] rounded-lg
        transition-all duration-200 group
        ${isActive
          ? 'text-[#D4AF37] bg-[rgba(212,175,55,0.07)]'
          : 'text-black/95 hover:text-black/90 hover:bg-black/[0.03]'}
      `}
    >
      {isActive && (
        <span className="absolute left-0 inset-y-2 w-[2px] rounded-r-full bg-[#D4AF37] opacity-80" />
      )}
      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#D4AF37]' : 'text-black/90 group-hover:text-black/90'}`} />
      <span className="tracking-[0.03em]">{item.label}</span>
    </Link>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { logout } = useAdmin();
  return (
    <div className="flex flex-col h-full">
      {/* Wordmark */}
      <div className="px-5 pt-7 pb-6 relative flex items-start gap-4">
        <TilakSymbol className="w-6 h-8 shrink-0 mt-1" lightMode={true} />
        <div>
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-black/90 hover:text-black/95 transition-colors lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <p
            className="text-[14px] tracking-[0.2em] text-black/90 font-medium uppercase leading-none"
            style={{ fontFamily: 'var(--font-accent)' }}
          >
            Swaminarayan
          </p>
          <p
            className="text-[10px] tracking-[0.28em] font-medium uppercase mt-1"
            style={{ fontFamily: 'var(--font-accent)', color: 'var(--a-gold)' }}
          >
            Ornaments
          </p>
        </div>
      </div>
      <div className="mx-5 mb-5 h-px" style={{ background: 'var(--a-border)' }} />

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        <p className="px-4 pb-2 text-[9px] tracking-[0.25em] uppercase text-black/50 font-bold">Menu</p>
        {NAV_ITEMS.map(item => <NavLink key={item.href} item={item} onClick={onClose} />)}
      </nav>

      {/* Footer links */}
      <div className="px-3 pb-5 pt-4" style={{ borderTop: '1px solid var(--a-border)' }}>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 text-[13px] rounded-lg text-black/55 hover:text-black/95 hover:bg-black/[0.03] transition-all duration-200 group"
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0 group-hover:text-black/90" />
          View Storefront
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] rounded-lg text-black/55 hover:text-red-400/80 hover:bg-red-400/[0.05] transition-all duration-200 group"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0 group-hover:text-red-400/80" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

interface Props { mobileOpen: boolean; onMobileClose: () => void; }

export default function AdminSidebar({ mobileOpen, onMobileClose }: Props) {
  return (
    <>
      {/* Desktop */}
      <aside
        className="hidden lg:flex flex-col w-56 shrink-0 min-h-screen border-r"
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
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-64 border-r lg:hidden flex flex-col relative"
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
