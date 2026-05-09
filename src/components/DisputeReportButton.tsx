'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { AlertTriangle, Send, CheckCircle } from 'lucide-react'

interface DisputeReportButtonProps {
  ruleId: string
  country: 'BR' | 'MX'
  originalInput: string
  violationMessage?: string
}

export function DisputeReportButton({ 
  ruleId, 
  country, 
  originalInput, 
  violationMessage 
}: DisputeReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [expectedResult, setExpectedResult] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<'success' | 'error' | null>(null)

  const handleSubmit = async () => {
    if (reason.length < 10) {
      return
    }

    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const res = await fetch('/api/dispute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country,
          ruleId,
          originalInput,
          userReason: reason,
          expectedResult: expectedResult || undefined,
        }),
      })

      const data = await res.json()
      
      if (data.success) {
        setSubmitResult('success')
        // Reset after 3 seconds
        setTimeout(() => {
          setIsOpen(false)
          setSubmitResult(null)
          setReason('')
          setExpectedResult('')
        }, 3000)
      } else {
        setSubmitResult('error')
      }
    } catch {
      setSubmitResult('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs text-gray-400 hover:text-amber-600 flex items-center gap-1 mt-2 underline"
      >
        <AlertTriangle className="w-3 h-3" />
        认为误检？报告问题
      </button>
    )
  }

  return (
    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
      <p className="text-xs font-medium text-amber-800 mb-2">
        报告规则误检 / 提交争议
      </p>
      
      {submitResult === 'success' ? (
        <div className="text-center py-2">
          <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-sm text-green-700">感谢反馈！我们的团队将在48小时内审核。</p>
        </div>
      ) : (
        <>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="请详细说明为什么认为这是误检..."
            className="text-sm mb-2 min-h-[60px]"
            maxLength={500}
          />
          <input
            type="text"
            value={expectedResult}
            onChange={(e) => setExpectedResult(e.target.value)}
            placeholder="你认为正确的结果是什么？（可选）"
            className="w-full text-sm px-3 py-2 border border-amber-300 rounded mb-2"
            maxLength={200}
          />
          <div className="flex gap-2">
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
            >
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={reason.length < 10 || isSubmitting}
              size="sm"
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs"
            >
              {isSubmitting ? (
                '提交中...'
              ) : (
                <>
                  <Send className="w-3 h-3 mr-1" />
                  提交
                </>
              )}
            </Button>
          </div>
          {submitResult === 'error' && (
            <p className="text-xs text-red-600 mt-2">提交失败，请稍后重试。</p>
          )}
          {reason.length > 0 && reason.length < 10 && (
            <p className="text-xs text-gray-500 mt-1">请至少输入 10 个字符</p>
          )}
        </>
      )}
    </div>
  )
}