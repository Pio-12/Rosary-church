import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "./components/site";
import { LanguageProvider } from "./components/LanguageProvider";

export const metadata: Metadata = {
  title: "Our Lady of Holy Rosary Church",
  description:
    "A living heritage of faith in the heart of Madurai.",
    icons: {
    icon: 
      "https://ncedxbcsrcwuoailxsph.supabase.co/storage/v1/object/public/church-images/ChatGPT%20Image%20Sep%2011,%202026,%2009_33_49%20PM.png",
  
}
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}