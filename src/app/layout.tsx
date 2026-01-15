import type { Metadata } from "next";
import { Cormorant_Garamond, Lora } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header, Footer } from "@/components/organisms";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Svetla Estetica | Centro Estetico Dalmine",
    template: "%s | Svetla Estetica",
  },
  description:
    "Centro estetico professionale a Dalmine, Bergamo. Trattamenti viso e corpo, prodotti di qualità, manicure, pedicure, ceretta e molto altro.",
  keywords: [
    "centro estetico",
    "dalmine",
    "bergamo",
    "trattamenti viso",
    "trattamenti corpo",
    "manicure",
    "pedicure",
    "ceretta",
    "luce pulsata",
  ],
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Svetla Estetica",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={`${cormorant.variable} ${lora.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

