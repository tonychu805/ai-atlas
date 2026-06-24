import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PopoverProvider } from "@/lib/popover-context";
import Nav from "./Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Atlas — Semiconductor Industry Database",
  description: "The open, comprehensive database of the semiconductor industry. Browse chips, supply chains, BOMs, and supplier graphs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <PopoverProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <footer className="border-t py-6 text-center text-xs" style={{ borderColor: 'var(--border)', color: '#8a8579' }}>
            AI Atlas · Open semiconductor industry database · Data from public filings, datasheets, and published estimates · Every estimate carries a source
          </footer>
        </PopoverProvider>
      </body>
    </html>
  );
}
