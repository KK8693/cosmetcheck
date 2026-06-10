// Platform compliance guides for CosmetCheck
// Phase 2: Programmatic SEO - platform × country × category
// Covers Amazon, Mercado Livre, and Shopee in Brazil & Mexico

export interface PlatformCategoryGuide {
  categorySlug: string
  categoryName: string
  specificRestrictions: string[]
  documentationRequired: string[]
  examples: string[]
}

export interface PlatformCountryGuide {
  country: 'brazil' | 'mexico'
  countryName: string
  marketplaceUrl: string
  overview: string

  cosmeticsPolicy: {
    allowed: boolean
    restrictions: string[]
    prohibitedCategories: string[]
    registrationRequired: boolean
    documentsNeeded: string[]
  }

  sellerRequirements: {
    accountType: string
    taxIdRequired: boolean
    localEntityRequired: boolean
    responsibleTechnicianRequired: boolean
  }

  listingRequirements: string[]
  commonViolations: string[]
  complianceChecklist: string[]
  categoryGuides: PlatformCategoryGuide[]
  faq: { question: string; answer: string }[]
  relatedRegulations: string[]
}

export interface PlatformGuide {
  slug: string
  name: string
  website: string
  description: string
  countries: PlatformCountryGuide[]
}

// ── Category definitions (must match category-index.ts) ──
const CATEGORY_SLUGS = [
  'actives',
  'corticosteroid',
  'hair_coloring',
  'other',
  'preservative',
  'skin_lightening',
  'surfactant',
] as const

