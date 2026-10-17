"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import type { Product } from "@/lib/data";
import { PieceLabel, PiecePhoto, SaveButton } from "../Piece";
import { useSelection } from "../Selection";

/**
 * Act III. Vertical scroll becomes a sideways glide along a velvet tray.
 * Pieces settle in order from --sc-p, so the rail reads as a drawer being
 * pulled rather than a slideshow on rails.
 */
export default function Tray({ pieces }: { pieces: Product[] }) {
  const { openPiece } = useSelection();
  const n = pieces.length + 2;
  return (
    <section
      className="vt-tray"
      data-sc-act="pan"
      data-sc-span="3.6"
      data-ground="dark"
      aria-labelledby="vt-tray-title"
    >
      <div className="vt-tray__stage" data-sc-stage>
        <div className="vt-tray__rail" data-sc-pan="0.02" style={{ "--n": n } as CSSProperties}>
          <header className="vt-tray__head">
            <h2 id="vt-tray-title" className="vt-display">
              Laid out
              <br />
              <em>on velvet.</em>
            </h2>
            <p>
              Selected pieces from the collection. Open any of them for the full label, and save the
              ones you want to ask about.
            </p>
          </header>

          {pieces.map((p, i) => (
            <article
              key={p.id}
              className="vt-tray__item"
              data-bead={p.id}
              data-bead-name={p.name}
              data-bead-img={p.images[0] ?? ""}
              style={{ "--i": i + 1 } as CSSProperties}
            >
              <div className="vt-tray__lift" data-sc-tilt="5">
                <button
                  type="button"
                  className="vt-tray__frame"
                  onClick={() => openPiece(p)}
                  aria-label={`View ${p.name}`}
                >
                  <PiecePhoto src={p.images[0]} alt={p.name} sizes="(max-width: 860px) 72vw, 30vw" />
                </button>
              </div>
              <div className="vt-tray__label">
                <PieceLabel product={p} compact />
                <SaveButton product={p} />
              </div>
            </article>
          ))}

          <div className="vt-tray__end" style={{ "--i": n - 1 } as CSSProperties}>
            <p className="vt-display vt-display--sm">
              There is more
              <br />
              <em>in the cabinet.</em>
            </p>
            <Link href="/collection" className="vt-button vt-button--line">
              See the collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
