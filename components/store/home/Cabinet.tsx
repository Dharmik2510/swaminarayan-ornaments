"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CategoryWithStats } from "@/lib/catalog";

/**
 * Act IV. Every category as a typeset index, with the real number of pieces
 * in each drawer. On a fine pointer, a photograph of the drawer's first piece
 * follows the cursor.
 */
export default function Cabinet({ categories }: { categories: CategoryWithStats[] }) {
  const root = useRef<HTMLElement>(null);
  const peek = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState<CategoryWithStats | null>(null);

  useEffect(() => {
    const el = root.current;
    const pk = peek.current;
    if (!el || !pk || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const P = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0;
    const tick = () => {
      raf = 0;
      const k = reduce ? 1 : 0.16;
      P.x += (P.tx - P.x) * k;
      P.y += (P.ty - P.y) * k;
      pk.style.transform = `translate3d(${P.x.toFixed(1)}px, ${P.y.toFixed(1)}px, 0)`;
      if (Math.abs(P.tx - P.x) > 0.3 || Math.abs(P.ty - P.y) > 0.3) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      P.tx = e.clientX - r.left + 28;
      P.ty = e.clientY - r.top - 120;
      if (P.x === 0 && P.y === 0) {
        P.x = P.tx;
        P.y = P.ty;
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    el.addEventListener("pointermove", onMove);
    return () => {
      el.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const total = categories.reduce((n, c) => n + c.productCount, 0);

  return (
    <section ref={root} className="vt-cabinet" data-ground="light" aria-labelledby="vt-cabinet-title">
      <div className="vt-cabinet__head" data-sc-in>
        <h2 id="vt-cabinet-title" className="vt-display">
          Every drawer
          <br />
          <em>in the cabinet.</em>
        </h2>
        <p>
          {categories.length} categories, {total} {total === 1 ? "piece" : "pieces"} on view today.
          Drawers marked <em>by enquiry</em> have nothing online yet; ask, and the house will show
          you what it holds.
        </p>
      </div>

      <ol
        className="vt-cabinet__index"
        data-sc-in
        data-sc-stagger="34"
        onPointerLeave={() => setShown(null)}
      >
        {categories.map((c) => (
          <li key={c.id}>
            <Link
              href={`/collection?category=${encodeURIComponent(c.name)}`}
              onPointerEnter={() => setShown(c.image ? c : null)}
              onFocus={() => setShown(null)}
              data-empty={c.productCount === 0 ? "true" : undefined}
            >
              <span className="vt-cabinet__name">{c.name}</span>
              <span className="vt-cabinet__count">
                {c.productCount > 0
                  ? `${c.productCount} ${c.productCount === 1 ? "piece" : "pieces"}`
                  : "By enquiry"}
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <div className="vt-cabinet__peek" ref={peek} data-on={shown ? "true" : "false"} aria-hidden="true">
        {shown?.image && <Image key={shown.id} src={shown.image} alt="" fill sizes="220px" />}
      </div>
    </section>
  );
}
