import type { Metadata } from 'next'
export const runtime = 'edge'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Shield, Globe, Zap } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { Logo } from '@/components/Logo'
import { setRequestLocale } from 'next-intl/server'
import { FooterSection } from '@/sections/FooterSection'

export const metadata: Metadata = {
  title: 'CosmetCheck México - Verificación de Conformidad COFEPRIS para Cosméticos',
  description: 'Herramienta gratuita para verificar la conformidad de cosméticos con COFEPRIS. Detecte ingredientes prohibidos, palabras prohibidas en etiquetas y genere listados en español compatibles.',
  keywords: 'COFEPRIS, conformidad cosméticos México, regulación cosméticos COFEPRIS, ingredientes prohibidos COFEPRIS, etiqueta cosmético México, vender cosméticos México',
  openGraph: {
    title: 'CosmetCheck México - Conformidad COFEPRIS en 1 clic',
    description: 'Verifique si sus cosméticos están en conformidad con COFEPRIS antes de vender en México',
    locale: 'es_MX',
  },
}

const cases = [
  {
    tag: '❌ Ingrediente prohibido',
    tagColor: 'text-red-300',
    body: '"Crema antiarrugas con ácido retinoico al 0.5% — retirada del mercado por COFEPRIS"',
    result: '→ Reformulado con retinol autorizado, aprobado en 5 días',
  },
  {
    tag: '⚠️ Error de etiqueta',
    tagColor: 'text-amber-300',
    body: '"Protector solar sin NOM-189 indicaciones — bloqueado en aduana"',
    result: '→ Se generó etiqueta NOM compatible, liberación inmediata',
  },
  {
    tag: '📝 Copy no conforme',
    tagColor: 'text-blue-300',
    body: '"Listing con anti-arrugas — denunciado por profeco"',
    result: '→ Cambiado a "revitalizante", ventas +18% sin riesgo',
  },
]

const faqs = [
  {
    q: '¿Qué es COFEPRIS y por qué importa para cosméticos?',
    a: 'COFEPRIS (Comisión Federal para la Protección contra Riesgos Sanitarios) es la autoridad reguladora de salud en México. Para cosméticos, define ingredientes permitidos, limites de concentración y requisitos de etiquetado (NOM). Las infracciones pueden generar multas de hasta MXN $150,000+ y decomiso de productos.',
  },
  {
    q: '¿Cuáles ingredientes están prohibidos por COFEPRIS?',
    a: 'COFEPRIS sigue los listados del Acuerdo 2004 y sus modificaciones, así como la NOM-141. Ejemplos: ácido retinoico en cosméticos (solo farmacéutico), plomo en labiales por encima de límites, mercurio, y ciertos conservantes como parabenos por encima de concentraciones permitidas. Nuestro motor escanea automáticamente contra estas listas.',
  },
  {
    q: '¿Puedo usar CosmetCheck gratis?',
    a: '¡Sí! El plan Free incluye 10 verificaciones de conformidad al mes, acceso a reglas de ANVISA y COFEPRIS. Para generación de Listing con IA y verificaciones ilimitadas, recomendamos el plan Pro.',
  },
  {
    q: '¿El Listing generado por IA es realmente conforme?',
    a: 'Nuestra IA genera Listings basados en las versiones actualizadas de las regulaciones, citando normas específicas (NOM, RDC). Recomendamos siempre una revisión final humana antes del lanzamiento, especialmente para productos con ingredientes nuevos o innovadores.',
  },
  {
    q: '¿Cuánto tiempo toma verificar un producto?',
    a: 'La verificación de conformidad toma segundos. Solo pega la lista de ingredientes o descripción del producto, selecciona el país (México) y nuestro motor de IA identificará automáticamente cualquier violación, sugerencias de corrección y referencias normativas.',
  },
]

