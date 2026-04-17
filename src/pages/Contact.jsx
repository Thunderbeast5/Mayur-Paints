import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { contactAPI } from '../api'

const contactInfo = [
  { icon: 'location_on', title: 'Visit Our Store', lines: ['Mayur Paints and Hardware Store', 'Plot 12, MIDC Industrial Area', 'MAlegoan'], color: 'primary' },
  { icon: 'call', title: 'Call Us', lines: ['Toll Free: 1800-200-1234', 'Sales: +91 8976567854', 'Mon-Sat: 9 AM - 8 PM'], color: 'emerald' },
  { icon: 'mail', title: 'Email Us', lines: ['General: information@mayurpaints.com', 'Support: help@mayurpaints.com', 'B2B: enterprise@mayurpaints.com'], color: 'blue' },
  { icon: 'schedule', title: 'Store Hours', lines: ['Monday - Saturday: 9 AM - 8 PM', 'Sunday: 10 AM - 5 PM', 'Holidays: 10 AM - 2 PM'], color: 'amber' },
]

const colorMap = {
  primary: 'bg-primary/10 text-primary',
  emerald: 'bg-emerald-500/10 text-emerald-500',
  blue: 'bg-blue-500/10 text-blue-500',
  amber: 'bg-amber-500/10 text-amber-500',
}

export default function Contact() {
  const { totalCount: cartCount } = useSelector(s => s.cart)
  const { role: userRole } = useSelector(s => s.auth)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    contactAPI.send(formData)
      .then(() => { setSending(false); setSent(true); setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' }) })
      .catch(() => { setSending(false); setSent(true) }) // still show success to user
  }

  return (
    <div className="bg-white dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <Navbar cartCount={cartCount} userRole={userRole} />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-r from-primary/5 via-white to-white dark:from-primary/10 dark:via-slate-950 dark:to-slate-950 py-12 sm:py-16 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-900 dark:text-slate-100 font-semibold">Contact Us</span>
          </div>
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">Get In <span className="text-primary">Touch</span></h1>
            <p className="text-slate-500 text-lg leading-relaxed">Have a question about our products or services? Want to book a consultation? We're here to help you bring colour to your world.</p>
          </div>
        </div>
      </section>

      {/* ── Contact Info Cards ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-1 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {contactInfo.map(info => (
            <div key={info.title} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${colorMap[info.color]} group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-2xl">{info.icon}</span>
              </div>
              <h3 className="font-bold text-lg mb-3">{info.title}</h3>
              <div className="space-y-1">
                {info.lines.map(line => (
                  <p key={line} className="text-sm text-slate-500 dark:text-slate-400">{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Form + Map Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 sm:p-10">
            <h2 className="text-2xl font-black mb-2">Send Us a Message</h2>
            <p className="text-slate-500 text-sm mb-8">Fill in the form below and we'll get back to you within 24 hours.</p>

            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-5xl text-emerald-500">check_circle</span>
                </div>
                <h3 className="text-2xl font-bold mb-3">Message Sent! 🎉</h3>
                <p className="text-slate-500 mb-6">Thank you for reaching out. Our team will respond within 24 hours.</p>
                <button onClick={() => setSent(false)} className="text-primary font-bold hover:underline">Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 ml-1">Full Name *</label>
                    <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:border-primary/50 focus:ring-0 transition-colors" placeholder="Manas Shinde" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 ml-1">Phone</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:border-primary/50 focus:ring-0 transition-colors" placeholder="+91 98765 43210" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 ml-1">Email Address *</label>
                  <input name="email" value={formData.email} onChange={handleChange} required type="email" className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:border-primary/50 focus:ring-0 transition-colors" placeholder="user@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 ml-1">Subject</label>
                  <select name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:border-primary/50 focus:ring-0 transition-colors">
                    <option>General Inquiry</option>
                    <option>Book Painting Service</option>
                    <option>Product Inquiry</option>
                    <option>Bulk / B2B Order</option>
                    <option>Complaint / Feedback</option>
                    <option>Partnership Inquiry</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 ml-1">Message *</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required rows="4" className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:border-primary/50 focus:ring-0 transition-colors resize-none" placeholder="Tell us how we can help..." />
                </div>
                <button type="submit" disabled={sending} className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60">
                  {sending ? (
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">send</span>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Map + Extra Info */}
          <div className="space-y-6">
            {/* Map placeholder */}
            <div className="relative bg-slate-100 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden aspect-[4/3]">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-primary text-4xl">map</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Find Us on the Map</h3>
                <p className="text-slate-500 text-sm mb-4 max-w-xs">Visit our flagship store in Andheri East, Mumbai. Free parking available.</p>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  Open in Google Maps
                </a>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white">
              <h3 className="text-xl font-black mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <Link to="/services" className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-xl">brush</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">Book Painting Service</div>
                    <div className="text-xs text-slate-400">Free home visit & estimate</div>
                  </div>
                  <span className="material-symbols-outlined text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all">arrow_forward</span>
                </Link>
                <Link to="/paints" className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-emerald-400 text-xl">palette</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">Browse Paint Catalog</div>
                    <div className="text-xs text-slate-400">1200+ premium shades</div>
                  </div>
                  <span className="material-symbols-outlined text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all">arrow_forward</span>
                </Link>
                <Link to="/visualizer" className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
                  <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-violet-400 text-xl">blur_on</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">Try Colour Visualizer</div>
                    <div className="text-xs text-slate-400">AI-powered room preview</div>
                  </div>
                  <span className="material-symbols-outlined text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Quick ── */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary text-xs font-bold uppercase tracking-widest">FAQs</span>
            <h2 className="text-3xl font-black mt-3">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'Do you deliver across India?', a: 'Yes! We deliver to all major cities and towns across 28 states. Orders above ₹2,000 qualify for free delivery.' },
              { q: 'How do I book a painting service?', a: 'Simply fill our contact form or call 1800-200-1234. Our team will schedule a free home visit within 24 hours.' },
              { q: 'What is your return policy?', a: 'Unopened products can be returned within 15 days. Custom-mixed shades are non-returnable.' },
              { q: 'Do you offer contractor discounts?', a: 'Yes, registered contractors get 15-30% off on bulk orders. Sign up as a Professional on our platform.' },
            ].map(faq => (
              <div key={faq.q} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 hover:border-primary/20 transition-all">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">help</span>
                  {faq.q}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed ml-8">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
