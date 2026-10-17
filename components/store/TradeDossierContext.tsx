'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { Product } from '@/lib/data';

export type PurityPreference = 'both' | '92' | '84';
export type InquiryMode = 'showroom' | 'catalog' | 'custom';

interface TradeDossierContextValue {
  shortlist: Product[];
  isShortlisted: (productId: string) => boolean;
  toggleShortlist: (product: Product) => void;
  removeFromShortlist: (productId: string) => void;
  clearShortlist: () => void;
  purityPref: PurityPreference;
  setPurityPref: (p: PurityPreference) => void;
  inquiryMode: InquiryMode;
  setInquiryMode: (m: InquiryMode) => void;
  selectedCategories: string[];
  toggleCategoryPref: (cat: string) => void;
  businessName: string;
  setBusinessName: (name: string) => void;
  city: string;
  setCity: (city: string) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  buildWhatsAppUrl: (phone?: string) => string;
}

const STORAGE_KEY = 'swaminarayan_trade_dossier_v1';

const TradeDossierContext = createContext<TradeDossierContextValue | null>(null);

export function TradeDossierProvider({ children }: { children: ReactNode }) {
  const [shortlist, setShortlist] = useState<Product[]>([]);
  const [purityPref, setPurityPref] = useState<PurityPreference>('both');
  const [inquiryMode, setInquiryMode] = useState<InquiryMode>('showroom');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'Necklaces',
    'Bangles',
    'Bridal Sets',
  ]);
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.shortlist)) setShortlist(parsed.shortlist);
        if (parsed.purityPref) setPurityPref(parsed.purityPref);
        if (parsed.inquiryMode) setInquiryMode(parsed.inquiryMode);
        if (Array.isArray(parsed.selectedCategories)) {
          setSelectedCategories(parsed.selectedCategories);
        }
        if (typeof parsed.businessName === 'string') setBusinessName(parsed.businessName);
        if (typeof parsed.city === 'string') setCity(parsed.city);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          shortlist,
          purityPref,
          inquiryMode,
          selectedCategories,
          businessName,
          city,
        })
      );
    } catch {
      // ignore storage errors
    }
  }, [shortlist, purityPref, inquiryMode, selectedCategories, businessName, city]);

  const isShortlisted = useCallback(
    (productId: string) => shortlist.some((p) => p.id === productId),
    [shortlist]
  );

  const toggleShortlist = useCallback((product: Product) => {
    setShortlist((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  }, []);

  const removeFromShortlist = useCallback((productId: string) => {
    setShortlist((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const clearShortlist = useCallback(() => {
    setShortlist([]);
  }, []);

  const toggleCategoryPref = useCallback((cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }, []);

  const buildWhatsAppUrl = useCallback(
    (phone = '919876543210') => {
      const modeLabel =
        inquiryMode === 'showroom'
          ? 'Private Showroom Appointment (Ahmedabad)'
          : inquiryMode === 'catalog'
            ? 'Wholesale Rate Sheet & Catalog Allocation'
            : 'Custom Bridal / Temple Jewellery Commission';

      const purityLabel =
        purityPref === 'both'
          ? '92K & 84K Hallmarked Gold'
          : `${purityPref} Carat Hallmarked Gold`;

      const lines: string[] = [
        'Namaste Swaminarayan Ornaments Trade Desk,',
        '',
        `*Inquiry Type:* ${modeLabel}`,
        `*Purity Requirement:* ${purityLabel}`,
      ];

      if (businessName.trim() || city.trim()) {
        lines.push(
          `*Retailer / Firm:* ${[businessName.trim(), city.trim()].filter(Boolean).join(' · ')}`
        );
      }

      if (selectedCategories.length > 0) {
        lines.push(`*Focus Categories:* ${selectedCategories.join(', ')}`);
      }

      if (shortlist.length > 0) {
        lines.push('', `*Shortlisted Pieces (${shortlist.length}):*`);
        shortlist.forEach((item, idx) => {
          lines.push(`${idx + 1}. ${item.name} (${item.carat}K · ${item.category})`);
        });
      }

      lines.push('', 'Please share wholesale trade availability and next steps.');
      return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`;
    },
    [inquiryMode, purityPref, businessName, city, selectedCategories, shortlist]
  );

  return (
    <TradeDossierContext.Provider
      value={{
        shortlist,
        isShortlisted,
        toggleShortlist,
        removeFromShortlist,
        clearShortlist,
        purityPref,
        setPurityPref,
        inquiryMode,
        setInquiryMode,
        selectedCategories,
        toggleCategoryPref,
        businessName,
        setBusinessName,
        city,
        setCity,
        drawerOpen,
        setDrawerOpen,
        buildWhatsAppUrl,
      }}
    >
      {children}
    </TradeDossierContext.Provider>
  );
}

export function useTradeDossier() {
  const ctx = useContext(TradeDossierContext);
  if (!ctx) {
    throw new Error('useTradeDossier must be used within a TradeDossierProvider');
  }
  return ctx;
}
