import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { FooterSection } from '@/sections/FooterSection'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Download,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  Truck,
  Store,
  Gavel,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

export const dynamic = 'force-static'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Brazil ANVISA Cosmetics Regulation 2025: Complete Guide for Sellers | CosmetCheck',
    description: 'Complete guide to Brazil ANVISA cosmetics compliance for sellers. Banned ingredients, labeling requirements, import process, platform rules (Amazon BR, Mercado Livre), and penalties.',
    keywords: 'ANVISA cosmetics regulation, Brazil cosmetic compliance, ANVISA banned ingredients, Mercado Livre cosmetics, Amazon Brazil beauty products',
    openGraph: {
      title: 'Brazil ANVISA Cosmetics Compliance Guide | CosmetCheck',
      description: 'The complete seller\'s guide to Brazil cosmetic regulations.',
      type: 'article',
    },
    alternates: {
      canonical: 'https://cosmetcheck.com/regulation/brazil',
    },
  }
}

const sections = [
  { id: 'overview', label: 'Key Regulations', icon: BookOpen },
  { id: 'banned', label: 'Banned Ingredients', icon: AlertTriangle },
  { id: 'restricted', label: 'Restricted & Limits', icon: ShieldCheck },
  { id: 'labeling', label: 'Labeling Requirements', icon: FileText },
  { id: 'import', label: 'Import & Customs', icon: Truck },
  { id: 'platforms', label: 'Platform Rules', icon: Store },
  { id: 'penalties', label: 'Penalties & Fines', icon: Gavel },
  { id: 'compliance', label: 'Ensure Compliance', icon: CheckCircle2 },
]

