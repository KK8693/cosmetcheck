'use client'

export const runtime = 'edge'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ResetPasswordPage() {
  const router = useRouter()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [validating, setValidating] = useState(true)

  useEffect(() => {
    // Check if user has a valid recovery token
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        // No valid session, redirect to login
        router.push('/?auth=reset-required')
      } else {
        setValidating(false)
      }
    }
    checkSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('密码至少需要6个字符')
      return
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    setLoading(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) throw updateError

      setSuccess(true)
      setTimeout(() => {
        router.push('/?auth=password-reset-success')
      }, 2000)
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : '更新密码失败')
    } finally {
      setLoading(false)
    }
  }

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A4D8C] mx-auto"></div>
          <p className="mt-4 text-gray-600">验证中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {success ? '密码已重置' : '设置新密码'}
          </CardTitle>
          <CardDescription className="text-center">
            {success 
              ? '您的密码已成功更新，即将跳转...' 
              : '请输入您的新密码'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">✅</div>
              <p className="text-green-600 font-medium">密码更新成功！</p>
              <p className="text-gray-500 text-sm mt-2">正在跳转到登录页面...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">新密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="至少6个字符"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认新密码</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="再次输入新密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0A4D8C] hover:bg-[#1E6BB8]"
                disabled={loading}
              >
                {loading ? '处理中...' : '重置密码'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}