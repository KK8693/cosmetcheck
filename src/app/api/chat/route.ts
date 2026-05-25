import { NextRequest } from 'next/server'
import { chatWithAI, ChatMode } from '@/lib/ai'
import { checkChatAccess } from '@/lib/subscription'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, mode = 'support', locale = 'zh' } = body as {
      messages: Array<{ role: 'user' | 'assistant'; content: string }>
      mode?: ChatMode
      locale?: string
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate mode
    if (mode !== 'support' && mode !== 'advisor') {
      return new Response(
        JSON.stringify({ error: 'Invalid mode. Use "support" or "advisor"' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Check permissions for all modes
    const userEmail = request.headers.get('x-user-email')
    if (!userEmail) {
      return new Response(
        JSON.stringify({
          error: 'Login required',
          message: 'Chat requires login. Please sign in or upgrade to Pro.',
          upgradeUrl: '/pricing',
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { allowed, tier, reason } = await checkChatAccess(userEmail, mode)
    if (!allowed) {
      const isMonthly = tier === 'pro-monthly'
      const isAdvisor = mode === 'advisor'
      return new Response(
        JSON.stringify({
          error: isAdvisor ? 'Pro Annual subscription required' : 'Pro subscription required',
          message: isAdvisor && isMonthly
            ? 'Compliance Advisor is exclusive to Pro Annual subscribers. Upgrade to unlock 1v1 AI compliance consulting.'
            : 'Chat is exclusive to Pro subscribers. Please upgrade to unlock this feature.',
          tier,
          reason,
          upgradeUrl: '/pricing',
          isMonthly,
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Convert messages to include locale hint in the last user message
    const processedMessages = messages.map((m, idx) => {
      if (m.role === 'user' && idx === messages.length - 1) {
        return {
          ...m,
          content: m.content,
        }
      }
      return m
    })

    const stream = await chatWithAI(processedMessages, mode, locale)

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-user-email',
    },
  })
}
