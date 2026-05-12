export const runtime = 'edge'

export const metadata = {
  title: 'Refund Policy - CosmetCheck',
  description: 'CosmetCheck Refund Policy',
}

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom max-w-3xl py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Refund Policy</h1>
        <p className="text-gray-500 mb-12">Last updated: May 12, 2025</p>

        <div className="prose prose-gray max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Refund Window</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>First-time subscribers:</strong> 7 days from purchase date</li>
              <li><strong>Renewals:</strong> No refund (unless required by law)</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility for Refund</h2>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Qualifying for a Refund:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>First-time subscription within 7 days of purchase</li>
              <li>Service has major technical issues preventing use</li>
              <li>Other circumstances as required by applicable law</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">NOT Eligible for Refund:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Service used for more than 7 days</li>
              <li>Abuse of subscription benefits (multiple accounts)</li>
              <li>Violation of Terms of Service resulting in account suspension</li>
              <li>Manual subscription cancellation</li>
              <li>Change of mind after 7 days</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Credits / Points</h2>
            <p className="text-gray-600 leading-relaxed">
              CosmetCheck does not offer credits or points purchases. 
              Free tier provides 10 checks per month on a rolling basis. 
              Unused quota does not roll over to the next month.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How to Request a Refund</h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-3">
              <li>Email <strong>support@cosmetcheck.com</strong></li>
              <li>Subject line: <strong>[Refund Request] your@email.com</strong></li>
              <li>Include: Order ID, subscription tier, reason for refund</li>
              <li>We will process within <strong>5-10 business days</strong></li>
              <li>Refund will be credited to your original payment method</li>
            </ol>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Dispute Resolution</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you are not satisfied with our refund decision, please contact us at 
              support@cosmetcheck.com. We will respond within 3 business days.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We encourage customers to contact us first before initiating 
              a chargeback with their bank or payment provider.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Subscription Cancellation</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong>Cancellation Path:</strong> Account Settings → Billing → Cancel Subscription
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              After cancellation, you will retain access until the end of your current billing period. 
              No refund will be provided for the remaining days.
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong>Automatic Renewal:</strong> Your subscription will automatically renew 
              on each billing date unless cancelled at least 24 hours before the renewal date.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Chargeback Policy</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We strongly recommend contacting our support team at <strong>support@cosmetcheck.com</strong> 
              before initiating any chargeback dispute. Most payment issues can be resolved directly 
              within 5-10 business days.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong>Chargeback Process:</strong> If you proceed with a chargeback, we will respond 
              by providing transaction records, service usage logs, and proof of delivery to your 
              payment provider. We actively dispute all unwarranted chargebacks.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong>Consequences of Unfounded Chargebacks:</strong>
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Permanent account suspension without prior notice</li>
              <li>Loss of access to all CosmetCheck services</li>
              <li>Restriction from creating new accounts</li>
              <li>Reporting to relevant fraud databases (where permitted by law)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              Repeated or abusive chargeback patterns may result in legal action to recover 
              unpaid services plus associated administrative fees.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              For refund inquiries: support@cosmetcheck.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}