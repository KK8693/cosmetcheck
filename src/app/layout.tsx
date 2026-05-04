import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CosmetCheck - 拉美美妆合规检测专家',
  description: '一键检测巴西/墨西哥等5国美妆合规，AI自动生成高转化Listing。免费开始，让您的美妆产品顺利进入拉美市场。',
  keywords: 'ANVISA, COFEPRIS, 美妆合规, 巴西美妆, 墨西哥美妆, 化妆品检测, Listing生成',
  openGraph: {
    title: 'CosmetCheck - 拉美卖美妆，不再被下架罚款',
    description: '一键检测巴西/墨西哥美妆合规，AI自动生成高转化Listing',
    type: 'website',
    locale: 'zh_CN',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}