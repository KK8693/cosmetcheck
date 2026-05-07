'use client'

import { useTheme } from 'next-themes'

interface LogoProps {
  className?: string
  size?: number
}

/**
 * CosmetCheck SVG Logo
 * 
 * Design: Shield + Letter C fusion
 * - Single color: #0A4D8C (blue) or white for dark mode
 * - viewBox: 0 0 64 64
 * - Recognizable at 16px
 * - Geometric design, no gradients/shadows
 */
export function Logo({ className = '', size = 64 }: LogoProps) {
  const { resolvedTheme } = useTheme()
  
  // Determine logo color based on theme
  const fillColor = resolvedTheme === 'dark' ? '#FFFFFF' : '#0A4D8C'
  const strokeColor = resolvedTheme === 'dark' ? '#0A4D8C' : '#FFFFFF'
  
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      aria-label="CosmetCheck Logo"
    >
      {/* Shield outline */}
      <path
        d="M32 4L8 16v16c0 13.2 10.3 25.2 24 28 13.7-2.8 24-14.8 24-28V16L32 4z"
        fill={fillColor}
      />
      {/* Letter C - cut out from shield (using same color as background for contrast) */}
      <path
        d="M38 20h-8c-4.4 0-8 3.6-8 8s3.6 8 8 8h8"
        stroke={strokeColor}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default Logo