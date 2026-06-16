import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Antigravity | Luxury Outdoor Library & Gear",
  description: "A meticulously curated selection of wilderness guidebooks, botanical manuals, and survival literature. Hand-bound companion volumes for summits, campfires, and backcountry trails.",
  keywords: ["luxury outdoor books", "wilderness guidebooks", "survival manual", "hiking reading", "nature memoirs"],
  authors: [{ name: "Antigravity Solutions" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Antigravity | Luxury Outdoor Library & Gear",
    description: "Hand-bound reading companions for backcountry explorers. Field guides, safety checklists, and nature essays.",
    type: "website",
    locale: "en_US",
    siteName: "Antigravity",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-midnight text-cream">
        <CartProvider>
          <Header />
          <main className="flex-grow flex flex-col">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
