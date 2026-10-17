"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Brand } from "./Brand";
import { EnquirySheet } from "./Enquiry";
import PieceSheet from "./PieceSheet";
import { SelectionProvider, useSelection } from "./Selection";

const LINKS: [string, string][] = [
  ["Collection", "/collection"],
  ["The house", "/#house"],
];

/**
 * The bar reads the ground under it. Every section declares data-ground, so
 * the bar inks itself for velvet or for card stock instead of hiding behind a
 * blurred slab. It steps out of the way while reading down and returns on the
 * way back up.
 */
function useBarState(ref: React.RefObject<HTMLElement | null>) {
  const [hidden, setHidden] = useState(false);
  const [ground, setGround] = useState<"dark" | "light">("dark");
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const probe = () => {
      frame = 0;
      const y = window.scrollY;
      const h = ref.current?.offsetHeight ?? 64;
      const mid = h / 2;
      const grounds = document.querySelectorAll<HTMLElement>("[data-ground]");
      let found: "dark" | "light" = "dark";
      for (const el of grounds) {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) found = (el.dataset.ground as "dark" | "light") ?? "dark";
      }
      setGround(found);
      setSolid(y > 40);
      const delta = y - last;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > 220);
        last = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(probe);
    };
    probe();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);
  return { hidden, ground, solid };
}

function Bar() {
  const ref = useRef<HTMLElement>(null);
  const { hidden, ground, solid } = useBarState(ref);
  const { saved, setEnquiryOpen } = useSelection();
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [menu]);

  return (
    <>
      <header
        ref={ref}
        className="vt-bar"
        data-on={menu ? "dark" : ground}
        data-hidden={hidden && !menu ? "true" : "false"}
        data-solid={solid ? "true" : "false"}
      >
        <Brand onNavigate={() => setMenu(false)} />
        <nav className="vt-bar__nav" aria-label="Main">
          {LINKS.map(([name, href]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
            >
              {name}
            </Link>
          ))}
        </nav>
        <div className="vt-bar__end">
          <button
            type="button"
            className="vt-bar__enquire"
            onClick={() => setEnquiryOpen(true)}
            aria-label={`Enquire${saved.length ? `, ${saved.length} saved` : ""}`}
          >
            Enquire
            {saved.length > 0 && <span className="vt-bar__count">{saved.length}</span>}
          </button>
          <button
            type="button"
            className="vt-bar__menu"
            aria-expanded={menu}
            aria-controls="vt-menu"
            aria-label={menu ? "Close menu" : "Open menu"}
            onClick={() => setMenu((m) => !m)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      <div id="vt-menu" className="vt-menu" data-open={menu ? "true" : "false"} hidden={!menu}>
        <nav aria-label="Mobile">
          {LINKS.map(([name, href]) => (
            <Link key={href} href={href} onClick={() => setMenu(false)}>
              {name}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              setMenu(false);
              setEnquiryOpen(true);
            }}
          >
            Enquire{saved.length ? ` (${saved.length})` : ""}
          </button>
        </nav>
      </div>
    </>
  );
}

function Colophon() {
  return (
    <footer className="vt-colophon" data-ground="dark">
      <Brand />
      <nav aria-label="Footer">
        <Link href="/collection">Collection</Link>
        <Link href="/#house">The house</Link>
        <a href="#top">Back to top</a>
      </nav>
      <p>© {new Date().getFullYear()} Swaminarayan Ornaments</p>
    </footer>
  );
}

export default function StoreShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const home = pathname === "/";
  return (
    <SelectionProvider>
      <div className="vt" id="top">
        <a href="#main" className="vt-skip">
          Skip to content
        </a>
        <Bar />
        {children}
        {!home && <Colophon />}
        <EnquirySheet />
        <PieceSheet />
      </div>
    </SelectionProvider>
  );
}

export { Colophon };
