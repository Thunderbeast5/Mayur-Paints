import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const sections = [
  { title: 'Information We Collect', content: 'We collect information you provide directly — such as your name, email address, phone number, and shipping address when you create an account or place an order. We also collect usage data such as pages visited, products viewed, and cart activity to improve your experience.' },
  { title: 'How We Use Your Information', content: 'Your information is used to process orders, send order confirmations and shipping updates, provide customer support, personalise your shopping experience, and send promotional offers (only if you opt in). We never sell your personal data to third parties.' },
  { title: 'Data Security', content: 'All data is transmitted over HTTPS with 256-bit SSL encryption. Payment information is processed securely and we follow industry-standard security practices to protect your data.' },
  { title: 'Cookies', content: 'We use cookies to keep you logged in, remember your cart, and analyse site traffic. You can disable cookies in your browser settings, but some features may not work correctly. We do not use cookies for advertising tracking.' },
  { title: 'Third-Party Services', content: 'We use standard analytics tools to understand site usage. These services have their own privacy policies. We do not share your personal information with advertisers.' },
  { title: 'Your Rights', content: 'You have the right to access, correct, or delete your personal data at any time. You can update your profile from your dashboard or contact us at privacy@mayurpaints.com. We will respond to all requests within 7 business days.' },
  { title: 'Data Retention', content: 'We retain your account data for as long as your account is active. Order history is retained for 7 years as required by Indian tax law. You may request deletion of your account and associated data at any time.' },
  { title: 'Changes to This Policy', content: 'We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on our website. Continued use of our services after changes constitutes acceptance of the updated policy.' },
]

export default function Privacy() {
  const { totalCount: cartCount } = useSelector(s => s.cart)
  const { role: userRole } = useSelector(s => s.auth)

  return (
    <div className="bg-white dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <Navbar cartCount={cartCount} userRole={userRole} />

      <section className="bg-gradient-to-r from-primary/5 via-white to-white dark:from-primary/10 dark:via-slate-950 dark:to-slate-950 py-12 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">Privacy Policy</span>
          </div>
          <h1 className="text-4xl font-black mb-3">Privacy <span className="text-primary">Policy</span></h1>
          <p className="text-slate-500">Last updated: April 2026 · Effective immediately</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="space-y-8">
          {sections.map((s, i) => (
            <div key={s.title} className="border-b border-slate-100 dark:border-slate-800 pb-8 last:border-0">
              <h2 className="text-lg font-black mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0">{i + 1}</span>
                {s.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{s.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
          <p className="text-sm text-slate-500">Questions about our privacy practices? Contact us at <a href="mailto:privacy@mayurpaints.com" className="text-primary font-semibold hover:underline">privacy@mayurpaints.com</a> or visit our <Link to="/contact" className="text-primary font-semibold hover:underline">Contact page</Link>.</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
