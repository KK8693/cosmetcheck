// Simple static not-found page for Cloudflare Pages compatibility
// No runtime export - let Next.js handle it automatically
import Link from 'next/link'

export const dynamic = 'force-static'

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '1rem',
      textAlign: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '6rem', margin: 0, color: '#2563eb' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', margin: '1rem 0' }}>Page Not Found</h2>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link 
        href="/"
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#2563eb',
          color: 'white',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: '500'
        }}
      >
        Back to Home
      </Link>
    </div>
  )
}