import { useState } from 'react'
import { Link } from 'react-router-dom'

/* ── Product Data ── */
const allProducts = [
  {
    id: 1,
    name: 'Moonlit Silk Emulsion',
    category: 'Interior',
    finish: 'Matte',
    price: 1850,
    size: '10L',
    color: '#E6E6FA',
    shade: 'Soft Lavender',
    code: 'MS-402',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGt9k3yd98jndAbwVA6Kyuf0sYCNuyfbHe65sUxoEQQmSJlPv59ok84clYwCUL8VMjd76vOATXrUfI-v84VW-_SPfy6g-EaNuTjWOxfYAnvNgyULMPZY-HORtIS_z0b2GQT4GScOZ-hoIHTVKv6Yzycvbdt81k5qpxNL8i0qeyJ8cRGORfxyHJCc3Q9hfKJ2-y7X3TGa4MsVw3V5Q3_vsWP9eeKg0r7xGC-W1DkYSpa8UYMRGtWy0MaQoaGxE_WSNi4dHg9ARZIg',
    badge: 'Bestseller',
  },
  {
    id: 2,
    name: 'Terracotta Sunset',
    category: 'Interior',
    finish: 'Matte',
    price: 2100,
    size: '10L',
    color: '#ec5b13',
    shade: 'Terracotta',
    code: 'M-2041',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyYZuomY829S19SlNP6Q3xwyo6tCnkgJkzJ5YogtjeX_yPReV1DysXfPt39oqi4Rq3XApCiTBkrDfM0d03D3DBYJDx-Lx_bSe-g7_rBzNb45q4i4S8N3q55m2HPl1vI1pkwT-blnXKg7PyriuPWQvDTd2p1EJ5vv_fLsmm_WEt4VjHyyyGiZrPZDY3gf9z0pg2WpY0ROBpo8RZp4nOoZzzIrZRDeRlaFlYhAnLtNdBhzfl0wERK3I8w8ikjCglBKRSNEahSkjckg',
    badge: 'New',
  },
  {
    id: 3,
    name: 'Arctic Shield Exterior',
    category: 'Exterior',
    finish: 'Gloss',
    price: 3200,
    size: '20L',
    color: '#ecf0f1',
    shade: 'Cloud White',
    code: 'EX-810',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiqcE7e8s177BuSadTL48hKsvV8KtxdCgQWj-U05dFy1AxfMlU9IRgHXEnmw6gZIrQzGhzSrf0lEhQ8Z_WbiwDI7U9cDmIneIlMHT1PbiLYK4acwKMB-oZWZkO5DYH8OHjtIIjkngNB_jyp824BgyQnHN8NBIJidyTbM1HInuFaM8IP5pEoyOAqxyww9hNldesG49gBHDC4Jq3MUxIeN3FbB2zLN1iWGEgvz1nn6E25XLe2WDYLq-9YkvAn6JGrwmVowZeTHUwxg',
    badge: null,
  },
  {
    id: 4,
    name: 'AquaGuard Pro',
    category: 'Waterproofing',
    finish: 'Satin',
    price: 4500,
    size: '20L',
    color: '#3498db',
    shade: 'Aegean Blue',
    code: 'WP-120',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPsd2riz4oYEuUAk_OaVz5VCF23UzmEaKuwV98RFqRJYBzAbk8g3V35k5Bwi7s0-wup7vm41jYYdj4DkeLo5JRNr3ICO3luV64p2S0jnkBZqhpzLcxip8t1halVGt-Bmwk-Un_Jrvn8KiifWgHFU-LUwJBT1PfZlLF_Loz0UYjp0TsgXAFEnty0o7ILAe8RkFH8bNZpcfOGsOnoUGkISI8eFBcPp_h-xaxssyVWMDi4RfSBu9Ze1Han_88yEqtyzVE1hlUnT9WyA',
    badge: 'Popular',
  },
  {
    id: 5,
    name: 'Master Brush Set',
    category: 'Tools',
    finish: null,
    price: 450,
    size: 'Set of 5',
    color: null,
    shade: null,
    code: 'MB-100',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_iCExhT4zpp6VmLEvYMuX8qhwZc3kRDcWJghVvZcvRhkgAzvTimFDaeJnS9wsb25upO2FM_OscmnzWsZKArwBxAjoXEbw_hfS_2-4u06Yk4OK_ySwSR_91ukRZTOe_Jk28MtXFf0aA6_G5mb9Ee7PiHTqiAdjwY0Ca9N63roanLTN_0KJPYg4VLahB7NjkhnqyGC1F3FlJHaVDc4Nq_ujaMcU7LYV6ay-qY1d-QziU4lPZ_csmlJNonKAx7xEraD3lExstndNzg',
    badge: null,
  },
  {
    id: 6,
    name: 'Pro Roller Kit',
    category: 'Tools',
    finish: null,
    price: 620,
    size: 'Kit',
    color: null,
    shade: null,
    code: 'PR-200',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVOEcCByZ4bACIBiQplRA852y_P6jg6GICWGFn-qxtc-9pT_7UoSutHw5abyM4Gnl5giJOSFO0ubKlRgqhr2NtZSH7CpfZ2_X8Nl-sJYEgXdtIaL71X1IYHWCNIGM1ZHNWveCv0L6lHsjXava2g3LkkXKMMpZIXy3t3eCsClV0-vIVgZsV98Hyqi3-ZrVWDuy0B-pVycpwWrCerfJsEqom-0SGd1SdxZIFnQMYNFxk6zes8xQ0V3YTIbmvUbS3SOf2Ive21clUhQ',
    badge: null,
  },
  {
    id: 7,
    name: 'Sage Garden Emulsion',
    category: 'Interior',
    finish: 'Satin',
    price: 1950,
    size: '10L',
    color: '#d9e4dd',
    shade: 'Sage Green',
    code: 'IN-305',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyYZuomY829S19SlNP6Q3xwyo6tCnkgJkzJ5YogtjeX_yPReV1DysXfPt39oqi4Rq3XApCiTBkrDfM0d03D3DBYJDx-Lx_bSe-g7_rBzNb45q4i4S8N3q55m2HPl1vI1pkwT-blnXKg7PyriuPWQvDTd2p1EJ5vv_fLsmm_WEt4VjHyyyGiZrPZDY3gf9z0pg2WpY0ROBpo8RZp4nOoZzzIrZRDeRlaFlYhAnLtNdBhzfl0wERK3I8w8ikjCglBKRSNEahSkjckg',
    badge: null,
  },
  {
    id: 8,
    name: 'Smooth Wall Putty',
    category: 'Tools',
    finish: null,
    price: 780,
    size: '5Kg',
    color: null,
    shade: null,
    code: 'WP-300',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDGvc6HjE83zEaGCU-fn4YzueL2vINSvleGM2UTqMXZsoBX2N-fdJ6xUwCQFhPIaQz1JfbxjGG-FO7X9jOhEc1AHMLU_IQScZxGgVWfMs86NWmw1r-iSgxp4zZeFuseo_y2d1rbAGFImTbunUegG_OhILtDJqOvsNIzyg5H31_nkQjTatG4sX0PIwOAixxMNHIJ8Ugs7Dq5S81_XsWwAXMNFORojrwtJh1t2ncd63fWDlUc2DlvuJigV0mvaMa6djPtIoYN51fhg',
    badge: null,
  },
]

