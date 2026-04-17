import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { hardwareAPI } from '../api'

/* ─────────────────────────────────────────────────
   Hardware Tool SVG – shows the actual tool type
   ───────────────────────────────────────────────── */
function HardwareToolSVG({ subCategory = '', name = '' }) {
  const type = (subCategory || name).toLowerCase()

  // Pick accent color per category
  const accent = type.includes('brush') ? '#10B981'
    : type.includes('roller') ? '#3B82F6'
    : type.includes('tape') ? '#F59E0B'
    : type.includes('putty') || type.includes('knife') ? '#8B5CF6'
    : type.includes('tray') ? '#EC4899'
    : type.includes('scraper') ? '#EF4444'
    : type.includes('sand') ? '#F97316'
    : type.includes('applicator') ? '#06B6D4'
    : type.includes('protection') ? '#14B8A6'
    : '#64748B'

  const toolSVG = () => {
    if (type.includes('brush')) return (
      <svg viewBox="0 0 120 180" xmlns="http://www.w3.org/2000/svg" className="w-24 h-36">
        {/* Handle */}
        <rect x="52" y="10" width="18" height="95" rx="7" fill="#92400E" />
        <rect x="55" y="10" width="6" height="95" rx="3" fill="rgba(255,255,255,0.2)" />
        {/* Ferrule band */}
        <rect x="47" y="100" width="28" height="14" rx="3" fill="#9CA3AF" />
        <rect x="47" y="106" width="28" height="3" fill="#6B7280" />
        {/* Bristles */}
        <rect x="42" y="112" width="38" height="52" rx="4" fill="#1C1917" />
        <rect x="43" y="113" width="8"  height="50" rx="2" fill="#292524" />
        <rect x="56" y="113" width="8"  height="50" rx="2" fill="#292524" />
        <rect x="69" y="113" width="9"  height="50" rx="2" fill="#292524" />
        {/* Paint tip */}
        <ellipse cx="61" cy="163" rx="18" ry="6" fill={accent} opacity="0.85" />
        <ellipse cx="61" cy="163" rx="12" ry="4" fill={accent} />
      </svg>
    )
    if (type.includes('roller')) return (
      <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32">
        {/* Handle */}
        <line x1="20" y1="140" x2="70" y2="90" stroke="#92400E" strokeWidth="10" strokeLinecap="round" />
        {/* Frame arm */}
        <line x1="70" y1="90" x2="70" y2="50" stroke="#9CA3AF" strokeWidth="6" strokeLinecap="round" />
        <line x1="70" y1="50" x2="130" y2="50" stroke="#9CA3AF" strokeWidth="6" strokeLinecap="round" />
        {/* Roller cylinder */}
        <rect x="90" y="38" width="50" height="38" rx="10" fill="#D1D5DB" />
        <rect x="92" y="40" width="46" height="34" rx="9" fill={accent} opacity="0.85" />
        <rect x="94" y="42" width="12" height="30" rx="4" fill="rgba(255,255,255,0.2)" />
        {/* Caps */}
        <ellipse cx="90"  cy="57" rx="10" ry="17" fill="#9CA3AF" />
        <ellipse cx="140" cy="57" rx="10" ry="17" fill="#9CA3AF" />
        <ellipse cx="140" cy="57" rx="6"  ry="13" fill="#6B7280" />
      </svg>
    )
    if (type.includes('tape')) return (
      <svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg" className="w-28 h-28">
        {/* Outer ring */}
        <circle cx="70" cy="70" r="60" fill={accent} />
        <circle cx="70" cy="70" r="50" fill="rgba(0,0,0,0.12)" />
        <circle cx="70" cy="70" r="49" fill={accent} opacity="0.8" />
        {/* Tape texture band */}
        <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="6" />
        {/* Inner hole */}
        <circle cx="70" cy="70" r="22" fill="#F3F4F6" />
        <circle cx="70" cy="70" r="18" fill="#E5E7EB" />
        {/* Highlight */}
        <ellipse cx="52" cy="42" rx="12" ry="8" fill="rgba(255,255,255,0.3)" transform="rotate(-25 52 42)" />
      </svg>
    )
    if (type.includes('putty') || type.includes('knife')) return (
      <svg viewBox="0 0 60 200" xmlns="http://www.w3.org/2000/svg" className="w-14 h-48">
        {/* Handle */}
        <rect x="12" y="10" width="36" height="100" rx="10" fill="#92400E" />
        <rect x="15" y="10" width="10" height="100" rx="5" fill="rgba(255,255,255,0.15)" />
        {/* Ferrule */}
        <rect x="10" y="105" width="40" height="12" rx="3" fill="#9CA3AF" />
        {/* Blade */}
        <rect x="14" y="115" width="32" height="70" rx="2" fill="#D1D5DB" />
        <rect x="15" y="115" width="8" height="70" fill="rgba(255,255,255,0.3)" />
        <polygon points="14,185 46,185 30,200" fill="#9CA3AF" />
      </svg>
    )
    if (type.includes('tray')) return (
      <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" className="w-40 h-24">
        {/* Tray body */}
        <path d="M 10 40 L 190 40 L 180 100 L 20 100 Z" fill="#D1D5DB" />
        <path d="M 10 40 L 190 40 L 180 100 L 20 100 Z" fill={accent} opacity="0.3" />
        {/* Ridged loading surface */}
        <path d="M 10 40 L 80 40 L 75 100 L 20 100 Z" fill={accent} opacity="0.7" />
        {/* Ridges */}
        <line x1="20" y1="55" x2="72" y2="55" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
        <line x1="22" y1="70" x2="74" y2="70" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
        <line x1="24" y1="85" x2="73" y2="85" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
        {/* Rim */}
        <rect x="8" y="36" width="184" height="8" rx="4" fill="#9CA3AF" />
        {/* Handle */}
        <rect x="155" y="15" width="32" height="8" rx="4" fill="#9CA3AF" />
        <rect x="175" y="15" width="8"  height="32" rx="4" fill="#9CA3AF" />
      </svg>
    )
    if (type.includes('scraper')) return (
      <svg viewBox="0 0 80 200" xmlns="http://www.w3.org/2000/svg" className="w-16 h-48">
        {/* Handle */}
        <rect x="15" y="10" width="50" height="110" rx="12" fill="#92400E" />
        <rect x="20" y="10" width="14" height="110" rx="6" fill="rgba(255,255,255,0.15)" />
        {/* Neck */}
        <rect x="22" y="115" width="36" height="15" rx="4" fill="#6B7280" />
        {/* Wide blade */}
        <rect x="5" y="128" width="70" height="55" rx="2" fill="#D1D5DB" />
        <rect x="7" y="130" width="18" height="51" fill="rgba(255,255,255,0.25)" />
        <rect x="5" y="175" width="70" height="8" rx="1" fill="#9CA3AF" />
      </svg>
    )
    if (type.includes('sand')) return (
      <svg viewBox="0 0 180 130" xmlns="http://www.w3.org/2000/svg" className="w-36 h-28">
        {/* Sanding block */}
        <rect x="20" y="30" width="140" height="70" rx="8" fill="#D97706" />
        <rect x="22" y="32" width="40" height="66" rx="5" fill="rgba(255,255,255,0.12)" />
        {/* Sandpaper texture grid */}
        {[35,55,75,95,115,135].map(x => (
          <line key={x} x1={x} y1="32" x2={x} y2="98" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
        ))}
        {[42,55,68,81,94].map(y => (
          <line key={y} x1="20" y1={y} x2="160" y2={y} stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
        ))}
        {/* Top grip pad */}
        <rect x="20" y="20" width="140" height="14" rx="5" fill="#92400E" />
      </svg>
    )
    if (type.includes('applicator') || type.includes('sponge')) return (
      <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32">
        {/* Handle */}
        <rect x="65" y="10" width="30" height="65" rx="8" fill="#92400E" />
        {/* Connector */}
        <rect x="60" y="68" width="40" height="12" rx="4" fill="#6B7280" />
        {/* Sponge pad */}
        <rect x="30" y="78" width="100" height="55" rx="10" fill={accent} opacity="0.85" />
        <rect x="32" y="80" width="28" height="51" rx="6"  fill="rgba(255,255,255,0.2)" />
        <rect x="65" y="80" width="15" height="51" rx="4"  fill="rgba(255,255,255,0.1)" />
        {/* Pore texture */}
        {[40,60,80,100,120].map(x =>
          [90,105,120].map(y => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="3" fill="rgba(0,0,0,0.12)" />
          ))
        )}
      </svg>
    )
    if (type.includes('protect') || type.includes('mask') || type.includes('glove')) return (
      <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32">
        {/* Safety helmet */}
        <path d="M 20 95 Q 20 40 80 30 Q 140 40 140 95 Z" fill={accent} />
        <path d="M 22 95 Q 25 45 80 34 Q 130 48 130 95 Z" fill="rgba(255,255,255,0.2)" />
        {/* Brim */}
        <rect x="10" y="90" width="140" height="14" rx="7" fill={accent} opacity="0.85" />
        <rect x="12" y="92" width="40" height="10" rx="3" fill="rgba(255,255,255,0.2)" />
        {/* Inner band */}
        <rect x="30" y="103" width="100" height="10" rx="5" fill="#374151" />
        {/* Shield visor hint */}
        <path d="M 54 60 Q 80 50 106 60 Q 108 72 80 75 Q 52 72 54 60 Z" fill="rgba(0,0,0,0.15)" />
        {/* Gloves */}
        <ellipse cx="45"  cy="138" rx="25" ry="16" fill={accent} opacity="0.8" />
        <ellipse cx="115" cy="138" rx="25" ry="16" fill={accent} opacity="0.8" />
        <rect x="22"  y="128" width="46" height="10" rx="5" fill={accent} />
        <rect x="92"  y="128" width="46" height="10" rx="5" fill={accent} />
      </svg>
    )
    // default – generic tool/wrench
    return (
      <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32">
        <path d="M 120 20 Q 145 20 145 45 Q 145 65 125 68 L 55 138 Q 45 148 30 148 Q 15 148 15 133 Q 15 118 25 108 L 95 38 Q 98 18 120 20 Z"
          fill={accent} />
        <path d="M 122 24 Q 140 26 140 45 Q 139 60 125 64 L 58 134 Q 48 143 32 143 Q 20 142 20 133 Q 21 120 28 112 L 95 42 Q 100 23 122 24 Z"
          fill="rgba(255,255,255,0.15)" />
        <circle cx="30" cy="133" r="8" fill="rgba(0,0,0,0.35)" />
        <circle cx="128" cy="38" r="10" fill="rgba(255,255,255,0.3)" />
      </svg>
    )
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden select-none">
      {/* radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 60% 30%, ${accent}30 0%, transparent 65%),
                       radial-gradient(ellipse at 30% 80%, ${accent}18 0%, transparent 55%)`,
        }}
      />
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {toolSVG()}
      </div>
    </div>
  )
}


const categoryFilters = ['All', 'Brushes', 'Rollers', 'Putty Knives', 'Tape', 'Trays', 'Scrapers', 'Sandpaper', 'Applicators', 'Protection']
const badgeColors = { Bestseller: 'bg-amber-500', New: 'bg-emerald-500', Popular: 'bg-blue-500' }


function HardwareShop({ cartCount, userRole, onAddToCart }) {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery]       = useState('')
  const [products, setProducts]             = useState([])
  const [loading, setLoading]               = useState(true)
  const [addedId, setAddedId]               = useState(null)

  useEffect(() => { loadProducts() }, [activeCategory])

  async function loadProducts() {
    setLoading(true)
    try {
      const params = { limit: 200 }
      if (activeCategory !== 'All') params.subCategory = activeCategory
      const data = await hardwareAPI.getAll(params)
      // data might be array or { products, pagination }
      let list = []
      if (Array.isArray(data)) {
        list = data
      } else if (data && Array.isArray(data.products)) {
        list = data.products
      }
      setProducts(list)
    } catch (err) {
      console.error('Failed to load hardware:', err)
      setProducts([])
    }
    setLoading(false)
  }

  function handleAddToCart(product) {
    if (!onAddToCart) return
    onAddToCart({ ...product, type: 'hardware' })
    const id = product._id || product.id
    setAddedId(id)
    setTimeout(() => setAddedId(null), 1500)
  }

  const filtered = products.filter((p) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.code || '').toLowerCase().includes(q) ||
      (p.brand || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.subCategory || '').toLowerCase().includes(q)
    )
  })


  return (
    <div className="bg-white dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <Navbar cartCount={cartCount} userRole={userRole} />

      <section className="bg-gradient-to-r from-emerald-500/5 via-white to-white dark:from-emerald-500/10 dark:via-slate-950 dark:to-slate-950 py-12 sm:py-16 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-900 dark:text-slate-100 font-semibold">Tools & Hardware</span>
          </div>
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">Tools & <span className="text-emerald-500">Hardware</span></h1>
            <p className="text-slate-500 text-lg leading-relaxed">Professional-grade brushes, rollers, putty, tapes, and more for a flawless paint job every time.</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {categoryFilters.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeCategory === cat ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30'}`}
              >{cat}</button>
            ))}
          </div>
          <div className="flex items-center bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-2.5 border border-slate-100 dark:border-slate-800 focus-within:border-emerald-500/50 transition-all w-full md:w-auto">
            <span className="material-symbols-outlined text-slate-400 text-xl mr-2">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm w-full md:w-56 placeholder:text-slate-400" placeholder="Search by name or SKU..." type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-6">
          Showing <span className="font-bold text-slate-900 dark:text-slate-100">{filtered.length}</span> item{filtered.length !== 1 ? 's' : ''}
          {activeCategory !== 'All' && <> in <span className="font-bold text-emerald-500">{activeCategory}</span></>}
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => {
                const pid = product._id || product.id
                const isAdded = addedId === pid
                
                const handleCardClick = (e) => {
                  // Don't navigate if clicking on buttons
                  if (e.target.closest('button')) return
                  navigate(`/product/hardware/${pid}`)
                }
                
                return (
                  <div 
                    key={pid} 
                    onClick={handleCardClick}
                    className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:border-emerald-500/20 transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-800 group-hover:bg-slate-100 dark:group-hover:bg-slate-700 transition-colors duration-300">
                      {/* Actual Product Image */}
                      <img 
                        src={product.image || 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500&h=500&fit=crop&q=80'} 
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500&h=500&fit=crop&q=80'
                        }}
                      />
                      
                      {product.badge && <span className={`absolute top-3 left-3 z-10 text-[10px] font-black uppercase tracking-widest text-white px-3 py-1 rounded-full ${badgeColors[product.badge] || 'bg-emerald-500'} shadow-lg`}>{product.badge}</span>}
                      {product.stock <= (product.minStock || 20) && <span className="absolute top-3 right-3 z-10 text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-100 px-2 py-1 rounded-full shadow-lg">Low Stock</span>}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">{product.category}</span>
                        <span className="text-[10px] text-slate-400 font-medium bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">{product.code}</span>
                      </div>
                      <h3 className="text-lg font-bold leading-tight mt-1 mb-1">{product.name}</h3>
                      <p className="text-xs text-slate-400 mb-2 line-clamp-2">{product.description}</p>
                      <div className="text-xs text-slate-400 mb-2">{product.size}</div>
                      {product.rating && (
                        <div className="flex items-center gap-1 mb-3">
                          <span className="material-symbols-outlined text-amber-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span className="text-xs font-bold">{product.rating}</span>
                          <span className="text-xs text-slate-400">({product.reviews})</span>
                        </div>
                      )}
                      {product.features && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.features.slice(0, 2).map((f) => <span key={f} className="text-[9px] bg-slate-50 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">{f}</span>)}
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Price</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-black">₹{product.price.toLocaleString()}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 ${product.stock === 0 ? 'bg-slate-300 text-white cursor-not-allowed shadow-none' : isAdded ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20'}`}
                        >
                          <span className="material-symbols-outlined text-sm">{isAdded ? 'check' : 'add_shopping_cart'}</span>
                          {product.stock === 0 ? 'Out' : isAdded ? 'Added!' : 'Add'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">construction</span>
                <h3 className="text-xl font-bold text-slate-400 mb-2">No tools found</h3>
                <p className="text-sm text-slate-400">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default HardwareShop
