import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Olympus MCP Harness",
  description:
    "The model reasons. The machine executes. WebMCP execution control for The WebMCP Challenge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${sora.variable}`}>
      <body className="min-h-screen bg-obsidian font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
