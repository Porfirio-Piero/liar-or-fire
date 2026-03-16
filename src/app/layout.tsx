import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Liar or Fire - Is it worth the hype?",
  description: "Vote on products, services, and trends. Are they 🔥 Fire or 🤥 Liar?",
  keywords: ["voting", "reviews", "products", "hype", "fire", "liar", "reviews"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}