"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Product } from "@/lib/data";
import { TOUR } from "@/lib/storefront";
import { pinProgress, prefersReducedMotion, smooth, useScrollFrame } from "@/hooks/useScrollFrame";
import { PieceLabel, SaveButton } from "../Piece";
import { useSelection } from "../Selection";

type Stop = { p: number; x: number; y: number; z: number };

const WHOLE = { x: 50, y: 50, z: 1 };
const S = TOUR.stations;

/** The camera path: whole, each station held, whole again. */
const PATH: Stop[] = [
  { p: 0, ...WHOLE },
  { p: 0.08, ...WHOLE },
  ...S.flatMap((s, i) => {
    const start = 0.18 + i * 0.2;
    return [
      { p: start, x: s.x, y: s.y, z: s.zoom },
      { p: start + (i === S.length - 1 ? 0.06 : 0.1), x: s.x, y: s.y, z: s.zoom },
    ];
  }),
  { p: 0.95, ...WHOLE },
  { p: 1, ...WHOLE },
];

/** Cue windows for each station caption, matched to the holds above. */
const CUES = S.map((_, i) => {
  const start = 0.18 + i * 0.2;
  const end = start + (i === S.length - 1 ? 0.06 : 0.1);
  return `${(start - 0.06).toFixed(2)} ${(end + 0.06).toFixed(2)}`;
});

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

function sample(p: number) {
  let a = PATH[0];
  let b = PATH[PATH.length - 1];
  for (let i = 0; i < PATH.length - 1; i++) {
    if (p >= PATH[i].p && p <= PATH[i + 1].p) {
      a = PATH[i];
      b = PATH[i + 1];
      break;
    }
  }
  const raw = b.p === a.p ? 1 : (p - a.p) / (b.p - a.p);
  const t = smooth(raw);
  let z = a.z + (b.z - a.z) * t;
  // Moving between two close-ups, pull back a little mid-flight, the way a
  // hand moves a loupe from one stone to the next.
  if (a.z > 1.2 && b.z > 1.2 && (a.x !== b.x || a.y !== b.y)) z *= 1 - 0.24 * Math.sin(Math.PI * raw);
  const holding = a.x === b.x && a.y === b.y && a.z > 1.2;
  // Station index currently framed, or -1 between stations.
  const at = holding ? S.findIndex((s) => s.x === a.x && s.y === a.y) : -1;
  const focus = Math.max(0, Math.min(1, (z - 1.15) / 0.6));
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z, at, focus };
}

export default function MacroTour({ piece }: { piece: Product | null }) {
  const act = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const cam = useRef<HTMLDivElement>(null);
  const ticks = useRef<HTMLOListElement>(null);
  const { openPiece } = useSelection();

  // The camera eases toward where the scroll says it should be, so a wheel's
  // uneven notches read as one continuous move of the hand.
  const target = useRef({ x: 50, y: 50, z: 1, focus: 0 });
  const now = useRef({ x: 50, y: 50, z: 1, focus: 0 });
  const raf = useRef(0);

  const paint = () => {
    raf.current = 0;
    const fr = frame.current;
    const c = cam.current;
    if (!fr || !c) return;
    const T = target.current;
    const N = now.current;
    const k = 0.14;
    N.x += (T.x - N.x) * k;
    N.y += (T.y - N.y) * k;
    N.z += (T.z - N.z) * k;
    N.focus += (T.focus - N.focus) * k;
    const settled =
      Math.abs(T.x - N.x) < 0.01 && Math.abs(T.y - N.y) < 0.01 && Math.abs(T.z - N.z) < 0.001;
    if (settled) Object.assign(N, T);

    const fw = fr.clientWidth;
    const fh = fr.clientHeight;
    const side = Math.max(fw, fh);
    const L = (fw - side) / 2;
    const Tp = (fh - side) / 2;
    let tx = fw / 2 - L - N.z * (N.x / 100) * side;
    let ty = fh / 2 - Tp - N.z * (N.y / 100) * side;
    // Never let the photograph's edge into the window.
    tx = Math.min(-L, Math.max(fw - L - N.z * side, tx));
    ty = Math.min(-Tp, Math.max(fh - Tp - N.z * side, ty));
    c.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${N.z.toFixed(4)})`;
    c.style.setProperty("--z", N.z.toFixed(4));
    fr.style.setProperty("--focus", N.focus.toFixed(3));
    if (!settled) raf.current = requestAnimationFrame(paint);
  };

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  useScrollFrame(() => {
    const el = act.current;
    const fr = frame.current;
    if (!el || !fr) return;
    const r = el.getBoundingClientRect();
    if (r.bottom < -innerHeight || r.top > innerHeight * 2) return;
    if (prefersReducedMotion()) return;

    const p = pinProgress(el);
    const { x, y, z, at, focus } = sample(p);
    target.current = { x, y, z, focus };
    if (!raf.current) raf.current = requestAnimationFrame(paint);
    fr.dataset.at = String(at);
    if (ticks.current) {
      ticks.current.style.setProperty("--tour", p.toFixed(4));
      ticks.current.dataset.at = String(at);
    }
  });

  return (
    <section
      ref={act}
      className="vt-tour"
      data-sc-act="pin"
      data-sc-span="4"
      data-ground="light"
      data-bead-anchor="tour"
      aria-labelledby="vt-tour-title"
    >
      <div className="vt-tour__stage" data-sc-stage>
        <div className="vt-tour__frame" ref={frame} data-at="-1">
          <div className="vt-tour__cam" ref={cam}>
            <Image src={TOUR.image} alt={TOUR.alt} fill sizes="(max-width: 860px) 130vw, 64vw" />
            {S.map((s, i) => (
              <span
                key={s.id}
                className="vt-tour__mark"
                data-i={i}
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                aria-hidden="true"
              >
                {ROMAN[i]}
              </span>
            ))}
          </div>
          <svg className="vt-tour__reticle" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="78" />
            <path d="M100 6 V30 M100 170 V194 M6 100 H30 M170 100 H194" />
          </svg>
        </div>

        <div className="vt-tour__copy">
          <div className="vt-tour__intro" data-sc-cue="0 0.16 0">
            <h2 id="vt-tour-title" className="vt-display">
              Look <em>closer.</em>
            </h2>
            <p>
              A piece is made of decisions you only see up close. Keep scrolling and the lens moves
              from one to the next.
            </p>
          </div>

          <ol className="vt-tour__captions">
            {S.map((s, i) => (
              <li key={s.id} data-sc-cue={CUES[i]}>
                <span className="vt-tour__num">{ROMAN[i]}</span>
                <h3>{s.title}</h3>
                <p>{s.caption}</p>
              </li>
            ))}
          </ol>

          {piece && (
            <div className="vt-tour__resolve" data-sc-cue="0.88">
              <PieceLabel product={piece} as="p" />
              <div className="vt-row">
                <button type="button" className="vt-button vt-button--line" onClick={() => openPiece(piece)}>
                  View piece
                </button>
                <SaveButton product={piece} variant="text" />
              </div>
            </div>
          )}

          <ol className="vt-tour__ticks" ref={ticks} aria-hidden="true">
            {S.map((s, i) => (
              <li key={s.id} data-i={i}>
                {ROMAN[i]}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
