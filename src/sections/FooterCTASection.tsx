import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function FooterCTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#5b21b6] text-white">
      <div className="container-custom text-center">
        <div className="mb-4 inline-flex items-center rounded-full bg-red-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg animate-bounce">
          🔥 限时福利 · 本月注册送 5 次 Pro 体验
        </div>
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
            className="border-white/20 bg-white/10 text-white placeholder:text-white/50 h-12 text-base"
          />
          <Button className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-gray-900 hover:from-[#f59e0b] hover:to-[#d97706] font-bold h-12 px-8 whitespace-nowrap shadow-lg shadow-amber-500/25 animate-pulse-subtle">
            立即免费检测
          </Button>
        </div>
        <p className="mt-4 text-sm text-white/60">
          无需信用卡 · 随时取消 · 免费版永久可用
        </p>
      </div>
    </section>
  )
}
