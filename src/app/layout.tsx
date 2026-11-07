import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "What2Build | Turn AI research into engineering projects",
  description: "Browse official research and engineering updates from frontier AI labs, and generate actionable project ideas from beginner to advanced.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased flex flex-col font-sans selection:bg-accent selection:text-accent-foreground">
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-border bg-background py-8 text-sm text-muted-foreground">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="font-medium text-foreground tracking-tight">What2Build</span>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <a
                  href={process.env.NEXT_PUBLIC_REPO_URL || "https://github.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
                <span>•</span>
                <span>Open-source AI research index</span>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
