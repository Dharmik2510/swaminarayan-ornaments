import type { Metadata } from "next";
import "./globals.css"; // force reload

export const metadata: Metadata = {
  title: "Swaminarayan Ornaments | Wholesale Gold Jewellery Excellence",
  description: "Discover exquisite wholesale gold jewellery at Swaminarayan Ornaments. Premium 92 & 84 carat gold necklaces, bangles, earrings, and more. Where heritage meets contemporary elegance.",
  keywords: "wholesale gold jewellery, gold necklaces, gold bangles, gold earrings, 92 carat gold, 84 carat gold, Swaminarayan Ornaments, Indian gold jewellery",
  openGraph: {
    title: "Swaminarayan Ornaments | Wholesale Gold Jewellery Excellence",
    description: "Where centuries of goldsmithing heritage meets contemporary elegance. Premium wholesale gold jewellery in 92 & 84 carat.",
    type: "website",
  },
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
