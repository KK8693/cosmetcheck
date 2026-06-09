// Auto-generated status index for CosmetCheck
// Phase 2: Programmatic SEO - status aggregation
// Generated: 2025-06-04

export const statusLabels: Record<string, string> = {
  banned: 'Banned / Prohibited',
  restricted: 'Restricted / Concentration-Limited',
  allowed: 'Allowed / Compliant',
  prescription: 'Prescription Only',
  pending: 'Pending Review',
}

export const statusIndex: Record<string, Record<string, string[]>> = {
  brazil: {
    'banned': ['4-methoxyphenol', 'arsenic', 'betamethasone', 'bithionol', 'cadmium', 'chloramphenicol', 'clorofene', 'cloroxylenol', 'corticosteroids', 'formaldehyde', 'hexachlorophene', 'hydrocortisone', 'hydroquinone', 'lead', 'mequinol', 'mercury', 'mercury-compounds', 'phenacetin', 'quaternium-15', 'retinoic-acid', 'thallium', 'tretinoin'],
    'restricted': ['alpha-arbutin', 'ammonia', 'benzophenone-3', 'benzoyl-peroxide', 'chlorhexidine', 'cocamide-dea', 'diazolidinyl-urea', 'diethanolamine', 'dmdm-hydantoin', 'glycolic-acid', 'homosalate', 'imidazolidinyl-urea', 'kojic-acid', 'lactic-acid', 'methylchloroisothiazolinone', 'methylisothiazolinone', 'methylparaben', 'niacinamide', 'octinoxate', 'p-phenylenediamine', 'phenoxyethanol', 'propylparaben', 'retinol', 'salicylic-acid', 'sodium-lauryl-sulfate', 'triclosan', 'triethanolamine', 'vitamin-c'],
  },
  mexico: {
    'allowed': ['sodium-lauryl-sulfate'],
    'banned': ['arsenic', 'betamethasone', 'bithionol', 'cadmium', 'chloramphenicol', 'cloroxylenol', 'corticosteroids', 'formaldehyde', 'hexachlorophene', 'hydrocortisone', 'hydroquinone', 'lead', 'mequinol', 'mercury', 'mercury-compounds', 'quaternium-15', 'retinoic-acid', 'tretinoin'],
    'restricted': ['ammonia', 'cocamide-dea', 'diazolidinyl-urea', 'diethanolamine', 'dmdm-hydantoin', 'imidazolidinyl-urea', 'methylchloroisothiazolinone', 'methylisothiazolinone', 'methylparaben', 'p-phenylenediamine', 'propylparaben', 'triethanolamine'],
  },
}

export function getStatusLabel(status: string): string {
  return statusLabels[status] ?? status
}

export function getIngredientsByStatus(country: 'brazil' | 'mexico', status: string): string[] {
  return statusIndex[country]?.[status] ?? []
}

export function getAllStatuses(country: 'brazil' | 'mexico'): string[] {
  return Object.keys(statusIndex[country] ?? {})
}
