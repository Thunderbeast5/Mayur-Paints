import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LoadingSpinner from '../components/LoadingSpinner'
import { paintsAPI } from '../api'

/* ─────────────────────────────────────────────────
   Paint Can SVG – renders the actual product color
   ───────────────────────────────────────────────── */
function PaintCanSVG({ color = '#888888', shade = '', category = 'Interior' }) {
  // derive a slightly darker tone for depth
  const bg = color

  const categoryLabel = {
    Interior: 'INT', Exterior: 'EXT', Waterproofing: 'WP', Primers: 'PRM',
  }[category] || 'PAINT'

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden select-none">
      {/* soft colour glow background */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 70% 20%, ${bg}40 0%, transparent 65%),
                       radial-gradient(ellipse at 20% 80%, ${bg}28 0%, transparent 55%)`,
        }}
      />

      <svg
        viewBox="0 0 200 250"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-36 h-44 drop-shadow-2xl"
        aria-label={`${shade} paint can`}
      >
        <defs>
          <linearGradient id={`body-${shade}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#8a8a8a" />
            <stop offset="28%"  stopColor="#e2e2e2" />
            <stop offset="55%"  stopColor="#d0d0d0" />
            <stop offset="100%" stopColor="#7a7a7a" />
          </linearGradient>
          <linearGradient id={`sheen-${shade}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(0,0,0,0.18)" />
            <stop offset="38%"  stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.22)" />
          </linearGradient>
          <linearGradient id={`lid-${shade}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.45)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
          </linearGradient>
          <filter id="dropShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* floor shadow */}
        <ellipse cx="100" cy="244" rx="68" ry="9" fill="rgba(0,0,0,0.14)" />

        {/* ── can body ── */}
        <rect x="30" y="78" width="140" height="152" rx="7" fill={`url(#body-${shade})`} />

        {/* left dark edge */}
        <rect x="30" y="78" width="18" height="152" rx="4" fill="rgba(0,0,0,0.11)" />
        {/* right dark edge */}
        <rect x="152" y="78" width="18" height="152" rx="4" fill="rgba(0,0,0,0.15)" />

        {/* colour stripe */}
        <rect x="30" y="112" width="140" height="72" fill={bg} />
        {/* top highlight on stripe */}
        <rect x="30" y="112" width="140" height="11" fill="rgba(255,255,255,0.22)" />
        {/* bottom shadow on stripe */}
        <rect x="30" y="173" width="140" height="11" fill="rgba(0,0,0,0.12)" />

        {/* white label area */}
        <rect x="38" y="120" width="124" height="56" rx="5" fill="white" opacity="0.93" />
        {/* colour swatch in label */}
        <rect x="46" y="128" width="20" height="20" rx="4" fill={bg} />
        {/* category tag */}
        <rect x="72" y="130" width="34" height="10" rx="3" fill={bg} opacity="0.18" />
        <text x="89" y="139" textAnchor="middle" fontSize="7" fontWeight="700"
          fill={bg} fontFamily="system-ui,sans-serif" letterSpacing="0.5">{categoryLabel}</text>

        {/* can sheen overlay */}
        <rect x="30" y="78" width="140" height="152" rx="7" fill={`url(#sheen-${shade})`} />

        {/* ── bottom rim ── */}
        <ellipse cx="100" cy="230" rx="70" ry="13" fill="#b0b0b0" />
        <ellipse cx="100" cy="228" rx="70" ry="11" fill="#c2c2c2" />

        {/* ── top rim ── */}
        <ellipse cx="100" cy="80"  rx="72" ry="14" fill="#b8b8b8" />
        <ellipse cx="100" cy="76"  rx="70" ry="12" fill="#d0d0d0" />

        {/* ── lid ── */}
        <ellipse cx="100" cy="70" rx="64" ry="11" fill={bg} />
        <ellipse cx="100" cy="66" rx="64" ry="11" fill={bg} />
        <ellipse cx="100" cy="62" rx="64" ry="11" fill={bg} />
        {/* lid sheen */}
        <ellipse cx="100" cy="58" rx="62" ry="10" fill={`url(#lid-${shade})`} opacity="0.55" />

        {/* ── handle ── */}
        <path
          d="M 68 54 Q 100 28 132 54"
          fill="none" stroke="#aaaaaa" strokeWidth="6" strokeLinecap="round"
        />
        <circle cx="68"  cy="54" r="5" fill="#c0c0c0" />
        <circle cx="132" cy="54" r="5" fill="#c0c0c0" />
      </svg>

      {/* shade name below can */}
      {shade && (
        <div className="absolute bottom-3 left-0 right-0 text-center">
          <span
            className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-sm"
            style={{ background: bg, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >{shade}</span>
        </div>
      )}
    </div>
  )
}

const categoryFilters = ['All', 'Interior', 'Exterior', 'Waterproofing', 'Primers']

const badgeColors = {
  Bestseller: 'bg-amber-500', New: 'bg-emerald-500', Popular: 'bg-blue-500',
  Premium: 'bg-violet-500', Trending: 'bg-pink-500', Value: 'bg-cyan-500',
}

function PaintCard({ product, onAddToCart, addedId }) {
  const navigate = useNavigate()
  
  const handleCardClick = (e) => {
    // Don't navigate if clicking on buttons
    if (e.target.closest('button')) return
    navigate(`/product/paint/${product._id || product.id}`)
  }
  
  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 animate-scale-in cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-50 dark:bg-slate-800 group-hover:bg-slate-100 dark:group-hover:bg-slate-700 transition-colors duration-300">
        {/* Actual Product Image */}
        <img 
          src={product.image || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&h=500&fit=crop&q=80'} 
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&h=500&fit=crop&q=80'
          }}
        />
        
        {/* Color overlay to show paint color */}
        <div 
          className="absolute inset-0 mix-blend-multiply opacity-30 group-hover:opacity-40 transition-opacity duration-300"
          style={{ backgroundColor: product.hexCode || product.color || '#888888' }}
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-20">
            <span className={`px-3 py-1 ${badgeColors[product.badge] || 'bg-primary'} text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg`}>
              {product.badge}
            </span>
          </div>
        )}

        {/* Color swatch indicator */}
        <div className="absolute top-3 right-3 z-20">
          <div 
            className="w-10 h-10 rounded-full border-4 border-white shadow-lg"
            style={{ backgroundColor: product.hexCode || product.color || '#888888' }}
          />
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg hover:bg-primary hover:text-white transition-colors">
            <span className="material-symbols-outlined text-lg">favorite_border</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{product.brand}</p>
          </div>
          <div className="text-right ml-3">
            <div className="flex items-center gap-1 mb-1">
              <span className="material-symbols-outlined text-yellow-500 text-lg">star</span>
              <span className="text-sm font-medium">{product.rating || 4.5}</span>
            </div>
            <p className="text-xs text-slate-400">({product.reviews || 100} reviews)</p>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-slate-400 text-lg">category</span>
            <span className="text-slate-600 dark:text-slate-300">{product.category}</span>
            {product.subCategory && (
              <>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600 dark:text-slate-300">{product.subCategory}</span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-slate-400 text-lg">format_paint</span>
            <span className="text-slate-600 dark:text-slate-300">{product.finish} Finish</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 dark:text-slate-300">{product.size}</span>
          </div>

          {product.coverage && (
            <div className="flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-slate-400 text-lg">square_foot</span>
              <span className="text-slate-600 dark:text-slate-300">Coverage: {product.coverage}</span>
            </div>
          )}

          {/* Color Preview */}
          {product.color && (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 text-lg">palette</span>
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: product.color }}
                />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {product.shade || product.code}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                ₹{product.price}
              </span>
            </div>
            {product.stock !== undefined && (
              <p className={`text-xs ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
              addedId === (product._id || product.id)
                ? 'bg-emerald-500 text-white'
                : product.stock === 0
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5'
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {addedId === (product._id || product.id) ? 'check' : 'shopping_cart'}
            </span>
            {addedId === (product._id || product.id) ? 'Added!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          
          <Link
            to={`/visualizer?color=${product.color || '#000000'}`}
            className="py-3 px-4 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-lg">blur_on</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

function PaintsShop({ cartCount, userRole, onAddToCart }) {
  const [searchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [addedId, setAddedId] = useState(null)
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => { loadProducts() }, [activeCategory, sortBy])
  useEffect(() => {
    const q = searchParams.get('search')
    if (q) setSearchQuery(q)
  }, [searchParams])

  async function loadProducts() {
    setLoading(true)
    try {
      const params = { limit: 200 }
      if (activeCategory !== 'All') params.category = activeCategory
      // paintsAPI.getAll now returns array (unwrapped by api.js)
      const data = await paintsAPI.getAll(params)
      // data could be an array directly OR a paginated object with .products
      let list = []
      if (Array.isArray(data)) {
        list = data
      } else if (data && Array.isArray(data.products)) {
        list = data.products
      }

      // Apply sorting
      list = [...list].sort((a, b) => {
        if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '')
        if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0)
        if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0)
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
        return 0
      })

      setProducts(list)
    } catch (err) {
      console.error('Failed to load products:', err)
      setProducts([])
    }
    setLoading(false)
  }

  function handleAddToCart(product) {
    if (!onAddToCart) return
    onAddToCart({ ...product, type: 'paint' })
    const id = product._id || product.id
    setAddedId(id)
    setTimeout(() => setAddedId(null), 1500)
  }

  const filtered = products.filter((p) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      (p.name || '').toLowerCase().includes(query) ||
      (p.brand || '').toLowerCase().includes(query) ||
      (p.category || '').toLowerCase().includes(query) ||
      (p.subCategory || '').toLowerCase().includes(query) ||
      (p.shade || '').toLowerCase().includes(query) ||
      (p.code || '').toLowerCase().includes(query)
    )
  })

  return (
    <div className="bg-white dark:bg-slate-950 font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <Navbar cartCount={cartCount} userRole={userRole} />

      {/* Header */}
      <section className="relative bg-slate-950 py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-5">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-300 font-semibold">Paints & Coatings</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
            Paints & <span className="text-primary">Coatings</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl">
            Premium interior, exterior, and waterproofing paints. 1000+ shades from our Malegaon facility.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 sticky top-[72px] z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categoryFilters.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-primary/30 hover:text-primary'
                  }`}
                >{cat}</button>
              ))}
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-initial">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search paints..."
                  className="w-full lg:w-60 pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-700 dark:text-slate-300"
              >
                <option value="name">Name A–Z</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-24">
              <LoadingSpinner size="lg" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <span className="material-symbols-outlined text-6xl text-slate-200 dark:text-slate-700 mb-4 block">search_off</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No products found</h3>
              <p className="text-slate-500">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-900 dark:text-white">{filtered.length}</span> of <span className="font-bold text-slate-900 dark:text-white">{products.length}</span> products
                  {searchQuery && <> matching "<span className="text-primary font-semibold">{searchQuery}</span>"</>}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((product, i) => (
                  <div key={product._id || product.id || i} className="animate-fade-in" style={{ animationDelay: `${Math.min(i * 0.05, 0.4)}s` }}>
                    <PaintCard product={product} onAddToCart={handleAddToCart} addedId={addedId} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default PaintsShop
