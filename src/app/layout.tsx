import type { Metadata } from 'next'
import { Inter, Space_Grotesk, DM_Sans } from 'next/font/google'
import './globals.css'
import Analytics from '@/components/Analytics'

// Required for Cloudflare Pages
export const runtime = 'edge'

const inter = Inter({ subsets: ['latin'], display: 'swap', preload: true })
const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  display: 'swap', 
  preload: true,
  variable: '--font-display',
})
const dmSans = DM_Sans({ 
  subsets: ['latin'], 
  display: 'swap', 
  preload: true,
  variable: '--font-body',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://cosmetcheck.com'),
  title: {
    default: 'CosmetCheck — LatAm Beauty Compliance AI',
    template: '%s | CosmetCheck',
  },
  description: 'One-click compliance check for Brazil, Mexico and 4 other countries. AI auto-generates high-converting Listings. Start free, avoid ANVISA/COFEPRIS penalties.',
  keywords: 'ANVISA, COFEPRIS, beauty compliance, Brazil cosmetics, Mexico cosmetics, cosmetic compliance, listing generation, LATAM',
  authors: [{ name: 'CosmetCheck' }],
  creator: 'CosmetCheck',
  publisher: 'CosmetCheck',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'CosmetCheck — LatAm Beauty Compliance AI',
    description: 'One-click compliance check for Brazil, Mexico and 4 other countries. AI auto-generates high-converting Listings. Start free, avoid ANVISA/COFEPRIS penalties.',
    url: 'https://cosmetcheck.com',
    siteName: 'CosmetCheck',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CosmetCheck — LatAm Beauty Compliance AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CosmetCheck — LatAm Beauty Compliance AI',
    description: 'One-click compliance check for Brazil, Mexico and 4 other countries. AI auto-generates high-converting Listings.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/',
    languages: {
      'zh-CN': '/zh',
      'en': '/en',
      'pt-BR': '/pt-BR',
      'es-MX': '/es-MX',
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.className} ${spaceGrotesk.variable} ${dmSans.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
