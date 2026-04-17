import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { paintsAPI, hardwareAPI, reviewsAPI } from '../api'
import toast from 'react-hot-toast'

export default function ProductDetail({ cartCount, userRole, onAddToCart, currentUser }) {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [reviews, setReviews] = useState([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })

  useEffect(() => {
    loadProduct()
  }, [type, id])

  async function loadProduct() {
    setLoading(true)
    try {
      const api = type === 'paint' ? paintsAPI : hardwareAPI
      const data = await api.getById(id)
      setProduct(data)
      
      // Load reviews
      try {
        const reviewData = await reviewsAPI.getByProduct(id, type)
        setReviews(Array.isArray(reviewData) ? reviewData : [])
      } catch (err) {
        console.log('Reviews not available')
      }
    } catch (error) {
      console.error('Failed to load product:', error)
      toast.error('Product not found')
      navigate(type === 'paint' ? '/paints' : '/hardware')
    }
    setLoading(false)
  }

  const handleAddToCart = () => {
    if (!product) return
    
    for (let i = 0; i < quantity; i++) {
      onAddToCart({ ...product, type: type === 'paint' ? 'paint' : 'hardware' })
    }
    
    toast.success(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart!`)
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!currentUser) {
      toast.error('Please login to submit a review')
      navigate('/login')
      return
    }

    try {
      await reviewsAPI.create({
        productId: id,
        productType: type === 'paint' ? 'Paint' : 'Hardware',
        rating: reviewForm.rating,
        comment: reviewForm.comment
      })
      
      toast.success('Review submitted successfully!')
      setShowReviewForm(false)
      setReviewForm({ rating: 5, comment: '' })
      loadProduct()
    } catch (error) {
      toast.error('Failed to submit review')
    }
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

  if (!product) return null

  const images = [product.image, product.image, product.image] // In real app, multiple images
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 4.5

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar cartCount={cartCount} userRole={userRole} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link to={type === 'paint' ? '/paints' : '/hardware'} className="hover:text-primary transition-colors">
            {type === 'paint' ? 'Paints' : 'Hardware'}
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-900 dark:text-slate-100 font-semibold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 mb-4">
              <img 
                src={images[selectedImage]} 
                alt={product.name}
                className="w-full h-96 object-contain"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`bg-white dark:bg-slate-900 rounded-xl border-2 p-4 transition-all ${
                    selectedImage === idx ? 'border-primary' : 'border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-20 object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="mb-4">
              <span className="text-sm font-bold text-primary uppercase tracking-wider">
                {product.brand}
              </span>
            </div>
            
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`material-symbols-outlined text-lg ${i < Math.floor(avgRating) ? 'text-yellow-500' : 'text-slate-300'}`}>
                    star
                  </span>
                ))}
                <span className="ml-2 text-sm font-bold">{avgRating}</span>
              </div>
              <span className="text-sm text-slate-400">({reviews.length} reviews)</span>
            </div>

            <div className="text-4xl font-black text-primary mb-6">
              ₹{product.price.toLocaleString()}
            </div>

            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {product.description}
            </p>

            {/* Product Specs */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 mb-6">
              <h3 className="font-bold mb-4">Product Specifications</h3>
              <div className="space-y-3">
                {type === 'paint' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Category</span>
                      <span className="font-semibold">{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Finish</span>
                      <span className="font-semibold capitalize">{product.finish}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Size</span>
                      <span className="font-semibold">{product.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Color</span>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                          style={{ backgroundColor: product.hexCode || product.color }}
                        />
                        <span className="font-semibold">{product.color}</span>
                      </div>
                    </div>
                  </>
                )}
                {type === 'hardware' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Category</span>
                      <span className="font-semibold">{product.category}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Stock</span>
                  <span className={`font-semibold ${product.stock > 10 ? 'text-green-600' : 'text-amber-600'}`}>
                    {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
                  </span>
                </div>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-slate-600 dark:text-slate-400 hover:text-primary"
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <span className="font-bold text-lg w-12 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="text-slate-600 dark:text-slate-400 hover:text-primary"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">shopping_cart</span>
                Add to Cart
              </button>
            </div>

            {/* Additional Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Link
                to={type === 'paint' ? '/visualizer' : '/contact'}
                className="border-2 border-slate-200 dark:border-slate-700 py-3 rounded-xl font-bold hover:border-primary hover:text-primary transition-all text-center"
              >
                {type === 'paint' ? '🎨 Visualize' : '📞 Contact'}
              </Link>
              <button className="border-2 border-slate-200 dark:border-slate-700 py-3 rounded-xl font-bold hover:border-primary hover:text-primary transition-all">
                ❤️ Add to Wishlist
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black">Customer Reviews</h2>
            {currentUser && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all"
              >
                Write a Review
              </button>
            )}
          </div>

          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 mb-8">
              <div className="mb-4">
                <label className="block font-bold mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="text-3xl"
                    >
                      <span className={`material-symbols-outlined ${star <= reviewForm.rating ? 'text-yellow-500' : 'text-slate-300'}`}>
                        star
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-2">Your Review</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 focus:border-primary focus:ring-0"
                  rows="4"
                  placeholder="Share your experience with this product..."
                  required
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90">
                  Submit Review
                </button>
                <button type="button" onClick={() => setShowReviewForm(false)} className="px-6 py-3 rounded-xl font-bold border-2 border-slate-200 dark:border-slate-700">
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <span className="material-symbols-outlined text-5xl mb-3 block">rate_review</span>
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary">person</span>
                      </div>
                      <div>
                        <div className="font-bold">{review.user?.name || 'Anonymous'}</div>
                        <div className="text-xs text-slate-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`material-symbols-outlined text-sm ${i < review.rating ? 'text-yellow-500' : 'text-slate-300'}`}>
                          star
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
