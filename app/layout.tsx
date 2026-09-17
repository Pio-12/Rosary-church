import type { Metadata, Viewport } from "next";
import { Noto_Sans_Tamil, Noto_Serif_Tamil } from "next/font/google";

import "./globals.css";
import { Header, Footer } from "./components/site";
import { LanguageProvider } from "./components/LanguageProvider";
import PageLoader from "./components/PageLoader";

const tamilSans = Noto_Sans_Tamil({
  subsets: ["tamil"],
  variable: "--font-tamil-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const tamilSerif = Noto_Serif_Tamil({
  subsets: ["tamil"],
  variable: "--font-tamil-serif",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const logoUrl =
  "https://ncedxbcsrcwuoailxsph.supabase.co/storage/v1/object/public/church-images/ChatGPT%20Image%20Sep%2011,%202026,%2009_33_49%20PM.png";

export const metadata: Metadata = {
  title: "Our Lady of Holy Rosary Church",
  description: "A living heritage of faith in the heart of Madurai.",
  icons: {
    icon: logoUrl,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${tamilSans.variable} ${tamilSerif.variable}`}>
        <LanguageProvider>
          <PageLoader />

          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}