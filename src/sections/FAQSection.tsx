'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
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
]

export function FAQSection() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 bg-[#0D0D12]">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white md:text-4xl mb-4">常见问题</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((item, idx) => (
            <div key={idx} className="border border-[#252530] rounded-xl overflow-hidden bg-[#1A1A24]">
              <button
                className="w-full flex items-center justify-between p-6 text-left hover:bg-[#252530] transition-colors"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <span className="font-semibold text-white pr-4">{item.q}</span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 text-gray-400 transition-transform duration-300 ease-out ${
                    activeFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-out ${
                  activeFaq === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 text-gray-300 leading-relaxed">
                  {item.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
