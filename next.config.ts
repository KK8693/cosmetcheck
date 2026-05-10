import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  // Cloudflare Pages compatible config
  output: 'standalone',
  // Fix for Cloudflare Pages _not-found runtime issue
  // Force all routes to use edge runtime by default
  experimental: {
    // This helps with edge runtime detection
  },
  // Set default runtime to edge for Cloudflare Pages
  // Note: Not all pages support this, but it helps with detection
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