export default function MexicoPage() {
  setRequestLocale('es-MX')
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2563eb] via-[#1d4ed8] to-[#1e40af] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
              <span className="mr-2">🇲🇽</span>
              Especialista en Conformidad COFEPRIS
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
                覆盖 <span className="font-bold text-white">墨西哥/巴西</span>
              </span>
            </div>

            <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Vende cosméticos en México<br className="hidden md:block" />
              sin ser retirado
            </h1>

            {/* Logo 墙 */}
            <div className="mb-8">
              <p className="text-xs text-white/50 uppercase tracking-wider mb-3">
                被这些平台的卖家信赖
              </p>
              <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
                {['Amazon México', 'Mercado Libre', 'Liverpool', 'Coppel', 'TikTok Shop'].map((name) => (
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
              Verifica la conformidad con COFEPRIS en segundos. Detecta ingredientes prohibidos, palabras prohibidas en etiquetas y genera listados en español mexicano — gratis para empezar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/?country=MX">
                <Button className="bg-white text-[#2563eb] hover:bg-white/90 font-semibold h-12 px-8">
                  Verificar mi producto
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12 px-8">
                  Ver precios
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
              Casos reales: cómo vendedores mexicanos evitaron multas
            </h2>
            <p className="text-gray-600">
              Escenarios reales que CosmetCheck ha ayudado a resolver
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

      {/* Por qué COFEPRIS es riguroso */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">
              Por qué la conformidad COFEPRIS importa
            </h2>
            <p className="text-lg text-gray-600">
              COFEPRIS (Comisión Federal para la Protección contra Riesgos Sanitarios) regula estrictamente los cosméticos en México. Una infracción puede resultar en multas de hasta MXN $150,000+ y decomiso de productos.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ingredientes prohibidos</h3>
                <p className="text-gray-600">
                  COFEPRIS mantiene listas actualizadas de sustancias prohibidas en cosméticos según la NOM-141. Nuestro motor detecta automáticamente cualquier ingrediente no permitido en tu fórmula.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Palabras prohibidas en etiquetas</h3>
                <p className="text-gray-600">
Términos como &quot;tratamiento&quot;, &quot;cura&quot;, &quot;medicinal&quot;, &quot;anti-arrugas&quot; y &quot;anti-edad&quot; están estrictamente prohibidos en etiquetas de cosméticos, ya que implican propiedades medicinales según la Ley General de Salud. Nuestra IA identifica y sugiere alternativas conformes.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Listado en español mexicano</h3>
                <p className="text-gray-600">
                  Genera títulos, descripciones y bullets en español mexicano que respetan las normas de COFEPRIS y convierten clientes en Amazon México y Mercado Libre.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Regulaciones clave */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-8 text-center">
              Principales regulaciones COFEPRIS
            </h2>
            <div className="space-y-4">
              {[
                { title: 'NOM-141', desc: 'Productos de higiene y belleza. Límites máximos de metales pesados y conservantes permitidos.' },
                { title: 'NOM-189', desc: 'Productos para la higiene y cuidado personal. Etiquetado y advertencias obligatorias (aplica a cosméticos).' },
                { title: 'Acuerdo COFEPRIS 2004', desc: 'Acuerdo que establece los listados de sustancias prohibidas y restringidas en productos de higiene personal, cosméticos y perfumes.' },
                { title: 'Ley General de Salud', desc: 'Ley Federal de Salud. Artículos 257-267 regulan cosméticos en México.' },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-[#2563eb] flex-shrink-0 mt-0.5" />
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
              Preguntas frecuentes sobre COFEPRIS
            </h2>
            <p className="text-gray-600">
              Todo lo que necesitas saber antes de vender cosméticos en México
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
          <div className="inline-block rounded-full bg-[#2563eb]/10 px-4 py-1 text-sm font-semibold text-[#2563eb] mb-4">
            Valor comprobado
          </div>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">
            Cada multa evitada paga años de Pro
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Las multas de COFEPRIS por infracción pueden llegar a MXN $150,000+, una suscripción Pro cubre todo el año
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
            <div className="rounded-2xl border-2 border-gray-100 bg-white p-6 text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">$0<span className="text-lg text-gray-500">/mes</span></div>
              <p className="text-sm text-gray-500 mb-4">10 verificaciones/mes · Ideal para probar</p>
              <Link href="/?country=MX">
                <Button variant="outline" className="w-full font-semibold text-[#2563eb] border-[#2563eb]/30">
                  Comenzar gratis
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl border-2 border-[#2563eb] bg-gradient-to-b from-[#2563eb]/5 to-white p-6 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#2563eb] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                Preferido
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
              <div className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Mex$499<span className="text-lg text-gray-500">/mes</span></div>
              <p className="text-sm text-gray-500 mb-4">Verificaciones ilimitadas + IA Listing</p>
              <Link href="/pricing">
                <Button className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-bold">
                  Ver detalles
                </Button>
              </Link>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Sin tarjeta de crédito · Reembolso 7 días · Cancela cuando quieras
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-[#2563eb] via-[#1d4ed8] to-[#1e40af] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold md:text-4xl mb-4">
            Comienza a vender con seguridad
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
            Miles de vendedores ya usan CosmetCheck para evitar multas de COFEPRIS. Verifica tu producto gratis ahora.
          </p>
          <Link href="/?country=MX">
            <Button className="bg-white text-[#2563eb] hover:bg-white/90 font-semibold h-12 px-8">
              Verificar conformidad COFEPRIS
            </Button>
          </Link>
        </div>
      </section>

      <FooterSection />
    </div>
  )
}
