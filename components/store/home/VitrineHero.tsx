"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Product } from "@/lib/data";
import { HERO } from "@/lib/storefront";
import { prefersReducedMotion, useScrollFrame } from "@/hooks/useScrollFrame";
import { PieceLabel, SaveButton } from "../Piece";
import { useSelection } from "../Selection";

/**
 * Act I. A display case, a lamp, one piece.
 *
 * Planes, back to front, each moving at its own rate as the hero leaves:
 *   velvet  folds of sheen and grain (CSS), lags the page most
 *   piece   the photograph, revealed only where the lamp falls
 *   copy    rides the page at 1x
 *   glass   reflections and the case edge, leads the page
 *   dust    motes that only show inside the beam
 * The lamp switches on once at load (CSS, so it also runs before hydration),
 * leans toward the pointer, and opens wider as the visitor scrolls.
 */
export default function VitrineHero({ piece }: { piece: Product | null }) {
  const root = useRef<HTMLElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const glass = useRef<HTMLDivElement>(null);
  const dust = useRef<HTMLCanvasElement>(null);
  const piecebox = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const { openPiece } = useSelection();

  useScrollFrame(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const h = el.offsetHeight || innerHeight;
    const y = Math.min(Math.max(scrollY, 0), h * 1.2);
    const t = y / h;
    el.style.setProperty("--open", t.toFixed(4));
    if (body.current)
      body.current.style.transform = `translate3d(0,${(y * 0.2).toFixed(1)}px,0) scale(${(1 + t * 0.07).toFixed(4)})`;
    if (glass.current) glass.current.style.transform = `translate3d(0,${(-y * 0.34).toFixed(1)}px,0)`;
  });

  // Pointer: the lamp leans toward the visitor, the glass slides the other way.
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion() || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0;
    const P = pointer.current;
    const onMove = (e: PointerEvent) => {
      P.tx = e.clientX / innerWidth - 0.5;
      P.ty = e.clientY / innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      raf = 0;
      P.x += (P.tx - P.x) * 0.08;
      P.y += (P.ty - P.y) * 0.08;
      el.style.setProperty("--lean-x", P.x.toFixed(4));
      el.style.setProperty("--lean-y", P.y.toFixed(4));
      if (Math.abs(P.tx - P.x) > 0.001 || Math.abs(P.ty - P.y) > 0.001) raf = requestAnimationFrame(tick);
    };
    el.addEventListener("pointermove", onMove);
    return () => {
      el.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Dust in the beam. Paused whenever the hero is off screen or the tab is hidden.
  useEffect(() => {
    const cv = dust.current;
    const el = root.current;
    if (!cv || !el || prefersReducedMotion()) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const motes = Array.from({ length: 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.4 + Math.random() * 1.4,
      v: 0.00012 + Math.random() * 0.00035,
      d: Math.random() * Math.PI * 2,
    }));
    const size = () => {
      const r = cv.getBoundingClientRect();
      w = r.width;
      h = r.height;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    let visible = true;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(draw);
    });
    io.observe(el);
    let last = performance.now();
    function draw(now: number) {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = Math.min(now - last, 50);
      last = now;
      // The beam sits where the lamp points on the photograph, plus the lean.
      const pb = piecebox.current;
      const P = pointer.current;
      const bw = pb?.offsetWidth ?? w;
      const lx = ((pb?.offsetLeft ?? 0) + bw * (HERO.lamp.x / 100 + P.x * 0.12)) / w;
      const ly = ((pb?.offsetTop ?? 0) + bw * (HERO.lamp.y / 100 + P.y * 0.09)) / h;
      ctx!.clearRect(0, 0, w, h);
      const R = Math.max(w, h) * 0.34;
      for (const m of motes) {
        m.y -= m.v * dt;
        m.d += 0.0006 * dt;
        if (m.y < -0.02) {
          m.y = 1.02;
          m.x = Math.random();
        }
        const px = m.x * w + Math.sin(m.d) * 6;
        const py = m.y * h;
        const dist = Math.hypot(px - lx * w, py - ly * h) / R;
        const a = Math.max(0, 1 - dist) * 0.55;
        if (a < 0.02) continue;
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(246, 226, 178, ${a.toFixed(3)})`;
        ctx!.arc(px, py, m.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    const onVis = () => {
      if (!document.hidden && visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    addEventListener("resize", size);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      removeEventListener("resize", size);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={root}
      className="vt-hero"
      data-ground="dark"
      data-bead-anchor="hero"
      aria-labelledby="vt-hero-title"
      style={{ ["--lamp-x" as string]: `${HERO.lamp.x}%`, ["--lamp-y" as string]: `${HERO.lamp.y}%` }}
    >
      <div className="vt-hero__body" ref={body}>
        <div className="vt-hero__piece" ref={piecebox}>
          <Image
            src={HERO.image}
            alt={piece ? `${piece.name}, lit on dark velvet` : "An emerald and white-stone necklace on dark green velvet"}
            fill
            preload
            sizes="(max-width: 860px) 170vw, 74vw"
          />
        </div>
        <div className="vt-hero__pool" aria-hidden="true" />
        <canvas className="vt-hero__dust" ref={dust} aria-hidden="true" />
      </div>

      <div className="vt-hero__copy">
        <h1 id="vt-hero-title" className="vt-hero__title">
          Swaminarayan
          <em>Ornaments</em>
        </h1>
        <p className="vt-hero__sub">
          Jewellery shown the way a jeweller shows it: one piece at a time, under good light.
        </p>
        <Link href="/collection" className="vt-button vt-button--solid">
          See the collection
        </Link>
      </div>

      {piece && (
        <aside className="vt-hero__label" aria-label="On view">
          <PieceLabel product={piece} as="p" compact />
          <div className="vt-hero__label-actions">
            <button type="button" className="vt-link" onClick={() => openPiece(piece)}>
              View piece
            </button>
            <SaveButton product={piece} variant="text" />
          </div>
        </aside>
      )}

      <div className="vt-hero__glass" ref={glass} aria-hidden="true">
        <span className="vt-hero__sheen vt-hero__sheen--a" />
        <span className="vt-hero__sheen vt-hero__sheen--b" />
        <span className="vt-hero__case" />
      </div>
      <div className="vt-hero__floor" aria-hidden="true" />
    </section>
  );
}
