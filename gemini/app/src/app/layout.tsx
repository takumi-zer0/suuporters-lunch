import "./globals.css";
import Providers from "@/providers";
import Sidebar from "@/components/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notion-like Editor",
  description: "A Notion-like editor built with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="min-h-screen antialiased flex">
        <Providers>
          <Sidebar />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
