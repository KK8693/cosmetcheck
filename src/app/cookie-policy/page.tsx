export const runtime = 'edge'

export const metadata = {
  title: 'Cookie Policy - CosmetCheck',
  description: 'CosmetCheck Cookie Policy',
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom max-w-3xl py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
        <p className="text-gray-500 mb-12">Last updated: May 2025</p>

        <div className="prose prose-gray max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              Cookies are small text files stored on your device when you visit websites. 
              They help the site function properly and provide analytics to site owners.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Cookies We Use</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Essential Cookies</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Cookie Name</th>
                    <th className="px-4 py-2">Purpose</th>
                    <th className="px-4 py-2">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-2">supabase-auth-token</td>
                    <td className="px-4 py-2">Keep you logged in</td>
                    <td className="px-4 py-2">Session</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-2">__cf_bm</td>
                    <td className="px-4 py-2">Cloudflare bot management</td>
                    <td className="px-4 py-2">30 minutes</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Analytics Cookies</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Currently, we do NOT use analytics cookies (Google Analytics, Plausible, etc.). 
              If we add analytics in the future, we will update this policy and request your consent.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Third-Party Cookies</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The following third parties may set cookies when you use our service:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Stripe</strong> - Payment security and fraud prevention</li>
              <li><strong>Supabase</strong> - Authentication and session management</li>
              <li><strong>Cloudflare</strong> - Security and performance</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Managing Cookies</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You can control or delete cookies through your browser settings:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><strong>Chrome:</strong> Settings → Privacy → Cookies</li>
              <li><strong>Firefox:</strong> Options → Privacy → Cookies</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
              <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              Note: Blocking essential cookies may prevent some features from working properly.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Updates to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this policy from time to time. Any changes will be posted on this page 
              with an updated &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              For questions about our Cookie Policy: support@cosmetcheck.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}