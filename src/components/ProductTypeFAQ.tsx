import type { ProductTypeData } from '@/data/product-types'

interface ProductTypeFAQProps {
  data: ProductTypeData
  country: 'brazil' | 'mexico'
}

export default function ProductTypeFAQ({ data, country }: ProductTypeFAQProps) {
  const compliance = data.complianceByCountry[country]
  const countryName = country === 'brazil' ? 'Brazil' : 'Mexico'
  const agencyName = compliance.regulator
  const productName = data.names.en

  const faqs = [
    {
      question: `Do I need to register ${productName.toLowerCase()} in ${countryName}?`,
      answer: compliance.registrationRequired
        ? `Yes, ${productName.toLowerCase()} products require ${compliance.registrationType} registration with ${agencyName} before they can be legally marketed in ${countryName}. This is governed by ${compliance.regulationName}.`
        : `No, ${productName.toLowerCase()} products currently do not require registration with ${agencyName} under ${compliance.regulationName}. However, they must still comply with all applicable safety and labeling requirements.`,
    },
    {
      question: `What testing is required for ${productName.toLowerCase()} in ${countryName}?`,
      answer:
        compliance.testingRequirements.length > 0
          ? `The following tests are typically required: ${compliance.testingRequirements.join(', ')}. Specific requirements may vary based on product formulation and claims.`
          : `Testing requirements for ${productName.toLowerCase()} in ${countryName} vary by formulation. Contact ${agencyName} or a local regulatory consultant for product-specific requirements.`,
    },
    {
      question: `Which ingredients are commonly restricted in ${productName.toLowerCase()} for ${countryName}?`,
      answer:
        data.commonRestrictedIngredients.length > 0
          ? `Common restricted ingredients for this product category include: ${data.commonRestrictedIngredients.join(', ')}. Always verify the current regulatory status of each ingredient before formulating your product.`
          : `Ingredient restrictions for ${productName.toLowerCase()} in ${countryName} are governed by the positive and negative lists under ${compliance.regulationName}. Review the complete regulatory text for specific limitations.`,
    },
    {
      question: `How long does ${compliance.registrationType} registration take in ${countryName}?`,
      answer: `Registration timelines in ${countryName} vary depending on the registration type and application completeness. ${compliance.registrationType} applications typically require several months for review. Working with a local regulatory representative can help expedite the process and ensure all documentation is correct.`,
    },
    {
      question: `What are the key labeling requirements for ${productName.toLowerCase()} in ${countryName}?`,
      answer:
        data.labelRequirements.en.length > 0
          ? `Key labeling requirements include: ${data.labelRequirements.en.join('; ')}. Labels must be in Portuguese for Brazil and Spanish for Mexico if sold domestically.`
          : `Labeling requirements for ${productName.toLowerCase()} in ${countryName} follow the general cosmetic labeling rules under ${compliance.regulationName}. All labels must include ingredient lists (INCI), manufacturer information, and applicable warnings.`,
    },
    {
      question: `Can I import ${productName.toLowerCase()} into ${countryName} without local registration?`,
      answer: `No. All cosmetic products intended for commercial sale in ${countryName} must have the appropriate ${compliance.registrationType} with ${agencyName} before importation. Importing unregistered cosmetics can result in customs seizure, fines, and denial of market access.`,
    },
  ]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="bg-[#1A1A24] border border-[#252530] rounded-2xl p-6 sm:p-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <h2 className="text-xl font-semibold font-heading mb-6 text-white/90">
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-[#252530] last:border-0 pb-6 last:pb-0">
            <h3 className="text-sm font-semibold text-white/80 mb-2">{faq.question}</h3>
            <p className="text-sm text-white/60 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
