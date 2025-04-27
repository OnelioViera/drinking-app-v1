import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sobriety Tracker",
  description: "Track your journey to sobriety",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.className} min-h-screen bg-gradient-to-b from-blue-50 to-white`}
        >
          <Navbar />
          <main className="container mx-auto p-4">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
