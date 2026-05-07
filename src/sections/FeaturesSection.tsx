import Image from 'next/image'

export function FeaturesSection() {
  return (
    <section className="py-20 bg-[#252530]">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white md:text-4xl mb-4">核心功能</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">专为拉美美妆合规设计的AI检测引擎</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '/assets/icons/icon-shield.svg', title: '上架前自动拦截下架风险', desc: '输入成分秒出风险报告：哪里违规、怎么改、引用哪条法规 — 不让罚款单先到' },
            { icon: '/assets/icons/icon-globe.svg', title: '当地人看了就想买的 Listing', desc: '不是翻译，是按巴西/墨西哥消费者搜索习惯重写标题和卖点，自带合规过滤' },
            { icon: '/assets/icons/icon-bolt.svg', title: '违禁词秒标红，附官方条款', desc: 'ANVISA RDC 编号、COFEPRIS NOM 标准直接引用，平台申诉有依据' },
            { icon: '/assets/icons/icon-gift.svg', title: '0 元先测 10 次，再决定', desc: '不用绑卡、不用签合同，测完觉得有用再升级 Pro' },
          ].map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-gray-700/50 bg-[#1E1E28] p-6 hover:border-[#0A4D8C]/50 hover:shadow-lg hover:shadow-[#0A4D8C]/10 transition-all">
              <div className="mb-4">
                <Image src={item.icon} alt="" width={48} height={48} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
