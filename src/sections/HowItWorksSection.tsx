export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-[#1A1A24]">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white md:text-4xl mb-4">三步完成合规检测</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">从成分输入到Listing生成，全程AI辅助，无需法规背景</p>
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
              <div className="rounded-2xl border border-gray-700/50 bg-[#252530]/50 p-8 hover:shadow-lg hover:border-[#0A4D8C]/30 transition-all">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-sm font-bold text-[#00A86B] mb-2">步骤 {item.step}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
