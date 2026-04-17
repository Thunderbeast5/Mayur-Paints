import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const services = [
  {
    id: 'interior',
    icon: 'weekend',
    title: 'Interior Painting',
    tagline: 'Transform every room',
    desc: 'Our certified painters deliver flawless interior finishes — from living rooms to bedrooms. We handle surface prep, priming, and final coats with premium Mayur paints.',
    features: ['Free colour consultation', 'Surface preparation included', '2-year workmanship warranty', 'Zero-VOC paint options', 'Furniture protection', 'Same-day cleanup'],
    price: 'From ₹12/sq.ft',
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    color: 'primary',
  },
  {
    id: 'exterior',
    icon: 'home',
    title: 'Exterior Painting',
    tagline: 'Weather-proof protection',
    desc: 'Protect your home from sun, rain, and dust with our advanced exterior coating systems. We use weatherproof formulations that last up to 10 years.',
    features: ['Weatherproof coatings', 'Anti-fungal treatment', '5-year paint warranty', 'Crack filling included', 'Scaffolding arranged', 'Post-work inspection'],
    price: 'From ₹18/sq.ft',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    color: 'blue',
  },
  {
    id: 'waterproofing',
    icon: 'water_drop',
    title: 'Waterproofing',
    tagline: 'Stop leaks permanently',
    desc: 'Advanced waterproofing solutions for terraces, bathrooms, basements, and walls. Our multi-layer system prevents seepage and dampness permanently.',
    features: ['Terrace & roof waterproofing', 'Bathroom waterproofing', 'Basement protection', '10-year guarantee', 'Thermal insulation option', 'Emergency repair service'],
    price: 'From ₹45/sq.ft',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    color: 'emerald',
  },
  {
    id: 'texture',
    icon: 'texture',
    title: 'Texture & Decorative',
    tagline: 'Artistic wall finishes',
    desc: 'Elevate your interiors with premium texture finishes — from Italian stucco to Venetian plaster. Our artisan painters create stunning feature walls.',
    features: ['50+ texture patterns', 'Venetian plaster', 'Metallic finishes', 'Stencil art', 'Ombre effects', 'Custom designs'],
    price: 'From ₹35/sq.ft',
    img: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80',
    color: 'violet',
  },
  {
    id: 'commercial',
    icon: 'business',
    title: 'Commercial Painting',
    tagline: 'For offices & retail',
    desc: 'Minimal disruption, maximum impact. We handle offices, retail spaces, hotels, and industrial facilities with dedicated project managers.',
    features: ['Night & weekend shifts', 'Dedicated project manager', 'Bulk pricing', 'Annual maintenance contracts', 'Brand colour matching', 'Fire-retardant options'],
    price: 'Custom quote',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    color: 'amber',
  },
]

const colorMap = {
  primary: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30', btn: 'bg-primary hover:bg-primary/90 shadow-primary/20' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/30', btn: 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/30', btn: 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-500', border: 'border-violet-500/30', btn: 'bg-violet-500 hover:bg-violet-600 shadow-violet-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30', btn: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' },
}

const process_steps = [
  { icon: 'call', title: 'Book Free Visit', desc: 'Call us or fill the form. Our expert visits your home within 24 hours.' },
  { icon: 'palette', title: 'Colour Consultation', desc: 'Choose from 1200+ shades with our colour consultant. We bring shade cards to your home.' },
  { icon: 'calculate', title: 'Get Estimate', desc: 'Transparent pricing with no hidden charges. Detailed quote within 2 hours.' },
  { icon: 'construction', title: 'Professional Execution', desc: 'Our trained painters handle everything — from masking to final coat. Supervised daily.' },
  { icon: 'verified', title: 'Quality Inspection', desc: 'Post-work inspection by our quality team. Touch-ups included. Full cleanup.' },
]

