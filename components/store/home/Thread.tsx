"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion, useScrollFrame } from "@/hooks/useScrollFrame";
import { useSelection } from "../Selection";

/**
 * The signature move. A gold thread runs down the margin, drawn by scroll.
 * Every piece the visitor passes is strung onto it as a bead cut from its own
 * photograph, and each bead is a button back to that piece, so the thread is
 * also the index of objects. Saved pieces wear a gold bead. In the close the
 * thread hands over to the tilak, which TilakClose draws.
 *
 * Beads are spaced evenly along the thread, and the tip's travel is mapped
 * piecewise between them, so the tip reaches each bead exactly when its piece
 * is in front of the visitor, however close together the pieces sit on the
 * page (the tray strings six of them in a few screens).
 */
interface Bead {
  id: string;
  name: string;
  img: string;
  /** scrollY at which the piece is in view */
  at: number;
}

function measure(): { beads: Bead[]; max: number } {
  const vh = innerHeight;
  const vw = innerWidth;
  const max = Math.max(document.documentElement.scrollHeight - vh, 1);
  const out: Bead[] = [];
  document.querySelectorAll<HTMLElement>("[data-bead]").forEach((el) => {
    const id = el.dataset.bead!;
    const name = el.dataset.beadName ?? "";
    const img = el.dataset.beadImg ?? "";
    const rail = el.closest<HTMLElement>("[data-sc-pan]");
    const act =
      el.closest<HTMLElement>("[data-sc-act]") ?? el.querySelector<HTMLElement>(":scope > [data-sc-act]");
    let at: number;
    if (rail && act) {
      // Inside the pan: solve for the progress at which this item is centred.
      const actTop = act.getBoundingClientRect().top + scrollY;
      const travel = Math.max(act.offsetHeight - vh, 1);
      const over = rail.scrollWidth - vw;
      const extra = over * (parseFloat(rail.dataset.scPan ?? "0") || 0);
      const railRect = rail.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const centre = r.left - railRect.left + r.width / 2;
      const stage = rail.parentElement!.getBoundingClientRect().left;
      const p = over > 0 ? (stage + rail.offsetLeft + centre - vw / 2) / (over + extra) : 0;
      at = actTop + Math.min(Math.max(p, 0), 1) * travel;
    } else if (act && act.dataset.scAct === "pin") {
      const actTop = act.getBoundingClientRect().top + scrollY;
      at = actTop + Math.max(act.offsetHeight - vh, 1) * 0.12;
    } else {
      const r = el.getBoundingClientRect();
      at = Math.max(0, r.top + scrollY + r.height / 2 - vh / 2);
    }
    out.push({ id, name, img, at: Math.min(at, max) });
  });
  // One bead per piece, in the order they are met.
  const seen = new Set<string>();
  return {
    beads: out
      .sort((a, b) => a.at - b.at)
      .filter((b) => (seen.has(b.id) ? false : (seen.add(b.id), true))),
    max,
  };
}

/** Where the tip sits (0..1) for a scroll position, given evenly spaced beads. */
function tipAt(y: number, beads: Bead[], max: number): number {
  const n = beads.length;
  if (!n) return Math.min(Math.max(y / max, 0), 1);
  const pts: [number, number][] = [];
  if (beads[0].at > 1) pts.push([0, 0]);
  beads.forEach((b, i) => pts.push([b.at, (i + 1) / (n + 1)]));
  pts.push([Math.max(max, beads[n - 1].at + 1), 1]);
  if (y <= pts[0][0]) return pts[0][1];
  for (let i = 0; i < pts.length - 1; i++) {
    const [y0, f0] = pts[i];
    const [y1, f1] = pts[i + 1];
    if (y <= y1) return f0 + (f1 - f0) * ((y - y0) / Math.max(y1 - y0, 1));
  }
  return 1;
}

export default function Thread({ version }: { version: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [beads, setBeads] = useState<Bead[]>([]);
  const [max, setMax] = useState(1);
  const [strung, setStrung] = useState(0);
  const { isSaved } = useSelection();

  const remeasure = useCallback(() => {
    const m = measure();
    setBeads(m.beads);
    setMax(m.max);
  }, []);

  useEffect(() => {
    // The engine lays out pinned acts after mount and again once fonts land.
    const timers = [60, 400, 1200].map((ms) => setTimeout(remeasure, ms));
    let w = innerWidth;
    const onResize = () => {
      if (innerWidth !== w) {
        w = innerWidth;
        remeasure();
      }
    };
    addEventListener("resize", onResize);
    document.fonts?.ready.then(remeasure);
    return () => {
      timers.forEach(clearTimeout);
      removeEventListener("resize", onResize);
    };
  }, [remeasure, version]);

  useScrollFrame(() => {
    const el = root.current;
    if (!el) return;
    const y = scrollY;
    el.style.setProperty("--thread", tipAt(y, beads, max).toFixed(4));
    // Hand over to the tilak as the close arrives.
    const close = document.querySelector<HTMLElement>("[data-close]");
    let fade = 0;
    if (close) {
      const r = close.getBoundingClientRect();
      fade = Math.min(Math.max((innerHeight * 0.7 - r.top) / (innerHeight * 0.6), 0), 1);
    }
    el.style.setProperty("--handover", fade.toFixed(3));
    el.dataset.hint = y < innerHeight * 0.25 ? "true" : "false";
    let n = 0;
    for (const b of beads) if (y >= b.at - 2) n++;
    setStrung((s) => (s === n ? s : n));
  }, [beads, max]);

  const go = (b: Bead) => {
    scrollTo({ top: b.at, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <div
      className="vt-thread"
      ref={root}
      data-hint="true"
      style={{ ["--first" as string]: (1 / (beads.length + 1)).toFixed(4) }}
    >
      <div className="vt-thread__line" aria-hidden="true">
        <span className="vt-thread__drawn" />
        <span className="vt-thread__tip" />
      </div>
      <nav className="vt-thread__beads" aria-label="Pieces on this page">
        <ol>
          {beads.map((b, i) => {
            const on = i < strung;
            return (
              <li
                key={b.id}
                style={{ ["--at" as string]: ((i + 1) / (beads.length + 1)).toFixed(4) }}
                data-strung={on ? "true" : "false"}
                data-saved={isSaved(b.id) ? "true" : "false"}
              >
                <button type="button" onClick={() => go(b)} tabIndex={on ? 0 : -1} aria-hidden={!on}>
                  <span className="vt-bead">
                    {b.img && <Image src={b.img} alt="" fill sizes="32px" />}
                  </span>
                  <span className="vt-bead__name">{b.name}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
      <p className="vt-thread__hint" aria-hidden="true">
        Each piece you pass is strung here.
      </p>
    </div>
  );
}
