import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { SITE_CONFIG } from "@/lib/seo-config";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.author.name, url: SITE_CONFIG.author.url }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/images/logo.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/images/logo.svg" },
      { url: "/favicon.svg" },
    ],
  },
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        {/* Accessible Skip to Content Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-hidden"
        >
          Skip to main content
        </a>
        <Providers>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <footer className="border-t border-border bg-background py-10 text-sm text-muted-foreground">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <span className="font-semibold text-foreground tracking-tight text-base">What2Build</span>
                  <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                    Bridging frontier AI research with real-world developer engineering projects.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-xs">
                  <Link href="/" className="hover:text-foreground transition-colors">
                    Home
                  </Link>
                  <Link href="/#companies" className="hover:text-foreground transition-colors">
                    Organizations
                  </Link>
                  <Link href="/llms.txt" className="hover:text-foreground transition-colors">
                    llms.txt
                  </Link>
                  <a
                    href={SITE_CONFIG.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    GitHub
                  </a>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} What2Build. All rights reserved.</p>
                <p>Not affiliated with OpenAI, Google, Anthropic, or Meta. All trademarks belong to their respective owners.</p>
              </div>
            </div>
          </footer>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
