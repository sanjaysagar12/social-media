import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalHeader from "@/components/ConditionalHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// This is a server component - metadata export is allowed here
export const metadata: Metadata = {
  title: "Small Step for Earth - Sustainability Challenges & Community",
  description: "Join a global community making small steps towards environmental sustainability. Participate in challenges, share your impact, and contribute to a greener planet.",
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
        <ConditionalHeader />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
