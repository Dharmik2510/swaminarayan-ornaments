# Storefront: "The Vitrine"

The public site (`/` and `/collection`) is built as a jeweller's display case on the
[scroll-craft](https://github.com/nateherkai/scroll-craft) engine (`lib/scrollcraft.js`,
`app/scrollcraft.css`, unmodified). The brief, feeling curve and score are in
`scrollcraft/builds/swaminarayan-vitrine/BRIEF.md`.

## The home page, act by act

| Act | Component | What scroll does |
|---|---|---|
| Vitrine | `components/store/home/VitrineHero.tsx` | A lamp switches on over the hero piece at load; the lamp follows the pointer; scrolling separates velvet, jewel, glass and dust planes |
| Look closer | `MacroTour.tsx` | Pinned. The camera eases into four stations on the bangle with factual captions, then pulls back to the labelled piece |
| The tray | `Tray.tsx` | Pinned pan. Featured pieces glide sideways and settle in order |
| The cabinet | `Cabinet.tsx` | Every category with live piece counts; a photo follows the cursor |
| The house | `House.tsx` | Short copy; the photograph wipes open |
| The plate | `TilakClose.tsx` | The thread draws the tilak, the chandlo drops, the enquiry holds |
| The thread | `Thread.tsx` | Signature move: every piece passed is strung on a gold thread as a bead; beads jump back; saved pieces get a gold bead |

Phones get their own composition (thread along the bottom edge, stacked tour).
`prefers-reduced-motion` turns every act into a complete static page and skips the engine.

## Editing content

- Product names, categories, purity, references and photos all come from the catalog
  (Firestore via the admin, or the sample data in `lib/data.ts` when Firebase is not
  configured). Featured products fill the tray.
- The two art-directed stages are set in `lib/storefront.ts`: the hero photograph and
  lamp position, and the macro tour's photograph, focus points and captions. If you swap
  the tour photograph, re-measure the points and rewrite the captions to match it.
- Purity reads "92 · 22K" / "84 · 18K", mirroring the admin form's own labels.

## Launch configuration

- `NEXT_PUBLIC_FIREBASE_*` in `.env.local` for the live catalogue. Without
  `NEXT_PUBLIC_FIREBASE_PROJECT_ID` the sample catalogue is shown and no Firestore request
  is made.
- `NEXT_PUBLIC_WHATSAPP_NUMBER` (country code + digits). With it, Enquire opens WhatsApp
  with the saved pieces written in; without it, the enquiry is copied to the clipboard.
- Sample products reuse three photographs and their descriptions do not all match the
  images. Replace them with real records before publishing.
- Fonts (Bodoni Moda, Hanken Grotesk, OFL) are self-hosted from `app/fonts/`.

## Local preview

```sh
npm ci
npm run dev -- --port 3100
```
