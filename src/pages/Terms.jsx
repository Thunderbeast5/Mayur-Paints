import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const sections = [
  { title: 'Acceptance of Terms', content: 'By accessing or using the Mayur Paints website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.' },
  { title: 'Products & Pricing', content: 'All prices are in Indian Rupees (INR) and include applicable taxes unless stated otherwise. We reserve the right to change prices at any time. Product images are for illustration purposes — actual colour may vary slightly due to screen calibration.' },
  { title: 'Orders & Payment', content: 'Orders are confirmed only after successful payment. We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery. For COD orders, payment must be made at the time of delivery. We reserve the right to cancel orders in case of pricing errors or stock unavailability.' },
  { title: 'Shipping & Delivery', content: 'We deliver across India. Standard delivery takes 3–5 business days. Free delivery on orders above ₹2,000. Delivery timelines are estimates and may vary due to logistics or unforeseen circumstances. Risk of loss passes to you upon delivery.' },
  { title: 'Returns & Refunds', content: 'Unopened products in original packaging may be returned within 15 days. Custom-mixed shades are non-returnable. Refunds are processed within 7–10 business days to the original payment method. Shipping charges are non-refundable unless the return is due to our error.' },
  { title: 'Intellectual Property', content: 'All content on this website — including text, images, logos, and software — is the property of Mayur Paints and protected by Indian copyright law. You may not reproduce, distribute, or create derivative works without our written permission.' },
  { title: 'Limitation of Liability', content: 'Mayur Paints shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our total liability shall not exceed the amount paid for the specific order in question.' },
  { title: 'Governing Law', content: 'These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Maharashtra, India. We encourage resolving disputes amicably before pursuing legal action.' },
]

export default function Terms() {
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
            <span className="font-semibold text-slate-900 dark:text-slate-100">Terms of Service</span>
          </div>
          <h1 className="text-4xl font-black mb-3">Terms of <span className="text-primary">Service</span></h1>
          <p className="text-slate-500">Last updated: April 2026 · Please read carefully before using our services.</p>
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
          <p className="text-sm text-slate-500">Questions about these terms? Contact us at <a href="mailto:legal@mayurpaints.com" className="text-primary font-semibold hover:underline">legal@mayurpaints.com</a> or visit our <Link to="/contact" className="text-primary font-semibold hover:underline">Contact page</Link>.</p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
