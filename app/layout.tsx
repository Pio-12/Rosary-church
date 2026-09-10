import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "./components/site";

export const metadata: Metadata = { title: "Our Lady of Holy Rosary Church", description: "A living heritage of faith in the heart of Madurai." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Header />{children}<Footer /></body></html>;
}