import { ingredientDatabase } from '@/data/ingredients-database'

export type RegulationStatus = {
  status: 'banned' | 'restricted' | 'allowed' | 'prescription' | 'pending'
  regulation: string
  since: string
  limit: string | null
  note: string
}

export type IngredientDetail = {
  name: string
  inci: string
  cas: string
  category: string
  commonUse: string
  description: string
  whyBanned?: string
  healthRisks: string[]
  alternatives: string[]
  status: {
    brazil: RegulationStatus
    mexico?: RegulationStatus
  }
}

export type IngredientSummary = {
  slug: string
  name: string
  inci: string
  category: string
  brazilStatus: RegulationStatus['status']
  mexicoStatus?: RegulationStatus['status']
  commonUse: string
}

const entries = ingredientDatabase.entries as unknown as Record<string, IngredientDetail>

export function getAllIngredients(): IngredientSummary[] {
  return Object.entries(entries).map(([slug, data]) => ({
    slug,
    name: data.name,
    inci: data.inci,
    category: data.category,
    brazilStatus: data.status.brazil.status,
    mexicoStatus: data.status.mexico?.status,
    commonUse: data.commonUse,
  }))
}

export function getIngredientBySlug(slug: string): IngredientDetail | null {
  return entries[slug] ?? null
}

export function getAllSlugs(): string[] {
  const slugs = Object.keys(entries)
  console.log('[DEBUG] getAllSlugs() returned', slugs.length, 'slugs. Last 5:', slugs.slice(-5))
  return slugs
}

export function getAlternatives(slugs: string[]): IngredientSummary[] {
  return slugs
    .map((slug) => {
      const data = entries[slug]
      if (!data) return null
      return {
        slug,
        name: data.name,
        inci: data.inci,
        category: data.category,
        brazilStatus: data.status.brazil.status,
        mexicoStatus: data.status.mexico?.status,
        commonUse: data.commonUse,
      }
    })
    .filter(Boolean) as IngredientSummary[]
}

export function getIngredientsByStatus(
  country: 'brazil' | 'mexico',
  status: RegulationStatus['status']
): IngredientSummary[] {
  return Object.entries(entries)
    .filter(([, data]) => {
      const s = country === 'brazil' ? data.status.brazil.status : data.status.mexico?.status
      return s === status
    })
    .map(([slug, data]) => ({
      slug,
      name: data.name,
      inci: data.inci,
      category: data.category,
      brazilStatus: data.status.brazil.status,
      mexicoStatus: data.status.mexico?.status,
      commonUse: data.commonUse,
    }))
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    skin_lightening: 'Skin Lightening',
    hair_coloring: 'Hair Coloring',
    corticosteroid: 'Corticosteroid',
    preservative: 'Preservative',
    actives: 'Active Ingredient',
  }
  return labels[category] ?? category
}

export function getIngredientCount(): number {
  return Object.keys(entries).length
}

export function getIngredientCountsByStatus(): {
  brazil: Record<RegulationStatus['status'], number>
  mexico: Record<RegulationStatus['status'], number>
} {
  const counts = {
    brazil: { banned: 0, restricted: 0, allowed: 0, prescription: 0, pending: 0 },
    mexico: { banned: 0, restricted: 0, allowed: 0, prescription: 0, pending: 0 },
  }
  for (const entry of Object.values(entries)) {
    counts.brazil[entry.status.brazil.status]++
    if (entry.status.mexico) {
      counts.mexico[entry.status.mexico.status]++
    }
  }
  return counts
}

export function getStatusColor(status: RegulationStatus['status']): {
  bg: string
  text: string
  border: string
  label: string
} {
  switch (status) {
    case 'banned':
      return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', label: 'Banned' }
    case 'restricted':
      return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Restricted' }
    case 'prescription':
      return { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', label: 'Prescription Only' }
    case 'allowed':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Allowed' }
    default:
      return { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/30', label: 'Pending Review' }
  }
}

export function getStatusIcon(status: RegulationStatus['status']): string {
  switch (status) {
    case 'banned': return '🔴'
    case 'restricted': return '🟡'
    case 'prescription': return '🟠'
    case 'allowed': return '🟢'
    default: return '⚪'
  }
}
