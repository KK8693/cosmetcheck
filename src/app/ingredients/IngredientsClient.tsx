'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getStatusColor, getStatusIcon, getCategoryLabel } from '@/lib/ingredient-data'
import type { IngredientSummary } from '@/lib/ingredient-data'
import {
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
} from 'lucide-react'

const STATUS_FILTERS = [
  { value: 'all', label: 'All Statuses', icon: Filter },
  { value: 'banned', label: 'Banned', icon: ShieldAlert },
  { value: 'restricted', label: 'Restricted', icon: AlertTriangle },
  { value: 'prescription', label: 'Prescription', icon: Stethoscope },
  { value: 'allowed', label: 'Allowed', icon: CheckCircle2 },
]

export default function IngredientsClient({
  allIngredients,
}: {
  allIngredients: IngredientSummary[]
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [countryFilter, setCountryFilter] = useState<'brazil' | 'mexico'>('brazil')

  const filtered = useMemo(() => {
    return allIngredients.filter((ing) => {
      const matchesSearch =
        searchQuery === '' ||
        ing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ing.inci.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ing.commonUse.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false

      if (statusFilter === 'all') return true

      const status =
        countryFilter === 'brazil' ? ing.brazilStatus : ing.mexicoStatus
      return status === statusFilter
    })
  }, [allIngredients, searchQuery, statusFilter, countryFilter])

  return (
    <>
      {/* Search & Filter */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#1A1A24] border border-[#252530] rounded-2xl p-4 sm:p-6">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <Input
                type="text"
                placeholder="Search ingredient, e.g. Hydroquinone, Retinol, Mercury..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-[#0F1419] border-[#252530] text-white placeholder:text-white/30 focus:border-[#0A4D8C] focus:ring-[#0A4D8C]/20 text-base"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Country Toggle */}
              <div className="flex bg-[#0F1419] rounded-xl p-1 border border-[#252530]">
                <button
                  onClick={() => setCountryFilter('brazil')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    countryFilter === 'brazil'
                      ? 'bg-[#0A4D8C] text-white'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  <span>🇧🇷</span> Brazil (ANVISA)
                </button>
                <button
                  onClick={() => setCountryFilter('mexico')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    countryFilter === 'mexico'
                      ? 'bg-[#0A4D8C] text-white'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  <span>🇲🇽</span> Mexico (COFEPRIS)
                </button>
              </div>

              {/* Status Pills */}
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((filter) => {
                  const Icon = filter.icon
                  return (
                    <button
                      key={filter.value}
                      onClick={() => setStatusFilter(filter.value)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all border ${
                        statusFilter === filter.value
                          ? 'bg-white/10 border-white/20 text-white'
                          : 'bg-transparent border-[#252530] text-white/40 hover:text-white/70'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {filter.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Table */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-white/40">
              Showing {filtered.length} of {allIngredients.length} ingredients
            </p>
            <p className="text-sm text-white/40 hidden sm:block">
              Sorted by: <span className="text-white/60">Name (A-Z)</span>
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-[#1A1A24] border border-[#252530] rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#252530] bg-[#0F1419]/50">
                  <th className="text-left px-6 py-4 text-sm font-medium text-white/50">
                    Ingredient
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-white/50">
                    INCI Name
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-white/50">
                    Category
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-white/50">
                    Brazil 🇧🇷
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-white/50">
                    Mexico 🇲🇽
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-white/50">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ing) => (
                  <tr
                    key={ing.slug}
                    className="border-b border-[#252530]/50 hover:bg-[#252530]/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0A4D8C]/20 flex items-center justify-center">
                          <FlaskConical className="w-4 h-4 text-[#1E6BB8]" />
                        </div>
                        <span className="font-medium text-white">{ing.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/50 font-mono">
                      {ing.inci}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-white/60">
                        {getCategoryLabel(ing.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={ing.brazilStatus} />
                    </td>
                    <td className="px-6 py-4">
                      {ing.mexicoStatus ? (
                        <StatusBadge status={ing.mexicoStatus} />
                      ) : (
                        <span className="text-sm text-white/20">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/ingredient/${ing.slug}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#252530] text-white/60 hover:text-white hover:bg-[#252530]"
                        >
                          Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((ing) => (
              <Link
                key={ing.slug}
                href={`/ingredient/${ing.slug}`}
                className="block bg-[#1A1A24] border border-[#252530] rounded-xl p-4 hover:border-[#0A4D8C]/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-white">{ing.name}</h3>
                    <p className="text-xs text-white/40 font-mono">{ing.inci}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/30" />
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <StatusBadge status={ing.brazilStatus} compact />
                  {ing.mexicoStatus && (
                    <StatusBadge status={ing.mexicoStatus} compact />
                  )}
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <p className="text-white/40 text-lg mb-2">No ingredients found</p>
              <p className="text-white/20 text-sm">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function StatusBadge({
  status,
  compact = false,
}: {
  status: string
  compact?: boolean
}) {
  const colors = getStatusColor(status as 'banned' | 'restricted' | 'allowed' | 'prescription' | 'pending')
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border ${colors.bg} ${colors.text} ${colors.border} ${
        compact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'
      }`}
    >
      {compact ? (
        <span className="text-xs">{getStatusIcon(status as 'banned' | 'restricted' | 'allowed' | 'prescription' | 'pending')}</span>
      ) : (
        <span>{getStatusIcon(status as 'banned' | 'restricted' | 'allowed' | 'prescription' | 'pending')}</span>
      )}
      {colors.label}
    </span>
  )
}
