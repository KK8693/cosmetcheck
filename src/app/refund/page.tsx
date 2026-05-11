import { redirect } from 'next/navigation'

export const runtime = 'edge'

export default function RefundRedirect() {
  redirect('/en/refund')
}
