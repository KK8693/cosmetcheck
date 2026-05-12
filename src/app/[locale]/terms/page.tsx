export const runtime = 'edge'

export const metadata = {
  title: 'Terms of Service - CosmetCheck',
  description: 'CosmetCheck Terms of Service',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom max-w-3xl py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <p className="text-gray-500 mb-12">Last updated: May 12, 2025</p>

        <div className="prose prose-gray max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Service Description</h2>
            <p className="text-gray-600 leading-relaxed">
              CosmetCheck is a cosmetic compliance detection tool for Latin American markets. 
              We help sellers verify if their products comply with ANVISA (Brazil) and COFEPRIS 
              (Mexico) regulations, and generate compliant e-commerce listings.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Account & Registration</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You must provide a valid email address and password to create an account. 
              You are responsible for maintaining the security of your account.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>You must be at least 18 years old</li>
              <li>You must provide accurate information</li>
              <li>One account per person</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Service Tiers</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-4">
              <h3 className="text-lg font-semibold mb-3">Free Tier</h3>
              <p className="text-gray-600">10 compliance checks per month. Limited to individual sellers.</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg mb-4">
              <h3 className="text-lg font-semibold mb-3">Pro Tier - $29/month</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Unlimited compliance checks</li>
                <li>AI Listing generation (Portuguese/Spanish)</li>
                <li>Real-time regulatory updates</li>
                <li>Priority support</li>
                <li>CSV batch detection</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Team Tier</h3>
              <p className="text-gray-600">Contact us for team pricing and features.</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Payment & Subscription</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Pro subscriptions are billed at $29/month or $245/year. 
              Subscriptions renew automatically unless cancelled before the next billing date.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              All prices are exclusive of applicable taxes. Tax will be calculated at checkout.
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong>Cancellation:</strong> You can cancel anytime via Account Settings → Billing → Cancel Subscription. 
              Your service will continue until the end of the current billing period.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Acceptable Use</h2>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Allowed:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Using the service for legitimate compliance checking</li>
              <li>Generating compliant e-commerce listings</li>
              <li>Providing feedback for improvement</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Prohibited:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Uploading illegal, harmful, or prohibited content</li>
              <li>Attempting to hack or attack the service</li>
              <li>Abusing free tier (automated bulk testing)</li>
              <li>Using AI-generated content for illegal purposes</li>
              <li>Creating multiple accounts to bypass limits</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. AI-Generated Content Disclaimer</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The AI-generated listings are provided for reference only and do not constitute legal advice. 
              You are solely responsible for verifying compliance before using any listing.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              We do not guarantee the accuracy, completeness, or fitness for a particular purpose 
              of AI-generated content. We recommend consulting a local compliance consultant 
              or attorney before listing products for sale.
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong>Content Ownership:</strong> You retain full ownership of the product information 
              you input. AI-generated content may be used for your commercial purposes, 
              but you bear all compliance responsibilities.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed">
              The CosmetCheck website, service, and all underlying technology are proprietary 
              and protected by intellectual property laws. You may not copy, modify, or distribute 
              any part of our service without prior written consent.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The service is provided &quot;AS IS&quot; without any warranties, express or implied. 
              We do not guarantee that the service will be uninterrupted, secure, or error-free.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              We shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages resulting from your use of or inability to use the service.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You bear all risks associated with compliance decisions made based on our service. 
              Regulatory requirements vary and change frequently.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Service Changes & Termination</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may modify, suspend, or discontinue any part of the service at any time 
              with reasonable notice.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              If your subscription is terminated due to violation of these terms, 
              we will not provide refunds.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You may cancel your subscription at any time. Upon cancellation, 
              you will retain access until the end of your current billing period.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Governing Law & Disputes</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              These terms are governed by the laws of <strong>Brazil</strong>, with specific consideration for:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Users in Brazil: Lei Geral de Proteção de Dados (LGPD - Law 13,709/2018)</li>
              <li>Users in Mexico: Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</li>
              <li>Users in the EU: General Data Protection Regulation (GDPR)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mb-4">
              Any disputes arising from these terms shall first be resolved through good-faith negotiation. 
              If unresolved within 30 days, disputes will be submitted to binding arbitration under the 
              rules of the <strong>Centro de Arbitragem e Mediação de Lisboa (CAML)</strong> or, 
              for Brazilian users, the <strong>Câmara de Arbitragem do Mercado (CAM)</strong> - B3.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Notwithstanding the above, we reserve the right to seek injunctive relief 
              in any competent jurisdiction to protect our intellectual property rights.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              For questions about these terms, please contact us:
            </p>
            <p className="text-gray-600">
              Email: support@cosmetcheck.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}