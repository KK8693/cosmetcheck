export const runtime = 'edge'

import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A4D8C] via-[#1E6BB8] to-[#00A86B]">
      <div className="text-center text-white p-8">
        <h2 className="text-4xl font-bold mb-4">404</h2>
        <p className="text-xl mb-8">Page not found</p>
        <Link 
          href="/"
          className="inline-block bg-white text-[#0A4D8C] px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}