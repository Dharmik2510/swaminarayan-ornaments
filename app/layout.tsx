import type { Metadata } from "next";
import "./globals.css"; // force reload

export const metadata: Metadata = {
  title: "Swaminarayan Ornaments | The Art of Adornment",
  description:
    "Discover necklaces, bangles, earrings and more at Swaminarayan Ornaments. Explore the collection, save your favourites and enquire about wholesale availability.",
  openGraph: {
    title: "Swaminarayan Ornaments | The Art of Adornment",
    description:
      "Ornaments for today. Stories for a lifetime. Explore our jewellery collection.",
    type: "website",
  },
  icons: { icon: "/logo.jpg", apple: "/logo.jpg" },
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
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
