"use client";

import Image from "next/image";
import type { Product } from "@/lib/data";
import { HOUSE_IMAGE } from "@/lib/storefront";
import { PieceLabel } from "../Piece";

/** Act V. A short, honest account of the house. The one wipe on the page. */
export default function House({ piece }: { piece: Product | null }) {
  return (
    <section
      id="house"
      className="vt-house"
      data-sc-act="flow"
      data-ground="dark"
      aria-labelledby="vt-house-title"
    >
      <figure className="vt-house__figure">
        <div className="vt-house__wipe" data-sc-reveal="up" data-sc-reveal-at="0.14 0.46">
          <Image src={HOUSE_IMAGE.image} alt={HOUSE_IMAGE.alt} fill sizes="(max-width: 860px) 88vw, 38vw" />
        </div>
        {piece && (
          <figcaption>
            <PieceLabel product={piece} as="p" compact />
          </figcaption>
        )}
      </figure>

      <div className="vt-house__copy" data-sc-in data-sc-stagger="70">
        <h2 id="vt-house-title" className="vt-display">
          The piece first.
          <br />
          <em>The conversation after.</em>
        </h2>
        <p>
          Swaminarayan Ornaments shows its work the way a good counter does. There are no prices
          and no checkout here, because jewellery like this is chosen in conversation: the weight
          in the hand, the occasion, the person it is for.
        </p>
        <p>
          Save what catches your eye as you go. When you are ready, one message carries your
          selection to the house, and the details are settled there.
        </p>
        <p className="vt-house__mark">
          Our mark takes its shape from the tilak-chandlo of the Swaminarayan tradition: a U drawn
          in sandalwood, with a dot of kumkum at its centre.
        </p>
      </div>
    </section>
  );
}
