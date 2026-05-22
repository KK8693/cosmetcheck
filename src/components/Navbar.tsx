'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname } from '@/i18n/routing'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/Logo'
import { Menu, X, Zap } from 'lucide-react'
import AuthModal from '@/components/AuthModal'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export function Navbar() {
  const t = useTranslations('nav')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const { user } = useAuth()

  // Check if current page is the home page (pathname excludes locale prefix in next-intl)
  const isHomePage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '#features', label: t('features'), isPage: false },
    { href: '#how-it-works', label: t('howItWorks'), isPage: false },
    { href: '/batch', label: t('batch'), isPage: true },
    { href: '#pricing', label: t('pricing'), isPage: false },
    { href: '#faq', label: t('faq'), isPage: false },
  ]

  return (
    <>
      {/* Navbar with solid background to prevent ghosting */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0D0D12]/95 backdrop-blur-lg border-b border-white/10 shadow-lg'
            : 'bg-[#0D0D12]'
        }`}
        style={{ 
          transform: 'translateZ(0)', 
          backfaceVisibility: 'hidden',
          isolation: 'isolate'
        }}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Logo size={32} />
              <span className="text-white font-bold text-xl">CosmetCheck</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                // For anchor links on non-home pages, navigate to home page with hash
                const resolvedHref =
                  !link.isPage && !isHomePage
                    ? `/${locale}${link.href}`
                    : link.href

                return link.isPage ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={resolvedHref}
                    className="text-white/70 hover:text-white transition-colors text-sm font-medium"
                  >
                    {link.label}
                  </a>
                )
              })}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageSwitcher />
              {user ? (
                <span className="text-sm text-white/60">
                  {tCommon('loggedInAs', { email: user?.email?.split('@')[0] ?? 'user' })}
                </span>
              ) : (
                <Button
                  onClick={() => setAuthOpen(true)}
                  className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-semibold"
                >
                  <Zap className="w-4 h-4 mr-1" />
                  {tCommon('freeStart')}
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0D0D12]/98 backdrop-blur-lg border-t border-white/10">
            <div className="container-custom py-4 space-y-3">
              {navLinks.map((link) => {
                // For anchor links on non-home pages, navigate to home page with hash
                const resolvedHref =
                  !link.isPage && !isHomePage
                    ? `/${locale}${link.href}`
                    : link.href

                return link.isPage ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-white/70 hover:text-white transition-colors py-2 text-sm font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={resolvedHref}
                    className="block text-white/70 hover:text-white transition-colors py-2 text-sm font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              })}
              <div className="py-2">
                <LanguageSwitcher />
              </div>
              <Button
                onClick={() => { setAuthOpen(true); setIsMobileMenuOpen(false) }}
                className="w-full mt-4 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 font-semibold"
              >
                <Zap className="w-4 h-4 mr-1" />
                {tCommon('freeStart')}
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Auth Modal */}
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  )
}