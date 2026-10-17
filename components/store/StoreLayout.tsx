"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X, Bookmark, Check } from "lucide-react";
import { motion, useScroll, useReducedMotion } from "framer-motion";
import { TradeDossierProvider, useTradeDossier } from "./TradeDossierContext";
import type { CategoryWithStats } from "@/lib/catalog";

export function Brand() {
  return (
    <Link
      href="/"
      className="atelier-brand"
      aria-label="Swaminarayan Ornaments home"
    >
      <span className="brand-mark" aria-hidden="true">
        S<span>O</span>
      </span>
      <span>
        SWAMINARAYAN<small>O R N A M E N T S</small>
      </span>
    </Link>
  );
}
export function Dialog({
  children,
  label,
  onClose,
}: {
  children: ReactNode;
  label: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = ref.current;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="atelier-dialog"
      aria-label={label}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog-inner">
        <button
          className="icon-button dialog-close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={22} />
        </button>
        {children}
      </div>
    </dialog>
  );
}
function Inquiry() {
  const { shortlist, drawerOpen, setDrawerOpen, removeFromShortlist } =
    useTradeDossier();
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
  const message = `Hello Swaminarayan Ornaments, I would like to enquire about your collection.${shortlist.length ? "\n\nMy selection:\n" + shortlist.map((p) => `${p.name} (${p.id})`).join("\n") : ""}\n\nPlease share availability, specifications and wholesale details.`;
  if (!drawerOpen) return null;
  return (
    <Dialog label="Your enquiry" onClose={() => setDrawerOpen(false)}>
      <div className="inquiry-content">
        <span className="eyebrow">A personal conversation</span>
        <h2>
          Your selection,
          <br />
          <em>our attention.</em>
        </h2>
        <p>
          Collect the pieces you love, then share your enquiry with our team.
        </p>
        <ul className="shortlist">
          {shortlist.map((p) => (
            <li key={p.id}>
              <span>
                {p.name}
                <small>{p.category}</small>
              </span>
              <button
                className="icon-button"
                onClick={() => removeFromShortlist(p.id)}
                aria-label={`Remove ${p.name}`}
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
        {!shortlist.length && (
          <p className="empty-note">
            Your selection is empty. Save pieces from the collection to include
            them here.
          </p>
        )}
        {phone ? (
          <a
            className="atelier-button"
            href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Enquire on WhatsApp <ArrowUpRight size={17} />
          </a>
        ) : (
          <>
            <button
              className="atelier-button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(message);
                  setCopied(true);
                  setCopyError(false);
                } catch {
                  setCopyError(true);
                }
              }}
            >
              {copied ? "Enquiry copied" : "Copy your enquiry"}{" "}
              {copied ? <Check size={17} /> : <ArrowUpRight size={17} />}
            </button>
            <p className="fine-print" role="status">
              {copyError
                ? "Copy the enquiry text below to share with your usual store contact."
                : "Share this enquiry with your usual store contact. Online messaging is not yet available."}
            </p>
            {copyError && (
              <textarea
                readOnly
                value={message}
                aria-label="Enquiry text"
                rows={6}
              />
            )}
          </>
        )}
      </div>
    </Dialog>
  );
}
function Shell({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState(false);
  const { shortlist, setDrawerOpen } = useTradeDossier();
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  const links = [
    ["Collections", "/collection"],
    ["Our story", "/#story"],
    ["The details", "/#details"],
  ];
  return (
    <div className="storefront atelier">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="atelier-header">
        <Brand />
        <nav aria-label="Main navigation" className="desktop-nav">
          {links.map(([name, href]) => (
            <Link key={name} href={href}>
              {name}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <button className="enquiry-link" onClick={() => setDrawerOpen(true)}>
            Enquire <ArrowUpRight size={15} />
          </button>
          <button
            className="icon-button saved-button"
            onClick={() => setDrawerOpen(true)}
            aria-label={`Open saved pieces, ${shortlist.length} saved`}
          >
            <Bookmark size={19} />
            {shortlist.length > 0 && <span>{shortlist.length}</span>}
          </button>
          <button
            className="icon-button mobile-toggle"
            onClick={() => setMenu(!menu)}
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
            aria-controls="mobile-nav"
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
        {!reduced && (
          <motion.div
            className="reading-progress"
            style={{ scaleX: scrollYProgress }}
          />
        )}
      </header>
      {menu && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="mobile-nav"
          onKeyDown={(e) => {
            if (e.key === "Escape") setMenu(false);
          }}
        >
          {links.map(([name, href]) => (
            <Link key={name} href={href} onClick={() => setMenu(false)}>
              {name}
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </nav>
      )}
      {children}
      <footer id="contact" className="atelier-footer">
        <div className="footer-invite">
          <span className="eyebrow">For the next chapter</span>
          <h2>
            Let’s find something
            <br />
            <em>extraordinary.</em>
          </h2>
          <button
            className="atelier-button light"
            onClick={() => setDrawerOpen(true)}
          >
            Begin a conversation <ArrowUpRight size={18} />
          </button>
        </div>
        <div className="footer-bottom">
          <Brand />
          <div>
            <Link href="/collection">Explore the collection</Link>
            <Link href="/#story">Our story</Link>
            <a href="#main-content">Back to top ↑</a>
          </div>
          <p>© {new Date().getFullYear()} Swaminarayan Ornaments</p>
        </div>
      </footer>
      <Inquiry />
    </div>
  );
}
export default function StoreLayout({
  children,
}: {
  children: ReactNode;
  categories?: CategoryWithStats[];
  showFooter?: boolean;
  scrollDeps?: unknown[];
}) {
  return (
    <TradeDossierProvider>
      <Shell>{children}</Shell>
    </TradeDossierProvider>
  );
}
