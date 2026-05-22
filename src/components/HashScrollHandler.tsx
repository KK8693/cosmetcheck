'use client'

import { useEffect } from 'react'

/**
 * Handles scrolling to hash anchors on page load and hash changes.
 * Needed because Next.js App Router doesn't always auto-scroll to hash
 * when navigating from another page.
 */
export function HashScrollHandler() {
  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash
      if (hash) {
        const element = document.querySelector(hash)
        if (element) {
          // Small delay to ensure DOM is fully rendered
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }, 100)
        }
      }
    }

    // Scroll on initial load
    scrollToHash()

    // Also handle hash changes while on the same page
    const handleHashChange = () => scrollToHash()
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return null
}
