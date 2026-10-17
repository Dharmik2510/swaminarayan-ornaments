# ScrollCraft Brief: Swaminarayan Ornaments, "The Vitrine"

**Status:** Self-authored under explicit creative delegation. The owner asked for a
production-grade revamp with scroll effects, animation and "something out of the box",
after rejecting two earlier AI builds (the editorial ivory build on
`feat/elegant-storefront-revamp` and the earlier "Sovereign Vault" build recorded in
`FINGERPRINTS.md`). Everything below that is not a quotation is an authored decision.

## Evidence vs. assumption

- **Evidence:** the repo README (a digital showroom without prices or carts; visitors
  browse, save pieces and enquire), the catalog model (`lib/data.ts`: name, category,
  description, purity 92/84 which the admin labels "92 Carat (22K)" and "84 Carat (18K)",
  tags, images, featured, status), 18 configured categories, three product photographs,
  and the brand mark (`public/logo.jpg`: a yellow U with a red dot, the tilak-chandlo of
  the Swaminarayan tradition).
- **Assumptions:** the visitor is a retailer or private buyer who will enquire on
  WhatsApp. No founding year, partner count, weights or certification are claimed,
  because none were verified. No counters anywhere.
- **Asset caveat:** the three photographs are reused by the sample products and do not
  match every sample description. The page reads every label from the catalog, so real
  products in Firestore relabel it without code changes. The two art-directed photos
  (hero and the macro tour) are set in `lib/storefront.ts`.

## 1. Vibe and references

- **Five words:** hushed, lit, precise, tactile, devotional.
- **References (non-web):**
  1. A jeweller's counter in a Gujarati bazaar: the velvet tray pulled out, one piece
     laid down at a time, the lamp angled over it.
  2. Museum object labels at the V&A jewellery gallery: the same small schema under
     every object, fact not persuasion.
  3. Raking-light macro photography of goldsmith work: the craft only appears when the
     light hits it from the side.

## 2. The scroll journey

1. Arrive at a lit display case. One piece, under a lamp, on velvet.
2. Lean in. The camera pushes into one piece and shows how it is made.
3. The tray. Pieces laid out side by side, each with a label and a Save.
4. The cabinet. Every category, with how many pieces each drawer holds.
5. The house. Who is showing you this, and what the mark means.
6. The plate. Your saved pieces, one Enquire action, and the mark completed.

## 3. Energy curve

Quiet open, rising to the macro tour (the loudest change on the page), a broad and easy
tray, a dense but calm index, a warm pause, and a resolved, still close.

## 4. Feeling curve and the peak

| Act | Feeling | What causes it |
|---|---|---|
| I. Vitrine | Hush | A lamp switches on over one necklace behind glass; dust hangs in the beam (`parallax` planes + bespoke lamp mask) |
| II. Closer (PEAK) | Wonder | Scroll pushes the camera into the bangle: the flower, the bezels, the openwork, the marks (`pin` + bespoke camera path) |
| III. The tray | Appetite | Vertical scroll becomes a sideways glide over velvet; pieces settle in order (`pan` + `tilt`) |
| IV. The cabinet | Clarity | Every category set as a typeset index with live counts and a preview (`flow` + `in`) |
| V. The house | Warmth | A short, honest account of the house; the earrings wipe into view (`reveal`) |
| VI. The plate | Resolve | The thread bends into the tilak and the chandlo drops beside the enquiry (`pin` + bespoke draw) |

- **The peak:** "You scroll and the camera literally walks you into the bangle, stone by
  stone, like the jeweller is holding it under your nose." Act II, the largest span (4.0).
- **Tell-someone sentence:** "It's the site where every piece you scroll past gets strung
  onto a gold thread, and at the end the thread bends into the Swaminarayan tilak."
- **Authored silence:** the hero is one viewport with no pin, deliberately quieter than
  the peak that follows it.

## 5. Signature move

**The thread (taar) and the mala.** A gold thread runs down the left margin for the whole
home page, drawn by scroll. Each piece the visitor passes is strung onto it as a bead cut
from that piece's photograph; beads are buttons that jump back to their piece, so the
thread is the object index. In the close, the thread resolves into the tilak and the red
chandlo drops into it: the visitor's own scroll completes the brand mark. Page-local code
(`components/store/Thread.tsx`, `components/store/TilakClose.tsx`), engine untouched.

## 6. Aesthetic family

Premium heritage, dark-led with hard cuts to card stock where the photography is shot
on white. Deep velvet green `#06130F`, raised `#0D211B`, bone ink `#EEEADF`, tinted
secondary `#A7B3AA`, gold `#D2AE5E` (on light grounds `#7A5A12`), card stock `#F3F2EE`.
Red `#C1272D` is used once: the chandlo.

## 7. Structural mode

Gallery / catalog grammar. Each act paints its own ground; no drift.

## 8. Supplied assets

`/logo.jpg` (tilak), three product photographs (upscaled 2x with Lanczos + light
unsharp into `public/images/stage/` for the two zoomed stages), the live Firestore
catalog with sample fallback. No generated imagery.

## Score

| Beat | Device | Why |
|---|---|---|
| Arrival | `parallax` (flow, 1 vh) + bespoke lamp | Depth from planes; the first screen is already the object, labelled |
| Wonder | `pin` 4.0 + bespoke camera path | A held frame whose content travels is the only way to give macro detail room |
| Range | `pan` 3.6 + `tilt` | Lateral travel reads as options, not argument |
| Order | `flow` + `in` | An index wants to be read at the reader's pace |
| Lineage | `reveal` (flow act) | A wipe for the one moment the house shows itself |
| Resolve | `pin` 1.6 + bespoke draw | The page stops moving and completes the mark |

Six acts, about 13 vh. Four-plus families, none adjacent twice.
