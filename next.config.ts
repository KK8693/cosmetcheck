import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  // Cloudflare Pages compatible config
  output: 'standalone',
  // IMPORTANT: Don't use Next.js i18n config with next-intl
  // next-intl handles i18n via middleware and [locale] dynamic routes
  // Include messages files in the build output for next-intl on edge runtime
  outputFileTracingIncludes: {
    '/': ['./messages/*.json'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  serverExternalPackages: ['@supabase/supabase-js'],
}

export default withNextIntl(nextConfig)