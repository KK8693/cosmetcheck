import { redirect } from 'next/navigation'

export const runtime = 'edge'

export default function AboutRedirect() {
  redirect('/en/about')
}
