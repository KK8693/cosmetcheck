// Auto-generated category index for CosmetCheck
// Phase 2: Programmatic SEO - category aggregation
// Generated: 2025-06-04

export const categoryLabels: Record<string, string> = {
  'actives': 'Active / Treatment',
  'corticosteroid': 'Corticosteroid / Hormone',
  'hair_coloring': 'Hair Coloring / Dye',
  'other': 'Other / Multi-use',
  'preservative': 'Preservative / Antimicrobial',
  'skin_lightening': 'Skin Lightening / Whitening',
  'surfactant': 'Surfactant / Emulsifier',
}

export const categoryIndex: Record<string, string[]> = {
  'actives': ['benzophenone-3', 'benzoyl-peroxide', 'glycolic-acid', 'homosalate', 'lactic-acid', 'octinoxate', 'retinoic-acid', 'retinol', 'salicylic-acid', 'tretinoin', 'vitamin-c'],
  'corticosteroid': ['betamethasone', 'corticosteroids', 'hydrocortisone'],
  'hair_coloring': ['ammonia', 'p-phenylenediamine'],
  'other': ['4-methoxyphenol', 'arsenic', 'bithionol', 'cadmium', 'chloramphenicol', 'clorofene', 'cloroxylenol', 'lead', 'mercury', 'mercury-compounds', 'phenacetin', 'thallium'],
  'preservative': ['chlorhexidine', 'diazolidinyl-urea', 'dmdm-hydantoin', 'formaldehyde', 'hexachlorophene', 'imidazolidinyl-urea', 'methylchloroisothiazolinone', 'methylisothiazolinone', 'methylparaben', 'phenoxyethanol', 'propylparaben', 'quaternium-15', 'triclosan'],
  'skin_lightening': ['alpha-arbutin', 'hydroquinone', 'kojic-acid', 'mequinol', 'niacinamide'],
  'surfactant': ['cocamide-dea', 'diethanolamine', 'sodium-lauryl-sulfate', 'triethanolamine'],
}

export function getCategoryLabel(slug: string): string {
  return categoryLabels[slug] ?? slug
}

export function getCategorySlugs(category: string): string[] {
  return categoryIndex[category] ?? []
}

export function getAllCategories(): string[] {
  return Object.keys(categoryIndex)
}
