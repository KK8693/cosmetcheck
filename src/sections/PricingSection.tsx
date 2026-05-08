import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SubscribeButton from '@/components/SubscribeButton'
import Link from 'next/link'

export function PricingSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#0A4D8C] via-[#0a5d8c] to-[#00A86B]">
      <div className="container-custom">
        <div className="text-center mb-12">
          <div className="inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-semibold text-white mb-4">
            价值优先
          </div>
          <h2 className="text-3xl font-bold text-white md:text-4xl mb-4">
            省下的每一次罚款，都够付一年Pro
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            ANVISA单次违规罚款可达 R$ 10,000+，一次Pro订阅即可覆盖全年
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free 卡 */}
          <Card className="border-2 border-[#252530] bg-[#1A1A24]">
            <CardContent className="p-8">
              <div className="inline-block rounded-full bg-[#252530] px-3 py-1 text-xs font-bold text-gray-300 mb-4">
                入门试用
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Free</h3>
              <div className="flex items-baseline mb-2">
                <span className="text-3xl md:text-4xl font-extrabold text-white">$0</span>
                <span className="text-gray-400 ml-2">/月</span>
              </div>
              <p className="text-sm text-gray-400 mb-6">适合：每月 ≤10 个 SKU 的测试卖家</p>
              <ul className="space-y-3 mb-8">
                {[
                  { text: '每月10次合规检测', active: true },
                  { text: '基础违禁词检测', active: true },
                  { text: '巴西ANVISA规则', active: true },
                  { text: '墨西哥COFEPRIS规则', active: true },
                  { text: 'AI Listing 生成', active: false },
                  { text: '批量 CSV 检测', active: false },
                ].map((item, idx) => (
                  <li key={idx} className={`flex items-center ${item.active ? 'text-gray-300' : 'text-gray-600'}`}>
                    {item.active ? (
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={item.active ? '' : 'line-through'}>{item.text}</span>
                  </li>
                ))}
              </ul>
              <Link href="/pricing">
                <Button variant="outline" className="w-full font-semibold text-[#0A4D8C] border-[#0A4D8C]/30 hover:bg-[#0A4D8C]/5">
                  免费试用 10 次
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pro 卡 */}
          <Card className="border-2 border-[#00A86B]/50 relative overflow-hidden bg-[#1A1A24]">
            {/* 推荐标签 */}
            <div className="absolute -top-px -right-14">
              <div className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 text-sm font-bold px-10 py-2 rotate-45 shadow-lg">
                🥇 推荐
              </div>
            </div>
            {/* 限时标签脉冲动画 */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-red-500 to-red-400 animate-pulse" />
            <CardContent className="p-8">
              <div className="inline-block rounded-full bg-red-900/30 px-3 py-1 text-xs font-bold text-red-400 mb-4 animate-pulse">
                🔥 限时省 40%
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
              <div className="flex items-baseline mb-2">
                <span className="text-lg text-gray-500 line-through mr-2">$49</span>
                <span className="text-4xl md:text-5xl font-extrabold text-white">$29</span>
                <span className="text-gray-400 ml-2">/月</span>
              </div>
              <p className="text-sm text-gray-400 mb-2">折合约 ¥199/月 · 随时取消</p>
              <p className="text-xs text-gray-500 mb-4">* 价格不含税，自动续费</p>
              <div className="mb-6 rounded-lg bg-red-900/20 border border-red-800/30 p-3">
                <p className="text-red-400 text-sm font-medium">
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
                  <li key={idx} className="flex items-center text-gray-300">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <SubscribeButton
                className="w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-bold shadow-lg shadow-amber-500/25"
              >
                解锁无限次 — $29/月
              </SubscribeButton>
            </CardContent>
          </Card>
        </div>
        {/* 省钱数据栏 */}
        <div className="mt-12 md:mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { num: 'R$ 8,500', label: '平均避免罚款金额', desc: '基于 200+ 卖家调研' },
            { num: '7 天', label: '平均节省合规时间', desc: '从 2 周缩短到 3 天' },
            { num: '92%', label: 'Listing 审核通过率', desc: 'AI 生成 vs 人工撰写' },
          ].map((item, idx) => (
            <div key={idx} className="bg-[#1A1A24] rounded-2xl border border-[#252530] p-6 text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-[#00A86B] mb-2">{item.num}</p>
              <p className="font-semibold text-white mb-1">{item.label}</p>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
