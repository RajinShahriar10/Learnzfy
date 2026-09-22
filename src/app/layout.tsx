export const dynamic = "force-dynamic"

import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Providers } from "@/providers"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { SkipLink } from "@/components/layout/skip-link"
import { WebVitals } from "@/components/layout/web-vitals"
import { siteConfig } from "@/config"
import { getSiteContent } from "@/lib/cms/content"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent()
  const { branding } = content

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: branding.metaTitle,
      template: `%s | ${branding.siteName}`,
    },
    description: branding.metaDescription,
    keywords: branding.metaKeywords,
    authors: [{ name: branding.siteName }],
    creator: branding.siteName,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      siteName: branding.siteName,
      title: branding.metaTitle,
      description: branding.metaDescription,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: branding.siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: branding.metaTitle,
      description: branding.metaDescription,
      images: [siteConfig.ogImage],
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
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  }
}

const themeScript = `
  try {
    document.documentElement.classList.add('disable-transitions');
    const t = localStorage.getItem('learnzfy-theme') || 'system';
    const d = t === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : t;
    if (d === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    requestAnimationFrame(() => requestAnimationFrame(() =>
      document.documentElement.classList.remove('disable-transitions')
    ));
  } catch (e) {}
`

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const content = await getSiteContent()

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: content.branding.siteName,
    url: siteConfig.url,
    description: content.branding.metaDescription,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <SkipLink />
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navbar siteName={content.branding.siteName} links={content.nav.links} />
            <main id="main-content" className="flex-1 outline-none" tabIndex={-1}>
              {children}
            </main>
            <Footer branding={content.branding} content={content.footer} />
          </div>
        </Providers>
        <WebVitals />
      </body>
    </html>
  )
}