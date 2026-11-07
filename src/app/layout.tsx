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
  icons: {
    icon: [
      { url: "/images/logo.png", type: "image/png" },
    ],
    apple: [
      { url: "/images/logo.png" },
    ],
  },
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
              <div className="text-xs text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} What2Build. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
