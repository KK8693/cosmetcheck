'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { CheckCircle, XCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

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
  const [emailValid, setEmailValid] = useState<boolean | null>(null)

  const { signIn, signUp, resetPassword } = useAuth()
  const t = useTranslations('auth')

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setEmailValid(value.length > 0 ? regex.test(value) : null)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    validateEmail(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Manual validation: empty form feedback
    if (!email.trim()) {
      setError(t('emailRequired') || '请输入邮箱地址')
      return
    }
    if (emailValid === false) {
      setError(t('emailInvalid') || '请输入有效的邮箱地址')
      return
    }
    if (!isForgotPassword && !password.trim()) {
      setError(t('passwordRequired') || '请输入密码')
      return
    }

    setLoading(true)

    try {
      if (isForgotPassword) {
        await resetPassword(email)
        setSuccess(t('resetSent') || '重置链接已发送到您的邮箱，请查收')
      } else if (isSignUp) {
        await signUp(email, password)
        setSuccess(t('registerSuccess'))
        setTimeout(() => onOpenChange(false), 1500)
      } else {
        await signIn(email, password)
        setSuccess(t('loginSuccess'))
        setTimeout(() => onOpenChange(false), 1000)
      }
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : (t('operationFailed') || '操作失败'))
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
        setEmailValid(null)
      }, 300)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isForgotPassword 
              ? t('resetPassword') || '重置密码'
              : isSignUp 
                ? t('createAccount') || '创建账户'
                : t('login')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</div>
          )}
          {success && (
            <div className="text-sm text-green-600 bg-green-50 rounded-lg p-3">{success}</div>
          )}

          <div className="space-y-2 relative">
            <Label htmlFor="auth-email">{t('email')}</Label>
            <div className="relative">
              <Input
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={handleEmailChange}
                required
                className={emailValid === true ? 'border-green-500 pr-10' : emailValid === false ? 'border-red-400 pr-10' : 'pr-10'}
              />
              {emailValid === true && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
              {emailValid === false && (
                <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
              )}
            </div>
            {emailValid === false && (
              <p className="text-xs text-red-400">{t('emailInvalid') || '请输入有效的邮箱地址'}</p>
            )}
          </div>

          {/* Password field - hide when in forgot password mode */}
          {!isForgotPassword && (
            <div className="space-y-2">
              <Label htmlFor="auth-password">{t('password')}</Label>
              <Input
                id="auth-password"
                type="password"
                placeholder={t('passwordHint') || '至少6个字符'}
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
              ? (t('processing') || '处理中...')
              : isForgotPassword 
                ? (t('sendResetLink') || '发送重置链接')
                : isSignUp 
                  ? t('createAccount') || '创建账户'
                  : t('login')}
          </Button>

          <div className="text-center text-sm text-gray-500">
            {isSignUp ? (
              <>
                <span className="text-gray-500">{t('hasAccount') || '已有账户？'}</span>{' '}
                <button
                  type="button"
                  className="text-[#0A4D8C] hover:underline font-medium"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsSignUp(false); setError(''); setSuccess('') }}
                >
                  {t('login')}
                </button>
              </>
            ) : (
              <>
                <span className="text-gray-500">{t('noAccount') || '没有账户？'}</span>{' '}
                <button
                  type="button"
                  className="text-[#0A4D8C] hover:underline font-medium"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsSignUp(true); setError(''); setSuccess('') }}
                >
                  {t('register') || '注册'}
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
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsForgotPassword(true); setError(''); setSuccess('') }}
              >
                {t('forgotPassword')}
              </button>
            </div>
          )}

          {/* Back to Sign In Link - show when in forgot password mode */}
          {isForgotPassword && (
            <div className="text-center text-sm text-gray-500">
              <button
                type="button"
                className="text-[#0A4D8C] hover:underline font-medium"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsForgotPassword(false); setError(''); setSuccess('') }}
              >
                {t('backToLogin') || '返回登录'}
              </button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
