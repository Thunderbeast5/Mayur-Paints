import { Routes, Route, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { loginSuccess, logout } from './redux/authSlice'
import { addItem, removeItem, updateQuantity, clearCart } from './redux/cartSlice'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Landing from './pages/Landing'
import ColourCosmos from './pages/ColourCosmos'
import PaintsShop from './pages/PaintsShop'
import HardwareShop from './pages/HardwareShop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import FAQ from './pages/FAQ'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'
import Wishlist from './pages/Wishlist'
import PaintCalculator from './pages/PaintCalculator'
import Payment from './pages/Payment'
import AdminPayments from './pages/AdminPayments'
import { ordersAPI } from './api'

function App() {
  const dispatch = useDispatch()
  const { user: currentUser, role: userRole } = useSelector(s => s.auth)
  const { items: cartItems, totalCount: cartCount } = useSelector(s => s.cart)

  const handleAddToCart = (product) => {
    dispatch(addItem(product))
  }

  const handleUpdateQuantity = (id, qty) => {
    dispatch(updateQuantity({ id, qty }))
  }

  const handleRemoveItem = (id) => {
    dispatch(removeItem(id))
  }

  const handleCheckout = async (shippingAddress, paymentMethod) => {
    if (!currentUser || cartItems.length === 0) return null
    try {
      console.log('Creating order for user:', currentUser._id || currentUser.id)
      console.log('Cart items:', cartItems)
      console.log('Shipping address:', shippingAddress)
      
      const orderItems = cartItems.map(item => ({
        productId: item.id,
        type: item.type,
        name: item.name,
        qty: item.qty,
        price: item.price,
      }))
      
      const order = await ordersAPI.create({
        userId: currentUser._id || currentUser.id,
        items: orderItems,
        shippingAddress: shippingAddress, // Already formatted by Cart.jsx
        paymentMethod,
      })
      
      console.log('Order created:', order)
      dispatch(clearCart())
      return order
    } catch (err) {
      console.error('Checkout failed:', err)
      return null
    }
  }

  const handleLogin = (role, user, token) => {
    dispatch(loginSuccess({ user, token, role }))
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          },
          success: {
            iconTheme: {
              primary: '#E85D26',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing cartCount={cartCount} userRole={userRole} />} />
        <Route path="/login" element={<LoginWrapper onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/visualizer" element={<ColourCosmos />} />
        <Route path="/paints" element={<PaintsShop cartCount={cartCount} userRole={userRole} onAddToCart={handleAddToCart} />} />
        <Route path="/products" element={<PaintsShop cartCount={cartCount} userRole={userRole} onAddToCart={handleAddToCart} />} />
        <Route path="/hardware" element={<HardwareShop cartCount={cartCount} userRole={userRole} onAddToCart={handleAddToCart} />} />
        <Route path="/product/:type/:id" element={<ProductDetail cartCount={cartCount} userRole={userRole} onAddToCart={handleAddToCart} currentUser={currentUser} />} />
        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCheckout={handleCheckout}
              userRole={userRole}
              currentUser={currentUser}
            />
          }
        />
        <Route path="/dashboard" element={<UserDashboard cartCount={cartCount} currentUser={currentUser} onLogout={handleLogout} />} />
        <Route path="/admin" element={<AdminDashboard currentUser={currentUser} userRole={userRole} />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/wishlist" element={<Wishlist cartCount={cartCount} userRole={userRole} onAddToCart={handleAddToCart} />} />
        <Route path="/paint-calculator" element={<PaintCalculator cartCount={cartCount} userRole={userRole} />} />
        <Route path="/payment" element={<Payment cartCount={cartCount} userRole={userRole} />} />
        <Route path="/admin/payments" element={<AdminPayments cartCount={cartCount} userRole={userRole} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

function LoginWrapper({ onLogin }) {
  const navigate = useNavigate()

  const handleLogin = (role, user, token) => {
    onLogin(role, user, token)
    // Redirect based on actual user role, not what they clicked
    if (role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/dashboard')
    }
  }

  return <Login onLogin={handleLogin} />
}

export default App
