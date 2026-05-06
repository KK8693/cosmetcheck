import { Card, CardContent } from '@/components/ui/card'

export function UseCasesSection() {
  return (
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
              desc: '快速合规上线，不耗误流量变现。从选品到上架48小时完成，赶上每一个流量风口。',
              highlight: '全渠道',
            },
          ].map((item, idx) => (
            <Card key={idx} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="inline-block rounded-full bg-[#0A4D8C]/10 px-3 py-1 text-xs font-semibold text-[#0A4D8C] mb-4">
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
  )
}
