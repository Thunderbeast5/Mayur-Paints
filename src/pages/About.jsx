import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const milestones = [
  { year: '1985', title: 'Founded', desc: 'Mayur Paints started as a small family workshop with a single product line.' },
  { year: '1994', title: 'National Expansion', desc: 'Expanded to 12 states with 200+ dealer partners across India.' },
  { year: '2003', title: 'ISO 9001 Certified', desc: 'Achieved international quality certification for manufacturing excellence.' },
  { year: '2011', title: 'Eco-Friendly Range', desc: "Launched India's first zero-VOC interior paint collection." },
  { year: '2018', title: '1000+ Shades', desc: 'Crossed the milestone of 1000 curated shades developed and tested in-house.' },
  { year: '2026', title: 'Digital Platform', desc: "Launched Colour Cosmos — India's most advanced paint visualizer." },
]

const values = [
  { icon: 'eco', title: 'Sustainability', desc: 'Every product is formulated with the environment in mind. Low VOC, recyclable packaging, and responsible sourcing.' },
  { icon: 'verified', title: 'Quality First', desc: 'Rigorous 47-point quality checks on every batch. ISO 9001:2015 certified manufacturing.' },
  { icon: 'diversity_3', title: 'Community', desc: 'We partner with local contractors, support artisan painters, and invest in skill development programs.' },
  { icon: 'science', title: 'Innovation', desc: 'Our R&D lab develops next-generation coatings that last longer, look better, and protect more.' },
]

const team = [
  { name: 'Leadership Team', role: 'Management', description: 'Our experienced leadership team brings decades of expertise in paint manufacturing, retail, and customer service to drive Mayur Paints forward.' },
]

const stats = [
  { value: '35+', label: 'Years of Excellence' },
  { value: '1200+', label: 'Premium Shades' },
  { value: '50,000+', label: 'Happy Customers' },
  { value: '28', label: 'States Covered' },
]

export default function About() {
  const { totalCount: cartCount, } = useSelector(s => s.cart)
  const { role: userRole } = useSelector(s => s.auth)

  return (
    <div className="bg-white dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <Navbar cartCount={cartCount} userRole={userRole} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-24 sm:py-32">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1400&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-white font-semibold">About Us</span>
          </div>
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 text-primary text-xs font-bold rounded-full mb-6 uppercase tracking-widest border border-primary/30">
              Est. 1985
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Painting India's <span className="text-primary">Story</span> Since 1985
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              From a small workshop to India's most trusted paint brand — our journey is built on quality, colour, and community.
            </p>
            <div className="flex gap-4">
              <Link to="/paints" className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:-translate-y-0.5 transition-all shadow-xl shadow-primary/30">
                Explore Products
              </Link>
              <Link to="/contact" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(s => (
              <div key={s.label} className="text-center text-white">
                <div className="text-4xl sm:text-5xl font-black mb-1">{s.value}</div>
                <div className="text-white/70 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-primary text-xs font-bold uppercase tracking-widest">Our Story</span>
            <h2 className="text-3xl sm:text-4xl font-black mt-3 mb-6">More Than Paint — A Legacy of Colour</h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>Mayur Paints was born from a simple belief: every home deserves to be beautiful. Founded in 1985, we started with a single product line and a commitment to quality that has never wavered.</p>
              <p>Four decades later, we've grown into one of India's most respected paint brands. We still obsess over every shade, every formula, every finish. We believe the right colour can transform not just a wall, but a life.</p>
              <p>Today, with over 1200 shades, a state-of-the-art R&D facility, and India's most advanced colour visualizer, we continue to push the boundaries of what paint can do.</p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80" alt="Our factory" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl">verified</span>
                </div>
                <div>
                  <div className="font-black text-lg">ISO 9001:2015</div>
                  <div className="text-xs text-slate-400">Certified Manufacturing</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary text-xs font-bold uppercase tracking-widest">What We Stand For</span>
            <h2 className="text-3xl sm:text-4xl font-black mt-3">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(v => (
              <div key={v.title} className="bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all group">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-2xl">{v.icon}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{v.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="text-center mb-14">
          <span className="text-primary text-xs font-bold uppercase tracking-widest">Our Journey</span>
          <h2 className="text-3xl sm:text-4xl font-black mt-3">Our Milestones</h2>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 hidden lg:block" />
          <div className="space-y-8 lg:space-y-0">
            {milestones.map((m, i) => (
              <div key={m.year} className={`relative lg:flex lg:items-center lg:gap-8 lg:mb-12 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                <div className={`lg:w-1/2 ${i % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:text-left lg:pl-12'}`}>
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:shadow-lg transition-all inline-block w-full">
                    <span className="text-primary font-black text-2xl">{m.year}</span>
                    <h3 className="font-bold text-lg mt-1 mb-2">{m.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{m.desc}</p>
                  </div>
                </div>
                <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 bg-primary rounded-full items-center justify-center shadow-lg shadow-primary/30 z-10">
                  <span className="material-symbols-outlined text-white text-sm">star</span>
                </div>
                <div className="lg:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary text-xs font-bold uppercase tracking-widest">Our Leadership</span>
            <h2 className="text-3xl sm:text-4xl font-black mt-3">Our Team</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto">Experienced professionals dedicated to bringing quality colour to every Indian home</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(t => (
              <div key={t.name} className="group bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:shadow-xl transition-all text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-primary text-4xl">person</span>
                </div>
                <h3 className="font-bold text-2xl mb-2">{t.name}</h3>
                <p className="text-primary text-sm font-medium mb-4">{t.role}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">{t.description}</p>
                {t.story && (
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
                    <p className="text-slate-400 dark:text-slate-500 text-xs italic leading-relaxed">"{t.story}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gradient-to-br from-primary via-orange-500 to-amber-500 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">Ready to Transform Your Space?</h2>
          <p className="text-white/80 text-lg mb-8">Explore 1200+ premium shades or book a free consultation with our colour experts.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/paints" className="bg-white text-primary px-8 py-4 rounded-2xl font-bold hover:-translate-y-0.5 transition-all shadow-xl">Shop Paints</Link>
            <Link to="/visualizer" className="bg-white/10 border border-white/30 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all">Try Visualizer</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
