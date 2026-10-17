import type { Metadata, Viewport } from "next";
import "./globals.css";
import { display, text } from "./fonts";

export const metadata: Metadata = {
  title: "Swaminarayan Ornaments | Jewellery, shown one piece at a time",
  description:
    "Necklaces, bangles, earrings and more from Swaminarayan Ornaments. Browse the collection, save the pieces you like and enquire.",
  openGraph: {
    title: "Swaminarayan Ornaments",
    description:
      "Jewellery shown the way a jeweller shows it: one piece at a time, under good light.",
    type: "website",
  },
  icons: { icon: "/logo.jpg", apple: "/logo.jpg" },
};

export const viewport: Viewport = {
  themeColor: "#06130F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${text.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
