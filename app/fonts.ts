import localFont from "next/font/local";

/** Bodoni Moda: variable weight and optical size. Its hairlines echo fine metalwork. */
export const display = localFont({
  src: [
    { path: "./fonts/BodoniModa.woff2", style: "normal", weight: "400 900" },
    { path: "./fonts/BodoniModa-Italic.woff2", style: "italic", weight: "400 900" },
  ],
  variable: "--font-vt-display",
  display: "swap",
  fallback: ["Didot", "Georgia", "serif"],
});

/** Hanken Grotesk: a warm, plain text face for labels and prose. */
export const text = localFont({
  src: [{ path: "./fonts/HankenGrotesk.woff2", style: "normal", weight: "100 900" }],
  variable: "--font-vt-text",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
});
