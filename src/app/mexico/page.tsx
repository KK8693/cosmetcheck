import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Shield, Globe, Zap } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'CosmetCheck México - Verificación de Conformidad COFEPRIS para Cosméticos',
  description: 'Herramienta gratuita para verificar la conformidad de cosméticos con COFEPRIS. Detecte ingredientes prohibidos, palabras prohibidas en etiquetas y genere listados en español compatibles.',
  keywords: 'COFEPRIS, conformidad cosméticos México, regulación cosméticos COFEPRIS, ingredientes prohibidos COFEPRIS, etiqueta cosmética México, vender cosméticos México',
  openGraph: {
    title: 'CosmetCheck México - Conformidad COFEPRIS en 1 clic',
    description: 'Verifique si sus cosméticos cumplen con COFEPRIS antes de vender en México',
    locale: 'es_MX',
  },
}

export default function MexicoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
              <span className="mr-2">🇲🇽</span>
              Especialista en Conformidad COFEPRIS
            </div>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
              Venda cosméticos en México<br className="hidden md:block" />
              sin ser retirado de la plataforma
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90 md:text-xl">
              Verifique la conformidad con COFEPRIS en segundos. Detecte ingredientes prohibidos, palabras prohibidas en etiquetas y genere listados en español — gratis para empezar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/?country=MX">
                <Button className="bg-white text-[#7c3aed] hover:bg-white/90 font-semibold h-12 px-8">
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

      {/* Por qué COFEPRIS es riguroso */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">
              Por qué la conformidad COFEPRIS importa
            </h2>
            <p className="text-lg text-gray-600">
              COFEPRIS (Comisión Federal para la Protección contra Riesgos Sanitarios) regula estrictamente los cosméticos en México. Una infracción puede resultar en multas de hasta $50,000 MXN+ y suspensión de ventas.
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
                  COFEPRIS mantiene una lista actualizada de sustancias prohibidas en cosméticos. Nuestro motor detecta automáticamente cualquier ingrediente no permitido en su fórmula.
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
                  Términos como &quot;tratamiento&quot;, &quot;cura&quot; y &quot;medicinal&quot; están estrictamente prohibidos en etiquetas de cosméticos. Nuestra IA identifica y sugiere alternativas compatibles.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Listado en español</h3>
                <p className="text-gray-600">
                  Genere títulos, descripciones y bullets en español mexicano que respetan las normas de COFEPRIS y convierten clientes en Mercado Libre y Amazon México.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Regulaciones clave */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-8 text-center">
              Principales regulaciones COFEPRIS
            </h2>
            <div className="space-y-4">
              {[
                { title: 'NOM-141-SSA1/SCF1-2012', desc: 'Norma Oficial Mexicana para etiquetado de productos de higiene personal, cosméticos y perfumes.' },
                { title: 'NOM-259-SSA1-2014', desc: 'Norma Oficial Mexicana para productos y servicios de higiene personal, cosméticos y perfumes.' },
                { title: 'Ley General de Salud', desc: 'Marco legal que establece las bases para la regulación de productos de higiene y cosméticos en México.' },
                { title: 'Reglamento de Insumos para la Salud', desc: 'Reglamento específico para el control sanitario de insumos para la salud, incluyendo cosméticos.' },
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
            Empiece a vender con seguridad
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
            Miles de vendedores ya usan CosmetCheck para evitar multas de COFEPRIS. Verifique su producto gratuitamente ahora.
          </p>
          <Link href="/?country=MX">
            <Button className="bg-white text-[#7c3aed] hover:bg-white/90 font-semibold h-12 px-8">
              Verificar conformidad COFEPRIS
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
