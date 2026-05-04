import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Shield, Globe, Zap } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'CosmetCheck Brasil - Verificação de Conformidade ANVISA para Cosméticos',
  description: 'Ferramenta gratuita para verificar a conformidade de cosméticos com a ANVISA. Detecte ingredientes proibidos, palavras proibidas em rótulos e gere listagens em português compatíveis.',
  keywords: 'ANVISA, conformidade cosméticos Brasil, regulamentação cosméticos ANVISA, ingredientes proibidos ANVISA, rótulo cosmético Brasil, vender cosméticos Brasil',
  openGraph: {
    title: 'CosmetCheck Brasil - Conformidade ANVISA em 1 clique',
    description: 'Verifique se seus cosméticos estão em conformidade com a ANVISA antes de vender no Brasil',
    locale: 'pt_BR',
  },
}

export default function BrasilPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
              <span className="mr-2">🇧🇷</span>
              Especialista em Conformidade ANVISA
            </div>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
              Venda cosméticos no Brasil<br className="hidden md:block" />
              sem ser retirado do ar
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90 md:text-xl">
              Verifique a conformidade com a ANVISA em segundos. Detecte ingredientes proibidos, palavras proibidas em rótulos e gere listagens em português — grátis para começar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/?country=BR">
                <Button className="bg-white text-[#7c3aed] hover:bg-white/90 font-semibold h-12 px-8">
                  Verificar meu produto
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12 px-8">
                  Ver preços
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Por que ANVISA é rigorosa */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">
              Por que a conformidade ANVISA importa
            </h2>
            <p className="text-lg text-gray-600">
              A ANVISA (Agência Nacional de Vigilância Sanitária) regula rigorosamente cosméticos no Brasil. Uma infração pode resultar em multas de até R$ 10.000+ e suspensão da venda.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ingredientes proibidos</h3>
                <p className="text-gray-600">
                  A ANVISA mantém uma lista atualizada de substâncias proibidas em cosméticos. Nosso motor detecta automaticamente qualquer ingrediente não permitido na sua fórmula.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Palavras proibidas em rótulos</h3>
                <p className="text-gray-600">
                  Termos como &quot;tratamento&quot;, &quot;cura&quot; e &quot;medicinal&quot; são estritamente proibidos em rótulos de cosméticos. Nossa IA identifica e sugere alternativas compatíveis.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Listagem em português</h3>
                <p className="text-gray-600">
                  Gere títulos, descrições e bullets em português brasileiro que respeitam as normas da ANVISA e convertem clientes no Mercado Livre e Amazon Brasil.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Regulamentações chave */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-8 text-center">
              Principais regulamentações ANVISA
            </h2>
            <div className="space-y-4">
              {[
                { title: 'RDC 15/2013', desc: 'Lista de substâncias proibidas e restritas em produtos de higiene pessoal, cosméticos e perfumes.' },
                { title: 'RDC 30/2010', desc: 'Regulamento técnico para produtos de higiene pessoal, cosméticos e perfumes.' },
                { title: 'RDC 7/2015', desc: 'Requisitos para registro e notificação de produtos de higiene pessoal, cosméticos e perfumes.' },
                { title: 'IN 26/2022', desc: 'Instrução normativa sobre rotulagem de produtos de higiene pessoal, cosméticos e perfumes.' },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-[#7c3aed] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 mt-1">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold md:text-4xl mb-4">
            Comece a vender com segurança
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
            Milhares de vendedores já usam o CosmetCheck para evitar multas da ANVISA. Verifique seu produto gratuitamente agora.
          </p>
          <Link href="/?country=BR">
            <Button className="bg-white text-[#7c3aed] hover:bg-white/90 font-semibold h-12 px-8">
              Verificar conformidade ANVISA
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
