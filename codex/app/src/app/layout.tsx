import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIコーディングCLI比較 — Claude Code × Codex × Gemini CLI",
  description:
    "Claude Code、Codex（CLI）、Gemini CLIの概要と特徴を、ライトテーマのシングルページで比較。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-neutral-900`}>
        {children}
      </body>
    </html>
  );
}
