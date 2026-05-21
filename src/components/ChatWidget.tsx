'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, Sparkles, Shield, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

type ChatMode = 'support' | 'advisor'

interface UsageTracker {
  date: string
  count: number
}

const STORAGE_KEYS = {
  support: 'cc_chat_support',
  advisor: 'cc_chat_advisor',
  history: 'cc_chat_history',
  mode: 'cc_chat_mode',
}

const LIMITS = {
  support: { free: 3 },
  advisor: { monthly: 10 },
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10)
}

function getMonth(): string {
  return new Date().toISOString().slice(0, 7)
}

function getUsage(key: string): UsageTracker {
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      const parsed = JSON.parse(raw) as UsageTracker
      return parsed
    }
  } catch {
    // ignore
  }
  return { date: getToday(), count: 0 }
}

function saveUsage(key: string, tracker: UsageTracker) {
  localStorage.setItem(key, JSON.stringify(tracker))
}

function getHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.history)
    if (raw) return JSON.parse(raw) as ChatMessage[]
  } catch {
    // ignore
  }
  return []
}

function saveHistory(messages: ChatMessage[]) {
  // Keep last 50 messages to avoid storage bloat
  const trimmed = messages.slice(-50)
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(trimmed))
}

function getSavedMode(): ChatMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.mode)
    if (raw === 'advisor') return 'advisor'
  } catch {
    // ignore
  }
  return 'support'
}

