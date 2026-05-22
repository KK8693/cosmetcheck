import { redirect } from 'next/navigation'

export const runtime = 'edge'

export default function ContactRedirect() {
  redirect('/en/contact')
}
