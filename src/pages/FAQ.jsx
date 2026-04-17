import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const faqs = [
  { cat: 'Orders & Delivery', items: [
    { q: 'Do you deliver across India?', a: 'Yes! We deliver to all major cities and towns across 28 states. Orders above ₹2,000 qualify for free delivery. Standard delivery takes 3–5 business days.' },
    { q: 'Can I track my order?', a: 'Yes. Once your order is shipped you will receive a tracking link via email. You can also track it from your dashboard under My Orders.' },
    { q: 'What is your return policy?', a: 'Unopened products in original packaging can be returned within 15 days of delivery. Custom-mixed shades are non-returnable. Raise a return request from your dashboard.' },
    { q: 'Can I cancel my order?', a: 'Orders can be cancelled before they are shipped. Once shipped, cancellation is not possible. Contact us immediately at 1800-200-1234 for urgent cancellations.' },
  ]},
  { cat: 'Products', items: [
    { q: 'How do I choose the right paint finish?', a: 'Matte is ideal for ceilings and low-traffic areas. Satin works well for living rooms and bedrooms. Gloss is best for kitchens, bathrooms, and trim work.' },
    { q: 'How much paint do I need?', a: 'One litre of standard emulsion covers approximately 120–140 sq ft with two coats. Measure your wall area (length × height) and divide by 130 for a rough estimate.' },
    { q: 'Are your paints eco-friendly?', a: 'Yes. Our interior range is low-VOC and child-safe. Our premium Royale range is zero-VOC. All products comply with BIS standards.' },
    { q: 'Do you offer custom colour mixing?', a: 'Yes! Visit any of our dealer stores for custom colour mixing. You can also use our Colour Cosmos visualizer to preview shades before ordering.' },
  ]},
  { cat: 'Services', items: [
    { q: 'How do I book a painting service?', a: 'Fill the contact form on our Contact page or call 1800-200-1234. Our team will schedule a free home visit within 24 hours.' },
    { q: 'What areas do your painting services cover?', a: 'We currently offer professional painting services in Mumbai, Pune, Delhi, Bangalore, Hyderabad, and Chennai. More cities coming soon.' },
    { q: 'How long does a typical painting project take?', a: 'A standard 2BHK apartment takes 3–5 days. Larger projects are estimated during the free site visit. We work on weekends too.' },
    { q: 'Do you provide a warranty on painting services?', a: 'Yes. All our painting services come with a 2-year workmanship warranty. If any issues arise, we fix them free of charge.' },
  ]},
  { cat: 'Account & Payments', items: [
    { q: 'What payment methods do you accept?', a: 'We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery (COD). All online payments are secured with 256-bit SSL encryption.' },
    { q: 'Do you offer contractor or bulk discounts?', a: 'Yes! Registered contractors and bulk buyers get 15–30% off. Contact our B2B team at enterprise@mayurpaints.com for details.' },
    { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page and enter your registered email. You will receive a reset link within 5 minutes.' },
  ]},
]

export default function FAQ() {
  const { totalCount: cartCount } = useSelector(s => s.cart)
  const { role: userRole } = useSelector(s => s.auth)
  const [open, setOpen] = useState({})

  function toggle(key) {
    setOpen(p => ({ ...p, [key]: !p[key] }))
  }

  return (
    <div className="bg-white dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <Navbar cartCount={cartCount} userRole={userRole} />

      {/* Hero */}
      <section className="bg-gradient-to-r from-primary/5 via-white to-white dark:from-primary/10 dark:via-slate-950 dark:to-slate-950 py-12 sm:py-16 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">FAQs</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-3">Frequently Asked <span className="text-primary">Questions</span></h1>
          <p className="text-slate-500 text-lg">Everything you need to know about our products, services, and policies.</p>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="space-y-10">
          {faqs.map(section => (
            <div key={section.cat}>
              <h2 className="text-lg font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">help_outline</span>
                {section.cat}
              </h2>
              <div className="space-y-3">
                {section.items.map((item, i) => {
                  const key = `${section.cat}-${i}`
                  return (
                    <div key={key} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:border-primary/20 transition-all">
                      <button onClick={() => toggle(key)} className="w-full flex items-center justify-between px-6 py-4 text-left gap-4">
                        <span className="font-semibold text-sm sm:text-base">{item.q}</span>
                        <span className={`material-symbols-outlined text-primary flex-shrink-0 transition-transform ${open[key] ? 'rotate-180' : ''}`}>expand_more</span>
                      </button>
                      {open[key] && (
                        <div className="px-6 pb-5 text-slate-500 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                          {item.a}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-14 bg-gradient-to-br from-primary to-orange-500 rounded-3xl p-8 text-white text-center">
          <h3 className="text-2xl font-black mb-2">Still have questions?</h3>
          <p className="text-white/80 mb-6">Our support team is available Mon–Sat, 9 AM – 8 PM.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="bg-white text-primary px-6 py-3 rounded-xl font-bold hover:-translate-y-0.5 transition-all shadow-lg">Contact Us</Link>
            <a href="tel:+911800200123" className="bg-white/15 border border-white/30 px-6 py-3 rounded-xl font-bold hover:bg-white/25 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">call</span>1800-200-1234
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
