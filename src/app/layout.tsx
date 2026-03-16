import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Liar or Fire - Is it worth the hype?",
  description: "Vote on products, services, and trends. Are they 🔥 Fire or 🤥 Liar? Upload images, comment, and share your experience.",
  keywords: ["voting", "reviews", "products", "hype", "fire", "liar", "reddit", "social"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.className} antialiased bg-zinc-950 text-white min-h-screen`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}