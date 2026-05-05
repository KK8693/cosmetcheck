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

const cases = [
  {
    tag: '❌ 禁用成分',
    tagColor: 'text-red-300',
    body: '“某美白霜含 Hydroquinone 2%，被 ANVISA 直接标红”',
    result: '→ 修改配方后 48h 重新上架',
  },
  {
    tag: '⚠️ 标签违规',
    tagColor: 'text-amber-300',
    body: '“防晒产品未标注 SPF 值，海关扣留”',
    result: '→ AI 生成合规标签，0 罚款通关',
  },
  {
    tag: '📝 文案误触',
    tagColor: 'text-blue-300',
    body: '“抗皱文案写“trata”，Listing 被下架 7 天”',
    result: '→ 替换后 CTR 提升 23%',
  },
]

const faqs = [
  {
    q: 'O que é a ANVISA e por que ela importa para cosméticos?',
    a: 'A ANVISA (Agência Nacional de Vigilância Sanitária) é o órgão regulador brasileiro para produtos de saúde. Para cosméticos, ela define quais ingredientes são permitidos, concentrações máximas e regras de rotulagem. Infrações podem resultar em multas de até R$ 10.000+ e suspensão da venda.',
  },
  {
    q: 'Quais ingredientes são proibidos pela ANVISA?',
    a: 'A ANVISA mantém uma lista atualizada de substâncias proibidas na RDC 15/2013. Exemplos incluem: hidroquinona em concentrações acima do permitido, mercúrio, chumbo em cosméticos, e certos conservantes como formaldeído liberadores acima dos limites. Nosso motor detecta automaticamente qualquer violação.',
  },
  {
    q: 'Posso usar o CosmetCheck gratuitamente?',
    a: 'Sim! O plano Free oferece 10 verificações de conformidade por mês, acesso às regras da ANVISA e COFEPRIS. Para geração de Listing com IA e verificações ilimitadas, recomendamos o plano Pro.',
  },
  {
    q: 'O Listing gerado pela IA é realmente compatível?',
    a: 'Nossa IA gera Listings baseadas nas versões atualizadas das regulamentações, citando as normas específicas (RDC, NOM). Recomendamos sempre uma revisão final humana antes do lançamento, especialmente para produtos com ingredientes novos ou inovadores.',
  },
  {
    q: 'Quanto tempo leva para verificar um produto?',
    a: 'A verificação de conformidade leva segundos. Basta colar a lista de ingredientes ou descrição do produto, selecionar o país (Brasil) e nosso motor de IA identificará automaticamente quaisquer violações, sugestões de correção e referências normativas.',
  },
]

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

            {/* SocialProofBar */}
            <div className="mb-6 inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium backdrop-blur">
              <span className="inline-flex items-center">
                <span className="mr-2 h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/80">已服务</span>
                <span className="mx-1 font-bold text-white">2,000+</span>
                <span className="text-white/80">卖家</span>
              </span>
              <span className="hidden sm:inline text-white/30">|</span>
              <span className="text-white/80">
                拦截 <span className="font-bold text-white">340,000+</span> 次合规风险
              </span>
              <span className="hidden sm:inline text-white/30">|</span>
              <span className="text-white/80">
                覆盖 <span className="font-bold text-white">巴西/墨西哥</span>
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
              Venda cosméticos no Brasil<br className="hidden md:block" />
              sem ser retirado do ar
            </h1>

            {/* Logo 墙 */}
            <div className="mb-8">
              <p className="text-xs text-white/50 uppercase tracking-wider mb-3">
                被这些平台的卖家信赖
              </p>
              <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
                {['Amazon Brazil', 'Mercado Livre', 'Shopee', 'TikTok Shop', 'SHEIN'].map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

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

      {/* 真实案例 */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl mb-4">
              真实案例：巴西卖家如何避免罚款
            </h2>
            <p className="text-gray-600">
              这些都是 CosmetCheck 帮助过的真实场景
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {cases.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-gray-100 bg-gray-50 p-5 hover:shadow-md transition-shadow"
              >
                <p className={`text-xs font-bold ${item.tagColor} mb-2`}>{item.tag}</p>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">{item.body}</p>
                <p className="text-xs text-green-600 font-semibold">{item.result}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por que ANVISA é rigorosa */}
      <section className="py-12 md:py-20 bg-white">
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
      <section className="py-12 md:py-20 bg-gray-50">
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

      {/* FAQ */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">
              Perguntas frequentes sobre ANVISA
            </h2>
            <p className="text-gray-600">
              Tudo o que você precisa saber antes de vender cosméticos no Brasil
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((item, idx) => (
              <details key={idx} className="border border-gray-100 rounded-xl overflow-hidden group">
                <summary className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors cursor-pointer list-none">
                  <span className="font-semibold text-gray-900 pr-4">{item.q}</span>
                  <span className="text-2xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-block rounded-full bg-[#7c3aed]/10 px-4 py-1 text-sm font-semibold text-[#7c3aed] mb-4">
            价值优先
          </div>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">
            省下的每一次罚款，都够付一年 Pro
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            ANVISA 单次违规罚款可达 R$ 10,000+，一次 Pro 订阅即可覆盖全年
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
            <div className="rounded-2xl border-2 border-gray-100 bg-white p-6 text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="text-4xl font-extrabold text-gray-900 mb-2">$0<span className="text-lg text-gray-500">/月</span></div>
              <p className="text-sm text-gray-500 mb-4">每月 10 次检测 · 适合测试</p>
              <Link href="/?country=BR">
                <Button variant="outline" className="w-full font-semibold text-[#7c3aed] border-[#7c3aed]/30">
                  免费开始
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl border-2 border-[#7c3aed] bg-gradient-to-b from-[#7c3aed]/5 to-white p-6 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#7c3aed] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                卖家首选
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
              <div className="text-4xl font-extrabold text-gray-900 mb-2">$29<span className="text-lg text-gray-500">/月</span></div>
              <p className="text-sm text-gray-500 mb-4">无限次检测 + AI Listing 生成</p>
              <Link href="/pricing">
                <Button className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-bold">
                  查看详情
                </Button>
              </Link>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            无需信用卡 · 7 天无理由退款 · 随时取消
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6] text-white">
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

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-white font-bold text-xl mb-4">CosmetCheck</div>
              <p className="text-sm">拉美美妆合规检测专家，让出海更简单。</p>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">产品</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/?country=BR" className="hover:text-white transition-colors">合规检测</Link></li>
                <li>AI Listing生成</li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">定价</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">资源</div>
              <ul className="space-y-2 text-sm">
                <li>法规知识库</li>
                <li>帮助中心</li>
                <li>API文档</li>
              </ul>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">法律</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">隐私政策</Link></li>
                <li>服务条款</li>
                <li>GDPR/LGPD/LFPDPPP</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            © 2025 CosmetCheck. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
