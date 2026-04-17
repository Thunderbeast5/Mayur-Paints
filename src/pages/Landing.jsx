import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

/* ── Data ── */
const services = [
  {
    icon: 'brush',
    title: 'Professional Painting',
    desc: 'Expert painters at your doorstep with guaranteed quality and a 2-year service warranty.',
    features: ['Certified Painters', 'Premium Materials', '2-Year Warranty', 'Free Consultation']
  },
  {
    icon: 'water_drop',
    title: 'Waterproofing Solutions',
    desc: 'Advanced leakage & dampness protection for terraces, walls, and basements.',
    features: ['10-Year Protection', 'Crack-Resistant', 'Eco-Friendly', 'All Weather Proof']
  },
  {
    icon: 'design_services',
    title: 'Interior Design',
    desc: 'Complete home makeover with curated colour palettes by our expert design team.',
    features: ['3D Visualization', 'Expert Designers', 'Custom Palettes', 'Virtual Consultation']
  },
  {
    icon: 'engineering',
    title: 'Certified Contractors',
    desc: 'Verified professionals across India trained in Mayur Paints application techniques.',
    features: ['Background Checked', 'Insured', 'Trained Professionals', 'Quality Assured']
  },
]

const categories = [
  {
    title: 'Premium Interior Emulsions',
    desc: 'Luxury stain-resistant finishes with 10-year warranty for every room.',
    cta: 'Explore Collection',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyYZuomY829S19SlNP6Q3xwyo6tCnkgJkzJ5YogtjeX_yPReV1DysXfPt39oqi4Rq3XApCiTBkrDfM0d03D3DBYJDx-Lx_bSe-g7_rBzNb45q4i4S8N3q55m2HPl1vI1pkwT-blnXKg7PyriuPWQvDTd2p1EJ5vv_fLsmm_WEt4VjHyyyGiZrPZDY3gf9z0pg2WpY0ROBpo8RZp4nOoZzzIrZRDeRlaFlYhAnLtNdBhzfl0wERK3I8w8ikjCglBKRSNEahSkjckg',
    link: '/paints',
    badge: 'Bestseller',
    colors: ['#f4e4d4', '#d9e4dd', '#ec5b13', '#2c3e50']
  },
  {
    title: 'Exterior Weather Shield',
    desc: 'Ultimate protection against sun, rain, and dust. Built for Indian weather.',
    cta: 'View Range',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiqcE7e8s177BuSadTL48hKsvV8KtxdCgQWj-U05dFy1AxfMlU9IRgHXEnmw6gZIrQzGhzSrf0lEhQ8Z_WbiwDI7U9cDmIneIlMHT1PbiLYK4acwKMB-oZWZkO5DYH8OHjtIIjkngNB_jyp824BgyQnHN8NBIJidyTbM1HInuFaM8IP5pEoyOAqxyww9hNldesG49gBHDC4Jq3MUxIeN3FbB2zLN1iWGEgvz1nn6E25XLe2WDYLq-9YkvAn6JGrwmVowZeTHUwxg',
    link: '/paints',
    badge: 'Premium',
    colors: ['#ecf0f1', '#d5c4a1', '#c14545', '#27ae60']
  },
  {
    title: 'Advanced Waterproofing',
    desc: 'Scientifically advanced leakage protection that bridges cracks up to 2mm.',
    cta: 'Get Protection',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPsd2riz4oYEuUAk_OaVz5VCF23UzmEaKuwV98RFqRJYBzAbk8g3V35k5Bwi7s0-wup7vm41jYYdj4DkeLo5JRNr3ICO3luV64p2S0jnkBZqhpzLcxip8t1halVGt-Bmwk-Un_Jrvn8KiifWgHFU-LUwJBT1PfZlLF_Loz0UYjp0TsgXAFEnty0o7ILAe8RkFH8bNZpcfOGsOnoUGkISI8eFBcPp_h-xaxssyVWMDi4RfSBu9Ze1Han_88yEqtyzVE1hlUnT9WyA',
    link: '/paints',
    badge: 'New',
    colors: ['#3498db', '#95a5a6', '#7f8c8d', '#e67e22']
  },
]

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Homeowner, Mumbai',
    text: 'Mayur Paints transformed my home completely. The quality is outstanding and my living room looks like a magazine cover.',
    rating: 5,
    location: 'Mumbai',
    project: '3BHK Apartment'
  },
  {
    name: 'Rajesh Kumar',
    role: 'Contractor, Delhi',
    text: 'As a professional contractor, I trust only Mayur Paints. The consistency and vibrant colors are unmatched in the market.',
    rating: 5,
    location: 'Delhi',
    project: 'Commercial Complex'
  },
  {
    name: 'Anita Desai',
    role: 'Interior Designer',
    text: 'The colour range is incredible! My clients love the durability and finish. Every product reflects true craftsmanship.',
    rating: 5,
    location: 'Bangalore',
    project: 'Villa Interior'
  },
]

const stats = [
  { value: '35+', label: 'Years of Excellence', icon: 'history' },
  { value: '1200+', label: 'Premium Shades', icon: 'palette' },
  { value: '50K+', label: 'Happy Customers', icon: 'people' },
  { value: '28', label: 'States Covered', icon: 'location_on' },
]

