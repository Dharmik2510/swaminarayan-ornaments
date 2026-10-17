"use client";

import Link from "next/link";
import { useRef } from "react";
import { pinProgress, prefersReducedMotion, smooth, useScrollFrame } from "@/hooks/useScrollFrame";
import { EnquiryPlate } from "../Enquiry";
import { useSelection } from "../Selection";

/**
 * Act VI. The thread that ran down the margin draws the tilak, then the
 * chandlo drops into it. The enquiry plate is already on the stage (greet
 * and hold), so the close is grounded before the mark completes.
 */
export default function TilakClose() {
  const act = useRef<HTMLElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const { saved } = useSelection();

  useScrollFrame(() => {
    const el = act.current;
    const m = mark.current;
    if (!el || !m) return;
    if (prefersReducedMotion()) {
      m.style.setProperty("--draw", "1");
      m.style.setProperty("--drop", "1");
      m.dataset.landed = "true";
      return;
    }
    // Start drawing as the stage slides in, so the thread is still moving
    // when the visitor arrives rather than waiting for the pin.
    const r = el.getBoundingClientRect();
    const approach = Math.min(Math.max(1 - r.top / innerHeight, 0), 1);
    const p = pinProgress(el);
    const draw = smooth(approach * 0.55 + p * 0.9);
    const drop = smooth((p - 0.42) / 0.3);
    m.style.setProperty("--draw", draw.toFixed(4));
    m.style.setProperty("--drop", drop.toFixed(4));
    m.dataset.landed = drop >= 0.999 ? "true" : "false";
  });

  return (
    <section
      ref={act}
      className="vt-close"
      data-sc-act="pin"
      data-sc-span="1.6"
      data-ground="dark"
      data-close
      aria-labelledby="vt-close-title"
    >
      <div className="vt-close__stage" data-sc-stage>
        <div className="vt-close__mark" ref={mark} data-landed="false" aria-hidden="true">
          <svg viewBox="-40 -150 180 340" className="vt-close__svg">
            <path className="vt-close__ghost" d="M14 10 V118 A36 36 0 0 0 86 118 V10" pathLength={1} />
            <defs>
              <radialGradient id="vt-chandlo-grad" cx="38%" cy="34%" r="70%">
                <stop offset="0%" stopColor="#ef4a4f" />
                <stop offset="55%" stopColor="#c1272d" />
                <stop offset="100%" stopColor="#7d1218" />
              </radialGradient>
            </defs>
            <path className="vt-close__u" d="M14 10 V118 A36 36 0 0 0 86 118 V10" pathLength={1} />
            <path className="vt-close__shine" d="M14 10 V118 A36 36 0 0 0 86 118 V10" pathLength={1} />
            <circle className="vt-close__ripple" cx="50" cy="78" r="17" />
            <circle className="vt-close__dot" cx="50" cy="78" r="17" />
          </svg>
          <p className="vt-close__caption">
            {saved.length
              ? `${saved.length} saved ${saved.length === 1 ? "piece" : "pieces"} on the thread.`
              : "The thread ends where our mark begins."}
          </p>
        </div>

        <div className="vt-close__plate" data-sc-cue="0 1 0 0">
          <EnquiryPlate
            headingId="vt-close-title"
            heading={
              <>
                Ask about
                <br />
                <em>a piece.</em>
              </>
            }
            intro="Everything you saved on the way down is listed here, and goes with the message."
          />
        </div>

        <footer className="vt-close__colophon">
          <span>© {new Date().getFullYear()} Swaminarayan Ornaments</span>
          <nav aria-label="Footer">
            <Link href="/collection">Collection</Link>
            <a href="#top">Back to top</a>
          </nav>
        </footer>
      </div>
    </section>
  );
}
