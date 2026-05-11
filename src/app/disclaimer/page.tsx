import { redirect } from 'next/navigation'

export const runtime = 'edge'

export default function DisclaimerRedirect() {
  redirect('/en/disclaimer')
}
