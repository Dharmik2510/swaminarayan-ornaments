# Editorial storefront

The homepage and collection use an ivory/emerald design, existing jewellery imagery, native scrolling, Framer Motion parallax and section reveals. Mobile layouts remove sticky storytelling; reduced-motion preferences disable movement. The admin UI remains separate.

## Local preview

```sh
npm ci
npm run dev -- --port 3100
```

Visit http://localhost:3100. Run `npm run build` for a production build.

## Launch configuration

- Configure the existing `NEXT_PUBLIC_FIREBASE_*` variables in `.env.local` to use the live catalogue and admin authentication. Without them the existing sample catalogue is displayed. Sample products reuse three images; replace those records with accurate product photographs and specifications before publishing.
- Set `NEXT_PUBLIC_WHATSAPP_NUMBER` to the business number, including country code and digits only. Without it, enquiries can be copied and no message is sent to a placeholder number.
- The storefront intentionally does not display the legacy `92/84 carat`, certification, weight, and founding-date claims. Confirm actual product specifications before publishing such claims.
- Google Fonts are currently loaded through the existing stylesheet, with system/Georgia fallbacks.

## Behaviour checked

Desktop and 390px mobile layout; category navigation; no-result search and recovery; product dialog; Escape dismissal; saved-selection persistence across reload; enquiry selection removal. Production build includes all public and admin routes. Live Firebase sign-in and WhatsApp delivery require production configuration and are not verified by local checks.
