'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { signIn, signUp, resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (isForgotPassword) {
        await resetPassword(email)
        setSuccess('重置链接已发送到您的邮箱，请查收')
      } else if (isSignUp) {
        await signUp(email, password)
        setSuccess('注册成功！请登录')
        setIsSignUp(false)
      } else {
        await signIn(email, password)
        setSuccess('登录成功！')
        setTimeout(() => onOpenChange(false), 1000)
      }
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : '操作失败')
    } finally {
      setLoading(false)
    }
  }

  // Reset form when modal closes
  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen)
    if (!isOpen) {
      setTimeout(() => {
        setIsSignUp(false)
        setIsForgotPassword(false)
        setEmail('')
        setPassword('')
        setError('')
        setSuccess('')
      }, 300)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isForgotPassword 
              ? '重置密码' 
              : isSignUp 
                ? '创建账户' 
                : '登录'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</div>
          )}
          {success && (
            <div className="text-sm text-green-600 bg-green-50 rounded-lg p-3">{success}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password field - hide when in forgot password mode */}
          {!isForgotPassword && (
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="至少6个字符"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!isForgotPassword}
                minLength={6}
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#0A4D8C] hover:bg-[#1E6BB8]"
            disabled={loading}
          >
            {loading 
              ? '处理中...' 
              : isForgotPassword 
                ? '发送重置链接' 
                : isSignUp 
                  ? '创建账户' 
                  : '登录'}
          </Button>

          <div className="text-center text-sm text-gray-500">
            {isSignUp ? (
              <>
                <span className="text-gray-500">已有账户？</span>{' '}
                <button
                  type="button"
                  className="text-[#0A4D8C] hover:underline font-medium"
                  onClick={() => { setIsSignUp(false); setError(''); setSuccess('') }}
                >
                  登录
                </button>
              </>
            ) : (
              <>
                <span className="text-gray-500">没有账户？</span>{' '}
                <button
                  type="button"
                  className="text-[#0A4D8C] hover:underline font-medium"
                  onClick={() => { setIsSignUp(true); setError(''); setSuccess('') }}
                >
                  注册
                </button>
              </>
            )}
          </div>

          {/* Forgot Password Link - only show when not in sign up or forgot mode */}
          {!isSignUp && !isForgotPassword && (
            <div className="text-center text-sm">
              <button
                type="button"
                className="text-[#0A4D8C] hover:underline"
                onClick={() => { setIsForgotPassword(true); setError(''); setSuccess('') }}
              >
                忘记密码？
              </button>
            </div>
          )}

          {/* Back to Sign In Link - show when in forgot password mode */}
          {isForgotPassword && (
            <div className="text-center text-sm text-gray-500">
              <button
                type="button"
                className="text-[#0A4D8C] hover:underline font-medium"
                onClick={() => { setIsForgotPassword(false); setError(''); setSuccess('') }}
              >
                返回登录
              </button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
