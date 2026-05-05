'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, X } from 'lucide-react'
import SubscribeButton from '@/components/SubscribeButton'
import Link from 'next/link'

const features = [
  { name: '每月合规检测次数', free: '10 次', pro: '无限次' },
  { name: '基础违禁词检测', free: true, pro: true },
  { name: 'ANVISA 规则库', free: true, pro: true },
  { name: 'COFEPRIS 规则库', free: true, pro: true },
  { name: 'AI Listing 生成（葡/西语）', free: false, pro: true },
  { name: '批量 CSV 检测', free: false, pro: true },
  { name: '法规更新实时通知', free: false, pro: true },
  { name: '优先客服支持', free: false, pro: true },
  { name: '新市场优先体验（阿根廷/哥伦比亚）', free: false, pro: true },
  { name: '专属合规顾问 1v1（年度订阅）', free: false, pro: true },
]

const faqs = [
  { q: '免费版真的永久免费吗？', a: '是的，免费版每月 10 次检测永久免费，无需绑卡，无需签合同。' },
  { q: '可以随时取消 Pro 订阅吗？', a: '可以，Pro 按月/年订阅，随时在账户设置中取消，次周期生效，无违约金。' },
  { q: '年付和月付有什么区别？', a: '功能完全相同，年付一次性支付 $245（省 $103），适合确定长期使用的卖家。' },
  { q: '支持哪些支付方式？', a: '支持 Visa、Mastercard、Amex 等国际信用卡，以及支付宝（中国大陆用户）。' },
  { q: '可以开发票/退税吗？', a: 'Pro 订阅支持开具国际 Invoice，可用于企业报销和税务抵扣。' },
  { q: '数据安全吗？', a: '所有数据传输使用 TLS 加密，符合 GDPR、LGPD（巴西）和 LFPDPPP（墨西哥）要求。' },
]

export default function PricingPage() {
  const [yearly, setYearly] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6] text-white py-20 md:py-28">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        <div className="container-custom relative text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
            <span className="mr-2 h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            已有 2,000+ 卖家选择 Pro
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
            简单透明的定价
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            省下的每一次罚款，都够付一年 Pro。免费开始，随时升级。
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom max-w-5xl">
          {/* Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setYearly(false)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  !yearly ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                月付
              </button>
              <button
                onClick={() => setYearly(true)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  yearly ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                年付 <span className="text-green-600 font-bold ml-1">省 30%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free */}
            <Card className="border-2 border-gray-100">
              <CardContent className="p-8">
                <div className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 mb-4">
                  入门试用
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-3xl md:text-4xl font-extrabold text-gray-900">$0</span>
                  <span className="text-gray-500 ml-2">/月</span>
                </div>
                <p className="text-sm text-gray-500 mb-6">适合：每月 ≤10 个 SKU 的测试卖家</p>
                <ul className="space-y-3 mb-8">
                  {[
                    '每月10次合规检测',
                    '基础违禁词检测',
                    '巴西ANVISA规则',
                    '墨西哥COFEPRIS规则',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                  {[
                    'AI Listing 生成',
                    '批量 CSV 检测',
                    '法规更新通知',
                    '优先客服',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <X className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0" />
                      <span className="line-through">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/">
                  <Button variant="outline" className="w-full font-semibold text-[#7c3aed] border-[#7c3aed]/30 hover:bg-[#7c3aed]/5">
                    免费试用 10 次
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="border-2 border-[#7c3aed] relative overflow-hidden bg-gradient-to-b from-[#7c3aed]/5 to-white">
              <div className="absolute top-0 right-0 bg-[#7c3aed] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                最划算 — 卖家首选
              </div>
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
                <div className="flex items-baseline mb-2">
                  {yearly ? (
                    <>
                      <span className="text-lg text-gray-400 line-through mr-2">$348</span>
                      <span className="text-4xl md:text-5xl font-extrabold text-gray-900">$245</span>
                      <span className="text-gray-500 ml-2">/年</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg text-gray-400 line-through mr-2">$49</span>
                      <span className="text-4xl md:text-5xl font-extrabold text-gray-900">$29</span>
                      <span className="text-gray-500 ml-2">/月</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {yearly ? '折合约 ¥168/月 · 年付省 $103' : '折合约 ¥199/月 · 随时取消'}
                </p>
                <div className="mb-6 rounded-lg bg-red-50 border border-red-100 p-3">
                  <p className="text-red-700 text-sm font-medium">
                    ⚠️ ANVISA 单次违规罚款 ≈ R$ 10,000（≈ $1,700），够付 <span className="font-bold">58 个月</span> Pro
                  </p>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    '无限次合规检测',
                    'AI Listing生成（葡/西语）',
                    '法规更新实时通知',
                    '优先客服支持',
                    '批量检测（CSV导入）',
                    '🌟 新市场优先体验（阿根廷/哥伦比亚 Q3）',
                    '🌟 专属合规顾问 1v1（年度订阅）',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <SubscribeButton
                  priceId={yearly ? 'price_pro_yearly' : 'price_pro_monthly'}
                  className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-bold shadow-lg shadow-amber-500/25"
                >
                  {yearly ? '解锁年付 Pro — $245/年' : '解锁无限次 — $29/月'}
                </SubscribeButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Comparison */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">详细功能对比</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            一目了然，选择最适合你的方案
          </p>
          <div className="border border-gray-200 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-900">功能</th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-center w-32">Free</th>
                  <th className="px-6 py-4 font-semibold text-[#7c3aed] text-center w-32">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {features.map((f, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-gray-700 text-sm">{f.name}</td>
                    <td className="px-6 py-4 text-center">
                      {f.free === true ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : f.free === false ? (
                        <X className="w-5 h-5 text-gray-300 mx-auto" />
                      ) : (
                        <span className="text-gray-600 text-sm">{f.free}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {f.pro === true ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-600 text-sm font-medium">{f.pro}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Money-back / Trust */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: '7 天', label: '无理由退款', desc: 'Pro 订阅 7 天内不满意全额退' },
              { num: '99.9%', label: '服务可用性', desc: '全年稳定运行，不影响业务' },
              { num: '24h', label: '客服响应', desc: 'Pro 用户工作日 24h 内回复' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
                <p className="text-3xl font-extrabold text-[#7c3aed] mb-2">{item.num}</p>
                <p className="font-semibold text-gray-900 mb-1">{item.label}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container-custom max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">定价常见问题</h2>
          <div className="space-y-4">
            {faqs.map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6] text-white text-center">
        <div className="container-custom">
          <div className="mb-4 inline-flex items-center rounded-full bg-red-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg animate-bounce">
            🔥 限时福利 · 本月注册送 5 次 Pro 体验
          </div>
          <h2 className="text-3xl font-bold md:text-4xl mb-4">还有疑问？</h2>
          <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
            先免费体验 10 次，觉得有用再升级。零风险，随时取消。
          </p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-bold h-12 px-8 shadow-lg shadow-amber-500/25">
              免费开始检测
            </Button>
          </Link>
          <p className="mt-4 text-sm text-white/60">无需信用卡 · 随时取消 · 免费版永久可用</p>
        </div>
      </section>
    </div>
  )
}
