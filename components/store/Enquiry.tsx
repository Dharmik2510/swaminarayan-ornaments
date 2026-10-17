"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { enquiryText, purityLabel, refLabel, whatsappNumber } from "@/lib/storefront";
import { useSelection } from "./Selection";
import { PiecePhoto } from "./Piece";

export function Sheet({
  label,
  onClose,
  children,
  wide = false,
}: {
  label: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.documentElement.style.overflow;
    dialog?.showModal();
    document.documentElement.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.documentElement.style.overflow = overflow;
      previous?.focus?.();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`vt-sheet${wide ? " vt-sheet--wide" : ""}`}
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="vt-sheet__inner">
        <button type="button" className="vt-sheet__close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
            <path d="M4 4 L16 16 M16 4 L4 16" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
        {children}
      </div>
    </dialog>
  );
}

/**
 * The enquiry itself: the saved pieces and one action. Used in the dialog
 * and, on the home page, as the closing plate.
 */
export function EnquiryPlate({
  heading,
  intro,
  headingId,
}: {
  heading: ReactNode;
  intro: ReactNode;
  headingId?: string;
}) {
  const { saved, remove } = useSelection();
  const phone = whatsappNumber();
  const message = enquiryText(saved);
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");

  return (
    <div className="vt-plate">
      <p className="vt-kicker">Enquiry</p>
      <h2 className="vt-plate__title" id={headingId}>
        {heading}
      </h2>
      <p className="vt-plate__intro">{intro}</p>

      {saved.length > 0 ? (
        <ul className="vt-plate__list" aria-label="Saved pieces">
          {saved.map((p) => (
            <li key={p.id}>
              <span className="vt-plate__thumb">
                <PiecePhoto src={p.images[0]} alt="" sizes="48px" />
              </span>
              <span className="vt-plate__piece">
                {p.name}
                <small>
                  {p.category} · {purityLabel(p.carat)} · Ref. {refLabel(p.id)}
                </small>
              </span>
              <button
                type="button"
                className="vt-plate__remove"
                onClick={() => remove(p.id)}
                aria-label={`Remove ${p.name}`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="vt-plate__empty">
          Nothing saved yet. Use <em>Save</em> on any piece and it will be listed here. You can
          also enquire about the collection in general.
        </p>
      )}

      <div className="vt-plate__actions">
        {phone ? (
          <a
            className="vt-button vt-button--solid"
            href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Enquire on WhatsApp
          </a>
        ) : (
          <button
            type="button"
            className="vt-button vt-button--solid"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(message);
                setCopied("done");
              } catch {
                setCopied("failed");
              }
            }}
          >
            {copied === "done" ? "Enquiry copied" : "Copy enquiry"}
          </button>
        )}
        <p className="vt-plate__note" role="status">
          {phone
            ? "Opens WhatsApp with your saved pieces already written in. Nothing is sent until you press send."
            : copied === "failed"
              ? "Copying was blocked by the browser. Select the text below and copy it."
              : copied === "done"
                ? "Paste it into a message to your usual contact at the house."
                : "Copies a message listing your saved pieces, ready to paste."}
        </p>
        {!phone && copied === "failed" && (
          <textarea readOnly value={message} rows={6} aria-label="Enquiry text" className="vt-plate__text" />
        )}
      </div>
    </div>
  );
}

export function EnquirySheet() {
  const { enquiryOpen, setEnquiryOpen } = useSelection();
  if (!enquiryOpen) return null;
  return (
    <Sheet label="Enquiry" onClose={() => setEnquiryOpen(false)}>
      <EnquiryPlate
        heading={<>Ask about a piece.</>}
        intro="Your saved pieces travel with the message, so the house knows exactly what you mean."
      />
    </Sheet>
  );
}