export default function Services() {
  const { totalCount: cartCount } = useSelector(s => s.cart)
  const { role: userRole } = useSelector(s => s.auth)
  const [expanded, setExpanded] = useState(null)

  return (
    <div className="bg-white dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <Navbar cartCount={cartCount} userRole={userRole} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-24 sm:py-32">
        <div className="absolute inset-0 opacity-15">
          <img src="https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1400&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-white font-semibold">Our Services</span>
          </div>
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 text-primary text-xs font-bold rounded-full mb-6 uppercase tracking-widest border border-primary/30">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
              Professional Services
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Expert Painting <span className="text-primary">Services</span> For Every Need
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              From interior makeovers to industrial waterproofing — we bring professional painting services to your doorstep with guaranteed quality and transparent pricing.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:-translate-y-0.5 transition-all shadow-xl shadow-primary/30 flex items-center gap-2">
                <span className="material-symbols-outlined">calendar_month</span>
                Book Free Consultation
              </Link>
              <a href="tel:+911800200123" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined">call</span>
                1800-200-1234
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="text-center mb-16">
          <span className="text-primary text-xs font-bold uppercase tracking-widest">What We Offer</span>
          <h2 className="text-3xl sm:text-4xl font-black mt-3">Our Professional Services</h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">Complete painting and coating solutions for residential and commercial properties. Every project supervised by certified professionals.</p>
        </div>

        <div className="space-y-8">
          {services.map((svc, i) => {
            const colors = colorMap[svc.color]
            const isExpanded = expanded === svc.id
            return (
              <div key={svc.id} className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:border-primary/20 transition-all duration-300 ${isExpanded ? 'shadow-2xl' : 'shadow-sm hover:shadow-lg'}`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className={`relative aspect-[16/9] lg:aspect-auto overflow-hidden ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <img src={svc.img} alt={svc.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold backdrop-blur-md bg-white/20 border border-white/20`}>
                        <span className="material-symbols-outlined text-lg">{svc.icon}</span>
                        {svc.tagline}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 lg:p-10 flex flex-col justify-center">
                    <div className={`w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center mb-5`}>
                      <span className={`material-symbols-outlined ${colors.text} text-2xl`}>{svc.icon}</span>
                    </div>
                    <h3 className="text-2xl font-black mb-2">{svc.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">{svc.desc}</p>

                    {/* Features */}
                    <div className={`grid grid-cols-2 gap-2 mb-6 ${isExpanded ? '' : 'max-h-24 overflow-hidden'}`}>
                      {svc.features.map(f => (
                        <div key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <span className={`material-symbols-outlined text-xs ${colors.text}`}>check_circle</span>
                          {f}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-xs text-slate-400">Starting at</span>
                        <div className="text-xl font-black">{svc.price}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setExpanded(isExpanded ? null : svc.id)} className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">{isExpanded ? 'expand_less' : 'expand_more'}</span>
                          {isExpanded ? 'Less' : 'More'}
                        </button>
                        <Link to="/contact" className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold transition-all shadow-lg ${colors.btn}`}>
                          Get Quote
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary text-xs font-bold uppercase tracking-widest">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-black mt-3">How It Works</h2>
            <p className="text-slate-500 mt-3 max-w-lg mx-auto">From booking to completion — our streamlined process ensures a hassle-free experience.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {process_steps.map((step, i) => (
              <div key={step.title} className="relative bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all text-center group">
                <div className="absolute -top-3 left-6 bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-black">{i + 1}</div>
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-2xl">{step.icon}</span>
                </div>
                <h3 className="font-bold text-sm mb-2">{step.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Guarantee Banner ── */}
      <section className="bg-gradient-to-br from-primary via-orange-500 to-amber-500 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center text-white">
          <div className="flex justify-center gap-3 mb-6">
            {['verified_user', 'workspace_premium', 'shield'].map(icon => (
              <div key={icon} className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                <span className="material-symbols-outlined text-2xl">{icon}</span>
              </div>
            ))}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black mb-4">100% Satisfaction Guarantee</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Not happy with the result? We'll redo it — free of charge. Every project comes with workmanship warranty and post-work inspection.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="bg-white text-primary px-8 py-4 rounded-2xl font-bold hover:-translate-y-0.5 transition-all shadow-xl flex items-center gap-2">
              <span className="material-symbols-outlined">calendar_month</span>
              Book Free Visit
            </Link>
            <Link to="/paints" className="bg-white/10 backdrop-blur-md border border-white/30 px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined">palette</span>
              Explore Paints
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}