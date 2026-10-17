import type { Product } from '@/lib/data';

/**
 * Editorial settings for the storefront.
 *
 * Product names, categories, purity and references always come from the
 * catalog (Firestore, or the sample data when Firestore is not configured).
 * The two art-directed stages on the home page are set here, because each one
 * is composed around a specific photograph.
 */

/** Hero: a dark photograph reads best under the lamp effect. */
export const HERO = {
  image: '/images/stage/necklace.webp',
  /** Catalog image path used to find the product the hero is labelling. */
  matchImage: '/images/emerald_necklace.png',
  /** Where the lamp points, in percent of the photograph. */
  lamp: { x: 37, y: 60 },
};

export interface TourStation {
  id: string;
  title: string;
  caption: string;
  /** Focus point in percent of the photograph. */
  x: number;
  y: number;
  /** Camera zoom at this station. 1 shows the whole frame. */
  zoom: number;
}

/**
 * The macro tour. Coordinates are measured on the 1024px bangle photograph,
 * and every caption describes something visible in it. If you change the
 * photograph, re-measure the points and rewrite the captions.
 */
export const TOUR = {
  image: '/images/stage/bangle.webp',
  matchImage: '/images/emerald_bangle.png',
  alt: 'Gold bangle set with round and baguette-cut emeralds, photographed on white',
  stations: [
    {
      id: 'flower',
      title: 'The flower',
      caption: 'Seven round emeralds gathered into one flower at the crown of the band.',
      x: 65.6,
      y: 54,
      zoom: 2,
    },
    {
      id: 'bezel',
      title: 'Closed bezels',
      caption: 'Baguette-cut emeralds held in a frame of metal on every side.',
      x: 78.2,
      y: 47.5,
      zoom: 2.3,
    },
    {
      id: 'openwork',
      title: 'Openwork',
      caption: 'Pierced scrollwork lets light through the band, edged by a row of pavé.',
      x: 49.2,
      y: 50.8,
      zoom: 2.4,
    },
    {
      id: 'marks',
      title: 'The marks',
      caption: 'Stamps struck on the inner face of the band.',
      x: 67.4,
      y: 31.2,
      zoom: 2.5,
    },
  ] satisfies TourStation[],
};

export const HOUSE_IMAGE = {
  image: '/images/stage/earrings.webp',
  alt: 'A pair of oval emerald earrings framed in a halo of white stones, in yellow gold',
};

/** Business WhatsApp number, digits only with country code. Optional. */
export function whatsappNumber(): string | null {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '');
  return raw && raw.length >= 8 ? raw : null;
}

/** Mirrors the admin form's own wording: "92 Carat (22K)". */
export function purityLabel(carat: Product['carat']): string {
  return carat === 92 ? '92 · 22K' : carat === 84 ? '84 · 18K' : String(carat);
}

/** A short, stable reference for labels. Firestore ids are long; trim them. */
export function refLabel(id: string): string {
  const clean = id.replace(/^prod-/, '');
  return (clean.length > 8 ? clean.slice(0, 6) : clean).toUpperCase();
}

export function enquiryText(pieces: Pick<Product, 'id' | 'name' | 'category' | 'carat'>[]): string {
  const lines = ['Hello Swaminarayan Ornaments, I would like to enquire about your collection.'];
  if (pieces.length) {
    lines.push('', 'Pieces I saved:');
    pieces.forEach((p, i) =>
      lines.push(`${i + 1}. ${p.name} (${p.category}, ${purityLabel(p.carat)}, ref ${refLabel(p.id)})`),
    );
  }
  lines.push('', 'Please share availability and specifications.');
  return lines.join('\n');
}