function detectLocale(): string {
  if (typeof navigator === 'undefined') return 'zh'
  const lang = navigator.language
  if (lang.startsWith('pt')) return 'pt-BR'
  if (lang.startsWith('es')) return 'es-MX'
  if (lang.startsWith('zh')) return 'zh'
  return 'en'
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<ChatMode>(getSavedMode)
  const [messages, setMessages] = useState<ChatMessage[]>(getHistory)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { user } = useAuth()

  // Listen for external open events
  useEffect(() => {
    const handleOpenChat = (e: Event) => {
      const customEvent = e as CustomEvent<{ mode?: ChatMode }>
      setIsOpen(true)
      if (customEvent.detail?.mode) {
        setMode(customEvent.detail.mode)
      }
    }
    window.addEventListener('open-chat-widget', handleOpenChat)
    return () => window.removeEventListener('open-chat-widget', handleOpenChat)
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Save mode on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.mode, mode)
  }, [mode])

  // Save messages on change
  useEffect(() => {
    saveHistory(messages)
  }, [messages])

  const isFreeUser = !user
  const supportUsage = getUsage(STORAGE_KEYS.support)
  const advisorUsage = getUsage(STORAGE_KEYS.advisor)

  // Reset counters if period changed
  const effectiveSupportUsage =
    supportUsage.date === getToday() ? supportUsage : { date: getToday(), count: 0 }
  const effectiveAdvisorUsage =
    advisorUsage.date === getMonth() ? advisorUsage : { date: getMonth(), count: 0 }

  const supportRemaining = isFreeUser
    ? Math.max(0, LIMITS.support.free - effectiveSupportUsage.count)
    : Infinity
  const advisorRemaining =
    Math.max(0, LIMITS.advisor.monthly - effectiveAdvisorUsage.count)

  const canUseSupport = isFreeUser ? supportRemaining > 0 : true
  const canUseAdvisor = !isFreeUser // Free users cannot use advisor at all

  const handleModeSwitch = (newMode: ChatMode) => {
    setMode(newMode)
    setError(null)
  }

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    setError(null)

    // Check support limit for free users
    if (mode === 'support' && isFreeUser) {
      if (effectiveSupportUsage.count >= LIMITS.support.free) {
        setError(
          'You have reached the daily limit (3 chats). Upgrade to Pro for unlimited AI support.'
        )
        return
      }
    }

    // Check advisor permission
    if (mode === 'advisor' && isFreeUser) {
      setError(
        'Compliance Advisor is exclusive to Pro subscribers. Upgrade to unlock 1v1 AI compliance consulting.'
      )
      return
    }

    const userMessage: ChatMessage = { role: 'user', content: trimmed }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (user?.email) {
        headers['x-user-email'] = user.email
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: newMessages,
          mode,
          locale: detectLocale(),
        }),
      })

      if (!response.ok) {
        if (response.status === 403) {
          const data = await response.json()
          setError(data.message || 'This feature requires a subscription upgrade.')
          setIsLoading(false)
          return
        }
        throw new Error('Failed to get response')
      }

      // Read streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      if (reader) {
        // Add placeholder assistant message
        setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          assistantContent += chunk
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { role: 'assistant', content: assistantContent },
          ])
        }
      }

      // Update usage counter
      if (mode === 'support' && isFreeUser) {
        const updated = {
          date: getToday(),
          count: effectiveSupportUsage.count + 1,
        }
        saveUsage(STORAGE_KEYS.support, updated)
      } else if (mode === 'advisor') {
        const updated = {
          date: getMonth(),
          count: effectiveAdvisorUsage.count + 1,
        }
        saveUsage(STORAGE_KEYS.advisor, updated)
      }
    } catch (err) {
      console.error('Chat error:', err)
      setError('Sorry, something went wrong. Please try again.')
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            mode === 'advisor'
              ? 'Sorry, the Compliance Advisor is temporarily unavailable. Please try again later or contact support.'
              : 'Sorry, I am temporarily unavailable. Please try again later.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, mode, messages, user, isFreeUser, effectiveSupportUsage, effectiveAdvisorUsage])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearHistory = () => {
    setMessages([])
    localStorage.removeItem(STORAGE_KEYS.history)
  }

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-[#0A4D8C] to-[#00A86B] text-white shadow-lg shadow-[#0A4D8C]/30 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-2rem)] bg-[#1A1A24] rounded-2xl border border-[#252530] shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#252530] bg-gradient-to-r from-[#0A4D8C]/20 to-[#00A86B]/10">
            <div className="flex items-center gap-2">
              {mode === 'advisor' ? (
                <Shield className="w-5 h-5 text-[#00A86B]" />
              ) : (
                <MessageCircle className="w-5 h-5 text-[#0A4D8C]" />
              )}
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {mode === 'advisor' ? 'AI Compliance Advisor' : 'AI Support'}
                </h3>
                <p className="text-xs text-gray-400">
                  {mode === 'advisor'
                    ? 'Expert in ANVISA & COFEPRIS'
                    : '24/7 Customer Support'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-[#252530] flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode switcher */}
          <div className="flex border-b border-[#252530]">
            <button
              onClick={() => handleModeSwitch('support')}
              className={`flex-1 py-2 text-xs font-medium transition-colors cursor-pointer ${
                mode === 'support'
                  ? 'text-[#0A4D8C] border-b-2 border-[#0A4D8C]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Support
            </button>
            <button
              onClick={() => handleModeSwitch('advisor')}
              className={`flex-1 py-2 text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                mode === 'advisor'
                  ? 'text-[#00A86B] border-b-2 border-[#00A86B]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              Advisor
              <span className="text-[10px] px-1 py-0.5 rounded bg-amber-500/20 text-amber-400">
                Pro
              </span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm py-8">
                {mode === 'advisor' ? (
                  <div className="space-y-2">
                    <Shield className="w-8 h-8 mx-auto text-[#00A86B]" />
                    <p>Ask me about ANVISA/COFEPRIS regulations,</p>
                    <p>ingredient compliance, or listing reviews.</p>
                    {!user && (
                      <p className="text-amber-400 text-xs mt-2">
                        Login required for Advisor mode
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <MessageCircle className="w-8 h-8 mx-auto text-[#0A4D8C]" />
                    <p>Hi! How can I help you today?</p>
                    {isFreeUser && (
                      <p className="text-gray-500 text-xs">
                        Free users: {supportRemaining} chats remaining today
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-[#0A4D8C] text-white'
                      : 'bg-[#252530] text-gray-200'
                  }`}
                >
                  {msg.content || (isLoading && idx === messages.length - 1 && msg.role === 'assistant') ? (
                    <span>{msg.content}</span>
                  ) : (
                    <span className="italic text-gray-500">...</span>
                  )}
                </div>
              </div>
            ))}

            {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
              <div className="flex justify-start">
                <div className="bg-[#252530] rounded-xl px-3 py-2 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                  <span className="text-sm text-gray-400">Thinking...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-800/30 rounded-xl px-3 py-2 text-sm text-red-400">
                {error}
                {error.includes('Upgrade') && (
                  <a
                    href="/pricing"
                    className="block mt-1 text-[#00A86B] hover:underline"
                  >
                    View Pricing →
                  </a>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t border-[#252530] p-3">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  mode === 'advisor'
                    ? 'Ask about regulations, ingredients...'
                    : 'Ask anything...'
                }
                className="flex-1 bg-[#252530] text-white text-sm rounded-lg px-3 py-2 resize-none outline-none focus:ring-1 focus:ring-[#0A4D8C] placeholder-gray-500 min-h-[40px] max-h-[100px]"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 rounded-lg bg-[#0A4D8C] text-white flex items-center justify-center hover:bg-[#1E6BB8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <button
                onClick={clearHistory}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
              >
                Clear chat
              </button>
              {mode === 'support' && isFreeUser && (
                <span className="text-xs text-gray-500">
                  {supportRemaining} left today
                </span>
              )}
              {mode === 'advisor' && user && (
                <span className="text-xs text-gray-500">
                  {advisorRemaining} left this month
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
