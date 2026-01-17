import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Scheherazade_New } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const arab = Scheherazade_New({
  variable: "--font-arab",
  weight: ["400", "700"],
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zakat Kita - Daarussyifa Super Apps",
  description: "Aplikasi majelis ta'lim dan dzikir daarussyifa untuk memudahkan hitung dan bayar zakat harian, sedekah subuh, wakaf, quran, hadits, dan lain lain",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${arab.variable} antialiased font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
