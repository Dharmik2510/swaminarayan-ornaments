"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/data";

/** The pieces a visitor saves to ask about, persisted in this browser only. */
export type SavedPiece = Pick<
  Product,
  "id" | "name" | "category" | "carat" | "images"
>;

interface SelectionValue {
  saved: SavedPiece[];
  isSaved: (id: string) => boolean;
  toggle: (product: Product | SavedPiece) => void;
  remove: (id: string) => void;
  enquiryOpen: boolean;
  setEnquiryOpen: (open: boolean) => void;
  active: Product | null;
  openPiece: (product: Product | null) => void;
}

const KEY = "so_selection_v2";
const LEGACY_KEY = "swaminarayan_trade_dossier_v1";

const SelectionContext = createContext<SelectionValue | null>(null);

function slim(p: Product | SavedPiece): SavedPiece {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    carat: p.carat,
    images: p.images.slice(0, 1),
  };
}

function valid(p: unknown): p is SavedPiece {
  const o = p as SavedPiece;
  return (
    !!o &&
    typeof o.id === "string" &&
    typeof o.name === "string" &&
    typeof o.category === "string" &&
    Array.isArray(o.images)
  );
}

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<SavedPiece[]>([]);
  const [ready, setReady] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [active, setActive] = useState<Product | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const list = Array.isArray(parsed) ? parsed : parsed?.shortlist;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (Array.isArray(list)) setSaved(list.filter(valid).map(slim));
      }
    } catch {
      // Storage can be unavailable (private mode, blocked site data).
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(saved));
    } catch {
      // Ignore: saving still works for this visit.
    }
  }, [saved, ready]);

  const isSaved = useCallback(
    (id: string) => saved.some((p) => p.id === id),
    [saved],
  );
  const toggle = useCallback((product: Product | SavedPiece) => {
    setSaved((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, slim(product)],
    );
  }, []);
  const remove = useCallback(
    (id: string) => setSaved((prev) => prev.filter((p) => p.id !== id)),
    [],
  );

  const value = useMemo(
    () => ({
      saved,
      isSaved,
      toggle,
      remove,
      enquiryOpen,
      setEnquiryOpen,
      active,
      openPiece: setActive,
    }),
    [saved, isSaved, toggle, remove, enquiryOpen, active],
  );

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSelection must be used inside SelectionProvider");
  return ctx;
}