const categoryFilters = ['All', 'Interior', 'Exterior', 'Waterproofing', 'Tools']

/* ── Badge component ── */
function Badge({ text }) {
  const colorMap = {
    Bestseller: 'bg-amber-500',
    New: 'bg-emerald-500',
    Popular: 'bg-blue-500',
  }
  return (
    <span className={`absolute top-4 left-4 z-10 text-[10px] font-black uppercase tracking-widest text-white px-3 py-1 rounded-full ${colorMap[text] || 'bg-primary'}`}>
      {text}
    </span>
  )
}

/* ── Product Card ── */
function ProductCard({ product }) {
  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-slate-50 dark:bg-slate-800 overflow-hidden">
        {product.badge && <Badge text={product.badge} />}
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.color && (
          <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full px-3 py-1.5">
            <div className="w-4 h-4 rounded-full border border-slate-200" style={{ backgroundColor: product.color }}></div>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{product.shade}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{product.category}</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight mt-1">{product.name}</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
            {product.code}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
          <span>{product.size}</span>
          {product.finish && (
            <>
              <span className="size-1 rounded-full bg-slate-300"></span>
              <span>{product.finish}</span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400">Starting at</span>
            <span className="text-xl font-black text-slate-900 dark:text-slate-100">₹{product.price.toLocaleString()}</span>
          </div>
          <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 active:scale-95">
            <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Products Page ── */
function Products() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = allProducts.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">format_paint</span>
              <h1 className="text-xl font-black tracking-tight uppercase">
                Mayur <span className="text-primary">Paints</span>
              </h1>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-semibold hover:text-primary transition-colors">Home</Link>
              <Link to="/products" className="text-sm font-semibold text-primary">Products</Link>
              <Link to="/visualizer" className="text-sm font-semibold hover:text-primary transition-colors">Visualizer</Link>
              <a className="text-sm font-semibold hover:text-primary transition-colors" href="#">Contractors</a>
            </nav>

            <div className="flex items-center gap-4">
              <Link to="/login" className="bg-primary text-white px-5 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <section className="bg-gradient-to-r from-primary/10 via-background-light to-background-light dark:from-primary/20 dark:via-background-dark dark:to-background-dark py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4 uppercase tracking-widest">
              Product Catalog
            </span>
            <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
              Find the <span className="text-primary">Perfect Shade</span> for Every Surface
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
              Browse our complete range of paints, coatings, waterproofing solutions, and professional tools.
            </p>
          </div>
        </div>
      </section>

      {/* ── Filters & Search ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categoryFilters.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-primary/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl px-4 py-2.5 border border-slate-200 dark:border-slate-800 focus-within:border-primary/50 transition-all w-full md:w-auto">
            <span className="material-symbols-outlined text-slate-400 text-xl mr-2">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-full md:w-56 placeholder:text-slate-400"
              placeholder="Search by name or SKU..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-slate-500 mb-6">
          Showing <span className="font-bold text-slate-900 dark:text-slate-100">{filtered.length}</span> product{filtered.length !== 1 ? 's' : ''}
          {activeCategory !== 'All' && (
            <> in <span className="font-bold text-primary">{activeCategory}</span></>
          )}
        </p>

        {/* ── Product Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">inventory_2</span>
            <h3 className="text-xl font-bold text-slate-400 mb-2">No products found</h3>
            <p className="text-sm text-slate-400">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 mt-12 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
            <p>© 2024 Mayur Paints Limited. All rights reserved.</p>
            <div className="flex gap-6">
              <a className="hover:text-primary" href="#">Privacy Policy</a>
              <a className="hover:text-primary" href="#">Terms of Service</a>
              <a className="hover:text-primary" href="#">Color Disclaimer</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Products