// ── Helper to build category guides with platform-specific data ──
function buildCategoryGuides(
  platform: 'amazon' | 'mercado-livre' | 'shopee',
  country: 'brazil' | 'mexico'
): PlatformCategoryGuide[] {
  const isBrazil = country === 'brazil'
  const isAmazon = platform === 'amazon'
  const isMercado = platform === 'mercado-livre'

  const categoryData: Record<string, Partial<PlatformCategoryGuide>> = {
    actives: {
      specificRestrictions: isBrazil
        ? [
            'Active ingredients like retinol and acids require concentration disclosure on listings',
            'Products with SPF claims need ANVISA registration (Registro) — not just Cadastro',
            'Vitamin C serums over 10% may be flagged for medical claims',
          ]
        : [
            'Active ingredients must have COFEPRIS registration matching product claims',
            'Salicylic acid over 2% requires special documentation',
            'Retinol products must include concentration and usage warnings',
          ],
      documentationRequired: isBrazil
        ? ['ANVISA registration number', 'PTR (Responsável Técnico) certificate', 'Product safety assessment']
        : ['COFEPRIS registration number', 'NOM compliance certificate', 'Label in Spanish'],
      examples: isBrazil
        ? [
            'Retinol serum — list concentration (e.g., 0.5%)',
            'Vitamin C serum — avoid "treats hyperpigmentation" claims',
            'Sunscreen SPF 50 — ensure ANVISA Registro, not Cadastro',
          ]
        : [
            'Retinol cream — include Spanish warnings',
            'Salicylic acid cleanser — keep concentration ≤ 2% for general sale',
            'Sunscreen — COFEPRIS Registro Sanitario required',
          ],
    },
    corticosteroid: {
      specificRestrictions: [
        'Corticosteroids are prescription-only in both Brazil and Mexico',
        'Over-the-counter sale is prohibited on all platforms',
        'Products containing corticosteroids without prescription documentation will be removed',
      ],
      documentationRequired: isBrazil
        ? ['Medical prescription validation', 'ANVISA special registration (controlled substance)', 'PTR authorization for controlled substances']
        : ['Medical prescription', 'COFEPRIS controlled substance permit', 'Import authorization for controlled cosmetics'],
      examples: [
        'Hydrocortisone cream — NOT allowed for general cosmetic sale',
        'Betamethasone products — prescription only, platform will delist',
        'Any product with corticosteroid claims — immediate removal risk',
      ],
    },
    hair_coloring: {
      specificRestrictions: isBrazil
        ? [
            'PPD (p-phenylenediamine) concentration must not exceed 6%',
            'Ammonia-free claims must be substantiated',
            'Professional-use products must be labeled as such and not marketed to consumers',
          ]
        : [
            'PPD limits apply per NOM standards',
            'Ammonia content must be disclosed',
            'Products for professional use only must state "Uso Profesional"',
          ],
      documentationRequired: isBrazil
        ? ['ANVISA Cadastro or Registro (depending on risk class)', 'Toxicological evaluation', 'Color batch stability data']
        : ['COFEPRIS Registro Sanitario', 'Dermatological safety test', 'Label with Spanish instructions'],
      examples: isBrazil
        ? [
            'Permanent hair dye — PPD ≤ 6%, include allergy warning',
            'Ammonia-free dye — ensure claim is verifiable',
            'Professional bleach — label "Uso Profissional" clearly',
          ]
        : [
            'Hair color kit — include gloves and allergy test instructions in Spanish',
            'PPD-containing dye — concentration must comply with NOM-141',
            'Ammonia hair dye — disclose ammonia percentage',
          ],
    },
    other: {
      specificRestrictions: isBrazil
        ? [
            'Products containing heavy metals (lead, mercury, arsenic, cadmium) are strictly prohibited',
            'Chloramphenicol in cosmetics is banned — will trigger automatic delisting',
            'Products with ambiguous ingredient lists may be flagged for review',
          ]
        : [
            'Heavy metals in cosmetics are banned under Mexican law',
            'Chloramphenicol and similar antibiotics prohibited in cosmetics',
            'Products with incomplete INCI lists may be rejected',
          ],
      documentationRequired: isBrazil
        ? ['Complete INCI list', 'Heavy metals test report', 'Microbiological analysis']
        : ['Complete INCI list in Spanish', 'Heavy metals certificate', 'Microbiological safety report'],
      examples: isBrazil
        ? [
            'Traditional face cream — ensure no mercury compounds',
            'Whitening product — heavy metals test required even if not in skin_lightening category',
            'Multi-use balm — complete ingredient disclosure mandatory',
          ]
        : [
            'Herbal cosmetic — verify all botanicals are COFEPRIS-approved',
            'Multi-purpose cream — disclose all active and inactive ingredients',
            'Imported cosmetic — Mexican label required',
          ],
    },
    preservative: {
      specificRestrictions: isBrazil
        ? [
            'Formaldehyde and formaldehyde-releasers (DMDM hydantoin, quaternium-15) must be disclosed',
            'Methylisothiazolinone (MI) and Methylchloroisothiazolinone (MCI) have concentration limits',
            'Parabens are allowed but increasingly scrutinized — transparency recommended',
          ]
        : [
            'Formaldehyde-releasing preservatives must be declared',
            'MI/MCI limits per NOM-141',
            'Phenoxyethanol limited to 1% in leave-on products',
          ],
      documentationRequired: isBrazil
        ? ['Preservative concentration declaration', 'Safety assessment for preservative system', 'Stability test showing preservative efficacy']
        : ['Preservative list with concentrations', 'Challenge test (preservative efficacy)', 'Label disclosure of all preservatives'],
      examples: isBrazil
        ? [
            'Paraben-free moisturizer — ensure alternative preservatives are disclosed',
            'Natural preservative system — provide safety data for non-standard preservatives',
            'Baby product — extra scrutiny on preservative choices',
          ]
        : [
            'Preservative-free claim — ensure product truly has no preservatives or use accepted alternatives',
            'Natural cosmetic — botanical preservatives still need safety documentation',
            'Spray product — preservatives must be safe for inhalation exposure',
          ],
    },
    skin_lightening: {
      specificRestrictions: isBrazil
        ? [
            'Hydroquinone is banned in cosmetic products — any product containing it will be delisted',
            'Alpha-arbutin and kojic acid are allowed but concentration must be disclosed',
            'Medical claims like "treats melasma" are prohibited for cosmetic products',
          ]
        : [
            'Hydroquinone is restricted to prescription use — cosmetic sale prohibited',
            'Kojic acid and arbutin allowed within limits',
            'Claims must be cosmetic ("brightening") not medical ("treats hyperpigmentation")',
          ],
      documentationRequired: isBrazil
        ? ['ANVISA Registro (higher risk class)', 'Dermatological safety test', 'No hydroquinone certificate of analysis']
        : ['COFEPRIS Registro Sanitario', 'No hydroquinone declaration', 'Clinical safety data for skin lightening claims'],
      examples: isBrazil
        ? [
            'Brightening serum with alpha-arbutin — disclose concentration, avoid medical claims',
            'Kojic acid cream — keep concentration within safe limits, include sun protection advice',
            'Niacinamide product — acceptable, but avoid "treats dark spots" language',
          ]
        : [
            'Skin lightening lotion — must have COFEPRIS registration, not just notification',
            'Alpha-arbutin serum — concentration disclosure required',
            '"Whitening" product — ensure claim is cosmetic, not medical',
          ],
    },
    surfactant: {
      specificRestrictions: isBrazil
        ? [
            'Sodium lauryl sulfate (SLS) and related surfactants must be listed by INCI name',
            'Cocamide DEA and related ethanolamines are restricted — concentration limits apply',
            'Products for babies or sensitive skin face additional scrutiny on surfactant choices',
          ]
        : [
            'SLS and SLES allowed but must be disclosed on label',
            'DEA-related surfactants have usage restrictions',
            'Baby wash products must use mild surfactants only',
          ],
      documentationRequired: isBrazil
        ? ['Surfactant concentration data', 'Irritation/sensitization test (if claim mild/sensitive)', 'Biodegradability data for environmental claims']
        : ['Surfactant list with INCI names', 'Irritation test for sensitive skin claims', 'Environmental safety data if claimed biodegradable'],
      examples: isBrazil
        ? [
            'Sulfate-free shampoo — ensure no SLS/SLES, disclose alternative surfactants',
            'Baby body wash — use only mild surfactants (e.g., coco-glucoside)',
            '"Gentle" cleanser — irritation test required to support claim',
          ]
        : [
            'Facial cleanser — mild surfactant recommended for leave-on claims',
            'Shampoo with SLES — disclose concentration, avoid baby market',
            '"Natural" surfactant — provide botanical source documentation',
          ],
    },
  }

  return CATEGORY_SLUGS.map((slug) => {
    const data = categoryData[slug]
    return {
      categorySlug: slug,
      categoryName: getCategoryName(slug),
      specificRestrictions: data.specificRestrictions ?? [],
      documentationRequired: data.documentationRequired ?? [],
      examples: data.examples ?? [],
    }
  })
}