/* ── Enhanced Sub-Components ── */
function CategoryCard({ title, desc, cta, img, link, badge, colors }) {
  return (
    <Link to={link} className="group relative overflow-hidden rounded-3xl aspect-[4/5] block shadow-xl hover:shadow-2xl transition-all duration-500">
      <img
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        src={img}
        alt={title}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      {/* Color Palette */}
      <div className="absolute top-4 right-4 flex gap-1">
        {colors?.map((color, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Badge */}
      {badge && (
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
            {badge}
          </span>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-white/90 mb-4 text-sm leading-relaxed">{desc}</p>
        <span className="inline-flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all">
          {cta}
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </span>
      </div>
    </Link>
  )
}

function ServiceCard({ icon, title, desc, features }) {
  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
        <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{desc}</p>
      <ul className="space-y-2">
        {features?.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}

function TestimonialCard({ name, role, text, rating, location, project }) {
  return (
    <div className="bg-slate-900 rounded-2xl p-7 border border-slate-800 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
      <div className="flex items-center gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <span key={i} className="material-symbols-outlined text-amber-400 text-lg" style={{fontVariationSettings:"'FILL' 1"}}>star</span>
        ))}
      </div>
      <p className="text-slate-300 mb-6 leading-relaxed text-sm">"{text}"</p>
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/15 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-black text-primary">{name.charAt(0)}</span>
          </div>
          <div>
            <div className="font-bold text-white text-sm">{name}</div>
            <div className="text-xs text-slate-500">{role}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">{location}</div>
          <div className="text-xs text-primary font-semibold">{project}</div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ value, label, icon }) {
  return (
    <div className="flex flex-col items-center text-center group p-6 rounded-2xl hover:bg-primary/5 transition-all duration-300">
      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300 shadow-sm">
        <span className="material-symbols-outlined text-primary text-2xl group-hover:text-white transition-colors">{icon}</span>
      </div>
      <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{value}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</div>
    </div>
  )
}

export default function Landing({ cartCount, userRole }) {
  return (
    <div className="bg-white dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <Navbar cartCount={cartCount} userRole={userRole} />

      {/* ── Enhanced Hero Section ── */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center bg-slate-950">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1400&q=80"
            alt=""
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/60" />
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-5">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/15 text-primary text-xs font-black rounded-full uppercase tracking-[0.15em] border border-primary/25 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                  Est. 1985 · Premium Paint Brand
                </span>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight">
                  Transform Your<br />
                  Home with <span className="text-primary">Mayur Paints and Hardware</span>
                </h1>
                <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
                  India's most trusted paint brand with 1200+ premium shades,
                  professional tools, and expert colour consultation.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">                <Link to="/paints" className="inline-flex items-center gap-2.5 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 shadow-xl shadow-primary/30">
                  <span className="material-symbols-outlined">palette</span>
                  Shop Paints
                </Link>
                <Link to="/visualizer" className="inline-flex items-center gap-2.5 bg-white/8 backdrop-blur-md text-white border border-white/15 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/15 hover:border-white/25 transition-all duration-300">
                  <span className="material-symbols-outlined">blur_on</span>
                  Try Visualizer
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                {[
                  { icon: 'verified', label: 'ISO 9001 Certified' },
                  { icon: 'eco', label: 'Eco-Friendly' },
                  { icon: 'shield', label: '10 Year Warranty' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 text-slate-300">
                    <span className="material-symbols-outlined text-primary text-lg">{item.icon}</span>
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block animate-fade-in delay-200">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <img
                  src="https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80"
                  alt="Premium Paints"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Rating card */}
              <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-900 rounded-2xl px-4 py-3 shadow-xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-amber-400 text-lg" style={{fontVariationSettings:"'FILL' 1"}}>star</span>
                  <span className="font-black text-slate-900 dark:text-white">4.9</span>
                  <span className="text-xs text-slate-400">/ 50K+ reviews</span>
                </div>
              </div>
              {/* Shade preview card */}
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-900 rounded-2xl px-4 py-3 shadow-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="flex gap-1">
                  {['#ec5b13','#d9e4dd','#1B2A4A','#F5E6D3'].map(c => (
                    <div key={c} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{backgroundColor: c}} />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">1200+ Shades</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section className="bg-white dark:bg-slate-950 py-16 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories Section ── */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary text-sm font-bold uppercase tracking-widest">Products</span>
            <h2 className="text-3xl sm:text-4xl font-black mt-3 mb-4">Premium Paint Collections</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Developed in our Malegaon facility with Mayur Shah's commitment to excellence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, i) => (
              <CategoryCard key={i} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Services Section ── */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary text-sm font-bold uppercase tracking-widest">Services</span>
            <h2 className="text-3xl sm:text-4xl font-black mt-3 mb-4">Complete Painting Solutions</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              From consultation to application, we handle everything with professional expertise
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <ServiceCard key={i} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials Section ── */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="section-label">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-3">What Our Customers Say</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Trusted by thousands of homeowners and professionals across India</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <TestimonialCard key={i} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-20 bg-gradient-to-br from-primary via-orange-500 to-amber-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-5 leading-tight">
            Ready to Transform<br />Your Space?
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of satisfied customers who trust Mayur Paints for quality and reliability
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/visualizer" className="inline-flex items-center gap-2.5 bg-white text-primary px-8 py-4 rounded-2xl font-bold text-lg hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 shadow-xl">
              <span className="material-symbols-outlined">blur_on</span>
              Try Colour Visualizer
            </Link>
            <Link to="/paints" className="inline-flex items-center gap-2.5 bg-white/15 backdrop-blur-md text-white border border-white/25 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/25 transition-all duration-300">
              <span className="material-symbols-outlined">palette</span>
              Browse Paints
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
