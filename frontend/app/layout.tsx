import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ModernHeader from "@/components/ModernHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Small Step For Earth - Social Media",
  description: "A social media platform to share your steps towards a sustainable future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <ModernHeader />
        <main className="pt-16 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