function getCategoryName(slug: string): string {
  const names: Record<string, string> = {
    actives: 'Active / Treatment',
    corticosteroid: 'Corticosteroid / Hormone',
    'hair_coloring': 'Hair Coloring / Dye',
    other: 'Other / Multi-use',
    preservative: 'Preservative / Antimicrobial',
    'skin_lightening': 'Skin Lightening / Whitening',
    surfactant: 'Surfactant / Emulsifier',
  }
  return names[slug] ?? slug
}

// ── Platform Data ──
export const platformGuides: PlatformGuide[] = [
  {
    slug: 'amazon',
    name: 'Amazon',
    website: 'https://sellercentral.amazon.com',
    description:
      'Amazon is the largest global e-commerce platform with dedicated marketplaces in Brazil (amazon.com.br) and Mexico (amazon.com.mx). Cosmetic sellers must comply with both platform policies and local regulatory requirements.',
    countries: [
      {
        country: 'brazil',
        countryName: 'Brazil',
        marketplaceUrl: 'amazon.com.br',
        overview:
          'Amazon Brazil requires all cosmetic products to have ANVISA registration (Cadastro or Registro depending on risk class). Sellers must display the ANVISA registration number on product listings. Products classified as medical devices or with medical claims are prohibited.',
        cosmeticsPolicy: {
          allowed: true,
          restrictions: [
            'All cosmetics must have valid ANVISA registration',
            'Medical claims (e.g., "treats acne", "cures dermatitis") are prohibited',
            'Products with SPF claims require ANVISA Registro (not Cadastro)',
            'Ingredients on the ANVISA banned list are strictly prohibited',
          ],
          prohibitedCategories: [
            'Unregistered cosmetics',
            'Products with medical device classification without registration',
            'Cosmetics containing ANVISA-banned ingredients',
            'Products with unsubstantiated SPF or UVA protection claims',
          ],
          registrationRequired: true,
          documentsNeeded: [
            'ANVISA registration number (Cadastro or Registro)',
            'PTR (Responsável Técnico) certificate',
            'Product label in Portuguese',
            'Safety assessment report',
          ],
        },
        sellerRequirements: {
          accountType: 'Professional Seller Account recommended',
          taxIdRequired: true,
          localEntityRequired: false,
          responsibleTechnicianRequired: true,
        },
        listingRequirements: [
          'Product title must include brand + product name + key attributes',
          'Full INCI ingredient list in Portuguese',
          'ANVISA registration number visible on product packaging and listing',
          'Product images must show actual packaging with Portuguese label',
          'Usage instructions and warnings in Portuguese',
          'SPF/UVA claims must reference ANVISA-approved test methods',
        ],
        commonViolations: [
          'Selling cosmetics without ANVISA registration',
          'Making medical or therapeutic claims in product descriptions',
          'Using before/after photos that imply medical treatment results',
          'Listing products with banned ingredients (e.g., hydroquinone, mercury)',
          'Inaccurate or missing ingredient lists',
          'SPF claims without ANVISA Registro',
        ],
        complianceChecklist: [
          'Verify ANVISA registration is current and matches the product exactly',
          'Ensure PTR (Responsável Técnico) is designated and documented',
          'Translate all labels, warnings, and instructions to Portuguese',
          'Review product title and description for prohibited medical claims',
          'Verify ingredient list against latest ANVISA banned/restricted lists',
          'Include ANVISA registration number in product images and listing',
          'Ensure SPF/UVA claims are supported by ANVISA-approved testing',
          'Set up proper tax documentation (CNPJ for Brazilian entities, or tax representation for foreign sellers)',
        ],
        categoryGuides: buildCategoryGuides('amazon', 'brazil'),
        faq: [
          {
            question: 'Do I need a Brazilian company to sell cosmetics on Amazon Brazil?',
            answer:
              'No, foreign sellers can sell on Amazon Brazil, but you need a local tax representative and CNPJ (Brazilian tax ID) registration. Alternatively, you can partner with a local distributor who handles compliance.',
          },
          {
            question: 'What is PTR and do I need it?',
            answer:
              'PTR stands for Responsável Técnico (Technical Responsible). It is a legally required designation in Brazil for cosmetic companies — a pharmacist, chemist, or similar professional who takes legal responsibility for product safety. Amazon requires PTR documentation for cosmetic sellers.',
          },
          {
            question: 'How long does ANVISA registration take?',
            answer:
              'Cadastro (simplified registration for low-risk products) typically takes 30-90 days. Registro (full registration for higher-risk products like sunscreen) can take 6-12 months. Plan your market entry accordingly.',
          },
          {
            question: 'Can I sell sunscreen on Amazon Brazil?',
            answer:
              'Yes, but sunscreen requires ANVISA Registro (not Cadastro), which is more complex and time-consuming. You also need SPF and UVA testing according to ANVISA-approved methods (ISO 24444 and ISO 24443).',
          },
          {
            question: 'What happens if my product is flagged for a compliance violation?',
            answer:
              'Amazon Brazil will typically suspend the listing and request documentation. Repeated violations can lead to account suspension. It is critical to proactively ensure all products have proper ANVISA registration before listing.',
          },
          {
            question: 'Are organic or natural cosmetics treated differently?',
            answer:
              'Natural and organic cosmetics still require ANVISA registration. If you make organic claims, you should have certification from a recognized body (e.g., IBD, Ecocert, USDA Organic) to substantiate those claims.',
          },
        ],
        relatedRegulations: ['/regulation/brazil', '/compliance/brazil-anvisa'],
      },
      {
        country: 'mexico',
        countryName: 'Mexico',
        marketplaceUrl: 'amazon.com.mx',
        overview:
          'Amazon Mexico requires all cosmetic products to have COFEPRIS sanitary registration (Registro Sanitario). Products must comply with NOM-141 labeling standards and other applicable Mexican regulations. Foreign sellers need a Mexican legal representative.',
        cosmeticsPolicy: {
          allowed: true,
          restrictions: [
            'All cosmetics must have COFEPRIS Registro Sanitario',
            'Medical claims are prohibited for cosmetic products',
            'Products must comply with NOM-141 labeling requirements',
            'Ingredients on COFEPRIS prohibited lists are not allowed',
          ],
          prohibitedCategories: [
            'Unregistered cosmetics',
            'Products with medical device classification without COFEPRIS approval',
            'Cosmetics with COFEPRIS-prohibited ingredients',
            'Products with unsubstantiated therapeutic claims',
          ],
          registrationRequired: true,
          documentsNeeded: [
            'COFEPRIS Registro Sanitario number',
            'NOM-141 compliance certificate',
            'Product label in Spanish',
            'Safety and efficacy documentation',
          ],
        },
        sellerRequirements: {
          accountType: 'Professional Seller Account',
          taxIdRequired: true,
          localEntityRequired: false,
          responsibleTechnicianRequired: false,
        },
        listingRequirements: [
          'Product title in Spanish with brand and key attributes',
          'Full ingredient list (INCI) in Spanish',
          'COFEPRIS registration number on packaging and listing',
          'Product images showing actual Spanish-labeled packaging',
          'Usage instructions, warnings, and precautions in Spanish',
          'Net content declaration in metric units (ml, g)',
        ],
        commonViolations: [
          'Selling cosmetics without COFEPRIS registration',
          'Medical or therapeutic claims in listings',
          'Products with banned ingredients (e.g., hydroquinone, mercury compounds)',
          'Incomplete or inaccurate ingredient lists',
          'Missing Spanish-language labels or instructions',
          'Unsubstantiated "natural" or "organic" claims',
        ],
        complianceChecklist: [
          'Verify COFEPRIS Registro Sanitario is valid and product-specific',
          'Ensure product label fully complies with NOM-141 (Spanish, net content, batch, manufacturer)',
          'Translate all product information to Spanish',
          'Review listings for prohibited medical claims',
          'Cross-check ingredients against COFEPRIS prohibited and restricted lists',
          'Include COFEPRIS registration number in product images and listing text',
          'Set up Mexican tax representation (RFC registration)',
          'Ensure proper customs documentation for imports',
        ],
        categoryGuides: buildCategoryGuides('amazon', 'mexico'),
        faq: [
          {
            question: 'Do I need a Mexican company to sell on Amazon Mexico?',
            answer:
              'No, foreign sellers can register on Amazon Mexico, but you need a Mexican legal representative and RFC (tax ID). Many foreign brands partner with a local importer/distributor who handles COFEPRIS registration and compliance.',
          },
          {
            question: 'How long does COFEPRIS registration take?',
            answer:
              'COFEPRIS Registro Sanitario typically takes 3-6 months for cosmetics. The timeline depends on product complexity and completeness of documentation. Working with an experienced local regulatory consultant can expedite the process.',
          },
          {
            question: 'What is NOM-141 and why does it matter?',
            answer:
              'NOM-141 is the Mexican official standard for cosmetic labeling. It mandates what information must appear on cosmetic labels, including ingredients in Spanish, manufacturer data, batch numbers, and warnings. Non-compliance can result in product detention at customs or delisting.',
          },
          {
            question: 'Can I use my US or EU product labels in Mexico?',
            answer:
              'No. Mexico requires Spanish-language labels with specific formatting per NOM-141. You need to create Mexico-specific packaging or apply compliant Spanish labels to your existing packaging.',
          },
          {
            question: 'Are there restrictions on advertising cosmetics in Mexico?',
            answer:
              'Yes. Mexico has strict rules against medical claims in cosmetic advertising. Claims like "treats", "cures", "heals", or "prevents" are prohibited. All claims must be cosmetic in nature (e.g., "moisturizes", "cleanses", "enhances appearance").',
          },
          {
            question: 'What import duties apply to cosmetics entering Mexico?',
            answer:
              'Cosmetics imported into Mexico are subject to customs duties (typically 0-20% depending on HS code), VAT (16%), and customs processing fees. Work with a customs broker to classify your products correctly and minimize costs.',
          },
        ],
        relatedRegulations: ['/regulation/mexico', '/compliance/mexico-cofepris'],
      },
    ],
  },
  {
    slug: 'mercado-livre',
    name: 'Mercado Livre',
    website: 'https://www.mercadolivre.com.br',
    description:
      'Mercado Livre (Mercado Libre in Spanish-speaking countries) is the largest e-commerce platform in Latin America. In Brazil (mercadolivre.com.br) and Mexico (mercadolibre.com.mx), it dominates online retail and has strict policies for cosmetic products.',
    countries: [
      {
        country: 'brazil',
        countryName: 'Brazil',
        marketplaceUrl: 'mercadolivre.com.br',
        overview:
          'Mercado Livre Brazil is the dominant e-commerce platform in Brazil. Cosmetics must have ANVISA registration, and the platform actively monitors for prohibited products. Sunscreen and products with medical claims face additional scrutiny.',
        cosmeticsPolicy: {
          allowed: true,
          restrictions: [
            'ANVISA registration required for all cosmetics',
            'Sunscreen products require ANVISA Registro (not Cadastro)',
            'Medical claims strictly prohibited',
            'Counterfeit or unauthorized branded products are banned',
          ],
          prohibitedCategories: [
            'Unregistered or counterfeit cosmetics',
            'Products with medical device claims',
            'Cosmetics containing ANVISA-prohibited ingredients',
            'Products claiming to treat diseases or medical conditions',
          ],
          registrationRequired: true,
          documentsNeeded: [
            'ANVISA registration number',
            'Product label in Portuguese',
            'PTR documentation (recommended)',
            'Proof of authenticity for branded products',
          ],
        },
        sellerRequirements: {
          accountType: 'Mercado Livre Seller Account',
          taxIdRequired: true,
          localEntityRequired: false,
          responsibleTechnicianRequired: true,
        },
        listingRequirements: [
          'Clear product title in Portuguese',
          'High-quality images showing Portuguese-labeled packaging',
          'Complete INCI ingredient list',
          'ANVISA registration number visible',
          'Accurate product description without medical claims',
          'Correct categorization in Mercado Livre category tree',
        ],
        commonViolations: [
          'Listing unregistered cosmetics',
          'Using brand names without authorization',
          'Making medical or therapeutic claims',
          'Selling products with banned ingredients',
          'Incorrect categorization (e.g., cosmetic listed as medical device)',
          'Counterfeit or replica products',
        ],
        complianceChecklist: [
          'Confirm ANVISA registration is valid and matches the product',
          'Designate a PTR (Responsável Técnico) for your cosmetic line',
          'Translate all labels and documentation to Portuguese',
          'Ensure product images clearly show ANVISA registration on packaging',
          'Verify no banned ingredients are present',
          'Review all product descriptions for prohibited medical claims',
          'Set up Mercado Envios (fulfillment) or arrange compliant shipping',
          'Register for Brazilian tax obligations (ICMS, IPI as applicable)',
        ],
        categoryGuides: buildCategoryGuides('mercado-livre', 'brazil'),
        faq: [
          {
            question: 'Is Mercado Livre the best platform for cosmetics in Brazil?',
            answer:
              'Mercado Livre is the largest e-commerce platform in Brazil by volume, making it a top choice for cosmetic brands. However, competition is fierce, and compliance requirements are strictly enforced. Many brands succeed by combining Mercado Livre with their own D2C website.',
          },
          {
            question: 'Does Mercado Livre require PTR like Amazon?',
            answer:
              'Yes, Mercado Livre expects cosmetic sellers to have PTR documentation, especially for higher-risk products. While enforcement may vary, having proper PTR designation is essential for legal compliance and account protection.',
          },
          {
            question: 'Can I sell imported cosmetics on Mercado Livre?',
            answer:
              'Yes, imported cosmetics are allowed if they have proper ANVISA registration and import documentation. You need to handle customs clearance and ensure products meet Brazilian labeling requirements before listing.',
          },
          {
            question: 'What is Mercado Envios and do I need it?',
            answer:
              'Mercado Envios is Mercado Livre\'s fulfillment and shipping program. While optional, using it improves delivery times and customer satisfaction. For cosmetics, ensure temperature-sensitive products are shipped appropriately.',
          },
          {
            question: 'How does Mercado Livre handle counterfeit complaints?',
            answer:
              'Mercado Livre has a strict anti-counterfeit policy. If a brand owner files a complaint, the listing is removed immediately, and repeat violations can lead to permanent account suspension. Always sell authentic products with proper authorization.',
          },
          {
            question: 'Are there special requirements for promotional campaigns?',
            answer:
              'Yes. Mercado Livre frequently runs promotional events (e.g., Black Friday, Mega Descontos). Products in promotions must still comply with all ANVISA requirements, and discounted medical devices or unregistered products are not allowed.',
          },
        ],
        relatedRegulations: ['/regulation/brazil', '/compliance/brazil-anvisa'],
      },
      {
        country: 'mexico',
        countryName: 'Mexico',
        marketplaceUrl: 'mercadolibre.com.mx',
        overview:
          'Mercado Libre Mexico is the leading e-commerce platform in Mexico. Cosmetics require COFEPRIS registration, and the platform enforces policies against medical claims and counterfeit products. Foreign sellers need a Mexican legal representative.',
        cosmeticsPolicy: {
          allowed: true,
          restrictions: [
            'COFEPRIS Registro Sanitario required for all cosmetics',
            'Medical claims are strictly prohibited',
            'Counterfeit products result in immediate account suspension',
            'Products must comply with NOM-141 labeling standards',
          ],
          prohibitedCategories: [
            'Unregistered cosmetics',
            'Counterfeit or unauthorized branded products',
            'Products with medical or therapeutic claims',
            'Cosmetics containing COFEPRIS-prohibited ingredients',
          ],
          registrationRequired: true,
          documentsNeeded: [
            'COFEPRIS Registro Sanitario',
            'NOM-141 compliant label in Spanish',
            'Safety documentation',
            'Brand authorization letter (for official distributors)',
          ],
        },
        sellerRequirements: {
          accountType: 'Mercado Libre Seller Account',
          taxIdRequired: true,
          localEntityRequired: false,
          responsibleTechnicianRequired: false,
        },
        listingRequirements: [
          'Product title and description in Spanish',
          'Images showing Spanish-labeled packaging',
          'Complete ingredient list (INCI) in Spanish',
          'COFEPRIS registration number visible',
          'Accurate categorization in Mercado Libre category tree',
          'Net content and manufacturer information per NOM-141',
        ],
        commonViolations: [
          'Selling without COFEPRIS registration',
          'Unauthorized use of brand trademarks',
          'Medical claims in product descriptions',
          'Products with prohibited ingredients',
          'Incorrect product categorization',
          'Selling expired or damaged products',
        ],
        complianceChecklist: [
          'Obtain valid COFEPRIS Registro Sanitario for each product',
          'Create NOM-141 compliant Spanish labels',
          'Verify all ingredients are COFEPRIS-approved',
          'Review listings for prohibited medical claims',
          'Ensure product images show compliant packaging',
          'Set up Mexican tax representation (RFC)',
          'Arrange proper import and customs documentation',
          'Monitor for counterfeit listings of your brand',
        ],
        categoryGuides: buildCategoryGuides('mercado-livre', 'mexico'),
        faq: [
          {
            question: 'Is Mercado Libre the largest marketplace in Mexico?',
            answer:
              'Yes, Mercado Libre dominates Mexican e-commerce with the largest seller and buyer base. For cosmetic brands targeting Mexico, it is often the first platform to consider alongside Amazon Mexico.',
          },
          {
            question: 'Can foreign brands sell directly on Mercado Libre Mexico?',
            answer:
              'Yes, but you need a Mexican legal representative and RFC (tax ID). Many foreign brands partner with a local distributor or use Mercado Libre\'s cross-border program if available for your product category.',
          },
          {
            question: 'How does Mercado Libre handle product authenticity?',
            answer:
              'Mercado Libre has a "Mercado Libre Authentic" program and takes counterfeit reports seriously. Brand owners can report infringing listings, and verified authentic sellers receive badges that improve buyer trust.',
          },
          {
            question: 'What are Mercado Libre\'s shipping requirements?',
            answer:
              'Mercado Libre offers Mercado Envíos (fulfillment by Mercado Libre) which is recommended for faster delivery. Alternatively, sellers can use approved carriers. Cosmetics must be packaged securely to prevent leakage or damage.',
          },
          {
            question: 'Are there advertising restrictions for cosmetics on Mercado Libre?',
            answer:
              'Yes. Like all Mexican platforms, Mercado Libre prohibits medical claims in cosmetic listings. Promoted listings (paid ads) must also comply with these rules, and non-compliant ads will be rejected.',
          },
          {
            question: 'What fees does Mercado Libre charge sellers?',
            answer:
              'Mercado Libre charges a sales commission (typically 10-20% depending on category), plus shipping fees if using Mercado Envíos. There may also be listing fees for certain categories or promotional placements.',
          },
        ],
        relatedRegulations: ['/regulation/mexico', '/compliance/mexico-cofepris'],
      },
    ],
  },
  {
    slug: 'shopee',
    name: 'Shopee',
    website: 'https://shopee.com.br',
    description:
      'Shopee is a fast-growing mobile-first e-commerce platform in Southeast Asia and Latin America. In Brazil (shopee.com.br) and Mexico (shopee.com.mx), Shopee is expanding rapidly and attracting cross-border sellers.',
    countries: [
      {
        country: 'brazil',
        countryName: 'Brazil',
        marketplaceUrl: 'shopee.com.br',
        overview:
          'Shopee Brazil has become a major e-commerce player, particularly for cross-border sellers from Asia. Cosmetics require ANVISA registration, and Shopee\'s policies increasingly align with local regulatory requirements. Overseas sellers must provide comprehensive product documentation.',
        cosmeticsPolicy: {
          allowed: true,
          restrictions: [
            'ANVISA registration required for all cosmetics sold in Brazil',
            'Cross-border sellers must provide complete certification documents',
            'Medical claims are prohibited',
            'Product must match description and images exactly',
          ],
          prohibitedCategories: [
            'Unregistered cosmetics',
            'Products with medical or therapeutic claims',
            'Counterfeit or imitation branded products',
            'Cosmetics with ANVISA-banned ingredients',
            'Products that do not match listing description',
          ],
          registrationRequired: true,
          documentsNeeded: [
            'ANVISA registration certificate',
            'Product label in Portuguese',
            'Import documentation (for cross-border sellers)',
            'Safety assessment report',
          ],
        },
        sellerRequirements: {
          accountType: 'Shopee Seller Account (Individual or Corporate)',
          taxIdRequired: true,
          localEntityRequired: false,
          responsibleTechnicianRequired: true,
        },
        listingRequirements: [
          'Product title in Portuguese with accurate description',
          'Clear images showing actual product and Portuguese labeling',
          'Complete ingredient list in Portuguese',
          'ANVISA registration number included where applicable',
          'Accurate product specifications and usage instructions',
          'Warning statements in Portuguese for restricted ingredients',
        ],
        commonViolations: [
          'Selling products without ANVISA registration',
          'Product does not match listing (wrong ingredients, counterfeit)',
          'Medical or therapeutic claims in descriptions',
          'Missing or inaccurate ingredient information',
          'Breach of Shopee\'s prohibited items policy',
          'Poor packaging leading to damaged products in transit',
        ],
        complianceChecklist: [
          'Verify ANVISA registration for every cosmetic product',
          'Ensure Portuguese labels meet ANVISA requirements',
          'Provide complete and accurate ingredient lists',
          'Review all listings for prohibited medical claims',
          'Use secure packaging suitable for cosmetics (leak-proof, breakage-resistant)',
          'Set up proper tax documentation for Brazilian sales',
          'Monitor customer feedback for compliance-related complaints',
          'Stay updated on Shopee Brazil\'s evolving seller policies',
        ],
        categoryGuides: buildCategoryGuides('shopee', 'brazil'),
        faq: [
          {
            question: 'Is Shopee a good platform for cosmetics in Brazil?',
            answer:
              'Shopee Brazil has grown rapidly and offers strong cross-border capabilities, making it attractive for international cosmetic brands. However, compliance requirements are increasingly enforced, so proper ANVISA registration is essential.',
          },
          {
            question: 'Can I ship cosmetics directly from abroad to Brazilian customers via Shopee?',
            answer:
              'Shopee supports cross-border shipping, but cosmetics entering Brazil must clear customs and comply with ANVISA requirements. Many sellers use Shopee\'s fulfillment centers or partner with local importers to streamline the process.',
          },
          {
            question: 'Does Shopee Brazil require PTR?',
            answer:
              'While Shopee\'s initial seller onboarding may not always require PTR documentation, Brazilian law mandates PTR for cosmetic companies. Having proper PTR designation protects your business and ensures legal compliance.',
          },
          {
            question: 'How does Shopee handle returns for cosmetics?',
            answer:
              'Shopee has a buyer protection policy that allows returns for damaged, counterfeit, or misrepresented products. Cosmetics sellers should have clear return policies and ensure products are well-packaged to minimize damage claims.',
          },
          {
            question: 'What are Shopee Coins and how do they affect cosmetic sellers?',
            answer:
              'Shopee Coins are the platform\'s loyalty rewards currency. Sellers can participate in coin rebate promotions to boost visibility. Ensure promotional pricing still maintains profit margins after platform fees and coin rebates.',
          },
          {
            question: 'Are there category-specific restrictions on Shopee Brazil?',
            answer:
              'Yes. High-risk categories like sunscreen, skin lightening, and products with active pharmaceutical ingredients face additional scrutiny. These products require proper ANVISA Registro and may need pre-approval from Shopee before listing.',
          },
        ],
        relatedRegulations: ['/regulation/brazil', '/compliance/brazil-anvisa'],
      },
      {
        country: 'mexico',
        countryName: 'Mexico',
        marketplaceUrl: 'shopee.com.mx',
        overview:
          'Shopee Mexico is a newer but fast-growing marketplace. Cosmetics require COFEPRIS registration, and the platform is building its seller compliance framework. Cross-border sellers should ensure all Mexican regulatory requirements are met before listing.',
        cosmeticsPolicy: {
          allowed: true,
          restrictions: [
            'COFEPRIS registration required for all cosmetics',
            'Cross-border sellers must provide full regulatory documentation',
            'Products must have Spanish labels per NOM-141',
            'Medical claims are prohibited',
          ],
          prohibitedCategories: [
            'Unregistered cosmetics',
            'Products with medical or therapeutic claims',
            'Counterfeit products',
            'Cosmetics with COFEPRIS-banned ingredients',
            'Products not matching listing description',
          ],
          registrationRequired: true,
          documentsNeeded: [
            'COFEPRIS Registro Sanitario',
            'NOM-141 compliant Spanish label',
            'Import permit (for cross-border sellers)',
            'Product safety documentation',
          ],
        },
        sellerRequirements: {
          accountType: 'Shopee Seller Account',
          taxIdRequired: true,
          localEntityRequired: false,
          responsibleTechnicianRequired: false,
        },
        listingRequirements: [
          'Product title and description in Spanish',
          'Images showing Spanish-labeled packaging',
          'Complete ingredient list (INCI) in Spanish',
          'COFEPRIS registration number visible',
          'Usage instructions and warnings in Spanish',
          'Accurate product weight/volume in metric units',
        ],
        commonViolations: [
          'Selling without COFEPRIS registration',
          'Product mismatch (wrong ingredients, counterfeit)',
          'Medical claims in listings',
          'Missing Spanish labels or instructions',
          'Non-compliant packaging for cosmetics',
          'Failure to respond to buyer complaints promptly',
        ],
        complianceChecklist: [
          'Obtain COFEPRIS Registro Sanitario before listing',
          'Create NOM-141 compliant Spanish product labels',
          'Verify all ingredients against COFEPRIS approved lists',
          'Review listings for prohibited medical claims',
          'Ensure product images show compliant packaging',
          'Set up Mexican tax documentation (RFC)',
          'Use appropriate packaging for cosmetics shipping',
          'Monitor Shopee Mexico policy updates regularly',
        ],
        categoryGuides: buildCategoryGuides('shopee', 'mexico'),
        faq: [
          {
            question: 'Is Shopee Mexico a viable platform for cosmetic brands?',
            answer:
              'Shopee Mexico is growing quickly and offers opportunities for early movers. The platform\'s mobile-first approach appeals to younger demographics. However, infrastructure and fulfillment options are still developing compared to Amazon or Mercado Libre.',
          },
          {
            question: 'What shipping options does Shopee Mexico offer?',
            answer:
              'Shopee Mexico offers Shopee Logistics (integrated shipping) and supports third-party carriers. Cross-border sellers can use Shopee\'s international shipping program or partner with local fulfillment providers.',
          },
          {
            question: 'Do I need a Mexican business entity to sell on Shopee Mexico?',
            answer:
              'No, foreign sellers can register, but you need a Mexican legal representative and RFC (tax ID) for tax compliance. Alternatively, partnering with a local distributor who handles COFEPRIS and tax obligations is a common approach.',
          },
          {
            question: 'How competitive is Shopee Mexico for cosmetics?',
            answer:
              'Shopee Mexico is less saturated than Amazon or Mercado Libre, offering lower competition for cosmetic brands. However, buyer trust is still building, so investing in reviews, ratings, and promotions is important for early growth.',
          },
          {
            question: 'What promotional tools does Shopee Mexico offer?',
            answer:
              'Shopee offers flash sales, discount vouchers, free shipping promotions, and Shopee Live (livestream shopping). Cosmetics perform well in livestream formats where product demonstrations can be shown.',
          },
          {
            question: 'Are there specific packaging requirements for cosmetics on Shopee?',
            answer:
              'Shopee requires secure packaging to prevent damage during transit. For cosmetics, this means leak-proof sealing, bubble wrap for glass containers, and sturdy outer boxes. Poor packaging leads to returns and negative reviews.',
          },
        ],
        relatedRegulations: ['/regulation/mexico', '/compliance/mexico-cofepris'],
      },
    ],
  },
]

// ── Helper functions ──
export function getAllPlatformSlugs(): string[] {
  return platformGuides.map((p) => p.slug)
}

export function getPlatformGuide(slug: string): PlatformGuide | undefined {
  return platformGuides.find((p) => p.slug === slug)
}

export function getPlatformCountryGuide(
  platformSlug: string,
  country: 'brazil' | 'mexico'
): PlatformCountryGuide | undefined {
  const platform = getPlatformGuide(platformSlug)
  return platform?.countries.find((c) => c.country === country)
}

export function getAllCountriesForPlatform(platformSlug: string): string[] {
  const platform = getPlatformGuide(platformSlug)
  return platform?.countries.map((c) => c.country) ?? []
}

export function getAllPlatformCountryCombinations(): { platform: string; country: string }[] {
  return platformGuides.flatMap((p) =>
    p.countries.map((c) => ({ platform: p.slug, country: c.country }))
  )
}

export function getCategoryGuideForPlatformCountry(
  platformSlug: string,
  country: 'brazil' | 'mexico',
  categorySlug: string
): PlatformCategoryGuide | undefined {
  const pcg = getPlatformCountryGuide(platformSlug, country)
  return pcg?.categoryGuides.find((cg) => cg.categorySlug === categorySlug)
}
