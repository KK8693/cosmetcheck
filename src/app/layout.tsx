import type { Metadata } from 'next'
import { Inter, Space_Grotesk, DM_Sans } from 'next/font/google'
import './globals.css'

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
    default: 'CosmetCheck - 拉美美妆合规检测专家',
    template: '%s | CosmetCheck',
  },
  description: '一键检测巴西/墨西哥等5国美妆合规，AI自动生成高转化Listing。免费开始，让您的美妆产品顺利进入拉美市场。',
  keywords: 'ANVISA, COFEPRIS, 美妆合规, 巴西美妆, 墨西哥美妆, 化妆品检测, Listing生成',
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
    title: 'CosmetCheck - 拉美卖美妆，不再被下架罚款',
    description: '一键检测巴西/墨西哥美妆合规，AI自动生成高转化Listing。免费开始，避免ANVISA/COFEPRIS下架罚款。',
    url: 'https://cosmetcheck.com',
    siteName: 'CosmetCheck',
    locale: 'zh_CN',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CosmetCheck - 拉美美妆合规检测专家',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CosmetCheck - 拉美美妆合规检测专家',
    description: '一键检测巴西/墨西哥美妆合规，AI自动生成高转化Listing',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://cosmetcheck.com',
    languages: {
      'zh-CN': 'https://cosmetcheck.com/zh',
      'en': 'https://cosmetcheck.com/en',
      'pt-BR': 'https://cosmetcheck.com/pt-BR',
      'es-MX': 'https://cosmetcheck.com/es-MX',
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.className} ${spaceGrotesk.variable} ${dmSans.variable}`}>
        {children}
      </body>
    </html>
  )
}
