'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        <div className="container-custom relative py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
              <span className="mr-2 h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              已服务 2,000+ 拉美美妆卖家
            </div>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
              拉美卖美妆，<br className="hidden md:block" />不再被下架罚款
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90 md:text-xl">
              一键检测巴西/墨西哥等5国合规，AI自动生成高转化Listing — 免费开始
            </p>

            {/* Hero Demo */}
            <div className="mx-auto max-w-xl rounded-2xl bg-white/10 p-6 backdrop-blur-lg md:p-8">
              <div className="mb-4 text-left">
                <Label className="text-white/80 text-sm">输入产品成分，实时检测合规</Label>
              </div>
              <div className="space-y-3">
                <Textarea
                  placeholder="例如：Aqua, Glycerin, Niacinamide, Paraben, Hydroquinone..."
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/50 min-h-[100px]"
                />
                <Button className="w-full bg-white text-[#7c3aed] hover:bg-white/90 font-semibold">
                  免费检测我的产品
                </Button>
              </div>
              <p className="mt-3 text-xs text-white/60">
                零门槛体验 · 无需注册 · 10秒出结果
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">三步完成合规检测</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">从成分输入到Listing生成，全程AI辅助，无需法规背景</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: '粘贴产品信息',
                desc: '粘贴产品描述、成分表或上传文档，支持中/英/葡/西语',
                icon: '📋',
              },
              {
                step: '02',
                title: 'AI自动检测合规',
                desc: '实时标记违禁词、浓度超标成分，显示ANVISA/COFEPRIS具体法规条款',
                icon: '🔍',
              },
              {
                step: '03',
                title: '生成高转化Listing',
                desc: '一键生成符合当地法规的葡语/西班牙语Listing，可直接上架',
                icon: '✨',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-8 hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <div className="text-sm font-bold text-[#7c3aed] mb-2">步骤 {item.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">谁在用 CosmetCheck</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">覆盖拉美美妆出海的典型场景</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: '中国卖家出海巴西',
                desc: '不懂葡语也能过ANVISA。AI自动生成合规的葡语Listing，告别翻译软件+人工校对的双重成本。',
                highlight: '巴西站',
              },
              {
                title: '墨西哥本土小品牌',
                desc: '低成本合规，和大品牌同台竞争。COFEPRIS检测+西语Listing，让合规不再是资金门槛。',
                highlight: '墨西哥站',
              },
              {
                title: 'TikTok达人推自有品牌',
                desc: '快速合规上线，不耽误流量变现。从选品到上架48小时完成，赶上每一个流量风口。',
                highlight: '全渠道',
              },
            ].map((item, idx) => (
              <Card key={idx} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-8">
                  <div className="inline-block rounded-full bg-[#7c3aed]/10 px-3 py-1 text-xs font-semibold text-[#7c3aed] mb-4">
                    {item.highlight}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">核心功能</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">专为拉美美妆合规设计的AI检测引擎</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🛡️', title: 'ANVISA+COFEPRIS双引擎', desc: '同时覆盖巴西和墨西哥法规，一键切换检测目标市场' },
              { icon: '🌐', title: '葡/西双语AI生成', desc: '基于当地消费者习惯生成Listing，非直译' },
              { icon: '⚡', title: '实时违禁词检测', desc: '毫秒级检测，违禁成分实时标红，附法规来源' },
              { icon: '🎁', title: '免费开始', desc: '每月10次免费检测，先体验再付费' },
            ].map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-gray-100 p-6 hover:border-[#7c3aed]/20 transition-colors">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="inline-block rounded-full bg-[#7c3aed]/10 px-4 py-1 text-sm font-semibold text-[#7c3aed] mb-4">
              价值优先
            </div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">
              省下的每一次罚款，都够付一年Pro
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              ANVISA单次违规罚款可达 R$ 10,000+，一次Pro订阅即可覆盖全年
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free */}
            <Card className="border-2 border-gray-100">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">$0</span>
                  <span className="text-gray-500 ml-2">/月</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {['每月10次合规检测', '基础违禁词检测', '巴西ANVISA规则', '墨西哥COFEPRIS规则'].map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full">免费开始</Button>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="border-2 border-[#7c3aed] relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#7c3aed] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                推荐
              </div>
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">$29</span>
                  <span className="text-gray-500 ml-2">/月</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {['无限次合规检测', 'AI Listing生成（葡/西语）', '法规更新实时通知', '优先客服支持', '批量检测（CSV导入）'].map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-[#7c3aed] hover:bg-[#6d28d9]">升级 Pro</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">常见问题</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: '你们的数据来源可靠吗？',
                a: '法规数据直接来自 ANVISA RDC 文件、COFEPRIS NOM 标准、INCI 国际命名数据库。每条规则均标注来源文件编号，可追溯验证。',
              },
              {
                q: '法规更新频率？',
                a: '官方源每月自动爬取，人工校验后更新。检测到重大法规变更时（如新禁用成分），48小时内完成规则更新并通知所有Pro用户。',
              },
              {
                q: '免费版够不够用？',
                a: '免费版每月10次检测，适合单品测试和小批量卖家。如果每月检测超过10次，或需要AI生成Listing，建议升级Pro。',
              },
              {
                q: '生成的Listing真的合规吗？',
                a: 'AI生成的Listing基于当前法规版本和官方要求，但建议上架前进行最终人工确认。我们提供规则来源链接供您二次验证。',
              },
              {
                q: '支持哪些平台？',
                a: '当前支持巴西（ANVISA）和墨西哥（COFEPRIS）的合规检测。Listing生成适配 Amazon、Mercado Livre、Shopee 等平台格式。',
              },
              {
                q: '我的产品数据安全吗？',
                a: '所有数据传输使用TLS加密，符合 GDPR、LGPD（巴西）和 LFPDPPP（墨西哥）数据保护要求。我们从不出售用户数据。',
              },
              {
                q: '多久支持其他国家？',
                a: '2025年Q3计划上线阿根廷（ANMAT）和哥伦比亚（INVIMA）。Pro用户可优先体验新市场。',
              },
              {
                q: '可以开发票/退税吗？',
                a: 'Pro订阅支持开具国际发票（Invoice），可用于企业报销和税务抵扣。',
              },
            ].map((item, idx) => (
              <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                >
                  <span className="font-semibold text-gray-900 pr-4">{item.q}</span>
                  <span className={`text-2xl flex-shrink-0 transition-transform ${activeFaq === idx ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6] text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold md:text-4xl mb-4">
            今天就开始合规卖货
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
            加入 2,000+ 拉美美妆卖家，用AI让合规不再成为出海障碍
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input
              type="email"
              placeholder="输入邮箱，免费开始"
              className="border-white/20 bg-white/10 text-white placeholder:text-white/50 h-12"
            />
            <Button className="bg-white text-[#7c3aed] hover:bg-white/90 font-semibold h-12 px-8 whitespace-nowrap">
              免费检测我的产品
            </Button>
          </div>
          <p className="mt-4 text-sm text-white/60">
            无需信用卡 · 随时取消 · 免费版永久可用
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-white font-bold text-xl mb-4">CosmetCheck</div>
              <p className="text-sm">拉美美妆合规检测专家，让出海更简单。</p>
            </div>
            <div>
              <div className="text-white font-semibold mb-4">产品</div>
              <ul className="space-y-2 text-sm">
                <li>合规检测</li>
                <li>AI Listing生成</li>
                <li>定价</li>
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
                <li>隐私政策</li>
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
