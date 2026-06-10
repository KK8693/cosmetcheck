import type { ProductTypeData } from '@/data/product-types'
import { Shield, ClipboardCheck, FlaskConical, FileText } from 'lucide-react'

interface ProductComplianceCardProps {
  data: ProductTypeData
  country: 'brazil' | 'mexico'
}

export default function ProductComplianceCard({ data, country }: ProductComplianceCardProps) {
  const compliance = data.complianceByCountry[country]
  const isBrazil = country === 'brazil'
  const countryFlag = isBrazil ? '🇧🇷' : '🇲🇽'
  const countryName = isBrazil ? 'Brazil' : 'Mexico'
  const agencyName = isBrazil ? 'ANVISA' : 'COFEPRIS'

  return (
    <div className="bg-[#1A1A24] border border-[#252530] rounded-2xl overflow-hidden">
      <div className="px-6 sm:px-8 py-6 border-b border-[#252530]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white/90">
              {countryFlag} {countryName} — {agencyName}
            </h2>
            <p className="text-sm text-white/40">
              Regulatory framework for {data.names.en}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-5">
        {/* Regulation */}
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-[#1E6BB8] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-white/40 mb-1">Key Regulation</p>
            <p className="text-sm text-white/80 font-mono">{compliance.regulationName}</p>
          </div>
        </div>

        {/* Registration Required */}
        <div className="flex items-start gap-3">
          <ClipboardCheck className="w-5 h-5 text-[#1E6BB8] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-white/40 mb-1">Registration Required</p>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                  compliance.registrationRequired
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}
              >
                {compliance.registrationRequired ? 'Yes' : 'No'}
              </span>
              {compliance.registrationRequired && (
                <span className="text-sm text-white/60">
                  Type: <span className="text-white/80 font-medium">{compliance.registrationType}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Testing Requirements */}
        <div className="flex items-start gap-3">
          <FlaskConical className="w-5 h-5 text-[#1E6BB8] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-white/40 mb-2">Testing Requirements</p>
            <ul className="space-y-1.5">
              {compliance.testingRequirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E6BB8] mt-1.5 shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Notes */}
        {compliance.notes && (
          <div className="pt-4 border-t border-[#252530]">
            <p className="text-sm text-white/50 leading-relaxed">
              <span className="text-white/40 font-medium">Note:</span>{' '}
              {compliance.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
