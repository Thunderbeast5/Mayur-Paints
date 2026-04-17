import { useState } from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(e) {
    e.preventDefault()
    if (email.trim()) { 
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-orange-500/20" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Enhanced Brand Section */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 animate-glow">
                <span className="material-symbols-outlined text-white text-2xl">format_paint</span>
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Mayur <span className="text-primary">Paints</span></h2>
                <p className="text-xs text-primary font-medium">Est. 1985 • Malegaon</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-md mb-6 text-slate-300">
              Premium paints, coatings and hardware for every surface. Trusted by homeowners and professionals across India since 1985.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <span>Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="material-symbols-outlined text-primary">phone</span>
                <span>+91 1800 200 1234</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="material-symbols-outlined text-primary">email</span>
                <span>info@mayurpaints.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { icon: 'facebook', label: 'Facebook' },
                { icon: 'alternate_email', label: 'Twitter' },
                { icon: 'smartphone', label: 'Instagram' },
                { icon: 'videocam', label: 'YouTube' },
                { icon: 'share', label: 'LinkedIn' }
              ].map((social) => (
                <a
                  key={social.icon}
                  href="#"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <span className="material-symbols-outlined text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Enhanced Shop Links */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">shopping_bag</span>
              Shop
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/paints?search=interior" className="hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="material-symbols-outlined text-lg group-hover:text-primary">format_paint</span>
                  Interior Paints
                </Link>
              </li>
              <li>
                <Link to="/paints?search=exterior" className="hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="material-symbols-outlined text-lg group-hover:text-primary">exterior</span>
                  Exterior Paints
                </Link>
              </li>
              <li>
                <Link to="/paints?search=waterproof" className="hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="material-symbols-outlined text-lg group-hover:text-primary">water_drop</span>
                  Waterproofing
                </Link>
              </li>
              <li>
                <Link to="/hardware" className="hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="material-symbols-outlined text-lg group-hover:text-primary">handyman</span>
                  Tools & Hardware
                </Link>
              </li>
              <li>
                <Link to="/paints?search=primer" className="hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="material-symbols-outlined text-lg group-hover:text-primary">layers</span>
                  Primers & Putty
                </Link>
              </li>
              <li>
                <Link to="/visualizer" className="hover:text-primary transition-colors flex items-center gap-2 group">
                  <span className="material-symbols-outlined text-lg group-hover:text-primary">blur_on</span>
                  Colour Visualizer
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">construction</span>
              Services
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/visualizer" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="material-symbols-outlined text-lg group-hover:text-primary">blur_on</span>Colour Visualizer</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="material-symbols-outlined text-lg group-hover:text-primary">brush</span>Professional Painting</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="material-symbols-outlined text-lg group-hover:text-primary">design_services</span>Interior Design</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="material-symbols-outlined text-lg group-hover:text-primary">engineering</span>Contractor Services</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="material-symbols-outlined text-lg group-hover:text-primary">support_agent</span>Free Consultation</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">business</span>
              Company
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="material-symbols-outlined text-lg group-hover:text-primary">info</span>About Us</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="material-symbols-outlined text-lg group-hover:text-primary">history</span>Our Heritage</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="material-symbols-outlined text-lg group-hover:text-primary">contact_page</span>Contact</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="material-symbols-outlined text-lg group-hover:text-primary">store</span>Find Store</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors flex items-center gap-2 group"><span className="material-symbols-outlined text-lg group-hover:text-primary">work</span>Careers</Link></li>
            </ul>
          </div>

          {/* Enhanced Newsletter */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">campaign</span>
              Stay Updated
            </h3>
            <p className="text-sm text-slate-300 mb-4">
              Get the latest updates on new products, exclusive offers, and painting tips.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent placeholder-slate-500"
                />
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                  mail
                </span>
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary text-white px-4 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">send</span>
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>

            {subscribed && (
              <p className="text-green-400 text-sm mt-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Thank you for subscribing!
              </p>
            )}

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary">verified</span>
                  <span>ISO 9001</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary">eco</span>
                  <span>Eco-Friendly</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary">shield</span>
                  <span>10 Year Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-500">
              © 2026 Mayur Paints. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link to="/faq" className="hover:text-primary transition-colors">Cookie Policy</Link>
              <Link to="/faq" className="hover:text-primary transition-colors">Sitemap</Link>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="material-symbols-outlined text-lg">payments</span>
              <span>Secure Payments</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
