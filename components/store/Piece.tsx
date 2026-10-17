"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/data";
import { purityLabel, refLabel } from "@/lib/storefront";
import { useSelection, type SavedPiece } from "./Selection";

export function PiecePhoto({
  src,
  alt,
  sizes,
  preload = false,
  className = "vt-photo",
}: {
  src?: string;
  alt: string;
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={`${className} vt-photo--empty`} role="img" aria-label={alt}>
        <span>Photograph to follow</span>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

/**
 * The label schema. Every object on the site carries exactly this, in this
 * order, so the collection reads as a collection and not as a set of adverts.
 */
export function PieceLabel({
  product,
  as: Tag = "h3",
  compact = false,
}: {
  product: Pick<Product, "id" | "name" | "category" | "carat">;
  as?: "h2" | "h3" | "p";
  compact?: boolean;
}) {
  return (
    <div className={`vt-label${compact ? " vt-label--compact" : ""}`}>
      <Tag className="vt-label__name">{product.name}</Tag>
      <dl className="vt-label__meta">
        <div>
          <dt>Category</dt>
          <dd>{product.category}</dd>
        </div>
        <div>
          <dt>Purity</dt>
          <dd>{purityLabel(product.carat)}</dd>
        </div>
        <div>
          <dt>Ref.</dt>
          <dd>{refLabel(product.id)}</dd>
        </div>
      </dl>
    </div>
  );
}

export function SaveButton({
  product,
  variant = "icon",
}: {
  product: Product | SavedPiece;
  variant?: "icon" | "text";
}) {
  const { isSaved, toggle } = useSelection();
  const saved = isSaved(product.id);
  if (variant === "text") {
    return (
      <button
        type="button"
        className={`vt-button vt-button--quiet${saved ? " is-on" : ""}`}
        aria-pressed={saved}
        onClick={() => toggle(product)}
      >
        <SaveGlyph on={saved} />
        {saved ? "Saved" : "Save"}
      </button>
    );
  }
  return (
    <button
      type="button"
      className={`vt-save${saved ? " is-on" : ""}`}
      aria-pressed={saved}
      aria-label={`${saved ? "Remove" : "Save"} ${product.name}${saved ? " from your saved pieces" : ""}`}
      onClick={() => toggle(product)}
    >
      <SaveGlyph on={saved} />
    </button>
  );
}

/** A small bead on a thread: the site's own glyph for "saved". */
export function SaveGlyph({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" className="vt-glyph">
      <path d="M10 1.5 V18.5" stroke="currentColor" strokeWidth="1.2" />
      <circle
        cx="10"
        cy="10"
        r="4.6"
        fill={on ? "currentColor" : "var(--vt-ground, transparent)"}
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}