export default function BrazilRegulationPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Brazil ANVISA Cosmetics Regulation 2025: Complete Guide for Sellers',
    description: 'Complete guide to Brazil ANVISA cosmetics compliance for international sellers.',
    author: { '@type': 'Organization', name: 'CosmetCheck' },
    publisher: { '@type': 'Organization', name: 'CosmetCheck' },
    datePublished: '2025-06-02',
    dateModified: '2025-06-02',
  }

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="min-h-screen bg-[#0F1419] text-[#E8ECF0]">
        {/* Hero */}
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">🇧🇷</span>
              <div>
                <div className="text-sm text-emerald-400 font-medium">ANVISA Regulation Guide</div>
                <h1 className="text-3xl sm:text-4xl font-bold">
                  Brazil Cosmetics Compliance
                </h1>
              </div>
            </div>
            <p className="text-lg text-slate-400 max-w-2xl">
              Everything you need to know to sell cosmetics in Brazil legally. Banned ingredients,
              labeling rules, import process, and platform-specific requirements.
            </p>

            {/* Table of Contents */}
            <nav className="mt-10 p-6 bg-[#1A1F26] rounded-xl border border-[#2A3038]">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Contents
              </h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#0F1419] text-sm text-slate-300 hover:text-emerald-400 transition-colors"
                  >
                    <s.icon className="w-4 h-4 text-slate-500" />
                    {s.label}
                  </a>
                ))}
              </div>
            </nav>
          </div>
        </section>

        {/* Section 1: Overview */}
        <section id="overview" className="pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1A1F26] rounded-2xl border border-[#2A3038] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold">Key Regulations Overview</h2>
              </div>
              <div className="prose prose-invert max-w-none">
                {/* TODO: 运营填充 - ANVISA核心法规概述 */}
                <p className="text-slate-400">
                  <span className="inline-block px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-medium mr-2">
                    TODO
                  </span>
                  运营补充：ANVISA 核心法规框架（RDC 375/2020 等）、化妆品分类定义、
                  适用范围、与中国/欧盟法规的关键差异。
                </p>
                <ul className="space-y-2 text-slate-400 mt-4">
                  <li>• <strong>RDC 375/2020</strong> — TODO: 一句话说明</li>
                  <li>• <strong>RDC 482/2021</strong> — TODO: 一句话说明</li>
                  <li>• <strong>Collegiate Board Resolution</strong> — TODO: 一句话说明</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Banned Ingredients */}
        <section id="banned" className="pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1A1F26] rounded-2xl border border-[#2A3038] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-xl font-bold">Banned Ingredients List</h2>
              </div>
              {/* TODO: 运营填充 - 禁用品类清单 + 链接到数据库 */}
              <p className="text-slate-400 mb-4">
                <span className="inline-block px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-medium mr-2">
                  TODO
                </span>
                运营补充：巴西禁用成分的主要类别（美白类、激素类、重金属类等）、
                常见高危成分清单、与中国卖家常用成分的冲突点。
              </p>
              <Link
                href="/ingredients?country=brazil&status=banned"
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
              >
                View Full Banned Ingredients Database
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section 3: Restricted Ingredients */}
        <section id="restricted" className="pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1A1F26] rounded-2xl border border-[#2A3038] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                </div>
                <h2 className="text-xl font-bold">Restricted Ingredients & Concentration Limits</h2>
              </div>
              {/* TODO: 运营填充 - 限用成分及浓度限制表 */}
              <p className="text-slate-400">
                <span className="inline-block px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-medium mr-2">
                  TODO
                </span>
                运营补充：重点限用成分及其浓度上限表格（防腐剂、防晒剂、活性成分等）。
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Labeling */}
        <section id="labeling" className="pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1A1F26] rounded-2xl border border-[#2A3038] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold">Labeling Requirements</h2>
              </div>
              {/* TODO: 运营填充 - 标签要求 */}
              <p className="text-slate-400">
                <span className="inline-block px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-medium mr-2">
                  TODO
                </span>
                运营补充：巴西化妆品标签强制要素（葡语标注、INCI成分名、净含量、
                制造商信息、批号、有效期、ANVISA注册号等）、禁止使用的宣传用语。
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Import & Customs */}
        <section id="import" className="pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1A1F26] rounded-2xl border border-[#2A3038] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-xl font-bold">Import & Customs Process</h2>
              </div>
              {/* TODO: 运营填充 - 进口清关流程 */}
              <p className="text-slate-400">
                <span className="inline-block px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-medium mr-2">
                  TODO
                </span>
                运营补充：化妆品进口巴西的流程（LIMPAD 系统、产品注册/通报、
                海关编码、必要文件清单、检验检疫要求）。
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Platform Rules */}
        <section id="platforms" className="pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1A1F26] rounded-2xl border border-[#2A3038] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <Store className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="text-xl font-bold">Platform-Specific Rules</h2>
              </div>
              {/* TODO: 运营填充 - 电商平台规则 */}
              <p className="text-slate-400">
                <span className="inline-block px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-medium mr-2">
                  TODO
                </span>
                运营补充：Amazon BR、Mercado Livre、Shopee BR、Magalu 等主流平台
                对化妆品卖家的具体要求（资质文件、禁售品类、合规审核流程）。
              </p>
            </div>
          </div>
        </section>

        {/* Section 7: Penalties */}
        <section id="penalties" className="pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1A1F26] rounded-2xl border border-[#2A3038] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
                  <Gavel className="w-5 h-5 text-rose-400" />
                </div>
                <h2 className="text-xl font-bold">Penalties & Fines</h2>
              </div>
              {/* TODO: 运营填充 - 处罚案例和罚款标准 */}
              <p className="text-slate-400">
                <span className="inline-block px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-medium mr-2">
                  TODO
                </span>
                运营补充：违规处罚标准（罚款金额、产品下架、刑事风险）、
                近年典型执法案例、海关扣押的常见原因。
              </p>
            </div>
          </div>
        </section>

        {/* Section 8: Ensure Compliance */}
        <section id="compliance" className="pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1A1F26] rounded-2xl border border-[#2A3038] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold">How to Ensure Compliance</h2>
              </div>
              {/* TODO: 运营填充 - 合规操作清单 */}
              <p className="text-slate-400">
                <span className="inline-block px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-medium mr-2">
                  TODO
                </span>
                运营补充：卖家自查清单（公式审核、标签审查、注册文件准备）、
                推荐的合规服务商、CosmetCheck 工具如何帮助自动化合规检测。
              </p>
            </div>
          </div>
        </section>

        {/* Resources Download */}
        <section className="pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1A1F26] rounded-2xl border border-[#2A3038] p-6 sm:p-8">
              <h2 className="text-xl font-bold mb-6">Downloadable Resources</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* TODO: 运营确认链接有效性 */}
                <ResourceCard
                  title="ANVISA RDC 375/2020"
                  description="Full text of the main cosmetic regulation"
                  href="#"
                  icon={Download}
                />
                <ResourceCard
                  title="Banned Ingredients Quick Reference"
                  description="Printable checklist of prohibited substances"
                  href="#"
                  icon={Download}
                />
                <ResourceCard
                  title="Product Label Template (PT)"
                  description="ANVISA-compliant label format in Portuguese"
                  href="#"
                  icon={Download}
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#0A4D8C]/20 to-[#00A86B]/10 border border-[#0A4D8C]/30 rounded-2xl p-8 sm:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Skip the Manual Research
              </h2>
              <p className="text-slate-400 max-w-lg mx-auto mb-6">
                Our AI scans your formula against all active ANVISA regulations in real time.
                Get instant compliance reports for Brazil.
              </p>
              <Link href="/">
                <Button className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-semibold h-12 px-8">
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Check My Product Free
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <FooterSection />
    </>
  )
}

function ResourceCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-4 rounded-xl bg-[#0F1419] border border-[#2A3038] hover:border-[#0A4D8C]/40 transition-colors group"
    >
      <div className="w-9 h-9 rounded-lg bg-[#0A4D8C]/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[#1E6BB8]" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors truncate">
          {title}
        </p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition-colors ml-auto shrink-0" />
    </a>
  )
}
