// Auto-generated priority matrix for CosmetCheck SEO
// Phase 1: Top 50 ingredient prioritization
// Generated: 2025-06-04

export type PriorityTier = 'p0' | 'p1' | 'p2'

export interface IngredientPriority {
  slug: string
  name: string
  priority: PriorityTier
  category: string
  brazilStatus: string
  mexicoStatus: string | null
  reason: string
}

export const ingredientPriorities: IngredientPriority[] = [
  { slug: '4-methoxyphenol', name: '4-Methoxyphenol', priority: 'p2', category: 'other', brazilStatus: 'banned', mexicoStatus: null, reason: 'Low search volume, niche or obscure ingredients' },
  { slug: 'alpha-arbutin', name: 'Alpha Arbutin', priority: 'p1', category: 'skin_lightening', brazilStatus: 'restricted', mexicoStatus: null, reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'ammonia', name: 'Ammonia', priority: 'p1', category: 'hair_coloring', brazilStatus: 'restricted', mexicoStatus: 'restricted', reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'arsenic', name: 'Arsenic', priority: 'p0', category: 'other', brazilStatus: 'banned', mexicoStatus: 'banned', reason: 'High search volume + banned + severe health risks + frequent marketplace violations' },
  { slug: 'benzophenone-3', name: 'Benzophenone-3', priority: 'p1', category: 'actives', brazilStatus: 'restricted', mexicoStatus: null, reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'benzoyl-peroxide', name: 'Benzoyl Peroxide', priority: 'p1', category: 'actives', brazilStatus: 'restricted', mexicoStatus: null, reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'betamethasone', name: 'Betamethasone', priority: 'p0', category: 'corticosteroid', brazilStatus: 'banned', mexicoStatus: 'banned', reason: 'High search volume + banned + severe health risks + frequent marketplace violations' },
  { slug: 'bithionol', name: 'Bithionol', priority: 'p2', category: 'other', brazilStatus: 'banned', mexicoStatus: 'banned', reason: 'Low search volume, niche or obscure ingredients' },
  { slug: 'cadmium', name: 'Cadmium', priority: 'p2', category: 'other', brazilStatus: 'banned', mexicoStatus: 'banned', reason: 'Low search volume, niche or obscure ingredients' },
  { slug: 'chloramphenicol', name: 'Chloramphenicol', priority: 'p0', category: 'other', brazilStatus: 'banned', mexicoStatus: 'banned', reason: 'High search volume + banned + severe health risks + frequent marketplace violations' },
  { slug: 'chlorhexidine', name: 'Chlorhexidine', priority: 'p1', category: 'preservative', brazilStatus: 'restricted', mexicoStatus: null, reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'clorofene', name: 'Clorofene', priority: 'p2', category: 'other', brazilStatus: 'banned', mexicoStatus: null, reason: 'Low search volume, niche or obscure ingredients' },
  { slug: 'cloroxylenol', name: 'Cloroxylenol', priority: 'p2', category: 'other', brazilStatus: 'banned', mexicoStatus: 'banned', reason: 'Low search volume, niche or obscure ingredients' },
  { slug: 'cocamide-dea', name: 'Cocamide DEA', priority: 'p1', category: 'surfactant', brazilStatus: 'restricted', mexicoStatus: 'restricted', reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'corticosteroids', name: 'Corticosteroids', priority: 'p0', category: 'corticosteroid', brazilStatus: 'banned', mexicoStatus: 'banned', reason: 'High search volume + banned + severe health risks + frequent marketplace violations' },
  { slug: 'diazolidinyl-urea', name: 'Diazolidinyl Urea', priority: 'p1', category: 'preservative', brazilStatus: 'restricted', mexicoStatus: 'restricted', reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'diethanolamine', name: 'Diethanolamine', priority: 'p1', category: 'surfactant', brazilStatus: 'restricted', mexicoStatus: 'restricted', reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'dmdm-hydantoin', name: 'DMDM Hydantoin', priority: 'p1', category: 'preservative', brazilStatus: 'restricted', mexicoStatus: 'restricted', reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'formaldehyde', name: 'Formaldehyde', priority: 'p0', category: 'preservative', brazilStatus: 'banned', mexicoStatus: 'banned', reason: 'High search volume + banned + severe health risks + frequent marketplace violations' },
  { slug: 'glycolic-acid', name: 'Glycolic Acid', priority: 'p1', category: 'actives', brazilStatus: 'restricted', mexicoStatus: null, reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'hexachlorophene', name: 'Hexachlorophene', priority: 'p0', category: 'preservative', brazilStatus: 'banned', mexicoStatus: 'banned', reason: 'High search volume + banned + severe health risks + frequent marketplace violations' },
  { slug: 'homosalate', name: 'Homosalate', priority: 'p1', category: 'actives', brazilStatus: 'restricted', mexicoStatus: null, reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'hydrocortisone', name: 'Hydrocortisone', priority: 'p1', category: 'corticosteroid', brazilStatus: 'banned', mexicoStatus: 'banned', reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'hydroquinone', name: 'Hydroquinone', priority: 'p0', category: 'skin_lightening', brazilStatus: 'banned', mexicoStatus: 'banned', reason: 'High search volume + banned + severe health risks + frequent marketplace violations' },
  { slug: 'imidazolidinyl-urea', name: 'Imidazolidinyl Urea', priority: 'p1', category: 'preservative', brazilStatus: 'restricted', mexicoStatus: 'restricted', reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'kojic-acid', name: 'Kojic Acid', priority: 'p1', category: 'skin_lightening', brazilStatus: 'restricted', mexicoStatus: null, reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'lactic-acid', name: 'Lactic Acid', priority: 'p1', category: 'actives', brazilStatus: 'restricted', mexicoStatus: null, reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'lead', name: 'Lead', priority: 'p0', category: 'other', brazilStatus: 'banned', mexicoStatus: 'banned', reason: 'High search volume + banned + severe health risks + frequent marketplace violations' },
  { slug: 'mequinol', name: 'Mequinol', priority: 'p0', category: 'skin_lightening', brazilStatus: 'banned', mexicoStatus: 'banned', reason: 'High search volume + banned + severe health risks + frequent marketplace violations' },
  { slug: 'mercury', name: 'Mercury', priority: 'p0', category: 'other', brazilStatus: 'banned', mexicoStatus: 'banned', reason: 'High search volume + banned + severe health risks + frequent marketplace violations' },
  { slug: 'mercury-compounds', name: 'Mercury compounds', priority: 'p0', category: 'other', brazilStatus: 'banned', mexicoStatus: 'banned', reason: 'High search volume + banned + severe health risks + frequent marketplace violations' },
  { slug: 'methylchloroisothiazolinone', name: 'Methylchloroisothiazolinone', priority: 'p1', category: 'preservative', brazilStatus: 'restricted', mexicoStatus: 'restricted', reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'methylisothiazolinone', name: 'Methylisothiazolinone', priority: 'p1', category: 'preservative', brazilStatus: 'restricted', mexicoStatus: 'restricted', reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'methylparaben', name: 'Methylparaben', priority: 'p1', category: 'preservative', brazilStatus: 'restricted', mexicoStatus: 'restricted', reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'niacinamide', name: 'Niacinamide', priority: 'p1', category: 'skin_lightening', brazilStatus: 'restricted', mexicoStatus: null, reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'octinoxate', name: 'Octinoxate', priority: 'p1', category: 'actives', brazilStatus: 'restricted', mexicoStatus: null, reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'p-phenylenediamine', name: 'P-Phenylenediamine', priority: 'p1', category: 'hair_coloring', brazilStatus: 'restricted', mexicoStatus: 'restricted', reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'phenacetin', name: 'Phenacetin', priority: 'p0', category: 'other', brazilStatus: 'banned', mexicoStatus: null, reason: 'High search volume + banned + severe health risks + frequent marketplace violations' },
  { slug: 'phenoxyethanol', name: 'Phenoxyethanol', priority: 'p1', category: 'preservative', brazilStatus: 'restricted', mexicoStatus: null, reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'propylparaben', name: 'Propylparaben', priority: 'p1', category: 'preservative', brazilStatus: 'restricted', mexicoStatus: 'restricted', reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'quaternium-15', name: 'Quaternium-15', priority: 'p0', category: 'preservative', brazilStatus: 'banned', mexicoStatus: 'banned', reason: 'High search volume + banned + severe health risks + frequent marketplace violations' },
  { slug: 'retinoic-acid', name: 'Retinoic Acid', priority: 'p0', category: 'actives', brazilStatus: 'banned', mexicoStatus: 'banned', reason: 'High search volume + banned + severe health risks + frequent marketplace violations' },
  { slug: 'retinol', name: 'Retinol', priority: 'p1', category: 'actives', brazilStatus: 'restricted', mexicoStatus: null, reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'salicylic-acid', name: 'Salicylic Acid', priority: 'p1', category: 'actives', brazilStatus: 'restricted', mexicoStatus: null, reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'sodium-lauryl-sulfate', name: 'Sodium Lauryl Sulfate', priority: 'p1', category: 'surfactant', brazilStatus: 'restricted', mexicoStatus: 'allowed', reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'thallium', name: 'Thallium', priority: 'p2', category: 'other', brazilStatus: 'banned', mexicoStatus: null, reason: 'Low search volume, niche or obscure ingredients' },
  { slug: 'tretinoin', name: 'Tretinoin', priority: 'p0', category: 'actives', brazilStatus: 'banned', mexicoStatus: 'banned', reason: 'High search volume + banned + severe health risks + frequent marketplace violations' },
  { slug: 'triclosan', name: 'Triclosan', priority: 'p1', category: 'preservative', brazilStatus: 'restricted', mexicoStatus: null, reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'triethanolamine', name: 'Triethanolamine', priority: 'p1', category: 'surfactant', brazilStatus: 'restricted', mexicoStatus: 'restricted', reason: 'Medium-high search volume, restricted status, high commercial relevance' },
  { slug: 'vitamin-c', name: 'Vitamin C', priority: 'p1', category: 'actives', brazilStatus: 'restricted', mexicoStatus: null, reason: 'Medium-high search volume, restricted status, high commercial relevance' }
]

export function getPriorityLabel(tier: PriorityTier): string {
  switch (tier) {
    case 'p0': return 'Critical Priority'
    case 'p1': return 'High Priority'
    case 'p2': return 'Standard Priority'
  }
}

export function getIngredientsByPriority(tier: PriorityTier): IngredientPriority[] {
  return ingredientPriorities.filter(i => i.priority === tier)
}

export function getPrioritySlugs(tier: PriorityTier): string[] {
  return ingredientPriorities.filter(i => i.priority === tier).map(i => i.slug)
}
