"use client";

import { useState } from "react";
import { useSelection } from "./Selection";
import { Sheet } from "./Enquiry";
import { PieceLabel, PiecePhoto, SaveButton } from "./Piece";

export default function PieceSheet() {
  const { active, openPiece, setEnquiryOpen } = useSelection();
  const [view, setView] = useState(0);
  if (!active) return null;
  const images = active.images.length ? active.images : [""];
  const shown = Math.min(view, images.length - 1);

  return (
    <Sheet
      label={active.name}
      wide
      onClose={() => {
        setView(0);
        openPiece(null);
      }}
    >
      <article className="vt-piece">
        <div className="vt-piece__media">
          <div className="vt-piece__frame">
            <PiecePhoto
              key={images[shown]}
              src={images[shown]}
              alt={`${active.name}, view ${shown + 1} of ${images.length}`}
              sizes="(max-width: 860px) 92vw, 52vw"
            />
          </div>
          {images.length > 1 && (
            <div className="vt-piece__views" role="group" aria-label="Views">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  className={i === shown ? "is-on" : ""}
                  aria-pressed={i === shown}
                  aria-label={`Show view ${i + 1}`}
                  onClick={() => setView(i)}
                >
                  <PiecePhoto src={src} alt="" sizes="72px" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="vt-piece__copy">
          <PieceLabel product={active} as="h2" />
          {active.description && <p className="vt-piece__desc">{active.description}</p>}
          {active.tags.length > 0 && (
            <ul className="vt-piece__tags" aria-label="Tags">
              {active.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
          <div className="vt-piece__actions">
            <SaveButton product={active} variant="text" />
            <button
              type="button"
              className="vt-button vt-button--solid"
              onClick={() => {
                openPiece(null);
                setEnquiryOpen(true);
              }}
            >
              Enquire
            </button>
          </div>
          <p className="vt-piece__fine">
            Weights, sizes and current availability are confirmed by the house when you enquire.
          </p>
        </div>
      </article>
    </Sheet>
  );
}
