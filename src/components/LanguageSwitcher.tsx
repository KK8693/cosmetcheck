'use client'

import { useI18n } from '@/i18n/useI18n'
import { Globe } from 'lucide-react'

const languages = [
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'pt-BR', label: 'PT', flag: '🇧🇷' },
  { code: 'es-MX', label: 'ES', flag: '🇲🇽' },
]

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()

  return (
    <div className="relative inline-flex items-center gap-2">
      <Globe className="w-4 h-4 text-white/70" />
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="bg-transparent text-white/70 text-sm font-medium border-none cursor-pointer focus:outline-none focus:ring-0 hover:text-white transition-colors appearance-none pr-6"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffffaa'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0 center',
          backgroundSize: '16px 16px'
        }}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-[#0D0D12] text-white">
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
    </div>
  )
}