"use client";
import Image from "next/image";
import { ArrowUpRight, Bookmark, Check } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/data";
import { Dialog } from "./StoreLayout";
import { useTradeDossier } from "./TradeDossierContext";
export function ProductPhoto({
  src,
  alt,
  sizes = "(max-width: 700px) 90vw, 33vw",
  priority = false,
}: {
  src?: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className="jewel-image"
    />
  ) : (
    <div className="photo-placeholder">Image coming soon</div>
  );
}
export default function AtelierProduct({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const { isShortlisted, toggleShortlist } = useTradeDossier();
  const saved = isShortlisted(product.id);
  return (
    <>
      <article className="atelier-product">
        <div className="product-visual">
          <button
            className="product-open"
            onClick={() => setOpen(true)}
            aria-label={`View ${product.name}`}
          >
            <ProductPhoto src={product.images[0]} alt={product.name} />
            <span className="view-piece">
              Discover piece <ArrowUpRight size={18} />
            </span>
          </button>
          <button
            className={`save-piece ${saved ? "is-saved" : ""}`}
            onClick={() => toggleShortlist(product)}
            aria-label={`${saved ? "Unsave" : "Save"} ${product.name}`}
            aria-pressed={saved}
          >
            <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="product-caption">
          <div>
            <span className="eyebrow">{product.category}</span>
            <button onClick={() => setOpen(true)}>
              <h3>{product.name}</h3>
            </button>
          </div>
          <button
            className="icon-button"
            onClick={() => setOpen(true)}
            aria-label={`Details for ${product.name}`}
          >
            <ArrowUpRight size={22} />
          </button>
        </div>
      </article>
      {open && (
        <Dialog label={product.name} onClose={() => setOpen(false)}>
          <div className="product-detail">
            <div className="detail-photo">
              <ProductPhoto
                src={product.images[0]}
                alt={product.name}
                sizes="(max-width: 700px) 90vw, 45vw"
              />
            </div>
            <div className="detail-copy">
              <span className="eyebrow">{product.category}</span>
              <h2>{product.name}</h2>
              <p>
                A piece to make your own. Enquire for material specifications,
                current availability and wholesale details.
              </p>
              <div className="product-tags">
                {product.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <button
                className="atelier-button"
                onClick={() => toggleShortlist(product)}
              >
                {saved ? "Saved to your selection" : "Save to your selection"}
                {saved ? <Check size={17} /> : <Bookmark size={17} />}
              </button>
              <p className="fine-print">Reference: {product.id}</p>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}
