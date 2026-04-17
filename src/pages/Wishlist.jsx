import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { wishlistAPI } from '../api'
import toast from 'react-hot-toast'

export default function Wishlist({ cartCount, userRole, onAddToCart }) {
  const { user: currentUser } = useSelector(s => s.auth)
  const [wishlist, setWishlist] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser) {
      loadWishlist()
    }
  }, [currentUser])

  async function loadWishlist() {
    try {
      const data = await wishlistAPI.get()
      setWishlist(data)
    } catch (error) {
      console.error('Failed to load wishlist:', error)
      toast.error('Failed to load wishlist')
    }
    setLoading(false)
  }

  async function handleRemove(productId) {
    try {
      await wishlistAPI.remove(productId)
      toast.success('Removed from wishlist')
      loadWishlist()
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  async function handleAddToCart(item) {
    if (!item.product) return
    
    onAddToCart({
      ...item.product,
      type: item.productType.toLowerCase()
    })
    
    toast.success('Added to cart!')
  }

  async function handleClearAll() {
    if (!confirm('Clear entire wishlist?')) return
    
    try {
      await wishlistAPI.clear()
      toast.success('Wishlist cleared')
      loadWishlist()
    } catch (error) {
      toast.error('Failed to clear wishlist')
    }
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar cartCount={cartCount} userRole={userRole} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">favorite</span>
          <h2 className="text-2xl font-black mb-4">Please Login</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Login to view your wishlist
          </p>
          <Link to="/login" className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90">
            Login
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar cartCount={cartCount} userRole={userRole} />
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  const items = wishlist?.items || []

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar cartCount={cartCount} userRole={userRole} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">
              My Wishlist
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          
          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-700 font-bold flex items-center gap-2"
            >
              <span className="material-symbols-outlined">delete</span>
              Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">favorite_border</span>
            <h2 className="text-2xl font-black mb-4">Your wishlist is empty</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Save items you love to buy them later
            </p>
            <Link to="/paints" className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden group hover:shadow-xl transition-all"
              >
                <Link to={`/product/${item.productType.toLowerCase()}/${item.product._id}`}>
                  <div className="aspect-square bg-slate-50 dark:bg-slate-800 p-6">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </Link>

                <div className="p-4">
                  <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                    {item.product.brand}
                  </div>
                  
                  <Link to={`/product/${item.productType.toLowerCase()}/${item.product._id}`}>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2 hover:text-primary transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xl font-black text-primary">
                      ₹{item.product.price.toLocaleString()}
                    </div>
                    <div className={`text-sm ${item.product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.product.stock === 0}
                      className="flex-1 bg-primary text-white py-2 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">shopping_cart</span>
                      Add
                    </button>
                    <button
                      onClick={() => handleRemove(item.product._id)}
                      className="px-4 py-2 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-red-500 hover:text-red-500 transition-all"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
