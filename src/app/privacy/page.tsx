export const metadata = {
  title: 'Privacy Policy - CosmetCheck',
  description: 'CosmetCheck Privacy Policy covering GDPR, LGPD, and LFPDPPP compliance',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom max-w-3xl py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <p className="text-gray-500 mb-12">Last updated: May 2025</p>

        <div className="prose prose-gray max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              CosmetCheck (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal data when you use our cosmetic compliance checking service.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We comply with the General Data Protection Regulation (GDPR) for users in the European Union, the Lei Geral de Proteção de Dados (LGPD) for users in Brazil, and the Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) for users in Mexico.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Data We Collect</h2>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">2.1 Product Information</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We collect product information that you voluntarily submit for compliance checking, including:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
              <li>Product names and descriptions</li>
              <li>Ingredient lists</li>
              <li>Target markets (e.g., Brazil, Mexico)</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">2.2 Account Information</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              When you create an account, we collect:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
              <li>Email address</li>
              <li>Name (optional)</li>
              <li>Subscription tier and usage data</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">2.3 Technical Data</h3>
            <p className="text-gray-600 leading-relaxed">
              We automatically collect certain technical information, including IP addresses, browser type, and device information, for security and analytics purposes.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Data</h2>
            <p className="text-gray-600 leading-relaxed mb-4">We use your data to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Provide cosmetic compliance checking services</li>
              <li>Generate AI-powered listings in Portuguese and Spanish</li>
              <li>Process payments and manage subscriptions</li>
              <li>Improve our regulatory database and detection accuracy</li>
              <li>Communicate service updates and regulatory changes</li>
              <li>Prevent fraud and abuse</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Storage and Security</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              All data is transmitted using TLS encryption and stored in secure, SOC 2-compliant data centers. We use Supabase for database hosting with Row Level Security (RLS) enabled.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We do not sell your data to third parties. Product information is used solely for compliance checking purposes.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-4">Under GDPR, LGPD, and LFPDPPP, you have the right to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your data (right to erasure)</li>
              <li>Export your data (data portability)</li>
              <li>Withdraw consent at any time</li>
              <li>Object to data processing</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your data for as long as your account is active or as needed to provide services. You can request deletion of your account and associated data at any time by contacting privacy@cosmetcheck.com.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              For privacy-related questions or to exercise your rights, please contact us at:
            </p>
            <p className="text-gray-600 leading-relaxed mt-2">
              Email: privacy@cosmetcheck.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
